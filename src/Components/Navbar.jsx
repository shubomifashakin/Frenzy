import { memo, useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { supabase } from "../Helpers/supabase";

import { UserContext } from "./AppLayout";
import { userStore } from "../Stores/UserStore";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";
import toast from "react-hot-toast";

function Navbar() {
  const {
    user_metadata: { userName },
  } = userStore(function (state) {
    return state.user;
  });

  function CloseSearch(e) {
    e.stopPropagation();
    setSearchValue([]);
  }

  const { mobileNav, toggleMobileNav, setSearchValue } =
    useContext(UserContext);

  return (
    <nav
      onClick={CloseSearch}
      className={`absolute left-0 top-0  z-50  col-span-full row-span-1 flex h-full w-9/12 flex-col space-y-2 border-b border-tertiaryColor bg-primaryBgColor px-2 py-4 transition-all duration-500 ease-in-out md:p-5 lg:relative lg:left-0 lg:grid lg:w-full lg:grid-cols-[1fr_1.5fr_1fr] lg:items-center lg:justify-start  lg:px-5 lg:py-0 ${
        mobileNav ? "left-0" : "left-[-75%]"
      }`}
    >
      <SearchBar />
      <NavItem path={"profile"} logo={true}>
        Frenzy
      </NavItem>
      <NavItem path={"profile"}>{userName}</NavItem>
      <NavItem path={"timeline"}>Timeline</NavItem>
      <NavItem path={"explore"}>Explore</NavItem>
      <LogOutBtn />
      <Timer />
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
    <div className="order-4 lg:hidden">
      <p
        className={`text-base font-bold ${
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
  async function logOut() {
    let { error } = await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <button
      onClick={logOut}
      className="order-last text-left font-bold  transition-all duration-300 hover:text-orangeColor lg:order-3 lg:justify-self-end"
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
          className={`cursor-pointer font-bold transition-all duration-500 ease-in-out hover:text-orangeColor  ${
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

function SearchBar() {
  const { searchValue, setSearchValue } = useContext(UserContext);

  return (
    <div className="group relative order-2 block items-center justify-center lg:order-2 lg:flex lg:h-full lg:w-full ">
      <div className="relative flex w-full items-center border-2 border-black  font-semibold text-primaryBgColor lg:rounded">
        <input
          className="input-style peer order-2 w-full rounded-none border-none bg-orangeColor transition-all duration-500 focus:bg-btnHover focus:text-primaryBgColor "
          placeholder="username"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <span className="order-1 h-full cursor-default border-r-2 border-black   bg-orangeColor p-2 font-bold transition-all duration-500 peer-focus:bg-btnHover peer-focus:text-primaryBgColor">
          @
        </span>
      </div>
      <SearchBarDropdown searchValue={searchValue} />
    </div>
  );
}

const SearchBarDropdown = memo(function SearchBarDropdown({ searchValue }) {
  const [foundUsers, setFoundUsers] = useState([]);
  //when the searchbarvalue changes refetch the users

  // //fetch users when the value in the searchbar is at least 3
  useEffect(
    function () {
      const abortSignal = new AbortController();

      async function findUser() {
        try {
          let { data: Users, error } = await supabase
            .from("UsersInfo")
            .select("*")
            .ilike("username", `%${searchValue}%`)
            .abortSignal(abortSignal.signal);

          if (error?.message) throw new Error(error.message);

          setFoundUsers(Users);
        } catch (err) {
          if (
            err.message === `AbortError: The user aborted a request.` ||
            err.message === `AbortError: signal is aborted without reason`
          )
            return;

          toast.error(err.message);
        }
      }

      if (searchValue.length > 2) {
        findUser();
      }

      return () => abortSignal.abort();
    },
    [searchValue, setFoundUsers],
  );

  return (
    <div
      className={`absolute left-0 top-full z-50 flex  w-full  flex-shrink-0 flex-col justify-center divide-y overflow-y-scroll bg-btnHover  transition-all duration-500 ${
        searchValue.length > 2 ? "block" : "hidden"
      }  lg:max-h-72 lg:min-h-20  `}
    >
      {!foundUsers.length ? (
        <p className="text-center font-semibold text-primaryBgColor">
          No users found
        </p>
      ) : null}

      {foundUsers.length
        ? foundUsers.map((user, i) => <FoundUser user={user} key={i} />)
        : null}
    </div>
  );
});

function FoundUser({ user }) {
  return (
    <span className="h-32 w-full flex-shrink-0 rounded-sm  px-2 py-4 font-semibold text-primaryBgColor transition-all  duration-500 hover:bg-orangeColor">
      {user.username.slice(1, user.username.length - 1)}
    </span>
  );
}

export default Navbar;
