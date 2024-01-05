function ImageModal({ isImageModal, toggleImageModal }) {
  function closeImageModal(e) {
    e.stopPropagation();
    toggleImageModal(false);
  }

  return (
    <div
      className={`animate-flash ease-in-out  ${
        isImageModal ? "block" : "hidden"
      } bg-lightBlack absolute left-0 top-0 z-[100] flex h-full w-full items-center justify-center  shadow-sm shadow-secondaryColor backdrop-blur-[2px] lg:bg-transparent`}
    >
      <div className="flex h-4/5 items-center justify-center px-4 md:px-6 lg:w-full lg:p-0">
        <img
          src={isImageModal}
          className=" h-full object-contain lg:object-cover"
        />
      </div>

      <span
        onClick={closeImageModal}
        className="hover:bg-lightBlack absolute left-[85%] top-5 cursor-pointer rounded-full px-3 py-1 text-2xl font-extrabold text-white transition-all  duration-300 hover:text-orangeColor md:left-[90%] md:text-3xl lg:left-10 lg:top-10 lg:text-xl lg:text-black"
      >
        X
      </span>
    </div>
  );
}

export default ImageModal;
