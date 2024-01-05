import { memo, useContext } from "react";
import { NavLink } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit } from "react-icons/fi";

import { getUsersInfo, updateUsername } from "../Actions/functions";

import LoadingUsersInfo from "./LoadingUsersInfo";
import { ErrorLoading } from "./Errors";
import { UserContext } from "./AppLayout";

export function UserInfo() {
  const { isEditingUserInfo, toggleEditUserInfo } = useContext(UserContext);
  //gets the logged in user info from the store
  const {
    user: { id },
  } = JSON.parse(localStorage.getItem("sb-jmfwsnwrjdahhxvtvqgq-auth-token"));

  //fetch the users personal data
  const { status, data, refetch, error } = useQuery({
    queryKey: ["userinfo"],
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
              username={data.username}
              toggleEditUserInfo={toggleEditUserInfo}
              isEditingUserInfo={isEditingUserInfo}
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

const ProfileNav = memo(function ProfileNav({ page }) {
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
});

const ProfilePicture = memo(function ProfilePicture({ avatar }) {
  return (
    <img
      src={avatar}
      className=" h-full w-full rounded-full object-cover grayscale-[25%]"
    />
  );
});

const UserName = memo(function UserName({
  username,
  isEditingUserInfo,
  toggleEditUserInfo,
}) {
  function HandleEditClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleEditUserInfo((c) => !c);
  }

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateUsername,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", "allPosts", "userinfo"]);
    },
  });

  return (
    <div className="flex items-center space-x-2 font-bold">
      {!isEditingUserInfo ? (
        <>
          <span> @{username.replaceAll('"', "")}</span>
          <FiEdit
            onClick={HandleEditClick}
            className="cursor-pointer transition-all duration-300 hover:text-orangeColor"
          />
        </>
      ) : (
        <EditUserName
          isEditing={isEditingUserInfo}
          toggleEdit={toggleEditUserInfo}
        />
      )}
    </div>
  );
});

function EditUserName({ toggleEdit }) {
  const { register, reset, formState, handleSubmit } = useForm();
  const { errors } = formState;

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateUsername,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", "allPosts", "userinfo"]);
      toast.success("Username Updated");

      //clear the input field
      reset();

      //close the edit field
      toggleEdit(false);
    },

    onError: (errors) => {
      //check if the error was username already exists one
      const userNameExists =
        errors.message ===
        'duplicate key value violates unique constraint "UsersInfo_username_key"';

      toast.error(userNameExists ? "Username is Taken" : errors.message);
    },
  });

  function submitForm(newUsername) {
    mutate(newUsername.username);
  }

  return (
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={handleSubmit(submitForm)}
    >
      {errors?.username > 0 ? null : (
        <p className="text-[0.7rem] font-medium text-red-600">
          {errors?.username?.message}
        </p>
      )}
      <div className="flex space-x-2">
        <input
          className="w-full rounded-sm border border-btnHover bg-orangeColor  px-2 py-1 text-base text-primaryBgColor outline-none transition-all duration-300 placeholder:font-medium placeholder:text-primaryBgColor"
          type="text"
          {...register("username", {
            required: { value: true, message: "Please ener a new username" },
            minLength: { value: 6, message: "At least 6 characters" },
            maxLength: { value: 12, message: "less than 12 characters" },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: "Letters, numbers and underscores only",
            },
          })}
          // ref={inputRef}
          placeholder="new username"
        />
        {/* <Button size={"xs"}>Confirm</Button> */}
        <button
          disabled={isPending}
          className="rounded-sm border  border-black bg-orangeColor px-2 text-xs text-primaryBgColor outline-none"
        >
          CONFIRM
        </button>
      </div>
    </form>
  );
}

const UserJoined = memo(function UserJoined({ date }) {
  return <p className="text-center  text-xs">Joined {date}</p>;
});
