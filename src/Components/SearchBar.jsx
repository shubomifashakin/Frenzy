import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function SearchBar() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="group relative block items-center justify-center lg:order-2 lg:flex lg:h-full lg:w-80 ">
      <div className=" relative flex w-full items-center bg-btnColor font-semibold text-primaryBgColor lg:rounded">
        <span className="border-r-2 border-primaryBgColor p-2">@</span>
        <form>
          <input
            className="input-style rounded-none border-none bg-transparent"
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

export function SearchBarDropdown({ searchValue }) {
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

export default SearchBar;
