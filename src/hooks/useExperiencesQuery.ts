import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Experience } from "@/types/experience";

const PAGE_SIZE = 9;

export type ExperiencesPage = {
  items: Experience[];
  nextPage: number | null;
  hasMore: boolean;
};

export const useExperiencesQuery = () => {
  return useInfiniteQuery<ExperiencesPage>({
    queryKey: ["experiences"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const { data } = await apiClient.get<ExperiencesPage>("/experiences", {
        params: {
          page: pageParam,
          limit: PAGE_SIZE,
        },
      });

      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
};

