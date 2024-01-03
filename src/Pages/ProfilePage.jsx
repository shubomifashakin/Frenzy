import { useQuery } from "@tanstack/react-query";

import { userStore } from "../Stores/UserStore";

import { getPosts } from "../Actions/functions";

import LoadingPosts from "../Components/LoadingPosts";
import { ErrorLoading } from "../Components/Errors";
import { Post } from "../Components/Post";

function ProfilePage() {
  const { id } = userStore(function (state) {
    return state.user;
  });

  //fetches our posts on mount
  const { status, data, error, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(id),
  });

  //reverses the post to start from last to first
  const reversed = data?.slice(0)?.reverse();

  return (
    <div className="w-full space-y-4  p-5 lg:mt-0 ">
      {status === "pending" ? <LoadingPosts /> : null}

      {status === "success"
        ? reversed.map((post, i) => (
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
