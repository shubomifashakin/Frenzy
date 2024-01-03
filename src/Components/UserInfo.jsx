import { useQuery } from "@tanstack/react-query";
import { getUsersInfo } from "../Actions/functions";
import { userStore } from "../Stores/UserStore";
import LoadingUsersInfo from "./LoadingUsersInfo";
import { NavLink } from "react-router-dom";
import { ErrorLoading } from "./Errors";
import { memo } from "react";

export function UserInfo() {
  //gets the logged in user info from the store
  const { id } = userStore(function (state) {
    return state.user;
  });

  //fetch the users personal data
  const { status, data, refetch, error } = useQuery({
    queryKey: ["userAvatar"],
    queryFn: () => getUsersInfo(id),
  });

  const formatNumber = data
    ? new Intl.DateTimeFormat(navigator.language, {
        dateStyle: "medium",
      }).format(new Date(data?.created_at))
    : null;

  return (
    <>
      {status === "pending" ? <LoadingUsersInfo /> : null}
      {status === "success" ? (
        <div className=" bg-sideColor px-4  py-5">
          <div className=" flex flex-col   items-center justify-between space-y-2 ">
            <div className="flex h-[200px] w-[200px] items-center justify-center rounded-full ">
              <ProfilePicture avatar={data.avatar} />
            </div>

            <UserName
              username={data.username.slice(1, data.username.length - 1)}
            />
          </div>

          <div className="= flex items-center justify-evenly space-x-4 py-4 ">
            <ProfileNav page={"Profile"} />
            <ProfileNav page={"Timeline"} />
            <ProfileNav page={"Explore"} />
          </div>

          <UserJoined date={formatNumber} />
        </div>
      ) : null}

      {status === "error" ? (
        <ErrorLoading retryFn={refetch} message={error.message} />
      ) : null}
    </>
  );
}

function ProfileNav({ page }) {
  return (
    <NavLink
      to={page}
      className={
        "font-semibold transition-all duration-500 hover:text-orangeColor"
      }
    >
      {page}
    </NavLink>
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

const UserJoined = memo(function UserJoined({ date }) {
  return <p className="text-center  text-xs">Joined {date}</p>;
});
