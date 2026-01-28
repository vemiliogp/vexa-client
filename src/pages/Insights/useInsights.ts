import { useQuery } from "@tanstack/react-query";

import { getInsights } from "@/services/insights";

export const useInsights = () => {
  const query = useQuery({
    queryKey: ["insights"],
    queryFn: getInsights,
  });

  return {
    ...query,
    insights: query.data?.data ?? [],
  };
};
