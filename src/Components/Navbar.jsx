import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../Helpers/supabase";

import { userStore } from "../Stores/UserStore";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";

function Navbar({ mobileNav, toggleMobileNav }) {
  const {
    user_metadata: { userName },
  } = userStore(function (state) {
    return state.user;
  });
  return (
    <nav
      onClick={(e) => e.stopPropagation()}
      className={`absolute left-0 top-0  z-50  col-span-full row-span-1 flex h-full w-9/12 flex-col space-y-2 border-b border-tertiaryColor bg-primaryBgColor px-2 py-4 transition-all duration-500 ease-in-out md:p-5 lg:relative lg:left-0 lg:z-auto lg:h-auto lg:w-full lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:px-5 lg:py-0 ${
        mobileNav ? "left-0" : "left-[-75%]"
      }`}
    >
      <SearchBar />
      <Username>{userName}</Username>
      <LogOutBtn />
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
    <div className="lg:hidden ">
      <p
        className={` text-lg font-bold ${lessThan1hour ? "text-red-500" : ""} ${
          lessThan30mins ? "text-red-600" : ""
        } transition-colors duration-500 ease-in-out`}
      >
        {hours}:{minutes}:{seconds}
      </p>
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
      className=" text-left font-bold  transition-all duration-300 hover:text-stone-600 lg:order-3"
    >
      Log Out
    </button>
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

function SearchBar() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="group relative block items-center justify-center lg:order-2 lg:flex lg:h-full lg:w-80 ">
      <div className="relative flex w-full items-center border-2 border-black  font-semibold text-primaryBgColor lg:rounded">
        <span className="h-full border-r-2 border-black bg-btnColor p-2 font-bold">
          @
        </span>
        <form className="w-full">
          <input
            className="input-style focus:bg-btnHoverColor w-full rounded-none border-none bg-btnColor"
            placeholder="username"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
      </div>
      <SearchBarDropdown searchValue={searchValue} />
    </div>
  );
}

function SearchBarDropdown({ searchValue }) {
  //when the searchbarvalue changes refetch the users
  useEffect(
    function () {
      if (searchValue.length > 2) console.log("yowa");
    },
    [searchValue],
  );

  return (
    <div
      className={`absolute left-0 top-full z-50  min-h-20 w-full  scroll-auto border-t-2 border-white bg-btnColor transition-all duration-500 ${
        searchValue.length > 2 ? "block" : "hidden"
      }  lg:max-h-60 lg:min-h-20  `}
    ></div>
  );
}

export default Navbar;
