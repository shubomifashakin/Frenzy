import { memo, useContext, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit } from "react-icons/fi";

import { getPosts, getUsersInfo, updateUserInfo } from "../Actions/functions";

import LoadingUsersInfo from "./LoadingUsersInfo";
import { ErrorLoading } from "./Errors";
import { UserContext } from "./AppLayout";
import { Button } from "./Button";

export function UserInfo() {
  const {
    isEditingUserInfo,
    toggleEditUserInfo,
    toggleImageModal,
    isImageModal,
  } = useContext(UserContext);

  //gets the logged in user info from the local storage
  const {
    user: { id },
  } = JSON.parse(localStorage.getItem("sb-jmfwsnwrjdahhxvtvqgq-auth-token"));

  //fetch the users personal data
  const { status, data, refetch, error } = useQuery({
    queryKey: ["userinfo"],
    queryFn: () => getUsersInfo(id),
  });

  const { data: postsData } = useQuery({
    queryKey: ["usersPosts"],
    queryFn: () => getPosts(id),
  });

  return (
    <>
      {status === "pending" ? <LoadingUsersInfo /> : null}
      {status === "success" && !isEditingUserInfo ? (
        <div className=" bg-sideColor px-4  py-5">
          <div className=" flex flex-col   items-center justify-between space-y-2 ">
            <ProfilePicture
              avatar={data.avatar}
              toggleImageModal={toggleImageModal}
              isImageModal={isImageModal}
            />

            <UserName
              username={data.username}
              toggleEditUserInfo={toggleEditUserInfo}
              isEditingUserInfo={isEditingUserInfo}
            />

            {postsData?.length ? (
              <p className="text-sm font-semibold">
                {postsData.length} {postsData.length > 1 ? "Posts" : "Post"}
              </p>
            ) : (
              <p className="text-sm font-semibold">Loading Posts</p>
            )}
          </div>

          <div className="= flex items-center justify-evenly space-x-4 py-4 ">
            <ProfileNav page={"Profile"} />
            <ProfileNav page={"Timeline"} />
            <ProfileNav page={"Explore"} />
          </div>

          <UserJoined date={data.created_at} />
        </div>
      ) : null}

      {status === "error" ? (
        <ErrorLoading retryFn={refetch} message={error.message} />
      ) : null}

      {isEditingUserInfo && status === "success" ? (
        <EditUserInfo
          currentImage={data.avatar}
          isEditing={isEditingUserInfo}
          setIsEditing={toggleEditUserInfo}
        />
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

const ProfilePicture = memo(function ProfilePicture({
  avatar,
  toggleImageModal,
  isImageModal,
}) {
  function showFullImage(e) {
    e.stopPropagation();
    toggleImageModal(avatar);
  }

  return (
    <div className="flex h-[200px] w-[200px] items-center justify-center rounded-full ">
      <img
        onClick={showFullImage}
        src={avatar}
        className={`h-full w-full cursor-pointer rounded-full object-cover transition-all duration-500 ${
          isImageModal ? "grayscale-[80%]" : ""
        } hover:grayscale-[80%]`}
      />
    </div>
  );
});

const UserName = memo(function UserName({ username, toggleEditUserInfo }) {
  function HandleEditClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleEditUserInfo((c) => !c);
  }

  return (
    <div className="flex items-center space-x-2 font-bold">
      <span> @{username.replaceAll('"', "")}</span>
      <FiEdit
        onClick={HandleEditClick}
        className="cursor-pointer transition-all duration-300 hover:text-orangeColor"
      />
    </div>
  );
});

const UserJoined = memo(function UserJoined({ date }) {
  const formattedDate = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "medium",
  }).format(new Date(date));

  return <p className="text-center  text-xs">Joined {formattedDate}</p>;
});

function EditUserInfo({ setIsEditing, currentImage }) {
  const [avatar, setAvatar] = useState(null);

  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: () => {
      toast.success("Update Successful");
      setAvatar(null);
      reset();
      setIsEditing(false);
      queryClient.invalidateQueries(["userinfo"]);
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  function updateInfo(newInfo) {
    const { username } = newInfo;
    if (!username && !avatar) {
      setIsEditing(false);
    }
    const infoToUpload = { username, avatar };
    mutate(infoToUpload);
  }

  return (
    <div
      className=" bg-sideColor px-4  py-5"
      onClick={(e) => e.stopPropagation()}
    >
      <h1>Edit Profile</h1>
      <form
        className="flex w-full flex-col items-center space-y-4 "
        onSubmit={handleSubmit(updateInfo)}
      >
        <EditImage currentImage={currentImage} setAvatar={setAvatar} />

        <div className="relative rounded-sm border-2 border-black bg-orangeColor">
          <input
            id="username"
            type="text"
            className={`peer w-full bg-orangeColor px-2 pb-0.5  pt-4 font-semibold text-white outline-none  transition-colors duration-300 ${
              errors?.username ? "focus:bg-red-600" : "focus:bg-btnHover"
            } `}
            {...register("username", {
              minLength: { value: 6, message: "at least 6 characters" },
              maxLength: {
                value: 12,
                message: "6-12 characters only",
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "alphanumeric only",
              },
            })}
          />

          {errors?.username?.message ? (
            <p className=" absolute  left-2  top-1 text-xs font-semibold text-white transition-all duration-300 peer-focus:top-0 peer-focus:opacity-75">
              {errors.username.message}
            </p>
          ) : null}

          {!errors?.username ? (
            <label
              htmlFor="username"
              className=" font-base  absolute  left-2 top-1 text-xs text-white transition-all duration-300 peer-focus:top-0 peer-focus:opacity-75"
            >
              new username
            </label>
          ) : null}
        </div>

        <Button width={"w-full"}>Update</Button>
      </form>
    </div>
  );
}

function EditImage({ setAvatar, currentImage }) {
  const fileRef = useRef(null);
  //when we click the image it triggers the hidden file input
  function handleImageClick(e) {
    e.stopPropagation();
    fileRef.current.click();
  }

  function storeImage(e) {
    const selectedFile = e.target.files[0];
    setAvatar(selectedFile);
  }
  return (
    <div className="relative flex h-[200px] w-[200px] items-center justify-center rounded-full ">
      <img
        onClick={handleImageClick}
        src={currentImage}
        className={`h-full w-full cursor-pointer rounded-full object-cover opacity-75 grayscale-[90%] transition-all duration-500 hover:grayscale-[100%]`}
      />

      <input
        type="file"
        accept={["image/png", "image/jpeg", "image/jpg"]}
        className="hidden"
        ref={fileRef}
        onClick={(e) => e.stopPropagation()}
        onChange={storeImage}
      />

      <p className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] cursor-pointer text-xl font-semibold text-white">
        Click
      </p>
    </div>
  );
}
