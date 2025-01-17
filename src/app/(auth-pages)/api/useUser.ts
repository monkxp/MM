import useQuery from "@/app/hooks/useQuery";
// import cache from "@/lib/cache";

const useGetUser = (userId: string) => {
  //   const queryFn = async () => {
  //     const cachedUser = cache.get(userId);
  //     if (cachedUser) return cachedUser;

  //     const response = await fetch(`/api/users/${userId}`);
  //     if (!response.ok) throw new Error("Failed to fetch user");
  //     const user = await response.json();
  //     cache.set(userId, user);
  //     return user;
  //   };

  const queryFn = async () => {
    // Try to get from cache first
    const cache = await caches.open("user-cache");
    const cachedResponse = await cache.match(`/api/users/${userId}`);
    if (cachedResponse) return cachedResponse.json();

    // If not in cache, fetch and cache
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    const clone = response.clone();
    cache.put(`/api/users/${userId}`, clone);
    return response.json();
  };

  return useQuery({
    queryFn,
    enabled: !!userId,
  });
};

export default useGetUser;
