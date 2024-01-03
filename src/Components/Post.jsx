import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userStore } from "../Stores/UserStore";

export function Post({ info, profilePage = false, isPostPage = false }) {
  const [isShowingImage, setShowImage] = useState(false);

  const {
    user_id: userId,
    created_at,
    content,
    image,
    username,
    id: postId,
  } = info;

  console.log(info);
  return (
    <div className=" bg-secondaryColor">
      <PostHeader
        profilePage={profilePage}
        userId={userId}
        username={username}
        created_at={created_at}
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

function PostHeader({ created_at, username, userId, profilePage }) {
  const { id: loggedId } = userStore(function (state) {
    return state.user;
  });

  console.log(loggedId === userId);

  //if the id of the post is the same thing with the logged in user, then the post is for the user, so show 'You'
  const postUsername = loggedId === userId ? "You" : username;

  return (
    <h2 className=" flex items-center justify-between rounded-t-lg border-b border-primaryBgColor  px-2 py-1 font-semibold text-black">
      {!profilePage ? (
        <Link
          to={`/${userId}`}
          className=" transition-all duration-500 hover:text-orangeColor"
        >
          {postUsername}
        </Link>
      ) : (
        <span> {postUsername}</span>
      )}
      <TimeOfPost time={created_at} />
    </h2>
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
  return (
    <>
      <div
        className={` ${
          isShowingImage ? "flex" : "hidden"
        }  max-h-60 w-full justify-center px-3 py-6 `}
      >
        <img className="w-full object-contain" src={image} />
      </div>

      <span
        className="block cursor-pointer  border-t border-primaryBgColor  py-1 text-center text-xs font-semibold text-stone-800  transition-all duration-300 hover:py-1.5 hover:text-stone-500"
        onClick={() => setShowImage((c) => !c)}
      >
        {isShowingImage ? "Hide" : "Show"} Image
      </span>
    </>
  );
}
