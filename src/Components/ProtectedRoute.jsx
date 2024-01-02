import { useNavigate } from "react-router-dom";
import { userStore } from "../Stores/UserStore";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const user = userStore(function (state) {
    return state.user;
  });

  const navigate = useNavigate();

  useEffect(
    function () {
      if (user?.aud !== "authenticated") navigate("/");
    },
    [user, navigate],
  );

  return user ? children : null;
}

export default ProtectedRoute;
