import { Link } from "react-router";
import AuthLayout from "@/features/auth/components/auth-layout";
import SignInForm from "./components/sign-in-form";

export default function Page() {
  return (
    <AuthLayout
      title="Sign in"
      description="Enter your email and password to sign in."
      footer={
        <p>
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-foreground underline">
            Sign up
          </Link>
        </p>
      }
    >
      <SignInForm />
    </AuthLayout>
  );
}
