import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaRegImages } from "react-icons/fa6";

import { uploadPost } from "../Actions/functions";
import { UserContext } from "./AppLayout";

function SendPost() {
  const imgRef = useRef(null);
  const contentRef = useRef(null);

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [chars, setChars] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const reader = useMemo(function () {
    return new FileReader();
  }, []);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: uploadPost,

    onSuccess: function () {
      toast.success("Post Was Sent");
      queryClient.invalidateQueries(["posts", "allPosts"]);

      //clear the post content
      contentRef.current.textContent = "";
      //remove the file
      setFile(null);

      setChars(0);
      setError("");
    },

    onError: function (error) {
      toast.error(error.message);
    },
  });

  function handleDragOver() {
    setIsDragging(true);
  }

  function hanldeDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e) {
    const selectedFile = e.dataTransfer.files[0];
    reader.readAsDataURL(selectedFile);
    setFile(selectedFile);
    setIsDragging(false);
  }

  function SubmitPost() {
    if (chars > 300 || !chars) {
      setError(chars > 300 ? "Post is too long" : "Post cannot be empty");
      return;
    }

    mutate({ image: file, postContent: contentRef.current.textContent });
  }

  //add the reader listener event for converting files
  useEffect(
    function () {
      function convertFileToImage(e) {
        imgRef.current.src = e.target.result;
      }

      reader.addEventListener("load", convertFileToImage);

      return () => reader.removeEventListener("load", convertFileToImage);
    },
    [reader, imgRef],
  );

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
      onDragOver={handleDragOver}
      onDragLeave={hanldeDragLeave}
      onDrop={handleDrop}
      className={`relative hidden w-full ${
        isDragging ? "bg-orange-400" : ""
      } space-y-2 border-none bg-secondaryColor px-4 py-4 transition-colors duration-300 lg:block`}
    >
      {(!chars || chars > 300) && error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : (
        <p className="text-xs text-black">Talk to your frenzies...</p>
      )}

      <TextArea setChars={setChars} contentRef={contentRef} />

      {file ? <ImageArea imgRef={imgRef} setFile={setFile} /> : null}

      <div className="flex items-center justify-between pt-2">
        <AddImageBtn setFile={setFile} imgRef={imgRef} reader={reader} />

        <div className="flex items-center space-x-2">
          <span
            className={`text-right text-xs ${
              chars > 300 ? "text-red-600" : ""
            }`}
          >
            {chars}/300
          </span>
          <SendPostBtn submitFn={SubmitPost} isPending={isPending} />
        </div>
      </div>
    </div>
  );
}

function TextArea({ contentRef, setChars }) {
  // Handle paste event to maintain line breaks
  function handlePaste(event) {
    event.preventDefault();
    let text = (event.originalEvent || event).clipboardData.getData(
      "text/plain",
    );

    contentRef.current.textContent += text;
  }

  //when a key is pressed update our character count
  function onKey(e) {
    setChars(contentRef.current.textContent.length);
  }

  return (
    <div
      onKeyUp={onKey}
      ref={contentRef}
      contentEditable={true}
      onPaste={handlePaste}
      className="block max-h-60  w-full overflow-y-auto whitespace-break-spaces bg-transparent outline-none"
    ></div>
  );
}

function ImageArea({ imgRef, setFile }) {
  const { toggleImageModal } = useContext(UserContext);

  function toggleModal(e) {
    e.stopPropagation();
    toggleImageModal(e.target.src);
  }

  return (
    <div className="relative flex max-h-60 w-full">
      <img
        ref={imgRef}
        src=""
        onClick={toggleModal}
        className="w-full object-cover"
      />

      <span
        className="absolute right-1 top-1 cursor-pointer rounded-full bg-orangeLight p-0.5 px-2 text-center text-sm font-semibold text-white transition-colors duration-300 hover:text-black"
        onClick={() => setFile(false)}
      >
        X
      </span>
    </div>
  );
}

function SendPostBtn({ submitFn, isPending }) {
  return (
    <button
      disabled={isPending}
      className="cursor-pointer text-base font-semibold transition-colors duration-300 hover:text-orangeColor disabled:cursor-wait"
      onClick={submitFn}
    >
      Post
    </button>
  );
}

function AddImageBtn({ setFile, reader }) {
  const fileRef = useRef(null);

  function triggerFile(e) {
    e.preventDefault();
    fileRef.current.click();
  }

  function storeSelectedFile(e) {
    const selectedFile = e.target.files[0];
    reader.readAsDataURL(selectedFile);
    setFile(selectedFile);
  }

  return (
    <>
      <button
        className="transition-colors duration-300 hover:text-orangeColor"
        onClick={triggerFile}
      >
        <FaRegImages className="text-xl" />
      </button>

      <input
        type="file"
        className="hidden"
        accept={["image/png", "image/jpeg", "image/jpg"]}
        onChange={storeSelectedFile}
        ref={fileRef}
      />
    </>
  );
}

export default SendPost;
