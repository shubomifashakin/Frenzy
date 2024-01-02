import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import LoadingSpinner from "../Components/LoadingSpinner";
import { userStore } from "../Stores/UserStore";
import { getPosts } from "../Actions/functions";

function ProfilePage() {
  const { id } = userStore(function (state) {
    return state.user;
  });

  //fetches our posts on mount
  const { status, data, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(id),
  });

  //reverses the post to start from last to first
  const reversed = data?.slice(0)?.reverse();

  return (
    <div className="w-full space-y-4 border-tertiaryColor p-5 lg:mt-0  lg:border-x">
      {status === "pending" ? <LoadingSpinner /> : null}

      {status === "success"
        ? reversed.map((post, i) => <Post key={i} info={post} />)
        : null}

      {status === "error" ? <p>{error.message}</p> : null}
    </div>
  );
}

function Post({ info }) {
  const [isShowingImage, setShowImage] = useState(false);

  const { created_at, content, image, username } = info;

  return (
    <div className=" bg-secondaryColorHover">
      <h1 className=" flex items-center justify-between rounded-t-lg border-b border-primaryColor  px-2 py-1 font-semibold text-black">
        {username} <TimeOfPost time={created_at} />
      </h1>

      <p className={`min-h-10  px-2 py-5 font-normal  text-black `}>
        {content}
      </p>

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

function TimeOfPost({ time }) {
  const newTime = new Date(time);
  const formattedDate = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "medium",
    timeStyle: "short",
    hourCycle: "h12",
  }).format(newTime);

  return (
    <span className="text-xs font-medium  underline">{formattedDate}</span>
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
        className="block cursor-pointer  border-t border-primaryColor  py-1 text-center text-xs font-semibold text-stone-800   transition-all duration-500 hover:text-secondaryColorHover"
        onClick={() => setShowImage((c) => !c)}
      >
        {isShowingImage ? "Hide" : "Show"} Image
      </span>
    </>
  );
}
export default ProfilePage;
