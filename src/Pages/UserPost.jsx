import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getSinglePost } from "../Actions/functions";
import LoadingPosts from "../Components/LoadingPosts";
import { Post } from "../Components/Post";
import { ErrorLoading } from "../Components/Errors";

function UserPost() {
  const { postId } = useParams();
  console.log(postId);
  const { isFetching, isLoading, error, data, isFetched, refetch } = useQuery({
    queryKey: ["clickedPost"],
    queryFn: () => getSinglePost(postId),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="w-full space-y-4  p-5 lg:mt-0 ">
      {isFetching || isLoading ? <LoadingPosts /> : null}

      {isFetched && !isLoading && !error ? (
        <div>
          <Post info={data} isPostPage={true} />
          <Link
            className="block text-right text-sm font-semibold underline lg:text-xs"
            to={-1}
          >
            Return
          </Link>
        </div>
      ) : null}

      {error ? (
        <ErrorLoading message={error.message} retryFn={refetch} />
      ) : null}
    </div>
  );
}

export default UserPost;
