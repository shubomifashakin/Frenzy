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
      className="absolute bottom-7 right-7 flex items-center justify-center rounded-full bg-secondaryColor p-2 text-center opacity-85 transition-all duration-500 hover:bg-secondaryColorHover focus:border-none focus:ring-2 focus:ring-secondaryColorHover focus:ring-offset-2 md:bottom-12 md:right-12 md:p-3"
    >
      <IoIosSend className="h-10 w-10 text-center text-white md:h-9 md:w-9" />
    </button>
  );
}

export default PostBtn;
