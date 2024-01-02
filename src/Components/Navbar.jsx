import { Link } from "react-router-dom";
import { userStore } from "../Stores/UserStore";

function Navbar({ mobileNav }) {
  const {
    user_metadata: { userName },
  } = userStore(function (state) {
    return state.user;
  });
  return (
    <nav
      className={` md-h-auto  absolute  left-0 top-0 z-50 col-span-full row-span-1 flex h-full w-1/2 border-b border-tertiaryColor bg-primaryColor px-2 py-4 transition-all duration-500 ease-in-out lg:relative lg:left-0 lg:z-auto lg:h-auto lg:w-full lg:items-center lg:justify-end lg:px-4 ${
        mobileNav ? "left-0" : "left-[-300px] md:left-[-500px]"
      }`}
    >
      <Username>{userName}</Username>
    </nav>
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
