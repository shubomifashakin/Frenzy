import { useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Navbar";
import PostBtn from "./PostBtn";
import CreatePosts from "./CreatePosts";

const Container = styled.div`
  display: grid;
  grid-template-rows: 0.25fr 2fr 0.25fr;
  height: 100dvh;
  background-color: red;
`;

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
      className="group relative h-dvh bg-primaryColor lg:grid lg:grid-rows-[0.35fr_3fr] 2xl:grid-rows-[0.2fr_2fr]"
    >
      <Navbar mobileNav={mobileNav} />
      <main className=" h-full overflow-auto bg-tertiaryColor md:p-5 md:px-3">
        <Outlet />
      </main>

      <CreatePosts
        isCreatePost={isCreatePost}
        toggleCreatePost={toggleCreatePost}
      />
      <PostBtn toggleCreatePost={toggleCreatePost} />
    </div>
  );
}

export default AppLayout;
