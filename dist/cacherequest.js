var CachedRequestHelper  = {

	// Just to make easier to chance this string if needed
	storageKeys : {
		timeout		: 'TIMEOUT',
		lastcall	: 'LASTCALL',
		response	: 'RESPONSE'
	},
 

 	// Default 'valid date' for cached information
	defaultTimeout	: 300000, // 5 minutes


	/*
		Method for being called outside (options are the same as jquery ones)
	*/
	send : function(options) {
		this.__prepareVariables(options);
 
		// If is there any cache and its timeout is valid, return cached information
		// else proceed with normal request
		var valid	= this.__isValid();
		if (valid)
			this.__callCachedCallback();
		else
			this.__doRequest();
 
		this.d.promise();
	},


	/*
		Stores options in object attribute to avoid unnecessary parameter
		create promise, mount an unique hash for that request
		get an old cache, if exists
	*/
	__prepareVariables : function(options) {
		this.opt	= options;
		this.d		= new $.Deferred();
		this.__createHash();
		this.__getStored();
	},


	/*
		Hash is created this way: url + request data + request method
	*/
	__createHash : function() {
		this.hash	= this.opt.url + '' + (this.opt.data || '') + (this.opt.method || '-ANY');
	},


	/*
		Tries to get cache from local storage using its hash
	*/
	__getStored : function() {
		this.stored = localStorage.getItem(this.hash);
		this.stored = JSON.parse(this.stored) || null;
	},


	/*
		Checkes cache's validity based on its timeout and time that was last called
	*/
	__isValid : function() {
		if (!this.stored)
			return false;
 
		var to		= this.stored[this.storageKeys.timeout],
			lc		= this.stored[this.storageKeys.lastcall];
 
		return (Date.now() - lc) < to;
	},


	/*
		Calls user's callback (success and complete), with cached information and
		keeping context chosen
	*/
	__callCachedCallback : function() {
		if (this.opt.hasOwnProperty('success'))
			this.opt.success.call(this.opt.context, null, 'CACHED', this.stored[this.storageKeys.response]);
		else if (this.opt.hasOwnProperty('complete'))
			this.opt.complete(this.opt.context, 'CACHED', this.stored[this.storageKeys.response]);
 
		this.d.resolve();
	},


	/*
		Does AJAX requests, changing callback parameters (original will be called later)
	*/
	__doRequest: function() {
		this.originalSettings = {
			's'		: this.opt.success,
			'f'		: this.opt.error,
			'c'		: this.opt.complete,
			'ctx'	: this.opt.context
		};
 
		this.opt.success	= this.__successCallback;
		this.opt.error		= this.__errorCallback;
		this.opt.complete	= this.__completeCallback;
		this.opt.context	= this;
 
		$.ajax(this.opt);
	},


	/*
		On success, it caches this request on LocalStorage, calls original callbacks
		and resolves promise
	*/
	__successCallback : function(data, status, res) {
		this.__cacheRequest(res);
 
		if (this.originalSettings.s)
			this.originalSettings.s.call(this.originalSettings.ctx, data, status, res);
		else if (this.originalSettings.c)
			this.originalSettings.c.call(this.originalSettings.ctx, res, status);
 
		this.d.resolve();
	},


	/*
		On error, calls original callbacks and resolves promise
	*/
	__errorCallback : function(res, status, err) {

		if (this.originalSettings.e)
			this.originalSettings.call(this.originalSettings.ctx, res, status, err);
 
		this.d.resolve();
	},


	/*
		On complete, it checkes if old cached request can be returned, calls original callbacks
		and resolves promise
	*/
	__completeCallback : function(res, status) {
 
		if(res.status === 0 && status === 'error') {
			if (this.opt.useOldIfError && this.stored)
				res = this.stored[this.storageKeys.response];
			else
				res = null;
		}
 
		if (this.originalSettings.c)
			this.originalSettings.c.call(this.originalSettings.ctx, res, status);
		else
			console.error('No "complete" callback, no connection and no cache available (or you don\'t want it).');
 
		this.d.resolve();
	},


	/*
		Caches request's response with its timeout and last call time. 
	*/
	__cacheRequest : function(res) {
		var data = {};
		data[this.storageKeys.timeout]	= this.opt.cacheTimeout || this.defaultTimeout;
		data[this.storageKeys.lastcall] = Date.now();
		data[this.storageKeys.response] = res;
 
		localStorage.setItem(this.hash, JSON.stringify(data));
	}
};