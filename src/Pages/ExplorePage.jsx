import { useSetupPage } from "../Hooks/SetUpPageHook";

import { getAllPostsByUsers } from "../Actions/functions";

import LoadingPosts from "../Components/LoadingPosts";
import { ErrorLoading } from "../Components/Errors";
import SendPost from "../Components/SendPost";
import { Post } from "../Components/Post";
import Main from "../Components/Main";
import CreatePosts from "../Components/CreatePosts";
import { useContext } from "react";
import { UIContext } from "../Components/AppLayout";

function ExplorePage() {
  const { isCreatePost, toggleCreatePost } = useContext(UIContext);

  const {
    mainRef,
    numberRef,
    loadingPosts,
    postsError,
    posts,
    dispatch,
    isPending,
    refetchPosts,
  } = useSetupPage(getAllPostsByUsers);

  return (
    <Main mainRef={mainRef}>
      {loadingPosts ? <LoadingPosts /> : null}

      {!loadingPosts && !postsError ? (
        <>
          <SendPost rDispatch={dispatch} numberRef={numberRef} />
          {posts.map((post, i) => (
            <Post key={i} info={post} />
          ))}
        </>
      ) : null}

      {postsError ? (
        <ErrorLoading retryFn={refetchPosts} message={postsError} />
      ) : null}

      {isPending ? (
        <p className="absolute bottom-0 left-1/2 translate-x-[-50%] text-xs  ">
          Loading More
        </p>
      ) : null}

      <CreatePosts
        isCreatePost={isCreatePost}
        toggleCreatePost={toggleCreatePost}
        dispatch={dispatch}
        numberRef={numberRef}
      />
    </Main>
  );
}

export default ExplorePage;
