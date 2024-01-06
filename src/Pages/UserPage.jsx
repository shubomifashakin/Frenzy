import { memo, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { IoChevronBack } from "react-icons/io5";

import LoadingPosts from "../Components/LoadingPosts";
import { ErrorLoading } from "../Components/Errors";
import { Post } from "../Components/Post";
import { UserContext } from "../Components/AppLayout";

import { getPosts, getUsersInfo } from "../Actions/functions";

function UserPage() {
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
  function refetchAll() {
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
      !postsIsRefetching &&
      !userIsRefetching &&
      !postsIsLoading ? (
        <>
          <UsersInfo info={userData} numberOfPosts={postsData.length} />
          <UsersPosts posts={postsData} />
        </>
      ) : null}

      {/**if only one of them failed, still refetch all */}
      {(userHasError || postsHasError) && (userHasError || postsHasError) ? (
        <ErrorLoading
          retryFn={refetchAll}
          message={postsError?.message || userError?.message}
        />
      ) : null}
    </div>
  );
}

export default UserPage;

function UsersInfo({ info, numberOfPosts }) {
  const { avatar, created_at } = info;

  const username = info.username.replaceAll('"', "");
  const formatNumber = Intl.DateTimeFormat(navigator.language, {
    dateStyle: "medium",
  }).format(new Date(created_at));

  return (
    <div className="relative w-full bg-orangeColor py-2">
      <div className=" flex flex-col   items-center justify-between space-y-6 py-5">
        <ProfilePicture avatar={avatar} />

        <UserName username={username} />

        <p className="text-sm font-semibold">
          {numberOfPosts} {numberOfPosts !== 1 ? "Posts" : "Post"}
        </p>

        <p className="text-center text-xs">Joined {formatNumber}</p>
      </div>

      <Link
        to={"/explore"}
        className="absolute left-5 top-5 text-base font-bold transition-all duration-300 hover:text-white"
      >
        <IoChevronBack className="text-2xl " />
      </Link>
    </div>
  );
}

const ProfilePicture = memo(function ProfilePicture({ avatar }) {
  const { toggleImageModal, isImageModal } = useContext(UserContext);

  function showImage(e) {
    e.stopPropagation();
    toggleImageModal(avatar);
  }

  return (
    <div className="flex h-1/2 w-[200px] items-center justify-center rounded-full ">
      <img
        onClick={showImage}
        src={avatar}
        className={`aspect-square h-full  w-full object-cover ${
          isImageModal ? "grayscale-[100%]" : ""
        } cursor-pointer rounded-full object-cover transition-all duration-500  hover:grayscale-[100%]`}
      />
    </div>
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
        <Post key={i} info={post} isUserPage={true} />
      ))}
    </>
  );
}
