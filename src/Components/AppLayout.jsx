import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import PostBtn from "./PostBtn";
import CreatePosts from "./CreatePosts";

function AppLayout() {
  const [mobileNav, toggleMobileNav] = useState(true);
  const [isCreatePost, toggleCreatePost] = useState(false);

  function handleLayoutClick(e) {
    e.stopPropagation();
    toggleCreatePost(false);
    toggleMobileNav(false);
  }

  return (
    <div
      onClick={handleLayoutClick}
      className="group relative h-dvh bg-primaryColor lg:grid lg:grid-cols-[1fr_1.5fr_1fr] lg:grid-rows-[0.35fr_3fr] 2xl:grid-rows-[0.2fr_2fr]"
    >
      <Navbar mobileNav={mobileNav} />

      <Sidebars colNo={1} />

      <main className=" col-start-2 h-full overflow-auto">
        <Outlet />
      </main>

      <Sidebars colNo={3} />

      <CreatePosts
        isCreatePost={isCreatePost}
        toggleCreatePost={toggleCreatePost}
      />
      <PostBtn toggleCreatePost={toggleCreatePost} />
    </div>
  );
}

function Sidebars({ colNo }) {
  return <div className={`col-start-${colNo} row-span-2`}></div>;
}

export default AppLayout;
