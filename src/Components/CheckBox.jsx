export function CheckBox({ setChecked, checked }) {
  return (
    <span
      onClick={() => setChecked((c) => !c)}
      className={`toggle bg-btnColor relative flex w-12 cursor-pointer rounded-full p-1 transition-all`}
    >
      <span
        className={`bg-primaryBgColor block h-5 w-5 cursor-pointer  rounded-full transition-all duration-300 ease-in-out hover:bg-secondaryColor  ${
          checked ? "translate-x-full" : "translate-x-0"
        }`}
      ></span>
    </span>
  );
}
