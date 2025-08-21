import { Request, Response } from "express";
import * as helper from '../helpers/commonHelpers';
import { createActivityLogService } from "../services/activityLogService";
import { activityLogValidation } from "../validations/activityLogValidation";
import { MESSAGES } from "../helpers/constants/messages";

export const createActivityLog = async (req: any, res: Response) => {
    try {
        const { error, value: validatedData } = activityLogValidation(req.body);
        if (error) {
            return helper.failed(res, error.details[0].message);
        }

        const ipHeader = req.headers["x-forwarded-for"];
        const ipAddress = Array.isArray(ipHeader)
            ? ipHeader[0]
            : ipHeader?.split(",")[0];

        const validateDataSend = {
            ...validatedData,
            ipAddress,
            userAgent: req.headers["user-agent"],
            userId: req.user._id,
        };

        const result = await createActivityLogService(validateDataSend);
        if ("error" in result) {
            return helper.failed(res, result.error);
        }

        return helper.success(res, MESSAGES.ACTIVITY_LOG.CREATE_SUCCESS, result);
    } catch (error) {
        console.error('Error creating activity log:', error);
        return helper.error(res, MESSAGES.ACTIVITY_LOG.CREATE_FAILED);
    }
}

