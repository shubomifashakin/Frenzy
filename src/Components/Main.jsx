import PostBtn from "./PostBtn";

function Main({ mainRef, children, showPostBtn = true }) {
  return (
    <main
      ref={mainRef}
      className="   col-start-2 h-full overflow-auto border-tertiaryColor lg:border-x"
    >
      <div className="relative w-full space-y-4 p-4 lg:mt-0 lg:p-5 ">
        {children}
      </div>

      {showPostBtn ? <PostBtn /> : null}
    </main>
  );
}

export default Main;
