import { createEffect, onMount } from "solid-js";
import { useAuth } from "../context/authContext";
import { useNavigate } from "@solidjs/router";

const RouteGuard = (props: any) => {
  const navigate = useNavigate();
  onMount(() => {
    const auth = useAuth();
    if (!auth?.isAuthenticated()) {
      // Redirect to login page if not authenticated
      navigate("/Auth/login", { replace: true });
    }
    return null; // Prevent rendering the protected component
  });

  return <>{props.children}</>;
};

export default RouteGuard;
