import { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../Pages/SignInPage";
import InputError from "./InputError";
import { PostStore } from "../Stores/PostStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

function CreatePosts({ isCreatePost, toggleCreatePost }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

  //get the user id from the url
  const { userId } = useParams();

  //gets the function to upload the post from the post store
  const uploadPost = PostStore(function (state) {
    return state.uploadPost;
  });

  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: uploadPost,
    onSuccess: function () {
      toast.success("Post Was Sent");
      queryClient.invalidateQueries("posts");

      //remove the file
      setFile(null);
      setIsDragging(false);

      //clear the post content
      reset();

      //close create post container
      toggleCreatePost(false);
    },

    onError: function (error) {
      toast.error(error.message);
    },
  });

  //when the escape key is pressed close the create post element
  function HandleEscape(e) {
    if (e?.key === "Escape") toggleCreatePost(false);
  }

  //when we submit the form, react-hook-form provides us with the post content since we registered it, but we manually get the file
  function submitPost(postInfo) {
    //if no image was added, uploaded the post content and userId like that
    if (!file) {
      mutate({ ...postInfo, userId });
    } else {
      mutate({ ...postInfo, image: file, userId });
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
    <div
      className={`animate-flash ease-in-out  ${
        isCreatePost ? "block" : "hidden"
      } absolute left-0 top-0 flex h-full w-full items-center justify-center bg-transparentSecondary shadow-sm shadow-secondaryColor backdrop-blur-[2px]`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={HandleEscape}
        className={` w-4/5  rounded-md border-2 border-secondaryColor bg-primaryColor text-xl font-bold text-primaryColor lg:w-1/2`}
      >
        <h2 className="flex items-center justify-between border-2 border-secondaryColor bg-secondaryColor p-3  text-lg outline-none">
          New Post <TimeOfPost />
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
            <Button size="small">Post</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DropFile({ file, setFile, setIsDragging, isDragging }) {
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
  function HanldeDiscardImage() {
    setFile(null);
    setIsDragging(false);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnter={handleDragEnter}
      onDrop={handleDrop}
      onDoubleClick={HanldeDiscardImage}
      className={`mb-4 hidden rounded-lg transition-all duration-500  ${
        isDragging ? "bg-secondaryColorHover" : "bg-tertiaryColor"
      } px-5 py-7 lg:block ${file?.name ? "cursor-pointer" : ""}`}
    >
      <p
        className={` text-center text-sm text-primaryColor ${
          isDragging ? "font-bold text-tertiaryColor" : "font-light"
        }`}
      >
        {file?.name
          ? ` ${file.name} (Double Click to Remove Image)`
          : "Drag and Drop your image here "}
      </p>
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
