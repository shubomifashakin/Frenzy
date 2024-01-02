import { Link, useNavigate } from "react-router-dom";
import { userStore } from "../Stores/UserStore";
import { useEffect, useState } from "react";
import { supabase } from "../Helpers/supabase";

function Navbar({ mobileNav }) {
  const {
    user_metadata: { userName },
  } = userStore(function (state) {
    return state.user;
  });
  return (
    <nav
      className={`  bg-primaryBgColor absolute left-0  top-0  z-50 col-span-full row-span-1 flex h-full w-1/2 flex-col space-y-2 border-b border-tertiaryColor px-2 py-4 transition-all duration-500 ease-in-out md:p-5 lg:relative lg:left-0 lg:z-auto lg:h-auto lg:w-full lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:px-5 ${
        mobileNav ? "left-0" : "left-[-300px] sm:left-[-400px] md:left-[-500px]"
      }`}
    >
      <Username>{userName}</Username>
      <Timer />
    </nav>
  );
}

function Timer({}) {
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
    <div className=" flex flex-col lg:h-1/4 lg:items-center lg:justify-center">
      <p
        className={`text-lg font-bold ${lessThan1hour ? "text-red-500" : ""} ${
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
      className="cursor-pointer font-bold transition-all duration-500 ease-in-out hover:underline"
    >
      {children}
    </Link>
  );
}

export default Navbar;
