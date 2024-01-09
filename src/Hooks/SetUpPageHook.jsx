import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useReducer, useRef } from "react";

const initialState = {
  loading: false,
  error: "",
  data: [],
};

function reducer(state, { payload, label }) {
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

export function useSetupPage(fetchFn, id = null) {
  const mainRef = useRef(null);
  const numberRef = useRef(10);

  const [{ loading, error, data: posts }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  //handles fetching of posts when the user scrolls to the bottom
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    error: isError,
  } = useMutation({
    mutationFn: fetchFn,

    onSuccess: (data) => {
      queryClient.invalidateQueries(["allPosts"]);

      //only increment the ref if the scroll actually returned more oold posts & we were scrolling down
      if (id ? data.length > 0 : data.Posts.length > 0 && data?.number) {
        //add the newly fetched posts to the data
        dispatch({ label: "oldPosts", payload: id ? data : data.Posts });
        numberRef.current += 10;
      }
    },
  });

  //the function we use to fetch our posts on mount
  const fetchPosts = useCallback(
    async function () {
      try {
        dispatch({ label: "isLoading" });
        const data = id ? await fetchFn({ id }) : await fetchFn();
        dispatch({ label: "isFetched", payload: id ? data : data.Posts });
      } catch (err) {
        dispatch({ label: "isError", payload: err.message });
      }
    },
    [fetchFn, id],
  );

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
          id
            ? mutate({ id, number: numberRef.current })
            : mutate(numberRef.current);
        }
      }

      element.addEventListener("scroll", scrollFn);

      return () => element.removeEventListener("scroll", scrollFn);
    },
    [mutate, isPending, id],
  );

  return {
    mainRef,
    dispatch,
    loadingPosts: loading,
    postsError: error,
    posts,
    numberRef,
    isPending,
    mutationError: isError,
    refetchPosts: fetchPosts,
  };
}
