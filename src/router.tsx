import { createBrowserRouter } from "react-router";
import AppLayout from "@/layouts/app-layout/layout";
import HomePage from "@/features/home";
import SignInPage from "@/features/auth/sign-in";
import SignUpPage from "@/features/auth/sign-up";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
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
