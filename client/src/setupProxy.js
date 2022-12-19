const {createProxyMiddleware} = require('http-proxy-middleware');

const Proxy = {
    target: "http://localhost:5500/api/", // change "localhost" to "api" when using docker
    changeOrigin: true
}
const Proxy2 = {
    target: "http://localhost:9900/api/", // change "localhost" to "api" when using docker
    changeOrigin: true
}
module.exports = app => {
  app.use('/users',
    createProxyMiddleware(Proxy) // to connect to auth microservice
  );
  app.use('/auth',
    createProxyMiddleware(Proxy) // to connect to auth microservice
  );
  app.use('/videos',
    createProxyMiddleware(Proxy2) // to connect to video microservice
  );
};