import { useSetupPage } from "../Hooks/SetUpPageHook";

import { getAllPostsByUsers } from "../Actions/functions";

import LoadingPosts from "../Components/LoadingPosts";
import { ErrorLoading } from "../Components/Errors";
import SendPost from "../Components/SendPost";
import { Post } from "../Components/Post";
import Main from "../Components/Main";

function ExplorePage() {
  const {
    mainRef,
    numberRef,
    loadingPosts,
    postsError,
    posts,
    dispatch: addLatestPostToStack,
    isFetchingMore,
    refetchPosts,
  } = useSetupPage(getAllPostsByUsers);

  return (
    <Main
      mainRef={mainRef}
      numberRef={numberRef}
      addLatestPostToStack={addLatestPostToStack}
    >
      {loadingPosts ? <LoadingPosts numOfLoaders={4} /> : null}

      {posts ? (
        <>
          <div className="lg:mb-3">
            <SendPost
              addPostOrReplyToStack={addLatestPostToStack}
              numberRef={numberRef}
            />
          </div>

          <div className="space-y-3">
            {posts.map((post, i) => (
              <Post key={i} info={post} />
            ))}
          </div>
        </>
      ) : null}

      {postsError ? (
        <ErrorLoading retryFn={refetchPosts} message={postsError} />
      ) : null}

      {isFetchingMore ? (
        <p className="absolute bottom-0 left-1/2 translate-x-[-50%] text-xs  ">
          Loading More
        </p>
      ) : null}
    </Main>
  );
}

export default ExplorePage;
