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
    isFetchingMore,
    loadingPosts: loadingReplies,
    postsError: replyError,
    posts: replies,
    refetchPosts: refetchReplies,
    dispatch: AddLatestReplyToStack,
  } = useSetupPage(getRepliesToPost, postId);

  //fetches the post we clicked on mount
  const {
    status,
    error: errorFetchingPost,
    data,
    refetch: refetchClickedPost,
  } = useQuery({
    queryKey: ["clickedPost"],
    queryFn: () => getSinglePost(postId),
    refetchOnWindowFocus: false,
  });

  return (
    <Main showPostBtn={false} mainRef={mainRef}>
      {status === "pending" ? <LoadingPosts numOfLoaders={1} /> : null}

      {status === "success" ? (
        <div className="space-y-2">
          <Post info={data} isPostPage={true} replies={data.num_comments} />

          <SendPost
            addPostOrReplyToStack={AddLatestReplyToStack}
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

          {replies ? (
            <>
              {replies.map((reply, i) => (
                <Post key={i} info={reply} isPostPage={true} />
              ))}
            </>
          ) : null}

          {replyError ? (
            <ErrorLoading retryFn={refetchReplies} message={replyError} />
          ) : null}

          {isFetchingMore ? (
            <p className="absolute bottom-1 left-1/2 translate-x-[-50%] text-xs  ">
              Loading More
            </p>
          ) : null}
        </div>
      ) : null}

      {status === "error" ? (
        <ErrorLoading
          message={errorFetchingPost.message}
          retryFn={refetchClickedPost}
        />
      ) : null}
    </Main>
  );
}

export default UserPost;
