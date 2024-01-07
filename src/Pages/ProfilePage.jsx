import { useCallback, useEffect, useReducer, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import LoadingPosts from "../Components/LoadingPosts";
import { ErrorLoading } from "../Components/Errors";
import { Post } from "../Components/Post";

import SendPost from "../Components/SendPost";
import Main from "../Components/Main";

import { getUsersPostsInf } from "../Actions/functions";

const initialState = {
  loading: false,
  error: "",
  data: [],
};

function Reducer(state, { payload, label }) {
  switch (label) {
    case "isLoading":
      return { ...state, loading: true, error: "" };
    case "isFetched":
      return { loading: false, error: "", data: payload };
    case "isError":
      return { ...state, loading: false, error: payload };
    case "oldPosts":
      return { ...state, data: [...state.data, ...payload] };
    case "newPost":
      return { ...state, data: [...payload, ...state.data] };
  }
}

function ProfilePage() {
  const {
    user: { id },
  } = JSON.parse(localStorage.getItem("sb-jmfwsnwrjdahhxvtvqgq-auth-token"));

  const [{ loading, error, data: posts }, dispatch] = useReducer(
    Reducer,
    initialState,
  );

  const { mutate, isPending } = useMutation({
    mutationFn: getUsersPostsInf,

    onSuccess: (data) => {
      //only increment the ref if the scroll actually returned something
      if (data.length > 0) {
        dispatch({ label: "oldPosts", payload: data });
        numberRef.current += 10;
      }
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  const mainRef = useRef(null);
  const numberRef = useRef(10);

  const fetchPosts = useCallback(
    async function () {
      try {
        dispatch({ label: "isLoading" });
        const data = await getUsersPostsInf({ id });
        dispatch({ label: "isFetched", payload: data });
      } catch (err) {
        dispatch({ label: "isError", payload: err.message });
      }
    },
    [id],
  );

  //fetches the latest 10 posts on mount
  useEffect(
    function () {
      fetchPosts();
    },
    [fetchPosts],
  );

  //adds a scroll event listener for when the user gets to the bottom of the page
  //it fetches 10 more posts when they get to the bottom
  useEffect(
    function () {
      const element = mainRef.current;

      function scrollFn() {
        //if we reach the end of the container && we are not fetching anything, fetch 10 more
        if (
          element.scrollTop === element.scrollHeight - element.clientHeight &&
          !isPending
        ) {
          mutate({ id, number: numberRef.current });
        }
      }

      element.addEventListener("scroll", scrollFn);

      return () => element.removeEventListener("scroll", scrollFn);
    },
    [id, mutate, isPending],
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
        <p className="absolute bottom-1 left-1/2 translate-x-[-50%] text-xs  ">
          Loading More
        </p>
      ) : null}
    </Main>
  );
}

export default ProfilePage;
