import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import DotLoader from "./DotLoader";
import { UserContext } from "./AppLayout";

import { getPosts, getUsersInfo } from "../Actions/functions";

export function Post({ info, isPostPage = false, isUserPage = false }) {
  const [isShowingImage, setShowImage] = useState(false);

  const { user_id: userId, created_at, content, image, id: postId } = info;

  //we trim the username because it is shipped with quotes "username"
  const username = info.username.replaceAll('"', "");

  return (
    <div className=" relative bg-secondaryColor">
      <PostHeader
        userId={userId}
        username={username}
        created_at={created_at}
        isUserPage={isUserPage}
      />

      <PostContent content={content} isPostPage={isPostPage} postId={postId} />

      {image ? (
        <PostImage
          image={image}
          isShowingImage={isShowingImage}
          setShowImage={setShowImage}
        />
      ) : null}
    </div>
  );
}

function PostHeader({ created_at, username, userId, isUserPage }) {
  const [isHovering, setIsHovering] = useState(false);

  //get the id of the user thats logged in
  const {
    user: { id: loggedId },
  } = JSON.parse(localStorage.getItem("sb-jmfwsnwrjdahhxvtvqgq-auth-token"));

  //if the userId of the post is the same as the logged in user, then the post is for the user, so replace username w 'You'
  const postUsername = loggedId === userId ? "You" : username;

  return (
    <h2 className=" flex items-center justify-between rounded-t-lg border-b border-primaryBgColor  px-2 py-1 font-semibold text-black">
      {/*if the post being rendered is not by the logged user and the logged in user is not on the userPage route (this means the posts being rendered is from the explore or timeline page) */}

      {loggedId !== userId && !isUserPage ? (
        <Link
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          to={`/${userId}`}
          className="group relative pr-1 font-bold transition-all duration-500 hover:text-orangeColor"
        >
          @{postUsername}
          {isHovering ? <HoverUserNameModal userId={userId} /> : null}
        </Link>
      ) : (
        <span className="font-bold">@{postUsername}</span>
      )}

      <TimeOfPost time={created_at} />
    </h2>
  );
}

function HoverUserNameModal({ userId }) {
  //get the users info
  const { isFetched, isFetching, isLoading, isRefetching, error, data } =
    useQuery({
      queryKey: ["externalUsersInfo"],
      queryFn: () => getUsersInfo(userId),
    });

  //get the users posts
  const {
    isFetched: fetchedPosts,
    isFetching: fetchingPosts,
    isLoading: loadingPosts,
    isRefetching: isRefetchingPosts,
    error: postsError,
    data: postsData,
  } = useQuery({
    queryKey: ["externalUsersPosts"],
    queryFn: () => getPosts(userId),
  });

  return (
    <>
      <div className="absolute left-full top-0 hidden h-24 min-w-52 max-w-60 animate-flash rounded-sm bg-lightBlack transition-all duration-300 hover:block hover:bg-black hover:shadow hover:shadow-black  lg:group-hover:block">
        {(isFetching ||
          isRefetching ||
          isLoading ||
          fetchingPosts ||
          loadingPosts ||
          isRefetchingPosts) &&
        (!error || !postsError) ? (
          <DotLoader />
        ) : null}

        {isFetched &&
        fetchedPosts &&
        !isLoading &&
        !loadingPosts &&
        !isRefetching &&
        !isRefetchingPosts &&
        !error &&
        !postsError ? (
          <div className="flex h-full w-full space-x-1 p-2 ">
            <section className="h-full rounded-full">
              <img
                src={data.avatar}
                className="aspect-square h-full rounded-full object-cover"
              />
            </section>

            <section>
              <p className=" text-xs tracking-wide text-white">
                @{data.username.replaceAll('"', "")}
              </p>

              <p className="text-xs font-normal tracking-wide text-white">
                {postsData.length} {postsData.length !== 1 ? "Posts" : "Post"}
              </p>
            </section>
          </div>
        ) : null}

        {error || postsError || null}
      </div>
    </>
  );
}

function TimeOfPost({ time }) {
  const newTime = new Date(time);
  const formattedDate = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "short",
    timeStyle: "short",
    hourCycle: "h12",
  }).format(newTime);

  return (
    <span className="text-xs font-medium  underline">{formattedDate}</span>
  );
}

function PostContent({ content, postId, isPostPage }) {
  const navigate = useNavigate();

  function goToPostPage() {
    if (isPostPage) return;
    navigate(`/post/${postId}`);
  }
  return (
    <p
      onClick={goToPostPage}
      className={`min-h-10 ${
        !isPostPage ? "cursor-pointer" : null
      }  px-2 py-5 font-normal  text-black `}
    >
      {content}
    </p>
  );
}

function PostImage({ image, isShowingImage, setShowImage }) {
  const { toggleImageModal, isImageModal } = useContext(UserContext);

  function showFullImage(e) {
    e.stopPropagation();
    toggleImageModal(image);
  }
  return (
    <>
      <div
        className={` ${
          isShowingImage ? "flex" : "hidden"
        }  max-h-60 w-full justify-center px-3 py-4 `}
      >
        <img
          onClick={showFullImage}
          className={`w-full cursor-pointer object-contain ${
            isImageModal ? "grayscale-[100%]" : ""
          } transition-all duration-300 hover:scale-110`}
          src={image}
        />
      </div>

      <span
        className="block cursor-pointer  border-t border-primaryBgColor  py-1 text-center text-xs font-semibold text-stone-800  transition-all duration-300 hover:py-1.5 hover:text-orangeLight"
        onClick={() => setShowImage((c) => !c)}
      >
        {isShowingImage ? "Hide" : "Show"} Image
      </span>
    </>
  );
}
