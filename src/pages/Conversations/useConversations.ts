import { useQuery } from "@tanstack/react-query";

import { getConversations } from "@/services/conversations";

export const useConversations = () => {
  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  return {
    ...query,
    conversations: query.data?.data ?? [],
  };
};
