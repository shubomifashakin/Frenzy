export function CheckBox({ setChecked, checked }) {
  return (
    <span
      onClick={() => setChecked((c) => !c)}
      className={`toggle  w-12 transition-all relative p-1 rounded-full bg-primaryTextColor flex ${
        checked ? "justify-end" : "justify-start"
      }`}
    >
      <span className="w-5 h-5 transition-all duration-500  rounded-full bg-primaryBg block hover:bg-orange-300"></span>
    </span>
  );
}
