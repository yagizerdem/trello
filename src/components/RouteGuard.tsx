import { createEffect } from "solid-js";
import { useAuth } from "../context/authContext";
import { useNavigate } from "@solidjs/router";

const RouteGuard = (props: any) => {
  const auth = useAuth();
  const navigate = useNavigate();

  createEffect(() => {
    console.log(!auth?.isAuthenticated(), "create affefct run");
    if (!auth?.isAuthenticated()) {
      // Redirect to login page if not authenticated
      //   navigate("/Auth/login", { replace: true });
      return null; // Prevent rendering the protected component
    }
  });

  return <>{props.children}</>;
};

export default RouteGuard;
