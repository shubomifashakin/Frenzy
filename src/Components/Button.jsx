import { memo } from "react";

export const Button = memo(function Button({
  children,
  size = "medium",
  isPending,
  width,
}) {
  return (
    <button
      disabled={isPending}
      className={` rounded-md bg-secondaryColor ${
        size === "medium" ? "p-3" : ""
      } ${size === "small" ? "px-2 py-1 ring-1" : ""} 
      
      ${
        size === "xs"
          ? "border-none bg-transparent p-0 text-xs ring-0 ring-offset-0 hover:border-none hover:bg-transparent hover:text-orangeColor hover:ring-offset-0 focus:border-none focus:text-orangeColor focus:ring-0 focus:ring-offset-0 "
          : ""
      }  ${width}
      border border-orangeColor font-semibold text-black ring ring-orangeColor  ring-offset-2 transition-all duration-500 ease-in-out hover:border-black hover:bg-secondaryColor  hover:text-btnHover hover:ring-offset-4 focus:scale-[0.9] focus:ring-2 focus:ring-secondaryColor focus:ring-offset-2 disabled:cursor-progress disabled:bg-btnHover disabled:text-primaryBgColor `}
    >
      {children}
    </button>
  );
});
