import React, { useState } from "react";
import SignIn from "../Auth/SignIn";
import SignUp from "../Auth/SignUp";
import PageLayout from "../Layout/PageLayout";
const LoginPage: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <PageLayout title={isSignIn ? "Sign In to Photobook" : "Create a Photobook Account"}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-4 tablet:p-8 rounded shadow-md w-full max-w-sm tablet:max-w-md">
          {isSignIn ? <SignIn /> : <SignUp />}
          <p className="mt-4 text-center text-sm text-gray-600">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="text-blue-500 hover:underline"
            >
              {isSignIn ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
