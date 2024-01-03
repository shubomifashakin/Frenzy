import { Link, useParams } from "react-router-dom";
import { getPosts, getUsersInfo } from "../Actions/functions";
import { useQuery } from "@tanstack/react-query";
import LoadingPosts from "../Components/LoadingPosts";
import { ErrorLoading } from "../Components/Errors";
import { memo, useEffect } from "react";
import { Post } from "../Components/Post";
import { IoChevronBack } from "react-icons/io5";

function UserPage() {
  //get user profile and their posts

  //get the userId from the params
  const { userId } = useParams();

  //fetch the users info
  const {
    isLoading: userIsLoading,
    data: userData,
    refetch: refetchUser,
    isError: userHasError,
    isFetched: userIsFetched,
    error: userError,
    isFetching: usersIsFetching,
    isRefetching: userIsRefetching,
  } = useQuery({
    queryKey: ["externalUsersInfo"],
    queryFn: () => getUsersInfo(userId),
  });

  //fetch the users posts
  const {
    data: postsData,
    isFetched: postsFetched,
    isLoading: postsIsLoading,
    isError: postsHasError,
    refetch: refetchPosts,
    error: postsError,
    isFetching: postsIsFetching,
    isRefetching: postsIsRefetching,
  } = useQuery({
    queryKey: ["externalUsersPosts"],
    queryFn: () => getPosts(userId),
    refetchOnMount: "always",
  });

  //if both of them failed, retch both of them at the same time
  function BothFailedFn() {
    refetchPosts();
    refetchUser();
  }

  //anytime the params changes, we render refetch the data
  //this is caused anytime the user clicks the found accounts in the search bar dropdown
  useEffect(
    function () {
      refetchPosts();
      refetchUser();
    },
    [userId, refetchPosts, refetchUser],
  );

  return (
    <div className="w-full space-y-4  p-5 lg:mt-0 ">
      {/**one of them is fetching or loading and both have no errors */}
      {(usersIsFetching ||
        postsIsFetching ||
        userIsLoading ||
        postsIsLoading) &&
      !userHasError &&
      !postsHasError ? (
        <LoadingPosts />
      ) : null}

      {/**data fetched from both and no errors */}
      {userIsFetched &&
      postsFetched &&
      !userHasError &&
      !postsHasError &&
      !userIsLoading &&
      !postsIsLoading ? (
        <>
          <UsersInfo info={userData} />
          <UsersPosts posts={postsData} />
        </>
      ) : null}

      {/**if only one of them failed, still refetch all */}
      {(userHasError || postsHasError) && userHasError !== postsHasError ? (
        <ErrorLoading
          retryFn={BothFailedFn}
          message={postsError?.message || userError?.message}
        />
      ) : null}

      {/*if both of them failed */}
      {userHasError && postsHasError ? (
        <ErrorLoading
          retryFn={BothFailedFn}
          message={
            "Lets try that again, Please check if you are connected to the internet!"
          }
        />
      ) : null}
    </div>
  );
}

export default UserPage;

function UsersInfo({ info }) {
  const { username, avatar, created_at } = info;

  const formatNumber = Intl.DateTimeFormat(navigator.language, {
    dateStyle: "medium",
  }).format(new Date(created_at));

  return (
    <div className="relative w-full bg-orangeLight py-2">
      <div className=" flex flex-col   items-center justify-between space-y-6 py-5">
        <div className="flex h-1/2 w-[200px] items-center justify-center rounded-full ">
          <ProfilePicture avatar={avatar} />
        </div>

        <UserName username={username.slice(1, username.length - 1)} />

        <p className="text-center text-xs">Joined {formatNumber}</p>
      </div>

      <Link
        to={"/profile"}
        className="absolute left-5 top-5 text-base font-bold transition-all duration-300 hover:text-white"
      >
        <IoChevronBack className="text-2xl " />
      </Link>
    </div>
  );
}

const ProfilePicture = memo(function ProfilePicture({ avatar }) {
  return (
    <img
      src={avatar}
      className=" h-full w-full rounded-full object-cover grayscale-[25%]"
    />
  );
});

const UserName = memo(function UserName({ username }) {
  return <p className="font-bold">@{username}</p>;
});

function UsersPosts({ posts }) {
  //reverses the post to start from last to first
  const reversed = posts.slice(0).reverse();

  return (
    <>
      {reversed.map((post, i) => (
        <Post key={i} info={post} />
      ))}
    </>
  );
}
