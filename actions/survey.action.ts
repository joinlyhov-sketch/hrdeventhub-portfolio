"use server";

import { surveyService } from "@/service/survey.service";
import { SurveyRequest, SurveyResponseRequest } from "../types/survey";
import { revalidateTag } from "next/cache";

export async function createSurveyAction(data: SurveyRequest) {
    const result = await surveyService.createSurvey(data);
    revalidateTag("surveys", "max");
    if (data.workspaceId) {
        revalidateTag(`workspace-surveys-${data.workspaceId}`, "max");
    }
    return result;
}

export async function updateSurveyAction(surveyId: string, data: Partial<SurveyRequest>) {
    const result = await surveyService.updateSurvey(surveyId, data);
    revalidateTag("surveys", "max");
    revalidateTag(`survey-${surveyId}`, "max");
    if (data.workspaceId) {
        revalidateTag(`workspace-surveys-${data.workspaceId}`, "max");
    }
    return result;
}

export async function deleteSurveyAction(surveyId: string, workspaceId?: string) {
    await surveyService.deleteSurvey(surveyId);
    revalidateTag("surveys", "max");
    revalidateTag(`survey-${surveyId}`, "max");
    if (workspaceId) {
        revalidateTag(`workspace-surveys-${workspaceId}`, "max");
    }
}

export async function submitSurveyResponseAction(surveyId: string, responseData: SurveyResponseRequest) {
    const result = await surveyService.submitSurveyResponse(surveyId, responseData);
    revalidateTag(`survey-responses-${surveyId}`, "max");
    revalidateTag(`survey-has-submitted-${surveyId}`, "max");
    return result;
}
