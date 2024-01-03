import { Button } from "../Pages/SignInPage";

export function ErrorLoading({ retryFn, message }) {
  return (
    <p className="flex h-32 w-full flex-col items-center justify-center space-y-4 bg-sideColor">
      <p className="font-semibold text-red-500">{message}</p>
      <form onSubmit={retryFn}>
        <Button size={"small"}>Retry</Button>
      </form>
    </p>
  );
}
