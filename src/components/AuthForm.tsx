import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
const AuthForm = () => {
  const {
    login,
    signup,
    isLoading,
    isAuthenticated
  } = useApp();
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error states
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter both email and password");
      return;
    }
    const success = await login(loginEmail, loginPassword);
    if (success) {
      navigate("/dashboard");
    } else {
      setLoginError("Invalid email or password");
    }
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    if (!registerName || !registerEmail || !registerPassword || !confirmPassword) {
      setRegisterError("Please fill in all fields");
      return;
    }
    if (registerPassword !== confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }
    const success = await signup(registerName, registerEmail, registerPassword);
    if (success) {
      navigate("/dashboard");
    } else {
      setRegisterError("Registration failed. Please try again.");
    }
  };
  return <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="mx-auto max-w-md w-full px-4 bg-white">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            
          </div>
          <h1 className="text-3xl font-bold text-[#212529]">Channel Nexus</h1>
          <p className="text-slate-700 mt-2">Unite your communication channels</p>
        </div>
        
        <Card className="border-amber-200 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-amber-600">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your connected channels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-xs text-amber-600 hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <Input id="password" type="password" placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                    </div>
                    
                    {loginError && <div className="text-sm text-red-500">{loginError}</div>}
                    
                    <Button type="submit" disabled={isLoading} className="w-full bg-[#212529] text-white">
                      {isLoading ? <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Please wait
                        </> : "Sign In"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" value={registerName} onChange={e => setRegisterName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input id="register-email" type="email" placeholder="your@email.com" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input id="register-password" type="password" placeholder="••••••••" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>
                    
                    {registerError && <div className="text-sm text-red-500">{registerError}</div>}
                    
                    <Button type="submit" className="w-full bg-amber-400 hover:bg-amber-500 text-black" disabled={isLoading}>
                      {isLoading ? <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Please wait
                        </> : "Create Account"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-500 flex justify-center">
            <p>
              By continuing, you agree to our{" "}
              <a href="#" className="text-amber-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-amber-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>;
};
export default AuthForm;