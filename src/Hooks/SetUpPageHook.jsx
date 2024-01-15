import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useReducer, useRef } from "react";

const initialState = {
  loading: false,
  error: "",
  data: null,
};

function reducer(state, { payload, label }) {
  switch (label) {
    case "isLoading":
      return { ...state, loading: true, error: "" };

    case "isFetched":
      return { loading: false, error: "", data: payload };

    case "setFile":
      return { ...state, isDragging: false, file: payload };

    case "isError":
      return { ...state, loading: false, error: payload };

    case "oldPosts":
      return { ...state, data: [...payload] };

    case "newPost":
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

  //handles the fetching of old posts or replies
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    error: isError,
  } = useMutation({
    mutationFn: fetchFn,

    onSuccess: (data) => {
      //only increment the ref if the scroll actually returned more old posts & we were scrolling down
      if (id ? data.length > 0 : data.Posts.length > 0 && data?.number) {
        //add the newly fetched posts to the data
        dispatch({ label: "oldPosts", payload: id ? data : data.Posts });

        //refetch the loged in users info
        queryClient.invalidateQueries({ queryKey: ["userinfo"] });

        //increment the ref
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
  //if the user scrolls to the last post/reply fetch more using the mutation fuction we defined above
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
    numberRef,
    dispatch,
    loadingPosts: loading,
    postsError: error,
    posts,
    isFetchingMore: isPending,
    fetcMoreError: isError,
    refetchPosts: fetchPosts,
  };
}
