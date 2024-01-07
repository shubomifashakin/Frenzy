import { useMutation, useQueryClient } from "@tanstack/react-query";

import LoadingPosts from "../Components/LoadingPosts";
import { ErrorLoading } from "../Components/Errors";
import { Post } from "../Components/Post";

import { getUsersPostsInf } from "../Actions/functions";
import { sortPostsFromLatestToOldest } from "../Helpers/heperFunctions";
import SendPost from "../Components/SendPost";
import { useCallback, useEffect, useReducer, useRef } from "react";

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

  if (label === "newPosts") {
    return { ...state, data: [...state.data, ...payload] };
  }
}

function ProfilePage() {
  const {
    user: { id },
  } = JSON.parse(localStorage.getItem("sb-jmfwsnwrjdahhxvtvqgq-auth-token"));

  const [{ loading, error, data }, dispatch] = useReducer(
    Reducer,
    initialState,
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: getUsersPostsInf,

    onSuccess: (data) => {
      dispatch({ label: "newPosts", payload: data });

      queryClient.invalidateQueries(["usersPosts"]);

      //only increment the ref if the scroll actually returned something
      if (data.length > 0) numberRef.current += 10;
    },
  });

  const posts = data ? sortPostsFromLatestToOldest(data) : [];

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

  useEffect(
    function () {
      mainRef.current.addEventListener("scroll", function () {
        //if we reach the end of the container, fetch 10 more
        if (
          mainRef.current.scrollTop ===
          mainRef.current.scrollHeight - mainRef.current.clientHeight
        ) {
          mutate({ id, number: numberRef.current });
        }
      });
    },
    [id, mutate],
  );

  return (
    <main
      ref={mainRef}
      className="   col-start-2 h-full overflow-auto border-tertiaryColor lg:border-x"
    >
      <div className="relative w-full space-y-4 p-5 lg:mt-0 ">
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
      </div>
    </main>
  );
}

export default ProfilePage;
