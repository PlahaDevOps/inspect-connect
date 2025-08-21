const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description of my API',
  },
  host: 'localhost:5002/api',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
  '../server.ts',
  '../routes/index.ts',
  '../routes/adminRoutes.ts',
  '../routes/apiRoutes.ts',
];;

swaggerAutogen(outputFile, endpointsFiles, doc);
