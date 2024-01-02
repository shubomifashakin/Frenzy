import { IoIosSend } from "react-icons/io";
import { LuSend } from "react-icons/lu";

function PostBtn({ toggleCreatePost }) {
  function handleTogglePost(e) {
    e.stopPropagation();
    toggleCreatePost((c) => !c);
  }
  return (
    <button
      onClick={handleTogglePost}
      className="border-btnColor ring-btnColor focus:ring-btnColorHover  hover:text-textHover group absolute bottom-7 right-7 flex items-center justify-center rounded-full border bg-secondaryColor p-2 text-center text-black  opacity-85 ring ring-offset-2 transition-all duration-500 hover:border-black hover:ring-offset-4 focus:scale-[0.9] focus:ring-2 focus:ring-offset-2 md:bottom-12 md:right-12 md:p-2"
    >
      <IoIosSend className="h-7 w-7 text-center text-inherit md:h-8 md:w-8" />
    </button>
  );
}

export default PostBtn;
