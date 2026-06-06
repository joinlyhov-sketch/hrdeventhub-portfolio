import useSWR from "swr";
import { surveyService } from "@/service/survey.service";
import { Survey } from "@/types/survey";
 
const fetchWorkspaceSurveys = async (workspaceId: string): Promise<Survey[]> => {
  return surveyService.getSurveysByWorkspace(workspaceId, 1, 50);
};
 
export function useWorkspaceSurveys(workspaceId: string) {
  const { data, error, isLoading, mutate } = useSWR<Survey[]>(
    workspaceId ? `workspace-surveys-${workspaceId}` : null,
    () => fetchWorkspaceSurveys(workspaceId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
    }
  );
 
  return {
    surveys: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
