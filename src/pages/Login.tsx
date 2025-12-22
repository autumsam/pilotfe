
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, User, Mail, UserPlus, LogIn } from "lucide-react";
import authService from "@/services/auth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await authService.login({ username, password });
      
      if ('error' in result) {
        toast.error(result.error || "Login failed");
      } else {
        // Save auth data
        authService.saveToken(result.token);
        const role = result.role || (result.user.is_staff ? 'admin' : 'user');
        authService.saveUser(result.user, role);
        
        toast.success(`Welcome back, ${result.user.username}!`);
        
        // Redirect based on role
        if (role === 'admin' || result.user.is_staff) {
          navigate("/api-stats/social");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      toast.error("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await authService.register({
        username,
        email,
        password,
        password2: confirmPassword,
      });

      if ('error' in result) {
        const details = result.details || {};
        const errorMessages = Object.entries(details)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
          .join("; ");
        toast.error(errorMessages || result.error);
      } else {
        // Save auth data
        authService.saveToken(result.token);
        authService.saveUser(result.user, 'user');
        
        toast.success(`Account created successfully! Welcome, ${result.user.username}!`);
        
        // Reset form
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsFlipped(false);
        
        // Redirect to dashboard
        navigate("/home");
      }
    } catch (error) {
      toast.error("Registration failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-400 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">PostPulse</h1>
          <p className="text-white/80 mt-2 text-sm md:text-base">Sign in to manage your social media</p>
        </div>
        
        <div 
          className="w-full relative perspective-1000"
          style={{ 
            perspective: '1000px'
          }}
        >
          <div
            className="relative w-full transition-transform duration-600 transform-style-preserve-3d"
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              minHeight: '435px'
            }}
          >
            {/* Login Card (Front) */}
            <Card 
              className="shadow-xl border-none absolute w-full overflow-auto"
              style={{
                backfaceVisibility: 'hidden',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                minHeight: '100%'
              }}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-xl md:text-2xl">Welcome back</CardTitle>
                <CardDescription className="text-sm">Enter your credentials to access your dashboard</CardDescription>
              </CardHeader>
              
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6">
                  <div className="space-y-1.5 md:space-y-2">
                    <Label htmlFor="username" className="text-sm">Username</Label>
                    <div className="relative">
                      <User className="absolute left-2.5 md:left-3 top-2.5 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      <Input
                        id="username"
                        placeholder="Username"
                        className="pl-8 md:pl-10 h-9 md:h-10 text-sm md:text-base"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 md:space-y-2">
                    <Label htmlFor="password" className="text-sm">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 md:left-3 top-2.5 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        className="pl-8 md:pl-10 h-9 md:h-10 text-sm md:text-base"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col gap-3 md:gap-4 px-4 md:px-6 pb-4 md:pb-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-postpulse-orange hover:bg-orange-600 gap-2 h-9 md:h-10 text-sm md:text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? "Authenticating..." : (
                      <>
                        <LogIn size={16} className="md:w-[18px] md:h-[18px]" />
                        Sign In
                      </>
                    )}
                  </Button>
                  <p className="text-xs md:text-sm text-center">
                    Don't have an account?{" "}
                    <button 
                      type="button" 
                      onClick={toggleForm} 
                      className="text-postpulse-blue hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                </CardFooter>
              </form>
            </Card>

            {/* Signup Card (Back) */}
            <Card 
              className="shadow-xl border-none absolute w-full backface-hidden transform-rotate-y-180 overflow-auto"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                minHeight: '100%'
              }}
            >
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-xl md:text-2xl">Create account</CardTitle>
                <CardDescription className="text-sm">Sign up for a new PostPulse account</CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-2.5 md:space-y-4 px-4 md:px-6">
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="signup-username" className="text-sm">Username</Label>
                    <div className="relative">
                      <User className="absolute left-2.5 md:left-3 top-2.5 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      <Input
                        id="signup-username"
                        placeholder="Choose a username"
                        className="pl-8 md:pl-10 h-9 md:h-10 text-sm md:text-base"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="signup-email" className="text-sm">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 md:left-3 top-2.5 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Email address"
                        className="pl-8 md:pl-10 h-9 md:h-10 text-sm md:text-base"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="signup-password" className="text-sm">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 md:left-3 top-2.5 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-8 md:pl-10 h-9 md:h-10 text-sm md:text-base"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 md:left-3 top-2.5 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-8 md:pl-10 h-9 md:h-10 text-sm md:text-base"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col gap-3 md:gap-4 px-4 md:px-6 pb-4 md:pb-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-postpulse-blue hover:bg-blue-700 gap-2 h-9 md:h-10 text-sm md:text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : (
                      <>
                        <UserPlus size={16} className="md:w-[18px] md:h-[18px]" />
                        Sign Up
                      </>
                    )}
                  </Button>
                  <p className="text-xs md:text-sm text-center">
                    Already have an account?{" "}
                    <button 
                      type="button" 
                      onClick={toggleForm} 
                      className="text-postpulse-orange hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
