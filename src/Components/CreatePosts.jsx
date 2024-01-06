import { memo, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";

import { getUsersInfo, uploadPost } from "../Actions/functions";

import InputError from "./InputError";
import { Button } from "./Button";

export const CreatePosts = memo(function CreatePosts({
  isCreatePost,
  toggleCreatePost,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

  //gets the id  from the local storage
  const {
    user: { id },
  } = JSON.parse(localStorage.getItem("sb-jmfwsnwrjdahhxvtvqgq-auth-token"));

  //fetch the users personal data with their id
  const { status, data } = useQuery({
    queryKey: ["userinfo"],
    queryFn: () => getUsersInfo(id),
  });

  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: uploadPost,
    onSuccess: function () {
      toast.success("Post Was Sent");
      queryClient.invalidateQueries(["posts", "allPosts"]);

      //remove the file
      setFile(null);
      setIsDragging(false);

      // clear the post content
      reset();

      //close create post container
      toggleCreatePost(false);
    },

    onError: function (error) {
      toast.error(error.message);
    },
  });

  const username = data?.username.slice(1, data.username.length - 1);

  //when the escape key is pressed close the create post element
  function HandleEscape(e) {
    if (e?.key === "Escape") toggleCreatePost(false);
  }

  //when we submit the form, react-hook-form provides us with the post content since we registered it, but we manually get the file
  function submitPost(postInfo) {
    //if no image was added, uploaded the post content and userId like that
    if (!file) {
      mutate({ ...postInfo, id, username });
    } else {
      mutate({ ...postInfo, image: file, id, username });
    }
  }

  //prevents default behaviour for drag and drop
  //this prevents the browser from opening the image we drop
  useEffect(function () {
    function fns(e) {
      e = e || event;
      e.preventDefault();
    }

    window.addEventListener("dragover", fns, false);

    window.addEventListener("drop", fns, false);

    return () => {
      window.removeEventListener("dragover", fns);
      window.removeEventListener("drop", fns);
    };
  }, []);

  return (
    <>
      {/**only show the modal if the user was fetched */}
      {status === "success" ? (
        <PostContainer isCreatePost={isCreatePost}>
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDown={HandleEscape}
            className={` w-4/5  rounded-md border-2 border-secondaryColor bg-primaryBgColor text-xl font-bold  lg:w-1/2`}
          >
            <h2 className="flex items-center justify-between border-2 border-secondaryColor bg-secondaryColor p-3  text-lg outline-none">
              New Post
            </h2>

            <form
              onSubmit={handleSubmit(submitPost)}
              className={`min-h-32 px-4 py-4 transition-all duration-500 `}
            >
              <PostContentArea
                register={register}
                errors={errors?.postContent?.message}
              />

              <DropFile
                file={file}
                setFile={setFile}
                setIsDragging={setIsDragging}
                isDragging={isDragging}
              />

              <div className="flex justify-end">
                <Button size="small" isPending={isPending}>
                  Post
                </Button>
              </div>
            </form>
          </div>
        </PostContainer>
      ) : null}
    </>
  );
});

function PostContainer({ children, isCreatePost }) {
  return (
    <div
      className={`animate-flash ease-in-out  ${
        isCreatePost ? "block" : "hidden"
      } absolute left-0 top-0 flex h-full w-full items-center justify-center  shadow-sm shadow-secondaryColor backdrop-blur-[2px]`}
    >
      {children}
    </div>
  );
}

function PostContentArea({ register, errors }) {
  return (
    <>
      <InputError>{errors}</InputError>
      <textarea
        placeholder="Tell your Frenzies something..."
        className="mb-4 block max-h-52 min-h-32 w-full resize-y overflow-y-auto bg-transparent text-base font-semibold text-black outline-none"
        {...register("postContent", {
          required: { value: true, message: "Post cannot be empty" },
          maxLength: {
            value: 500,
            message: "A Post cannot exceed 500 characters",
          },
        })}
      />
    </>
  );
}

const DropFile = memo(function DropFile({
  file,
  setFile,
  setIsDragging,
  isDragging,
}) {
  const fileRef = useRef(null);

  function handleDragOver(e) {
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    setIsDragging(false);
  }

  function handleDragEnter(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDrop(e) {
    const [file] = e.dataTransfer.files;
    if (
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "image/jpeg"
    ) {
      setFile(file);
      //we dont set draggin to false, so that we can keep the dark orange background which tells the user that there is an image in the post
    } else {
      toast.error("File is not supported, Must be a png, jpg or jpeg");
      setIsDragging(false);
    }
  }

  //when the user double clicks on the drag container, the image would be discarded
  function HanldeDiscardImage(e) {
    e.stopPropagation();
    setFile(null);
    setIsDragging(false);
  }

  //when we click the image field it triggers the hidden file input
  function handleImageClick(e) {
    console.log("hello");
    e.stopPropagation();
    fileRef.current.click();
  }

  function storeImage(e) {
    const selectedFile = e.target.files[0];
    setIsDragging(true);
    setFile(selectedFile);
  }

  return (
    <div
      onClick={handleImageClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnter={handleDragEnter}
      onDrop={handleDrop}
      className={`mb-4  hidden cursor-pointer flex-col items-center justify-center rounded-lg transition-all duration-500  ${
        isDragging ? "bg-secondaryColor" : "bg-tertiaryColor"
      } px-5 py-7 lg:flex `}
    >
      <input
        type="file"
        accept={["image/png", "image/jpeg", "image/jpg"]}
        className="hidden"
        ref={fileRef}
        onClick={(e) => e.stopPropagation()}
        onChange={storeImage}
      />

      <span
        className={`text-center text-sm font-bold capitalize ${
          isDragging ? " text-black" : ""
        }`}
      >
        {file?.name
          ? ` ${file.name}`
          : "Click or Drag and Drop your image here "}
      </span>

      {file?.name ? (
        <p
          className="mt-2 text-center text-xs font-bold underline hover:text-orangeColor "
          onClick={HanldeDiscardImage}
        >
          Remove Image
        </p>
      ) : null}
    </div>
  );
});

function TimeOfPost() {
  const [date, setDate] = useState(new Date());

  const formatedDate = new Intl.DateTimeFormat(navigator.locale, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
  useEffect(function () {
    const intervalId = setInterval(function () {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  });

  return <span className="text-xs">{formatedDate}</span>;
}
export default CreatePosts;
