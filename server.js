var express = require('express');
var app = express();

app.use(express.static('test'));

app.get('/ok', function (req, res) {
	res.send('{response:"foo"}');
	//res.status(500).send('{response:"oops"}');
});



var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('CacheRequest testing enviroment listening at http://%s:%s', host, port);

});
