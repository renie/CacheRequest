var CacheRequest = (function(){

	// insert: CacheRequestProto.js

	return {
		send : function(options) {
			var cr = new CacheRequestProto();
			return cr.send(options);
		}
	};
}());
