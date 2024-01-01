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
      className="group absolute bottom-7 right-7 flex items-center justify-center rounded-full border border-secondaryColor bg-secondaryColor p-2 text-center text-primaryColor opacity-85 ring ring-secondaryColor ring-offset-2  transition-all duration-500 hover:border-black hover:bg-secondaryColorHover hover:text-tertiaryColor hover:ring-offset-4 focus:scale-[0.9] focus:ring-2 focus:ring-secondaryColorHover focus:ring-offset-2 md:bottom-12 md:right-12 md:p-3"
    >
      <IoIosSend className="h-10 w-10 text-center text-inherit md:h-9 md:w-9" />
    </button>
  );
}

export default PostBtn;
