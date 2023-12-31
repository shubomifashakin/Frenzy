export function CheckBox({ setChecked, checked }) {
  return (
    <span
      onClick={() => setChecked((c) => !c)}
      className={`toggle cursor-pointer w-12 transition-all relative p-1 rounded-full bg-secondaryColor flex ${
        checked ? "justify-end" : "justify-start"
      }`}
    >
      <span className="w-5 cursor-pointer h-5 transition-all duration-500  rounded-full bg-primaryColor ease-in-out block hover:bg-secondaryColorHover"></span>
    </span>
  );
}
