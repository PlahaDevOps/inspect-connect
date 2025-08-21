import { Request, Response } from "express";
import * as helper from '../../utils/helpers';
import * as stripeValidations from '../../validations/adminValidations/stripeValidations';
import * as stripeServices from '../../services/adminServices/stripeServices';
import { MESSAGES } from "../../utils/constants/messages";

export const createSubscriptionPlan = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { error, value: validatedData } = stripeValidations.createSubscriptionPlanValidation(req.body);
        if(error){
            return helper.failed(res, error.details[0].message);
        }

        const Result = await stripeServices.createSubscriptionPlanService(validatedData);

        if ('error' in Result) {
            return helper.failed(res, Result?.error as string);
        }

        return helper.success(res, MESSAGES.STRIPE.CREATE_SUBSCRIPTION_PLAN_SUCCESS, Result);
    } catch (error) {
        console.error('Stripe webhook controller error:', error);
        return helper.error(res, MESSAGES.STRIPE.STRIPE_WEBHOOK_FAILED);
    }
}

export const getSubscriptionPlans = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const Result = await stripeServices.getSubscriptionPlansService();
        if('error' in Result){
            return helper.failed(res, Result?.error as string);
        }

        return helper.success(res, MESSAGES.STRIPE.GET_SUBSCRIPTION_PLANS_SUCCESS, Result);
    } catch (error) {
        console.error('Get subscription plans controller error:', error);
        return helper.error(res, MESSAGES.STRIPE.GET_SUBSCRIPTION_PLANS_FAILED);
    }
}

export const updateSubscriptionPlan = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        if(!req.params.id){
            return helper.failed(res, MESSAGES.STRIPE.SUBSCRIPTION_PLAN_ID_REQUIRED);
        }
        
        const Result = await stripeServices.updateSubscriptionPlanService(req.params.id, req.body);
        if('error' in Result){
            return helper.failed(res, Result?.error as string);
        }

        return helper.success(res, MESSAGES.STRIPE.UPDATE_SUBSCRIPTION_PLAN_SUCCESS, Result);
    } catch (error) {
        console.error('Update subscription plan controller error:', error);
        return helper.error(res, MESSAGES.STRIPE.UPDATE_SUBSCRIPTION_PLAN_FAILED);
    }
}

export const deleteSubscriptionPlan = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        if(!req.params.id){
            return helper.failed(res, MESSAGES.STRIPE.SUBSCRIPTION_PLAN_ID_REQUIRED);
        }

        const Result = await stripeServices.deleteSubscriptionPlanService(req.params.id);
        if('error' in Result){
            return helper.failed(res, Result?.error as string);
        }
        
        return helper.success(res, MESSAGES.STRIPE.DELETE_SUBSCRIPTION_PLAN_SUCCESS, Result);
    } catch (error) {
        console.error('Delete subscription plan controller error:', error);
        return helper.error(res, MESSAGES.STRIPE.DELETE_SUBSCRIPTION_PLAN_FAILED);
    }
}

export const getSubscriptionPlansByType = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        if(!req.params.userType){
            return helper.failed(res, MESSAGES.STRIPE.SUBSCRIPTION_PLAN_TYPE_REQUIRED);
        }

        const Result = await stripeServices.getSubscriptionPlansByTypeService(Number(req.params.userType));
        if('error' in Result){
            return helper.failed(res, Result?.error as string);
        }

        return helper.success(res, MESSAGES.STRIPE.GET_SUBSCRIPTION_PLAN_BY_ID_SUCCESS, Result);
    } catch (error) {
        console.error('Get subscription plan by id controller error:', error);
        return helper.error(res, MESSAGES.STRIPE.GET_SUBSCRIPTION_PLAN_BY_ID_FAILED);
    }
}