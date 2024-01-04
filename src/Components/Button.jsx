import { memo } from "react";

export const Button = memo(function Button({ children, size = "medium" }) {
  return (
    <button
      className={` rounded-md bg-secondaryColor ${
        size === "medium" ? "p-3" : ""
      } ${
        size === "small" ? "px-2 py-1" : ""
      }  border border-orangeColor font-semibold text-black ring  ring-orangeColor ring-offset-2 transition-all duration-500 ease-in-out hover:border-black  hover:bg-secondaryColor hover:text-btnHover hover:ring-offset-4 focus:scale-[0.9] focus:ring-2 focus:ring-secondaryColor focus:ring-offset-2 `}
    >
      {children}
    </button>
  );
});
