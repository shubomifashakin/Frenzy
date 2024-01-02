import { Link, useNavigate } from "react-router-dom";
import { userStore } from "../Stores/UserStore";
import { useEffect, useState } from "react";
import { supabase } from "../Helpers/supabase";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";
import SearchBar, { SearchBarDropdown } from "./SearchBar";

function Navbar({ mobileNav, toggleMobileNav }) {
  const {
    user_metadata: { userName },
  } = userStore(function (state) {
    return state.user;
  });
  return (
    <nav
      onClick={(e) => e.stopPropagation()}
      className={`absolute left-0 top-0  z-50  col-span-full row-span-1 flex h-full w-1/2 flex-col space-y-2 border-b border-tertiaryColor bg-primaryBgColor px-2 py-4 transition-all duration-500 ease-in-out md:p-5 lg:relative lg:left-0 lg:z-auto lg:h-auto lg:w-full lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:px-5 lg:py-0 ${
        mobileNav ? "left-0" : "left-[-50%]"
      }`}
    >
      <SearchBar />
      <Username>{userName}</Username>
      <Timer />
      <MobileNavTrigger
        mobileNav={mobileNav}
        toggleMobileNav={toggleMobileNav}
      />
    </nav>
  );
}

function MobileNavTrigger({ mobileNav, toggleMobileNav }) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        toggleMobileNav((c) => !c);
      }}
      className="bg-btnHoverColor absolute left-full top-1/2  m-auto flex h-20 w-10 translate-y-[-50%] cursor-pointer items-center justify-start rounded-br-full rounded-tr-full text-left sm:h-24 sm:w-12  lg:hidden"
    >
      {mobileNav ? (
        <FaCaretLeft display={"inline"} fontSize={"2rem"} />
      ) : (
        <FaCaretRight display={"inline"} fontSize={"2rem"} />
      )}
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
    <div className=" flex w-20 flex-col bg-red-300 lg:order-3 lg:h-1/4 lg:items-center lg:justify-center">
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

function Username({ children }) {
  return (
    <Link
      to={"profile"}
      className="cursor-pointer font-bold transition-all duration-500 ease-in-out hover:underline lg:order-1"
    >
      {children}
    </Link>
  );
}

export default Navbar;
