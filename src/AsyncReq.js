var AsyncReq = (function AsyncReq() {

	if (hasjQuery)
		return jQuery.ajax;

	function callback(opt, xhr) {
		var st;
		if ( xhr.status > 200 ) {
			st = 'error';
			opt.error(
				xhr,
				st
			);
		} else {
			st = xhr.statusText;
			opt.success(
				xhr.responseText,
				st,
				xhr
			);
		}
		opt.complete(
			xhr,
			st
		);
	}

	return function(opt) {
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.open((opt.type||'GET'), opt.url, (opt.async||true));

		xmlhttp.onload	= callback.bind(this, opt, xmlhttp);
		xmlhttp.onerror = callback.bind(this, opt, xmlhttp);

		xmlhttp.send();

	};

}());
