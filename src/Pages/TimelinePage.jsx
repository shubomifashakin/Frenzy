import { useQuery } from "@tanstack/react-query";
import { PostStore } from "../Stores/PostStore";
import { useParams } from "react-router-dom";
import { useState } from "react";
import LoadingSpinner from "../Components/LoadingSpinner";

function TimelinePage() {
  //receives the function to getPosts from our postsStore
  const getPosts = PostStore(function (state) {
    return state.getPosts;
  });

  //gets the userId from the url
  const { userId } = useParams();

  //fetches our posts on mount
  const { status, data, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(userId),
  });
  const reversed = data?.slice(0)?.reverse();

  return (
    <div className="m-auto w-full  rounded-md px-5 py-5 lg:mt-0 lg:w-1/2">
      {status === "pending" ? <LoadingSpinner /> : null}
      {status === "success"
        ? reversed.map((post, i) => <Post key={i} info={post} />)
        : null}
      {status === "error" ? <p>{error.message}</p> : null}
    </div>
  );
}

function Post({ info }) {
  const { created_at, content, image } = info;
  const [isShowingImage, setShowImage] = useState(false);

  return (
    <div className=" min-h-32 has-[~div]:mb-4">
      <h1 className=" flex items-center justify-between rounded-t-lg border-2  border-primaryColor bg-secondaryColor px-2 py-3.5 font-semibold text-primaryColor">
        Username <TimeOfPost time={created_at} />
      </h1>
      <p
        className={` bg-primaryColor px-2 py-5 font-normal ${
          !image ? "rounded-b-md border-2 border-primaryColor" : ""
        }`}
      >
        {" "}
        {content}
      </p>

      {image ? (
        <PostImage image={image} isShowingImage={isShowingImage} />
      ) : null}

      {image ? (
        <span
          className="block cursor-pointer rounded-b-md border-2 border-primaryColor bg-secondaryColor py-1 text-center text-sm font-semibold text-tertiaryColor transition-all  duration-500 hover:text-secondaryColorHover"
          onClick={() => setShowImage((c) => !c)}
        >
          {isShowingImage ? "Hide" : "Show"} Image
        </span>
      ) : null}
    </div>
  );
}

function TimeOfPost({ time }) {
  const newTime = new Date(time);
  const formattedDate = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "long",
    timeStyle: "short",
    hourCycle: "h12",
  }).format(newTime);

  return <span className="text-xs underline">{formattedDate}</span>;
}

function PostImage({ image, isShowingImage }) {
  return (
    <div
      className={` ${
        isShowingImage ? "flex" : "hidden"
      }  max-h-60 w-full justify-center  bg-primaryColor px-3 py-6 `}
    >
      <img className="w-full object-contain" src={image} />
    </div>
  );
}
export default TimelinePage;
