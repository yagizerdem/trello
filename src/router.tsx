import { createBrowserRouter } from "react-router";
import HomePage from "@/features/home";
import SignInPage from "@/features/auth/sign-in";
import SignUpPage from "@/features/auth/sign-up";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
]);

export default router;
