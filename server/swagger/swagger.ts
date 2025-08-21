const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description of my API',
  },
  host: 'localhost:5002',
  basePath: '/api/v1',
  schemes: ['http'],
  consumes: [],
  produces: [],
  tags: [
    { name: 'Auth' },
    { name: 'Stripe Subscription' },
    { name: 'Uploads'},
    { name: 'Activity Logs'},
    { name: 'Admin' },
    { name: 'Admin Stripe' },
  ],
  securityDefinitions: {
    authToken: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Bearer token for authorization',
    },
  },
  definitions: {
    signup: {
      role: 1,
      email: 'string',
      profileImage: 'string',
      name: 'string',
      status: 1,
      phoneNumber: 'string',
      countryCode: 'string',
      password: 'string',
      resetPasswordToken: 'string',
      emailOtpExpiryTime: '06-06-2025',
      country: 'string',
      state: 'string',
      city: 'string',
      zip: 'string',
      location: {
        type: 'Point',
        locationName: 'string',
        coordinates: [1,2],
      },
      phoneOtpExpiryTime: '06-06-2025',
      phoneOtp: 'string',
      // fields for inspector
      stripeCustomerId: 'string',
      isDeleted: false,
      mailingAddress: 'string',
      certificateTypeId: 'string',
      certificateAgencyIds: ['string'],
      certificateDocuments: ['string'],
      certificateExpiryDate: '06-06-2025',
      currentSubscriptionId: 'string',
      uploadedIdOrLicenseDocument: 'string',
      referenceDocuments: ['string'],
      workHistoryDescription: 'string',
      phoneOtpVerified: true,
      emailOtpVerified: true,
      verifyByAdmin: true,
      subscriptionStatus: 1,
      agreedToTerms: true,
      isTruthfully: true,
      loginTime: '06-06-2025',
    },
    signin: {
      email: 'string',
      password: 'string',
    },
    Response200: {
      success: true,
      message: "string",
      body: "string",
    },
    Response400: {
      success: false,
      message: "string",
      body: "string",
    },
    Response401: {
      success: false,
      message: "string",
      body: "string",
    },
    Response403: {
      success: false,
      message: "string",
      body: "string",
    },
    Response404: {
      success: false,
      message: "string",
      body: "string",
    },
    Response500: {
      success: false,
      message: "string",
      body: "string",
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
  "../routes/apiRoutes.ts",
  "../routes/adminRoutes.ts"
];

swaggerAutogen(outputFile, endpointsFiles, doc);
