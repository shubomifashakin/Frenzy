import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useSetupPage } from "../Hooks/SetUpPageHook";

import { getRepliesToPost, getSinglePost } from "../Actions/functions";

import LoadingPosts from "../Components/LoadingPosts";
import { ErrorLoading } from "../Components/Errors";
import SendPost from "../Components/SendPost";
import { Post } from "../Components/Post";
import Main from "../Components/Main";

function UserPost() {
  const { postId } = useParams();

  const {
    mainRef,
    numberRef,
    isPending,
    loadingPosts: loadingReplies,
    postsError: replyError,
    posts: replies,
    refetchPosts: refetchReplies,
    dispatch,
  } = useSetupPage(getRepliesToPost, postId);

  //fetches the post we clicked on mount
  const { isLoading, error, data, isFetched, refetch } = useQuery({
    queryKey: ["clickedPost"],
    queryFn: () => getSinglePost(postId),
    refetchOnWindowFocus: false,
  });

  return (
    <Main mainRef={mainRef}>
      {isLoading ? <LoadingPosts numOfLoaders={1} /> : null}

      {isFetched && !isLoading ? (
        <div className="space-y-2">
          <Post info={data} isPostPage={true} replies={replies.length} />

          <SendPost
            rDispatch={dispatch}
            isPostPage={true}
            numberRef={numberRef}
          />

          <Link
            className="block text-right text-sm font-semibold underline lg:text-xs"
            to={"/explore"}
          >
            Return
          </Link>

          {loadingReplies ? (
            <p className="absolute bottom-1 left-1/2 translate-x-[-50%] text-xs  ">
              Loading Comments
            </p>
          ) : null}

          {!loadingReplies && !replyError ? (
            <>
              {replies.map((reply, i) => (
                <Post key={i} info={reply} />
              ))}
            </>
          ) : null}

          {replyError ? (
            <ErrorLoading retryFn={refetchReplies} message={replyError} />
          ) : null}

          {isPending ? (
            <p className="absolute bottom-1 left-1/2 translate-x-[-50%] text-xs  ">
              Loading More
            </p>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <ErrorLoading message={error.message} retryFn={refetch} />
      ) : null}
    </Main>
  );
}

export default UserPost;
