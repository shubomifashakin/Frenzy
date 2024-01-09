function Main({ mainRef, children }) {
  return (
    <main
      ref={mainRef}
      className="   col-start-2 h-full overflow-auto border-tertiaryColor lg:border-x"
    >
      <div className="relative w-full p-4 lg:mt-0 lg:space-y-4 lg:p-5 ">
        {children}
      </div>
    </main>
  );
}

export default Main;
