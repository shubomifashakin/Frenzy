import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import { getSinglePost } from "../Actions/functions";

import LoadingPosts from "../Components/LoadingPosts";
import { Post } from "../Components/Post";
import { ErrorLoading } from "../Components/Errors";
import Main from "../Components/Main";

function UserPost() {
  const { postId } = useParams();
  const {
    isFetching,
    isLoading,
    error,
    data,
    isFetched,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["clickedPost"],
    queryFn: () => getSinglePost(postId),
    refetchOnWindowFocus: false,
  });

  return (
    <Main>
      {isFetching || isLoading || isRefetching ? (
        <LoadingPosts numOfLoaders={1} />
      ) : null}

      {isFetched && !isLoading && !isRefetching && !error ? (
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
    </Main>
  );
}

export default UserPost;
