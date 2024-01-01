function Navbar({ mobileNav }) {
  return (
    <nav
      className={`md-h-auto absolute z-50 h-full bg-secondaryColor transition-all duration-500 ease-in-out lg:relative lg:z-auto lg:h-auto lg:w-auto ${
        mobileNav ? "w-1/2" : "w-0"
      }`}
    ></nav>
  );
}

export default Navbar;
