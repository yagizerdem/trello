import { createBrowserRouter } from "react-router";
import AppLayout from "@/layouts/app-layout/layout";
import HomePage from "@/features/home";
import SignInPage from "@/features/auth/sign-in";
import SignUpPage from "@/features/auth/sign-up";
import NotFoundPage from "@/features/not-found";
import WorkflowPage from "@/features/workflow";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
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
  {
    path: "/workflow",
    element: <WorkflowPage />,
  },
]);

export default router;
