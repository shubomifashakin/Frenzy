import { useQuery } from "@tanstack/react-query";
import { PostStore } from "../Stores/PostStore";
import { useParams } from "react-router-dom";

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

  // console.log(data);

  return (
    <div className="m-auto w-full  rounded-md bg-tertiaryColor px-5 py-5 lg:mt-0 lg:w-1/2">
      {status === "pending" ? <p>Loading</p> : null}
      {status === "success"
        ? reversed.map((post, i) => <Post key={i} info={post} />)
        : null}
      {status === "error" ? <p>{error.message}</p> : null}
    </div>
  );
}

function Post({ info }) {
  const { created_at, content, image } = info;
  return (
    <div className="mb-4 min-h-32">
      <h1 className=" flex items-center justify-between rounded-t-lg border-2  border-primaryColor bg-secondaryColor px-2 py-3.5 font-semibold text-primaryColor">
        Username <TimeOfPost time={created_at} />
      </h1>
      <p className="rounded-b-lg bg-primaryColor px-2 py-5"> {content}</p>
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

  const onlyTime = new Intl.DateTimeFormat(navigator.language, {
    timeStyle: "short",
    hourCycle: "h24",
    hour12: false,
  }).format(newTime);

  const timePassed = Date.now() - new Date(newTime);
  const daysSincePost = Math.trunc(timePassed / 86_400_000);
  const today = daysSincePost === 0 ? `Today by ${onlyTime}` : null;
  const yesterday = daysSincePost === 1 ? `Yesterday by ${onlyTime}` : null;

  return <span className="text-xs">{formattedDate}</span>;
}
export default TimelinePage;
