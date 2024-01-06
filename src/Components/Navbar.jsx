import { memo, useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";

import { findUsers, logOutUser } from "../Actions/functions";

import { UserContext } from "./AppLayout";

function Navbar() {
  function CloseSearch(e) {
    e.stopPropagation();
    setSearchValue([]);
  }

  const { mobileNav, toggleMobileNav, setSearchValue, searchValue } =
    useContext(UserContext);

  return (
    <nav
      onClick={CloseSearch}
      className={`absolute left-0 top-0  z-50 col-span-full row-span-1 flex h-full w-9/12 flex-col space-y-4 border-b border-tertiaryColor bg-primaryBgColor px-2 py-4 transition-all duration-500 ease-in-out md:p-5 lg:relative lg:left-0 lg:z-auto lg:grid lg:w-full lg:grid-cols-[1fr_1.5fr_1fr] lg:items-center lg:justify-start lg:space-y-2  lg:px-5 lg:py-0 ${
        mobileNav ? "left-0" : "left-[-75%]"
      }`}
    >
      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
      <NavItem path={"profile"} logo={true}>
        Frenzy
      </NavItem>
      <NavItem path={"profile"}>Profile</NavItem>
      <NavItem path={"timeline"}>Timeline</NavItem>
      <NavItem path={"explore"}>Explore</NavItem>
      <LogOutBtn />
      {/* <Timer /> */}
      <MobileNavTrigger
        mobileNav={mobileNav}
        toggleMobileNav={toggleMobileNav}
      />
    </nav>
  );
}

const MobileNavTrigger = memo(function MobileNavTrigger({
  mobileNav,
  toggleMobileNav,
}) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        toggleMobileNav((c) => !c);
      }}
      className="absolute left-full top-1/2 m-auto  flex h-20 w-10 translate-y-[-50%] cursor-pointer items-center justify-start rounded-br-full rounded-tr-full bg-orangeLight text-left sm:h-24 sm:w-12  lg:hidden"
    >
      {mobileNav ? (
        <FaCaretLeft display={"inline"} fontSize={"2rem"} />
      ) : (
        <FaCaretRight display={"inline"} fontSize={"2rem"} />
      )}
    </div>
  );
});

const Timer = memo(function Timer() {
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

  useEffect(function () {
    const intervalId = setInterval(function () {
      if (timeLeft) {
        setTimeLeft((c) => c - 1000);
      } else {
        logOutUser();

        navigate("/");
      }
    }, 1000);

    return () => clearInterval(intervalId);
  });

  return (
    <div className="order-4 lg:hidden">
      <p
        className={` text-2xl font-bold md:text-3xl lg:text-base ${
          lessThan1hour ? "text-red-500" : ""
        } ${
          lessThan30mins ? "text-red-600" : ""
        } transition-colors duration-500 ease-in-out`}
      >
        {hours}:{minutes}:{seconds}
      </p>
    </div>
  );
});

const LogOutBtn = memo(function LogOutBtn() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: logOutFn, isPending } = useMutation({
    mutationFn: logOutUser,

    onSuccess: () => {
      //remove all queries
      queryClient.removeQueries();

      //go back to the sign in page
      navigate("/");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <button
      disabled={isPending}
      onClick={logOutFn}
      className="order-last text-left text-2xl font-bold transition-all  duration-300 hover:text-orangeColor md:text-3xl lg:order-3 lg:justify-self-end lg:text-base"
    >
      Log Out
    </button>
  );
});

const NavItem = memo(function Username({ children, path, logo = false }) {
  return (
    <>
      {!logo ? (
        <NavLink
          to={path}
          className={`cursor-pointer text-2xl font-bold transition-all duration-500 ease-in-out hover:text-orangeColor md:text-3xl lg:text-base ${
            logo ? "order-1 lg:block" : "order-3 lg:hidden"
          } lg:justify-self-start`}
        >
          {children}
        </NavLink>
      ) : null}

      {logo ? (
        <p
          className={`order-1 cursor-default font-bold transition-all duration-500   
           ease-in-out lg:block lg:justify-self-start`}
        >
          {children}
        </p>
      ) : null}
    </>
  );
});

const SearchBar = memo(function SearchBar({ searchValue, setSearchValue }) {
  return (
    <div className="group relative order-2 block items-center justify-center lg:order-2 lg:flex lg:h-full lg:w-full ">
      <div className="relative flex w-full items-center border-2 border-black bg-orangeColor  font-semibold text-primaryBgColor lg:rounded">
        <input
          className="input-style peer order-2 w-full rounded-none border-none bg-orangeColor transition-all duration-500 focus:bg-btnHover focus:text-primaryBgColor md:py-4 lg:p-2 "
          placeholder="username"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <span className="order-1 h-full cursor-default border-r-2 border-black bg-orangeColor  p-2 font-bold transition-all duration-500 peer-focus:bg-btnHover peer-focus:text-primaryBgColor md:py-4 lg:p-2">
          @
        </span>
      </div>
      <SearchBarDropdown searchValue={searchValue} />
    </div>
  );
});

const SearchBarDropdown = memo(function SearchBarDropdown({ searchValue }) {
  //when the searchbarvalue changes refetch the users
  const { mutate, isPending, isSuccess, data } = useMutation({
    mutationFn: findUsers,

    onError: (err) => {
      if (
        err.message === `AbortError: The user aborted a request.` ||
        err.message === `AbortError: signal is aborted without reason` ||
        err.message === `AbortError: Fetch is aborted`
      )
        return;

      toast.error(err.message);
    },
  });

  //fetch users when the value in the searchbar is at least 3
  useEffect(
    function () {
      const abortSignal = new AbortController();

      if (searchValue.length > 2) {
        mutate({ searchValue, abortSignal });
      }

      return () => abortSignal.abort();
    },
    [searchValue, mutate],
  );

  return (
    <div
      className={`absolute left-0 top-full z-50 w-full  justify-center divide-y overflow-y-auto  bg-btnHover  transition-all duration-500 ${
        searchValue.length > 2 ? "block" : "hidden"
      }  lg:max-h-72 lg:min-h-20  `}
    >
      {!data?.length && isSuccess ? (
        <p className="flex h-32 items-center justify-center text-center font-semibold text-primaryBgColor">
          No users found
        </p>
      ) : null}

      {data?.length && isSuccess
        ? data.map((user, i) => <FoundUser user={user} key={i} />)
        : null}

      {isPending ? (
        <p className="flex h-32 items-center justify-center text-center font-semibold text-primaryBgColor">
          Searching
        </p>
      ) : null}
    </div>
  );
});

function FoundUser({ user }) {
  const { avatar } = user;
  const username = user.username.replaceAll('"', "");
  return (
    <Link
      to={`/${user.id}`}
      className="relative flex h-32 w-full flex-shrink-0 flex-grow-0 items-center space-x-4  rounded-sm p-4 font-semibold text-primaryBgColor transition-all  duration-500 hover:bg-orangeColor"
    >
      <div className="h-full">
        <img
          src={avatar}
          className="aspect-square h-full rounded-full object-cover"
        />
      </div>
      <div>
        <p> {username}</p>
      </div>
    </Link>
  );
}

export default Navbar;
