import { useQuery } from "@tanstack/react-query";

import { getConnections } from "@/services/connections";

export const useConnections = () => {
  const query = useQuery({
    queryKey: ["connections"],
    queryFn: getConnections,
  });

  return {
    ...query,
    connections: query.data?.data ?? [],
  };
};
