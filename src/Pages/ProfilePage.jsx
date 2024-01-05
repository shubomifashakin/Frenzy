import { useQuery } from "@tanstack/react-query";

import { getPosts, sortPostsFromLatestToOldest } from "../Actions/functions";

import LoadingPosts from "../Components/LoadingPosts";
import { ErrorLoading } from "../Components/Errors";
import { Post } from "../Components/Post";

function ProfilePage() {
  const {
    user: { id },
  } = JSON.parse(localStorage.getItem("sb-jmfwsnwrjdahhxvtvqgq-auth-token"));

  //fetches our posts on mount
  const { status, data, error, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(id),
  });

  const posts = data ? sortPostsFromLatestToOldest(data) : [];

  return (
    <div className="w-full space-y-4  p-5 lg:mt-0 ">
      {status === "pending" ? <LoadingPosts /> : null}

      {status === "success"
        ? posts.map((post, i) => (
            <Post profilePage={true} key={i} info={post} />
          ))
        : null}

      {status === "error" ? (
        <ErrorLoading retryFn={refetch} message={error.message} />
      ) : null}
    </div>
  );
}

export default ProfilePage;
