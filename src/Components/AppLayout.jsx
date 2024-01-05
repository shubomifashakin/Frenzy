import { createContext, useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import PostBtn from "./PostBtn";
import CreatePosts from "./CreatePosts";
import Sidebars from "./Sidebars";
import { UserInfo } from "./UserInfo";

import { Timer } from "./Timer";
import ImageModal from "./ImageModal";

export const UserContext = createContext(null);
function AppLayout() {
  const [mobileNav, toggleMobileNav] = useState(false);
  const [isCreatePost, toggleCreatePost] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isEditingUserInfo, toggleEditUserInfo] = useState(false);
  const [isImageModal, toggleImageModal] = useState("");

  //if we click anywhere on the layout remove the mobilenav and post modal
  function handleLayoutClick(e) {
    e.stopPropagation();
    //close create post modal
    toggleCreatePost(false);
    //close mobile nav
    toggleMobileNav(false);
    //close search bar
    setSearchValue([]);
    //close edit user info
    toggleEditUserInfo(false);
    //close image modal
    toggleImageModal("");
  }

  return (
    <UserContext.Provider
      value={{
        mobileNav,
        isCreatePost,
        toggleCreatePost,
        toggleMobileNav,
        searchValue,
        setSearchValue,
        isEditingUserInfo,
        toggleEditUserInfo,
        toggleImageModal,
        isImageModal,
      }}
    >
      <div
        onClick={handleLayoutClick}
        className=" relative h-dvh bg-primaryBgColor lg:grid lg:grid-cols-[1fr_1.5fr_1fr] lg:grid-rows-[0.35fr_3fr] 2xl:grid-rows-[0.2fr_2fr]"
      >
        <Navbar />

        <Sidebars colNo={1} height={"full"}>
          <div className="flex w-full flex-col justify-between space-y-4">
            <UserInfo />
          </div>
          {/* 
          <Timer /> */}
        </Sidebars>

        <main className=" col-start-2  h-full  overflow-auto border-tertiaryColor lg:border-x">
          <Outlet />
        </main>

        <Sidebars colNo={3} height={"full"} sideColor={true} />

        <CreatePosts
          isCreatePost={isCreatePost}
          toggleCreatePost={toggleCreatePost}
        />

        <ImageModal
          isImageModal={isImageModal}
          toggleImageModal={toggleImageModal}
        />

        <PostBtn
          toggleCreatePost={toggleCreatePost}
          toggleMobileNav={toggleMobileNav}
          setSearchValue={setSearchValue}
          toggleEditUserInfo={toggleEditUserInfo}
        />
      </div>
    </UserContext.Provider>
  );
}

export default AppLayout;
