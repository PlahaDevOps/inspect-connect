import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import * as authController from '../controllers/apiControllers/authController';
import * as activityLogController from '../controllers/apiControllers/activityLogController';
import * as stripeController from '../controllers/apiControllers/stripeController';

const router = Router();

// public routes
router.post('/signUp', authController.signUp);
router.post('/signIn', authController.signIn);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);
router.post('/uploads', authController.fileUpload);
// router.post('/testApi', authController.testApi);
router.post('/webhook', stripeController.stripeWebhook);

// Protected routes
router.use(authMiddleware);
router.post('/verifyOtp', authController.verifyOtp);
router.post('/resendOtp', authController.resendOtp);
router.post('/logout', authController.logout);

// Activity Log
router.post('/logs', activityLogController.createActivityLog);

// Stripe
router.post('/subscriptions', stripeController.createSubscription);
router.post('/createCheckoutSession', stripeController.createCheckoutSession);
// router.get('/subscriptions/clientSecret', stripeController.getClientSecret);
// router.post("/payments", stripeController.stripePaymentIntent);
// router.post("/verifyPayment", stripeController.verifyPayment);
//   router.post(
//     "/stripe_webhook",
//     stripe_controller.stripeWebhook
//   );
//   router.post(
//     "/stripe_webhook_front_end",
//     authenticateJWT,
//     stripe_controller.stripeWebhookFromFrontEnd
//   );


export default router;

// Public Routes
// #swagger.start
/*#swagger.title = 'Auth'*/
/*#swagger.tags = ['Auth']*/
/*#swagger.summary = 'Sign In'*/

/*
    #swagger.path = '/signIn'
    #swagger.method = 'post'
    #swagger.tags = ['Auth']
    #swagger.description = 'Sign In'
    #swagger.produces = ['application/json']
    #swagger.parameters['signIn'] = {
        in: 'body',
        schema: { $ref: '#/definitions/signin' }
    }
*/

/* #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } } */
/* #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } } */
/* #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } } */
/* #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } } */
/* #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } } */
/* #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } } */
// #swagger.end

// #swagger.start
/*#swagger.title = 'Auth'*/
/*#swagger.tags = ['Auth']*/
/*#swagger.summary = 'Sign Up'*/

/*
    #swagger.path = '/signUp'
    #swagger.method = 'post'
    #swagger.description = 'Sign Up'
    #swagger.produces = ['application/json']
    #swagger.parameters['signUp'] = {
        in: 'body',
        schema: { $ref: '#/definitions/signup' }
    }
*/

/* #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } } */
/* #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } } */
/* #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } } */
/* #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } } */
/* #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } } */
/* #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } } */
// #swagger.end

// #swagger.start
/*#swagger.title = 'Auth'*/
/*#swagger.tags = ['Auth']*/
/*#swagger.summary = 'Forgot Password'*/

/*
    #swagger.path = '/forgotPassword'
    #swagger.method = 'post'
    #swagger.description = 'Forgot Password'
    #swagger.produces = ['application/json']
    #swagger.parameters['forgotPassword'] = {
        in: 'body',  
        schema: { email: 'string' }
    }
*/

/* #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } } */
/* #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } } */
/* #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } } */
/* #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } } */
/* #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } } */
/* #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } } */
// #swagger.end

// #swagger.start
/*#swagger.title = 'Auth'*/
/*#swagger.tags = ['Auth']*/
/*#swagger.summary = 'Forgot Password'*/

/*
    #swagger.path = '/resetPassword'
    #swagger.method = 'post'
    #swagger.description = 'Reset Password'
    #swagger.produces = ['application/json']
    #swagger.parameters['resetPassword'] = {
        in: 'body',  
        schema: { encryptedEmail: 'string', resetPasswordToken: 'string', password: 'string' }
    }
*/

/* #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } } */
/* #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } } */
/* #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } } */
/* #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } } */
/* #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } } */
/* #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } } */
// #swagger.end

// Protected Routes
// #swagger.start
/*#swagger.title = 'Auth'*/
/*#swagger.tags = ['Auth']*/
/*#swagger.summary = 'Verify Otp'*/
/*#swagger.security = [{
    "authToken": []
}]*/

/*
    #swagger.path = '/verifyOtp'
    #swagger.method = 'post'
    #swagger.description = 'Verify Otp'
    #swagger.produces = ['application/json']
    #swagger.parameters['verifyOtp'] = {
        in: 'body',  
        schema: { phoneOtp: 'string', phoneNumber: 'string', countryCode: 'string' }
    }
*/


/* #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } } */
/* #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } } */
/* #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } } */
/* #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } } */
/* #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } } */
/* #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } } */

// #swagger.end


// #swagger.start

/*#swagger.title = 'Auth'*/
/*#swagger.tags = ['Auth']*/
/*#swagger.summary = 'Resend Otp'*/
/*#swagger.security = [{
    "authToken": []
}]*/

/*
    #swagger.path = '/resendOtp'
    #swagger.method = 'post'
    #swagger.description = 'Resend Otp'
    #swagger.produces = ['application/json']
    #swagger.parameters['resendOtp'] = {
        in: 'body',  
        schema: { phoneNumber: 'string', countryCode: 'string' }
    }
*/


/* #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } } */
/* #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } } */
/* #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } } */
/* #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } } */
/* #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } } */
/* #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } } */
// #swagger.end

// #swagger.start
/*#swagger.title = 'Auth'*/
/*#swagger.tags = ['Auth']*/
/*#swagger.summary = 'Logout'*/
/*#swagger.security = [{
    "authToken": []
}]*/

/*
    #swagger.path = '/logout'
    #swagger.method = 'post'
    #swagger.description = 'Logout'
    #swagger.produces = ['application/json']
    #swagger.parameters['logout'] = {
        in: 'body', 
    }
*/


/* #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } } */
/* #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } } */
/* #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } } */
/* #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } } */
/* #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } } */
/* #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } } */
// #swagger.end

// #swagger.start
/*#swagger.title = 'Activity Logs'*/
/*#swagger.tags = ['Activity Logs']*/
/*#swagger.summary = 'Create Activity Log'*/
/*#swagger.security = [{
    "authToken": []
}]*/

/*
    #swagger.path = '/logs'
    #swagger.method = 'post'
    #swagger.description = 'Create Activity Log'
    #swagger.produces = ['application/json']
    #swagger.parameters['logs'] = {
        in: 'body', 
        schema: {
            bookingId: 'string',
            action: 'string',
            service: 'string',
            fullRequestUrl: 'string',
            date: 'string',
            description: 'string'
        }
    }
*/


/* #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } } */
/* #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } } */
/* #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } } */
/* #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } } */
/* #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } } */
/* #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } } */
// #swagger.end

// #swagger.start
/*#swagger.title = 'Stripe Subscription'*/
/*#swagger.tags = ['Stripe Subscription']*/
/*#swagger.summary = 'Create Subscription'*/
/*#swagger.security = [{
    "authToken": []
}]*/

/*
    #swagger.path = '/subscriptions'
    #swagger.method = 'post'
    #swagger.description = 'Create Subscription'
    #swagger.produces = ['application/json']
    #swagger.parameters['subscriptions'] = {
        in: 'body', 
        schema: {
            customerId: 'string',
            planId: 'string',
        }
    }
*/


/* #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } } */
/* #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } } */
/* #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } } */
/* #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } } */
/* #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } } */
/* #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } } */
// #swagger.end

// #swagger.start
/*#swagger.title = 'Stripe Subscription'*/
/*#swagger.tags = ['Stripe Subscription']*/
/*#swagger.summary = 'Stripe Webhook'*/
/*#swagger.security = [{
    "authToken": []
}]*/

/*
    #swagger.path = '/subscriptions/clientSecret'
    #swagger.method = 'get'
    #swagger.description = 'Get Client Secret'
    #swagger.produces = ['application/json']
*/


/* #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } } */
/* #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } } */
/* #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } } */
/* #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } } */
/* #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } } */
/* #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } } */
// #swagger.end

// #swagger.start
/*#swagger.title = 'Stripe Subscription'*/
/*#swagger.tags = ['Stripe Subscription']*/
/*#swagger.summary = 'Stripe Webhook'*/

/*
    #swagger.path = '/webhooks'
    #swagger.method = 'post'
    #swagger.description = 'Stripe Webhook'
    #swagger.produces = ['application/json']
    #swagger.parameters['webhooks'] = {
        in: 'body', 
        schema: {}
    }
*/


/* #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } } */
/* #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } } */
/* #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } } */
/* #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } } */
/* #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } } */
/* #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } } */
// #swagger.end

// #swagger.start
/*#swagger.title = 'Uploads'*/
/*#swagger.tags = ['Uploads']*/
/*#swagger.summary = 'File Upload'*/

/*
    #swagger.path = '/uploads'
    #swagger.method = 'post'
    #swagger.description = 'File Upload'
    #swagger.consumes = ['multipart/form-data']
    #swagger.produces = ['application/json']
    #swagger.parameters['file'] = {
        in: 'formData',
        type: 'file',
        required: true,
        description: 'Select the file to upload'
    }
*/


/* #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } } */
/* #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } } */
/* #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } } */
/* #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } } */
/* #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } } */
/* #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } } */
// #swagger.end