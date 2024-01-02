function LoadingPosts() {
  return (
    <div className="flex h-full w-full animate-flasInfinite flex-col justify-between space-y-4">
      <Post />
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
    <h1 className="min-h-10 rounded-t-lg border-b border-primaryBgColor  px-2 py-1"></h1>
  );
}

function PostContent() {
  return <p className={`min-h-32  px-2 py-5  `}></p>;
}
