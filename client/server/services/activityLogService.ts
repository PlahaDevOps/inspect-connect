import { MESSAGES } from "../helpers/constants/messages";
import { IActivityLog } from "../interfaces/logInterface";
import activityLogModel from "../models/logActivityModel";

export const createActivityLogService = async (data: IActivityLog) => {
    try {
        const activityLog = await activityLogModel.create(data);

        if(!activityLog){
            return { error: MESSAGES.ACTIVITY_LOG.CREATE_FAILED };
        }
        return activityLog;
    } catch (error) {
        console.error('Error creating activity log:', error);
        return { error: MESSAGES.ACTIVITY_LOG.CREATE_FAILED };
    }
}