import { ISubscriptionPlan } from "../../interfaces/stripeInterface";
import subscriptionPlanModel from "../../models/subscriptionPlanModel";
import { MESSAGES } from "../../utils/constants/messages";
import { stripeCreateProduct, stripeExistingProduct } from "../../utils/stripe/stripe";

export const createSubscriptionPlanService = async (data: ISubscriptionPlan) => {
    try {
        const existingPlan = await subscriptionPlanModel.findOne({ name: data.name, interval: data.interval, amount: data.amount });
        if (existingPlan) {
            return { error: MESSAGES.STRIPE.SUBSCRIPTION_PLAN_ALREADY_EXISTS };
        }

        const existingProduct = await stripeExistingProduct(data.name);
        if(existingProduct){
            return { error: MESSAGES.STRIPE.SUBSCRIPTION_PLAN_ALREADY_EXISTS };
        }
        
        const createProduct = await stripeCreateProduct(data);
        if(!createProduct){
            return { error: MESSAGES.STRIPE.CREATE_PRODUCT_FAILED };
        }

        const subscriptionPlan = await subscriptionPlanModel.create(data);
        if(!subscriptionPlan){
            return { error: MESSAGES.STRIPE.CREATE_SUBSCRIPTION_PLAN_FAILED };
        }

        return subscriptionPlan;
    } catch (error) {
        console.error('Create subscription plan service error:', error);
        return { error: MESSAGES.STRIPE.CREATE_SUBSCRIPTION_PLAN_FAILED };
    }
};

export const getSubscriptionPlansService = async () => {
    try {
        const subscriptionPlans = await subscriptionPlanModel.find({ status: 1 });
        if(!subscriptionPlans){
            return { error: MESSAGES.STRIPE.GET_SUBSCRIPTION_PLANS_FAILED };
        }

        if(subscriptionPlans.length === 0){
            return { error: MESSAGES.STRIPE.NO_SUBSCRIPTION_PLANS_FOUND };
        }
        
        return subscriptionPlans;
    } catch (error) {
        console.error('Get subscription plans service error:', error);
        return { error: MESSAGES.STRIPE.GET_SUBSCRIPTION_PLANS_FAILED };
    }
}

export const updateSubscriptionPlanService = async (id: string, data: ISubscriptionPlan) => {
    try {
        const existingPlan = await subscriptionPlanModel.findOne({ _id: id });
        if (!existingPlan) {
            return { error: MESSAGES.STRIPE.SUBSCRIPTION_PLAN_NOT_FOUND };
        }

        const subscriptionPlan = await subscriptionPlanModel.updateOne({ _id: id }, data);

        if(!subscriptionPlan){
            return { error: MESSAGES.STRIPE.UPDATE_SUBSCRIPTION_PLAN_FAILED };
        }

        return subscriptionPlan;
    } catch (error) {
        console.error('Update subscription plan service error:', error);
        return { error: MESSAGES.STRIPE.UPDATE_SUBSCRIPTION_PLAN_FAILED };
    }
}

export const deleteSubscriptionPlanService = async (id: string) => {
    try {
        const existingPlan = await subscriptionPlanModel.findOne({ _id: id });
        if (!existingPlan) {
            return { error: MESSAGES.STRIPE.SUBSCRIPTION_PLAN_NOT_FOUND };
        }

        const subscriptionPlan = await subscriptionPlanModel.deleteOne({ _id: id });
        if(!subscriptionPlan){
            return { error: MESSAGES.STRIPE.DELETE_SUBSCRIPTION_PLAN_FAILED };
        }

        return subscriptionPlan;
    } catch (error) {
        console.error('Delete subscription plan service error:', error);
        return { error: MESSAGES.STRIPE.DELETE_SUBSCRIPTION_PLAN_FAILED };
    }
}

export const getSubscriptionPlansByTypeService = async (userType: number) => {
    try {
        const subscriptionPlan = await subscriptionPlanModel.findOne({ userType: userType, status: 1 });
        if(!subscriptionPlan){
            return { error: MESSAGES.STRIPE.SUBSCRIPTION_PLAN_NOT_FOUND };
        }

        return subscriptionPlan;
    } catch (error) {
        console.error('Get subscription plan by id service error:', error);
        return { error: MESSAGES.STRIPE.GET_SUBSCRIPTION_PLAN_BY_ID_FAILED };
    }
}
