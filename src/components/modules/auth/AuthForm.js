
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login, verifyOtp, checkAuth } from "../../store/features/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle, Home, Leaf, Shield } from "lucide-react";
import { toast } from "@/components/ui/use-toast"; // ✅ Call the toast method

const Login = () => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("chinmaya@aas.technology");
  const [password, setPassword] = useState("Chin@2025");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, isTokenChecked } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await dispatch(checkAuth()).unwrap();
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuthStatus();
  }, [dispatch]);

  useEffect(() => {
    if (isTokenChecked && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isTokenChecked, isAuthenticated, router]);

  useEffect(() => {
    let countdown;
    if (mode === "otp" && otpSent) {
      setTimer(60);
      setIsResendDisabled(true);
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [mode, otpSent]);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email) || !password) {
      setError("Please enter valid email and password");
      return;
    }
    setIsLoading(true);
    try {
      const response = await dispatch(login({ email, password })).unwrap();
      if (response.message === "OTP sent successfully") {
        setError("");
        setOtpSent(true);
        setMode("otp");
        setOtp(Array(6).fill(""));
        setOtpError("");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError(err?.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setOtpError("Please enter a 6-digit OTP");
      return;
    }
    setIsLoading(true);
    try {
      const response = await dispatch(
        verifyOtp({ email, otp: otpValue })
      ).unwrap(); 
      
      if (response.message === "Login successful") {
        toast.success("Login successful!...");
        setMode("login");
        router.push("/dashboard");
      } else {
        setOtpError("Invalid OTP. Please try again.");
        setOtp(Array(6).fill(""));
      }
    } catch (err) {
      setOtpError(err?.message || "Invalid OTP. Please try again.");
      setOtp(Array(6).fill(""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isResendDisabled) return;
    setOtp(Array(6).fill(""));
    setOtpError("");
    setIsLoading(true);
    try {
      const response = await dispatch(login({ email, password })).unwrap();
      if (response.message === "OTP sent successfully") {
        setOtpSent(true);
        setTimer(60);
        setIsResendDisabled(true);
      } else {
        setOtpError("Failed to resend OTP");
      }
    } catch {
      setOtpError("Error resending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (/^\d$/.test(val) || val === "") {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);
      if (otpError) setOtpError("");
      if (val && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
    if (e.key === "Enter") {
      handleOtpSubmit();
    }
  };

  const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    const maskedName =
      name.length > 4
        ? `${name.slice(0, 3)}${"*".repeat(name.length - 3)}`
        : `${name.charAt(0)}${"*".repeat(name.length - 1)}`;
    return `${maskedName}@${domain}`;
  };

  const resetAll = () => {
    setMode("login");
    setEmail("");
    setPassword("");
    setOtp(Array(6).fill(""));
    setOtpError("");
    setError("");
    setOtpSent(false);
    setTimer(60);
    setIsResendDisabled(true);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const renderOtpInputs = (otpArray, handleChange, handleKeyDown, idPrefix) => (
    <div className="flex justify-center space-x-3 mb-6">
      {otpArray.map((digit, index) => (
        <Input
          key={index}
          id={`${idPrefix}-input-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-14 h-16 text-center text-2xl font-bold border-3 border-green-300 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
          autoFocus={index === 0}
        />
      ))}
    </div>
  );

  // if (isCheckingAuth || (isTokenChecked && isAuthenticated)) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600">
  //       <div className="relative">
  //         <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent shadow-lg"></div>
  //         <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-green-200 opacity-30"></div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 via-emerald-700 to-teal-800 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
    <Card className="max-w-md w-full rounded-3xl shadow-2xl bg-white/95 backdrop-blur-lg p-8 border-0 relative overflow-hidden z-10">
        {/* Green accent bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
        
        {mode === "login" && (
          <>
            <CardHeader className="mb-8 text-center relative">
           
              <CardTitle className="text-4xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">
                Welcome Back! 
              </CardTitle>
              <p className="text-gray-700 mt-3 text-lg font-medium">
                Step into your  productivity! 🚀
              </p>
            </CardHeader>
            
            {error && (
              <Alert
                variant="destructive"
                className="mb-6 border-red-300 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl shadow-md"
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
                <AlertDescription className="text-red-700 font-semibold">{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-bold text-green-700 flex items-center gap-2"
                >
                  📧 Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@aas.technology"
                  className="h-14 rounded-2xl shadow-lg focus:ring-4 focus:ring-green-300 border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 text-gray-800 font-medium placeholder-green-500 transition-all duration-300 hover:shadow-xl"
                  autoComplete="username"
                />
              </div>
              
              <div className="space-y-2 relative">
                <Label
                  htmlFor="password"
                  className="text-sm font-bold text-emerald-700 flex items-center gap-2"
                >
                  🔐 Password
                </Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-14 rounded-2xl shadow-lg focus:ring-4 focus:ring-emerald-300 border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 text-gray-800 font-medium placeholder-emerald-500 pr-14 transition-all duration-300 hover:shadow-xl"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-11 text-green-600 hover:text-emerald-600 transition-colors duration-200 transform hover:scale-110"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 font-bold rounded-2xl h-14 text-lg text-white shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-2xl"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Sending Otp...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield size={20} />
                    Login! 
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center mt-8">
              <button
                onClick={handleBackToHome}
                className="inline-flex items-center space-x-2 text-green-700 hover:text-emerald-700 hover:underline font-bold transition-all duration-200 transform hover:scale-105 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full shadow-md hover:shadow-lg border border-green-200"
              >
                <Home size={18} />
                <span> ← Back to  Home</span>
              </button>
            </div>
          </>
        )}

        {mode === "otp" && (
          <>
            <CardHeader className="mb-6 text-center relative">
              <div className="absolute -top-2 -left-2 text-emerald-500 animate-pulse">
                <Shield size={32} className="drop-shadow-lg" />
              </div>
              <CardTitle className="text-3xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                 Security Check! 🔐
              </CardTitle>
              <p className="text-gray-700 mt-3 leading-relaxed">
                We sent a fresh otp to{" "}
                <span className="font-bold text-green-700 bg-green-100 px-3 py-1 rounded-lg border border-green-200">
                  {maskEmail(email)}
                </span>
                <br />
                <span className="text-sm text-emerald-600 font-semibold mt-2 block">
                  🌿 Enter the 6-digit otp!
                </span>
              </p>
            </CardHeader>
            
            {otpError && (
              <div className="text-center mb-4 p-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl border-2 border-red-200 shadow-md">
                <p className="text-red-600 font-bold">❌ {otpError}</p>
              </div>
            )}
            
            {error && (
              <Alert
                variant="destructive"
                className="mb-4 border-red-300 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl shadow-md"
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
                <AlertDescription className="text-red-700 font-semibold">{error}</AlertDescription>
              </Alert>
            )}
            
            {renderOtpInputs(otp, handleOtpChange, handleOtpKeyDown, "otp")}
            
            <div className="flex justify-between items-center mb-8 gap-4">
              <Button
                variant="outline"
                disabled={isResendDisabled}
                onClick={handleResendOtp}
                className="text-green-700 font-bold hover:bg-green-50 transition rounded-2xl border-2 border-green-300 hover:border-green-500 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:transform-none bg-gradient-to-r from-green-50 to-emerald-50"
              >
                {isResendDisabled ? (
                  <span className="flex items-center gap-2">
                    ⏱️ Fresh otp in {timer}s
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    🔄 Send Fresh Otp
                  </span>
                )}
              </Button>
              
              <Button
                onClick={handleOtpSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 font-bold rounded-2xl shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95 text-white hover:shadow-2xl"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    ✅ Verify OTP
                  </div>
                )}
              </Button>
            </div>
            
            <div className="text-center space-y-4">
              <button
                onClick={() => {
                  setMode("login");
                  setOtp(Array(6).fill(""));
                  setOtpError("");
                  setError("");
                }}
                className="block w-full text-green-700 hover:text-emerald-700 hover:underline font-bold transition-colors duration-200 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 py-3 rounded-2xl border border-green-200 shadow-sm hover:shadow-md"
              >
                ← Back to  Login
              </button>

              <button
                onClick={handleBackToHome}
                className="inline-flex items-center space-x-2 text-green-700 hover:text-emerald-700 hover:underline font-bold transition-all duration-200 transform hover:scale-105 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full shadow-md hover:shadow-lg border border-green-200"
              >
                <Home size={16} />
                <span> ← Back to  Home</span>
              </button>
            </div>
          </>
        )}
      </Card>
     
    </div>
  );
};

export default Login;


