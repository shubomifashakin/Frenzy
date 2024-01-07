import { useMutation, useQueryClient } from "@tanstack/react-query";

import LoadingPosts from "../Components/LoadingPosts";
import { ErrorLoading } from "../Components/Errors";
import { Post } from "../Components/Post";

import { getAllPostsByUsers } from "../Actions/functions";
import SendPost from "../Components/SendPost";
import { useCallback, useEffect, useReducer, useRef } from "react";
import Main from "../Components/Main";

const initialState = {
  loading: false,
  error: "",
  data: [],
};

function Reducer(state, { payload, label }) {
  if (label === "isLoading") {
    return { ...state, loading: true, error: "" };
  }
  if (label === "isFetched") {
    return { loading: false, error: "", data: payload };
  }
  if (label === "isError") {
    return { ...state, loading: false, error: payload };
  }

  if (label === "oldPosts") {
    return { ...state, data: [...state.data, ...payload] };
  }

  if (label === "newPost") {
    return { ...state, data: [...payload, ...state.data] };
  }
}

function ExplorePage() {
  const mainRef = useRef(null);
  const numberRef = useRef(10);

  const [{ loading, error, data: posts }, dispatch] = useReducer(
    Reducer,
    initialState,
  );

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: getAllPostsByUsers,

    onSuccess: (data) => {
      queryClient.invalidateQueries(["allPosts"]);

      //only increment the ref if the scroll actually returned more oold posts & we were scrolling down
      if (data.Posts.length > 0 && data.number) {
        //add the newly fetched posts to the data
        dispatch({ label: "oldPosts", payload: data.Posts });
        numberRef.current += 10;
      }
    },
  });

  const fetchPosts = useCallback(async function () {
    try {
      dispatch({ label: "isLoading" });
      const data = await getAllPostsByUsers();
      dispatch({ label: "isFetched", payload: data.Posts });
    } catch (err) {
      dispatch({ label: "isError", payload: err.message });
    }
  }, []);

  //fetches the 10 latests posts on mount
  useEffect(
    function () {
      fetchPosts();
    },
    [fetchPosts],
  );

  //adds a scroll event listener on mount,
  //if the user scrolls to the last post fetch more
  useEffect(
    function () {
      const element = mainRef.current;
      function scrollFn() {
        if (
          element.scrollTop === element.scrollHeight - element.clientHeight &&
          !isPending
        ) {
          mutate(numberRef.current);
        }
      }

      element.addEventListener("scroll", scrollFn);

      return () => element.removeEventListener("scroll", scrollFn);
    },
    [mutate, isPending],
  );

  return (
    <Main mainRef={mainRef}>
      {loading ? <LoadingPosts /> : null}

      {!loading && !error ? (
        <>
          <SendPost dispatch={dispatch} />
          {posts.map((post, i) => (
            <Post key={i} info={post} />
          ))}
        </>
      ) : null}

      {error ? <ErrorLoading retryFn={fetchPosts} message={error} /> : null}
      {isPending ? (
        <p className="absolute bottom-0 left-1/2 translate-x-[-50%] text-xs  ">
          Loading More
        </p>
      ) : null}
    </Main>
  );
}

export default ExplorePage;
