import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getPosts, getUsersInfo } from "../Actions/functions";
import DotLoader from "./DotLoader";
import { UserContext } from "./AppLayout";

export function Post({
  info,
  profilePage = false,
  isPostPage = false,
  userPage = false,
}) {
  const [isShowingImage, setShowImage] = useState(false);

  const { user_id: userId, created_at, content, image, id: postId } = info;

  //we trim the username because it is shipped with quotes "username"
  const username = info.username.replaceAll('"', "");

  return (
    <div className=" relative bg-secondaryColor">
      <PostHeader
        profilePage={profilePage}
        userId={userId}
        username={username}
        created_at={created_at}
        userPage={userPage}
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

function PostHeader({ created_at, username, userId, userPage }) {
  const [isHovering, setIsHovering] = useState(false);

  //get the id of the user thats logged in
  const {
    user: { id: loggedId },
  } = JSON.parse(localStorage.getItem("sb-jmfwsnwrjdahhxvtvqgq-auth-token"));

  //if the id of the post is the same thing with the logged in user, then the post is for the user, so show 'You'
  const postUsername = loggedId === userId ? "You" : username;

  return (
    <h2 className=" flex items-center justify-between rounded-t-lg border-b border-primaryBgColor  px-2 py-1 font-semibold text-black">
      {/*if the post is not by the logged user and also not from an external users page add a profile link (this means the posts being rendered is from the explore or timeline page) */}

      {loggedId !== userId && !userPage ? (
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
      <div className="bg-lightBlack absolute left-full top-0 hidden h-24 min-w-52 max-w-60 animate-flash rounded-sm transition-all duration-300 hover:block hover:bg-black lg:group-hover:block">
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
          <div className="flex h-full w-full space-x-1  p-2">
            <section className="h-full ">
              <img
                src={data.avatar}
                className="h-full rounded-full object-cover"
              />
            </section>

            <section>
              <p className="font-base text-xs text-white">
                @{data.username.replaceAll('"', "")}
              </p>

              <p className="text-xs">{postsData.length} Posts</p>
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
        }  max-h-60 w-full justify-center px-3 py-6 `}
      >
        <img
          onClick={showFullImage}
          className={`w-full cursor-pointer object-contain ${
            isImageModal ? "grayscale-[100%]" : ""
          }`}
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
