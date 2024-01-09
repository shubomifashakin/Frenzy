import { useSetupPage } from "../Hooks/SetUpPageHook";

import { getUsersPostsInf } from "../Actions/functions";

import LoadingPosts from "../Components/LoadingPosts";
import { ErrorLoading } from "../Components/Errors";
import SendPost from "../Components/SendPost";
import { Post } from "../Components/Post";
import Main from "../Components/Main";
import { useContext } from "react";
import { UIContext } from "../Components/AppLayout";
import CreatePosts from "../Components/CreatePosts";

function ProfilePage() {
  const { isCreatePost, toggleCreatePost } = useContext(UIContext);

  const {
    user: { id },
  } = JSON.parse(localStorage.getItem("sb-jmfwsnwrjdahhxvtvqgq-auth-token"));

  const {
    mainRef,
    numberRef,
    loadingPosts,
    postsError,
    posts,
    dispatch,
    isPending,
    refetchPosts,
  } = useSetupPage(getUsersPostsInf, id);

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
        <p className="absolute bottom-1 left-1/2 translate-x-[-50%] text-xs  ">
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

export default ProfilePage;
