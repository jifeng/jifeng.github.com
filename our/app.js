var connect = require('connect');
var path = require('path');


var app = connect();
app.use(connect.static(__dirname));
app.listen(2008);
