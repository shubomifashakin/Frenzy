function LoadingPosts() {
  return (
    <div className="animate-flasInfinite flex h-full w-full flex-col justify-between space-y-4">
      <Post />
      <Post />
      <Post />
    </div>
  );
}

export default LoadingPosts;

function Post() {
  return (
    <div className=" bg-secondaryColor ">
      <PostHeader />

      <PostContent />
    </div>
  );
}

function PostHeader() {
  return (
    <h1 className="border-primaryBgColor min-h-10 rounded-t-lg border-b  px-2 py-1"></h1>
  );
}

function PostContent() {
  return <p className={`min-h-32  px-2 py-5  `}></p>;
}
