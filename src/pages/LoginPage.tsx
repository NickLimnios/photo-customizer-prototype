import { useState } from "react";

import SignIn from "../Auth/SignIn";
import SignUp from "../Auth/SignUp";
import PageLayout from "../Layout/PageLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginPage = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <PageLayout title="Access your LumiBook account">
      <div className="mx-auto w-full max-w-md">
        <Card className="border-muted/60">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              {mode === "signin" ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription>
              {mode === "signin"
                ? "Sign in to continue editing your photobooks."
                : "Set up your account to sync projects across devices."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={mode} onValueChange={(value) => setMode(value as typeof mode)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="mt-6">
                <SignIn />
              </TabsContent>
              <TabsContent value="signup" className="mt-6">
                <SignUp />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
