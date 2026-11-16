import { Link } from "react-router";
import AuthLayout from "@/features/auth/components/auth-layout";
import SignUpForm from "./components/sign-up-form";

export default function Page() {
  return (
    <AuthLayout
      title="Sign up"
      description="Create an account with your email and password."
      footer={
        <p>
          Already have an account?{" "}
          <Link to="/sign-in" className="text-foreground underline">
            Sign in
          </Link>
        </p>
      }
    >
      <SignUpForm />
    </AuthLayout>
  );
}
