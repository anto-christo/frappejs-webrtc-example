const server = require('frappejs/server');

server.start({
    backend: 'sqlite',
    connectionParams: {
	  port: 9000,
      dbPath: 'test.db',
    },
    staticPath: './dist',
});
