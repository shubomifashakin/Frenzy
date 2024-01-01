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

  const uploadPost = PostStore(function (state) {
    return state.uploadPost;
  });

  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: uploadPost,
    onSuccess: function () {
      toast.success("Posted");
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

  function HandleEscape(e) {
    if (e?.key === "Escape") toggleCreatePost(false);
  }

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
      onClick={(e) => e.stopPropagation()}
      onKeyDown={HandleEscape}
      className={`absolute left-1/2 top-1/2 w-4/5 translate-x-[-50%] translate-y-[-50%] rounded-md text-xl font-bold text-primaryColor lg:w-1/2  ${
        isCreatePost ? "block" : "hidden"
      } border-2 border-secondaryColor bg-primaryColor`}
    >
      <h2 className="border-2 border-secondaryColor bg-secondaryColor p-3  text-lg outline-none">
        New Post
      </h2>

      <form
        onSubmit={handleSubmit(submitPost)}
        className={`min-h-32 px-4 py-4 transition-all duration-500 ${
          isDragging ? "bg-secondaryColorHover" : ""
        }`}
      >
        <PostContentArea
          register={register}
          errors={errors?.postContent?.message}
        />
        <DropFile file={file} setFile={setFile} setIsDragging={setIsDragging} />

        <div className="flex justify-end">
          <Button size="small">Post</Button>
        </div>
      </form>
    </div>
  );
}

function DropFile({ file, setFile, setIsDragging }) {
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
    } else {
      toast.error("File is not supported, must be png,jpg or jpeg");
      setIsDragging(false);
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnter={handleDragEnter}
      onDrop={handleDrop}
      className="mb-4 hidden rounded-lg bg-tertiaryColor px-5 py-7 lg:block"
    >
      <p className="text-center text-sm text-primaryColor">
        {file?.name || "Drag and drop files here or click to select files"}
      </p>
    </div>
  );
}

function PostContentArea({ register, errors }) {
  return (
    <>
      <InputError>{errors}</InputError>
      <textarea
        className="mb-4 block max-h-52 min-h-32 w-full resize-y overflow-y-auto bg-transparent text-base font-normal text-black outline-none"
        {...register("postContent", {
          required: { value: true, message: "Post cannot be empty" },
          maxLength: {
            value: 500,
            message: "Post has exceeded 500 characters",
          },
        })}
      />
    </>
  );
}
export default CreatePosts;
