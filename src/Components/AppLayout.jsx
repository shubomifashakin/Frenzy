import { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import PostBtn from "./PostBtn";
import CreatePosts from "./CreatePosts";
import { TbLogout2 } from "react-icons/tb";
import { supabase } from "../Helpers/supabase";

function AppLayout() {
  const [mobileNav, toggleMobileNav] = useState(false);
  const [isCreatePost, toggleCreatePost] = useState(false);

  function handleLayoutClick(e) {
    e.stopPropagation();
    toggleCreatePost(false);
    toggleMobileNav(false);
  }

  return (
    <div
      onClick={handleLayoutClick}
      className="group relative h-dvh bg-primaryBgColor lg:grid lg:grid-cols-[1fr_1.5fr_1fr] lg:grid-rows-[0.35fr_3fr] 2xl:grid-rows-[0.2fr_2fr]"
    >
      <Navbar mobileNav={mobileNav} toggleMobileNav={toggleMobileNav} />

      <Sidebars colNo={1} height={"full"}>
        <div className="h-1/4  bg-sideColor"></div>
        <div className="h-1/4  bg-sideColor"></div>

        <LogOutBtn />
      </Sidebars>

      <main className=" col-start-2 h-full overflow-auto">
        <Outlet />
      </main>

      <Sidebars colNo={3} height={"full"} sideColor={true} />

      <CreatePosts
        isCreatePost={isCreatePost}
        toggleCreatePost={toggleCreatePost}
      />

      <PostBtn
        toggleCreatePost={toggleCreatePost}
        toggleMobileNav={toggleMobileNav}
      />
    </div>
  );
}

function LogOutBtn() {
  const navigate = useNavigate();
  async function logOut() {
    let { error } = await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <button
      onClick={logOut}
      className="text-center text-sm font-normal underline transition-all duration-300 hover:text-stone-600"
    >
      Log Out
    </button>
  );
}

function Sidebars({ colNo, height = "small", children, sideColor = false }) {
  return (
    <div className={`hidden lg:block col-start-${colNo} row-span-2 p-5`}>
      <div
        className={`${
          height === "small"
            ? "h-1/4"
            : height === "medium"
              ? "h-1/2"
              : "h-full"
        } ${sideColor ? " bg-sideColor" : ""} flex w-full flex-col space-y-6  `}
      >
        {children}
      </div>
    </div>
  );
}

export default AppLayout;
