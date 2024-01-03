import { useQuery } from "@tanstack/react-query";
import { getAllPostsByUsers } from "../Actions/functions";
import { ErrorLoading } from "../Components/Errors";
import LoadingPosts from "../Components/LoadingPosts";
import { Post } from "../Components/Post";

function ExplorePage() {
  //get posts from all users
  const { status, error, data, refetch } = useQuery({
    queryKey: ["allPosts"],
    queryFn: getAllPostsByUsers,
  });

  //reverses the post to start from last to first
  const reversed = data?.slice(0)?.reverse();

  return (
    <div className="w-full space-y-4  p-5 lg:mt-0 ">
      {status === "pending" ? <LoadingPosts /> : null}
      {status === "success"
        ? reversed.map((post, i) => <Post key={i} info={post} />)
        : null}
      {status === "error" ? (
        <ErrorLoading retryFn={refetch} message={error.message} />
      ) : null}
    </div>
  );
}

export default ExplorePage;
