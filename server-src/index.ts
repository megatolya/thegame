import server = require('./server');
var io = require('./io');

io.apply(io, server);
