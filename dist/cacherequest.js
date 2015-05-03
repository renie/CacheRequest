var CacheRequest = (function(){

	var AsyncReq = (function AsyncReq(jq) {

	if (jq !== undefined && jq !== null)
		return jq.ajax;

}(jQuery));

	var CacheRequestProto = function CacheRequestProto(){

	// Just to make easier to chance this string if needed
	var self = this;

	self.storageKeys = {
		timeout		: 'TIMEOUT',
		lastcall	: 'LASTCALL',
		response	: 'RESPONSE'
	};

 	// Default 'valid date' for cached information
	self.defaultTimeout	= 300000; // 5 minutes

	/*
		Method for being called outside (options are the same as jquery ones)
	*/
	function send(options) {
		__prepareVariables(options);

		// If is there any cache and its timeout is valid, return cached information
		// else proceed with normal request
		var valid	= __isValid();
		if (valid)
			__callCachedCallback();
		else
			__doRequest();

		self.d.promise();
	}


	/*
		Stores options in object attribute to avoid unnecessary parameter
		create promise, mount an unique hash for that request
		get an old cache, if exists
	*/
	function __prepareVariables(options) {
		self.opt	= options;
		self.d		= new $.Deferred();
		__createHash();
		__getStored();
	}


	/*
		Hash is created this way: url + request data + request method
	*/
	function __createHash() {
		self.hash	= self.opt.url + '' + (self.opt.data || '') + (self.opt.method || '-ANY');
	}


	/*
		Tries to get cache from local storage using its hash
	*/
	function __getStored() {
		self.stored = localStorage.getItem(self.hash);
		self.stored = JSON.parse(self.stored) || null;
	}


	/*
		Checkes cache's validity based on its timeout and time that was last called
	*/
	function __isValid() {
		if (!self.stored)
			return false;

		var to		= self.stored[self.storageKeys.timeout],
			lc		= self.stored[self.storageKeys.lastcall];

		return (Date.now() - lc) < to;
	}


	/*
		Calls user's callback (success and complete), with cached information and
		keeping context chosen
	*/
	function __callCachedCallback() {
		if (self.opt.hasOwnProperty('success'))
			self.opt.success.call(self.opt.context, null, 'CACHED', self.stored[self.storageKeys.response]);
		else if (self.opt.hasOwnProperty('complete'))
			self.opt.complete(self.opt.context, 'CACHED', self.stored[self.storageKeys.response]);

		self.d.resolve();
	}


	/*
		Does AJAX requests, changing callback parameters (original will be called later)
	*/
	function __doRequest() {
		self.originalSettings = {
			's'		: self.opt.success,
			'f'		: self.opt.error,
			'c'		: self.opt.complete,
			'ctx'	: self.opt.context
		};

		self.opt.success	= __successCallback;
		self.opt.error		= __errorCallback;
		self.opt.complete	= __completeCallback;
		self.opt.context	= self;

		AsyncReq(self.opt);
	}


	/*
		On success, it caches this request on LocalStorage, calls original callbacks
		and resolves promise
	*/
	function __successCallback(data, status, res) {
		__cacheRequest(res);

		if (self.originalSettings.s)
			self.originalSettings.s.call(self.originalSettings.ctx, data, status, res);
		else if (self.originalSettings.c)
			self.originalSettings.c.call(self.originalSettings.ctx, res, status);

		self.d.resolve();
	}


	/*
		On error, calls original callbacks and resolves promise
	*/
	function __errorCallback(res, status, err) {

		if (self.originalSettings.e)
			self.originalSettings.call(self.originalSettings.ctx, res, status, err);

		self.d.resolve();
	}


	/*
		On complete, it checkes if old cached request can be returned, calls original callbacks
		and resolves promise
	*/
	function __completeCallback(res, status) {

		if(res.status === 0 || status === 'error') {
			if (self.opt.useOldIfError && self.stored)
				res = self.stored[self.storageKeys.response];
			else
				res = null;
		}

		if (self.originalSettings.c)
			self.originalSettings.c.call(self.originalSettings.ctx, res, status);
		else
			console.log('No "complete" callback, no connection and no cache available (or you don\'t want it).');

		self.d.resolve();
	}


	/*
		Caches request's response with its timeout and last call time.
	*/
	function __cacheRequest(res) {
		var data = {};
		data[self.storageKeys.timeout]	= self.opt.cacheTimeout || self.defaultTimeout;
		data[self.storageKeys.lastcall] = Date.now();
		data[self.storageKeys.response] = res;

		localStorage.setItem(self.hash, JSON.stringify(data));
	}

	return {
		send : send
	};
};


	return {
		send : function(options) {
			var cr = new CacheRequestProto();
			return cr.send(options);
		}
	};
}());
