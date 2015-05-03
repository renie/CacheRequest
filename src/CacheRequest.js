var CacheRequest = (function(){

	// insert AsyncReq
	// insert CacheRequestProto

	return {
		send : function(options) {
			var cr = new CacheRequestProto();
			return cr.send(options);
		}
	};
}());
