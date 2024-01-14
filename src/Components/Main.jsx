import { useContext } from "react";
import PostBtn from "./PostBtn";
import { UIContext } from "./AppLayout";
import CreatePosts from "./CreatePosts";

function Main({
  mainRef,
  children,
  showPostBtn = true,
  addLatestPostToStack,
  numberRef,
}) {
  const { isCreatePost, toggleCreatePost } = useContext(UIContext);

  return (
    <main
      ref={mainRef}
      className="   col-start-2 h-full overflow-auto border-tertiaryColor lg:border-x"
    >
      <div className="relative w-full  p-4 lg:mt-0 lg:p-5 ">{children}</div>

      <CreatePosts
        isCreatePost={isCreatePost}
        toggleCreatePost={toggleCreatePost}
        addNewPostToPage={addLatestPostToStack}
        numberRef={numberRef}
      />

      {showPostBtn ? <PostBtn /> : null}
    </main>
  );
}

export default Main;
