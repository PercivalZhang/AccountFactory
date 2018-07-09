'use strict';
import restify from 'restify';
import { router } from '../route/api';

const Debug = require('debug')('factory:server');

Debug(__dirname);

let http_options = {
    name: "factory"
};
let server = restify.createServer(http_options);

server.pre(restify.plugins.pre.dedupeSlashes()); // tolerate double slashes
server.use(restify.plugins.jsonBodyParser({ mapParams: true }));
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({ mapParams:true }));
server.pre(restify.plugins.pre.dedupeSlashes());
// set ip rate-limiting: max 100, steady 50
// If a client has consumed all of their available rate/burst,
// an HTTP response code of 429 Too Many Requests is returned.
server.use(restify.plugins.throttle({burst:100,rate:50,ip:true}));

// Put any routing, response, etc. logic here. This allows us to define these functions
// only once, and it will be re-used on both the HTTP and HTTPs servers
let setup_server = function(server) {
    router.applyRoutes(server, '/factory');
};

// Now, setup both servers in one step
setup_server(server);

/**
 * Listen on provided port, on all network interfaces.
 */
let port = process.env.PORT || 3001;
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            Debug(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            Debug(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    Debug('Listening on %s', bind);
}