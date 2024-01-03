import { useState } from "react";
import { Link } from "react-router-dom";
import { userStore } from "../Stores/UserStore";

export function Post({ info, profilePage = false }) {
  const [isShowingImage, setShowImage] = useState(false);

  const { userId, created_at, content, image, username } = info;

  return (
    <div className=" bg-secondaryColor">
      <PostHeader
        profilePage={profilePage}
        userId={userId}
        username={username}
        created_at={created_at}
      />

      <PostContent content={content} />

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

  //if the id of the post is the same thing with the logged in user, then the post is for the user, so show 'You'
  const postUsername = loggedId === userId ? "You" : username;

  return (
    <>
      {!profilePage ? (
        <Link
          to={`/${userId}`}
          className=" flex items-center justify-between rounded-t-lg border-b border-primaryBgColor  px-2 py-1 font-semibold text-black"
        >
          <span className=" transition-all duration-500 hover:text-orangeColor">
            {postUsername}
          </span>
          <TimeOfPost time={created_at} />
        </Link>
      ) : (
        <h1 className=" flex cursor-default items-center justify-between rounded-t-lg border-b border-primaryBgColor  px-2 py-1 font-semibold text-black">
          {username} <TimeOfPost time={created_at} />
        </h1>
      )}
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

function PostContent({ content }) {
  return (
    <p className={`min-h-10  px-2 py-5 font-normal  text-black `}>{content}</p>
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
