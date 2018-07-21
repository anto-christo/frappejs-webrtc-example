const server = require('frappejs/server');

server.start({
    backend: 'sqlite',
    connectionParams: {
	  port: 8000,
      dbPath: 'test.db',
    },
    staticPath: './dist',
});
