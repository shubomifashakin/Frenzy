import { memo, useContext } from "react";
import { IoIosSend } from "react-icons/io";
import { UIContext } from "./AppLayout";

const PostBtn = memo(function PostBtn() {
  const {
    toggleEditUserInfo,
    toggleCreatePost,
    toggleMobileNav,
    setSearchValue,
  } = useContext(UIContext);

  function handleTogglePost(e) {
    e.stopPropagation();
    toggleCreatePost((c) => !c);
    //if the mobile nav is open close it
    toggleMobileNav(false);
    toggleEditUserInfo(false);
    setSearchValue([]);
  }

  return (
    <button
      onClick={handleTogglePost}
      className="focus:ring-orangeColorHover group absolute  bottom-7 right-7 flex items-center justify-center rounded-full border border-orangeColor bg-secondaryColor p-2 text-center text-black opacity-85 ring  ring-orangeColor ring-offset-2 transition-all duration-500 hover:border-black hover:text-btnHover hover:ring-offset-4 focus:scale-[0.9] focus:ring-2 focus:ring-offset-2 md:bottom-12 md:right-12 md:p-2 lg:hidden"
    >
      <IoIosSend className="h-7 w-7 text-center text-inherit md:h-8 md:w-8" />
    </button>
  );
});

export default PostBtn;
