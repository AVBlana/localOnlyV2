import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Experience } from "@/types/experience";

export const useExperiencesQuery = () => {
  return useQuery<Experience[]>({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data } = await apiClient.get("/experiences");
      return data;
    },
  });
};

