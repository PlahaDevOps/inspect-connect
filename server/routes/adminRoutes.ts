import { Router, Request, Response, NextFunction } from 'express';
import * as authController from '../controllers/apiControllers/authController';
import * as stripeController from '../controllers/adminControllers/stripeController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
router.post('/signIn', authController.signIn);

// Protected routes
router.use(authMiddleware); // Need to add admin middleware
router.post('/subscriptionPlans', stripeController.createSubscriptionPlan);
router.get('/subscriptionPlans', stripeController.getSubscriptionPlans);
router.put('/subscriptionPlans/:id', stripeController.updateSubscriptionPlan);
router.delete('/subscriptionPlans/:id', stripeController.deleteSubscriptionPlan);
router.get('/subscriptionPlans/:userType', stripeController.getSubscriptionPlansByType);

export default router;

// #swagger.start
/*  #swagger.title = 'Admin'*/
/*  #swagger.tags = ['Admin']*/
/*  #swagger.summary = 'Admin Login'*/

/* #swagger.path = '/admin/signIn'
    #swagger.method = 'post'
    #swagger.description = 'Admin Login'
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        required: true,
        description: 'Admin Login',
        schema: { $ref: '#/definitions/signin' }
    }
    #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } }
    #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } }
    #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } }
    #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } }
    #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } }
    #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } }
*/
// #swagger.end

// #swagger.start
/*  #swagger.title = 'Admin Stripe'*/
/*  #swagger.tags = ['Admin Stripe']*/
/*  #swagger.summary = 'Create Subscription Plan'*/
/*  #swagger.security = [{
    "authToken": []
}]*/

/* #swagger.path = '/admin/subscriptionPlans'
    #swagger.method = 'post'
    #swagger.description = 'Create Subscription Plan'
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        required: true,
        description: 'Create Subscription Plan',
        schema: { name: 'string', description: 'string', price: 'number', currency: 'string', trialDays: 'number', userType: 'number', frequencyInterval: 'number' }
    }
    #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } }
    #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } }
    #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } }
    #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } }
    #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } }
    #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } }
*/
// #swagger.end

// #swagger.start
/*  #swagger.title = 'Admin Stripe'*/
/*  #swagger.tags = ['Admin Stripe']*/
/*  #swagger.summary = 'Get Subscription Plans'*/
/*  #swagger.security = [{
    "authToken": []
}]*/

/* #swagger.path = '/admin/subscriptionPlans'
    #swagger.method = 'get'
    #swagger.description = 'Get Subscription Plans'
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } }
    #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } }
    #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } }
    #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } }
    #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } }
    #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } }
*/
// #swagger.end

// #swagger.start
/*  #swagger.title = 'Admin Stripe'*/
/*  #swagger.tags = ['Admin Stripe']*/
/*  #swagger.summary = 'Update Subscription Plan'*/
/*  #swagger.security = [{
    "authToken": []
}]*/

/* #swagger.path = '/admin/subscriptionPlans/:id'
    #swagger.method = 'put'
    #swagger.description = 'Update Subscription Plan'
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.parameters['id'] = {
        in: 'path',
        type: 'string',
        required: true,
        description: 'Subscription Plan ID'
    }
    #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        required: true,
        description: 'Update Subscription Plan',
        schema: { name: 'string', description: 'string', price: 'number', currency: 'string', trialDays: 'number', userType: 'number', frequencyInterval: 'number' }
    }
    #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } }
    #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } }
    #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } }
    #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } }
    #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } }
    #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } }
*/
// #swagger.end

// #swagger.start
/*  #swagger.title = 'Admin Stripe'*/
/*  #swagger.tags = ['Admin Stripe']*/
/*  #swagger.summary = 'Delete Subscription Plan'*/
/*  #swagger.security = [{
    "authToken": []
}]*/

/* #swagger.path = '/admin/subscriptionPlans/:id'
    #swagger.method = 'delete'
    #swagger.description = 'Delete Subscription Plan'
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.parameters['id'] = {
        in: 'path',
        type: 'string',
        required: true,
        description: 'Subscription Plan ID'
    }
    #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } }
    #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } }
    #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } }
    #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } }
    #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } }
    #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } }
*/
// #swagger.end

// #swagger.start
/*  #swagger.title = 'Admin Stripe'*/
/*  #swagger.tags = ['Admin Stripe']*/
/*  #swagger.summary = 'Get Subscription Plan By Type'*/

/* #swagger.path = '/subscriptionPlans/:type'
    #swagger.method = 'get'
    #swagger.tags = ['Admin Stripe']
    #swagger.description = 'Get Subscription Plan By Type'
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.parameters['type'] = {
        in: 'path',
        type: 'string',
        required: true,
        description: 'Subscription Plan Type'
    }
    #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Response200' } }
    #swagger.responses[400] = { description: 'Bad Request', schema: { $ref: '#/definitions/Response400' } }
    #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: '#/definitions/Response401' } }
    #swagger.responses[403] = { description: 'Forbidden', schema: { $ref: '#/definitions/Response403' } }
    #swagger.responses[404] = { description: 'Not Found', schema: { $ref: '#/definitions/Response404' } }
    #swagger.responses[500] = { description: 'Internal Server Error', schema: { $ref: '#/definitions/Response500' } }
*/
// #swagger.end
