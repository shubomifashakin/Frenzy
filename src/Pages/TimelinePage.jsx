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

  return (
    <div className="m-auto w-[80%] pt-5 lg:w-1/2">
      {status === "pending" ? <p>Loading</p> : null}
      {status === "success"
        ? data.map((post, i) => <Post key={i} info={post} />)
        : null}
      {status === "error" ? <p>{error.message}</p> : null}
    </div>
  );
}

function Post({ info }) {
  return <p>{info.content}</p>;
}

export default TimelinePage;
