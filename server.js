var connect = require('connect');

connect(connect.static(__dirname)).listen(9999);
