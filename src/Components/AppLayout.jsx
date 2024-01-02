import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import PostBtn from "./PostBtn";
import CreatePosts from "./CreatePosts";
import { supabase } from "../Helpers/supabase";
import Sidebars from "./Sidebars";

function AppLayout() {
  const [mobileNav, toggleMobileNav] = useState(false);
  const [isCreatePost, toggleCreatePost] = useState(false);

  //if we click anywhere on the layout remove the mobilenav and post modal
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
        <div className="flex  h-3/4 w-full flex-col justify-between space-y-4">
          <div className="h-1/2  bg-sideColor"></div>
          <div className="h-1/2  bg-sideColor"></div>
        </div>

        <Timer />
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

function Timer() {
  const timeHad = 60 * 1000 * 60 * 2;
  const [timeLeft, setTimeLeft] = useState(timeHad);
  let hours = Math.floor(timeLeft / 3600000);
  let minutes = Math.floor((timeLeft % 3600000) / 60000);
  let seconds = Math.floor((timeLeft % 60000) / 1000);

  const lessThan1hour = timeLeft < 60 * 1000 * 60;
  const lessThan30mins = timeLeft < 60 * 1000 * 30;

  // Add leading zeros if needed
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  const navigate = useNavigate();

  async function logOut() {
    let { error } = await supabase.auth.signOut();
    navigate("/");
  }

  useEffect(function () {
    const intervalId = setInterval(function () {
      if (timeLeft) {
        setTimeLeft((c) => c - 1000);
      } else {
        logOut();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  });

  return (
    <div className=" flex-collg:items-center flex w-20 lg:justify-center">
      <p
        className={`w-full text-center text-lg font-bold ${
          lessThan1hour ? "text-red-500" : ""
        } ${
          lessThan30mins ? "text-red-600" : ""
        } transition-colors duration-500 ease-in-out`}
      >
        {hours}:{minutes}:{seconds}
      </p>
    </div>
  );
}

export default AppLayout;
