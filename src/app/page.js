// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { login, verifyOtp, checkAuth } from "@/store/features/authSlice";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Eye, EyeOff, AlertCircle } from "lucide-react";
// import { toast } from "@/components/ui/use-toast";

// export default function AdminLoginPage() {
//   const [mode, setMode] = useState("login");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [otp, setOtp] = useState(Array(6).fill(""));
//   const [otpError, setOtpError] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [timer, setTimer] = useState(60);
//   const [isResendDisabled, setIsResendDisabled] = useState(true);
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);

//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { isAuthenticated, isTokenChecked } = useSelector((state) => state.auth);

//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         await dispatch(checkAuth()).unwrap();
//       } catch (error) {
//         console.error("Auth check failed:", error);
//       } finally {
//         setIsCheckingAuth(false);
//       }
//     };
//     checkAuthStatus();
//   }, [dispatch]);

//   useEffect(() => {
//     if (isTokenChecked && isAuthenticated) {
//       router.push("/admin/dashboard");
//     }
//   }, [isTokenChecked, isAuthenticated, router]);

//   useEffect(() => {
//     let countdown;
//     if (mode === "otp" && otpSent) {
//       setTimer(60);
//       setIsResendDisabled(true);
//       countdown = setInterval(() => {
//         setTimer((prev) => {
//           if (prev <= 1) {
//             clearInterval(countdown);
//             setIsResendDisabled(false);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(countdown);
//   }, [mode, otpSent]);

//   const validateEmail = (email) => {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return emailRegex.test(email);
//   };

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateEmail(email) || !password) {
//       setError("Please enter a valid email and password");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await dispatch(login({ email, password })).unwrap();
//       if (response.message === "OTP sent successfully") {
//         setError("");
//         setOtpSent(true);
//         setMode("otp");
//         setOtp(Array(6).fill(""));
//         setOtpError("");
//       } else {
//         setError(response.message || "Login failed");
//       }
//     } catch (err) {
//       setError(err?.message || "Authentication failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOtpSubmit = async () => {
//     const otpValue = otp.join("");
//     if (otpValue.length !== 6) {
//       setOtpError("Please enter a 6-digit OTP");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await dispatch(verifyOtp({ email, otp: otpValue })).unwrap();
//       if (response.message === "Login successful") {
//         toast({ title: "Success", description: "Login successful!" });
//         setMode("login");
//         router.push("/admin/dashboard");
//       } else {
//         setOtpError("Invalid OTP. Please try again.");
//         setOtp(Array(6).fill(""));
//       }
//     } catch (err) {
//       setOtpError(err?.message || "Invalid OTP. Please try again.");
//       setOtp(Array(6).fill(""));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     if (isResendDisabled) return;
//     setOtp(Array(6).fill(""));
//     setOtpError("");
//     setIsLoading(true);
//     try {
//       const response = await dispatch(login({ email, password })).unwrap();
//       if (response.message === "OTP sent successfully") {
//         setOtpSent(true);
//         setTimer(60);
//         setIsResendDisabled(true);
//       } else {
//         setOtpError("Failed to resend OTP");
//       }
//     } catch {
//       setOtpError("Error resending OTP");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOtpChange = (e, index) => {
//     const val = e.target.value;
//     if (/^\d$/.test(val) || val === "") {
//       const newOtp = [...otp];
//       newOtp[index] = val;
//       setOtp(newOtp);
//       if (otpError) setOtpError("");
//       if (val && index < 5) {
//         document.getElementById(`otp-input-${index + 1}`).focus();
//       }
//     }
//   };

//   const handleOtpKeyDown = (e, index) => {
//     if (e.key === "Backspace") {
//       const newOtp = [...otp];
//       newOtp[index] = "";
//       setOtp(newOtp);
//       if (index > 0) {
//         document.getElementById(`otp-input-${index - 1}`).focus();
//       }
//     }
//     if (e.key === "Enter") {
//       handleOtpSubmit();
//     }
//   };

//   const maskEmail = (email) => {
//     if (!email) return "";
//     const [name, domain] = email.split("@");
//     const maskedName =
//       name.length > 4
//         ? `${name.slice(0, 3)}${"*".repeat(name.length - 3)}`
//         : `${name.charAt(0)}${"*".repeat(name.length - 1)}`;
//     return `${maskedName}@${domain}`;
//   };

//   const renderOtpInputs = (otpArray, handleChange, handleKeyDown, idPrefix) => (
//     <div className="flex justify-center space-x-2 mb-6">
//       {otpArray.map((digit, index) => (
//         <Input
//           key={index}
//           id={`${idPrefix}-input-${index}`}
//           type="text"
//           inputMode="numeric"
//           maxLength={1}
//           value={digit}
//           onChange={(e) => handleChange(e, index)}
//           onKeyDown={(e) => handleKeyDown(e, index)}
//           className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
//           autoFocus={index === 0}
//         />
//       ))}
//     </div>
//   );

//   if (isCheckingAuth || (isTokenChecked && isAuthenticated)) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
//       <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
//         {mode === "login" && (
//           <>
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Admin Panel</h2>
//             <p className="text-gray-500 mb-6">Sign in to manage your platform</p>

//             {error && (
//               <Alert variant="destructive" className="mb-6">
//                 <AlertCircle className="w-5 h-5" />
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             <form onSubmit={handleLoginSubmit} className="space-y-5">
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
//                   Email
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email"
//                   className="h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-primary/20"
//                 />
//               </div>
//               <div className="space-y-2 relative">
//                 <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
//                   Password
//                 </Label>
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter your password"
//                   className="h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-primary/20 pr-10"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full h-10 font-semibold"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center gap-2">
//                     <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//                     Sending OTP...
//                   </div>
//                 ) : (
//                   "Sign In"
//                 )}
//               </Button>
//             </form>
//           </>
//         )}

//         {mode === "otp" && (
//           <>
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Verify OTP</h2>
//             <p className="text-gray-500 mb-4">
//               Enter the 6-digit code sent to{" "}
//               <span className="font-semibold text-primary">{maskEmail(email)}</span>
//             </p>

//             {otpError && (
//               <Alert variant="destructive" className="mb-6">
//                 <AlertCircle className="w-5 h-5" />
//                 <AlertDescription>{otpError}</AlertDescription>
//               </Alert>
//             )}

//             {renderOtpInputs(otp, handleOtpChange, handleOtpKeyDown, "otp")}

//             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//               <Button
//                 variant="outline"
//                 disabled={isResendDisabled}
//                 onClick={handleResendOtp}
//                 className="w-full sm:w-auto"
//               >
//                 {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
//               </Button>
//               <Button
//                 onClick={handleOtpSubmit}
//                 disabled={isLoading}
//                 className="w-full sm:w-auto"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center gap-2">
//                     <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//                     Verifying...
//                   </div>
//                 ) : (
//                   "Verify OTP"
//                 )}
//               </Button>
//             </div>
//             <button
//               onClick={() => setMode("login")}
//               className="mt-4 text-primary hover:underline text-sm"
//             >
//               Back to Sign In
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login, verifyOtp, checkAuth } from "@/store/features/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";

export default function AdminLoginPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, isTokenChecked } = useSelector((state) => state.auth);

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
      router.push("/admin/dashboard");
    }
  }, [isTokenChecked, isAuthenticated, router]);

  useEffect(() => {
    let countdown;
    if ((mode === "otp" || mode === "reset-otp") && otpSent) {
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
      setError("Please enter a valid email and password");
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

  const handleResetEmailSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    setIsLoading(true);
    try {
      // Hypothetical Redux action for sending reset OTP
      const response = await dispatch({ type: "auth/requestResetOtp", payload: { email } }).unwrap();
      if (response.message === "OTP sent successfully") {
        setError("");
        setOtpSent(true);
        setMode("reset-otp");
        setOtp(Array(6).fill(""));
        setOtpError("");
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err?.message || "Failed to send OTP");
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
      if (mode === "otp") {
        const response = await dispatch(verifyOtp({ email, otp: otpValue })).unwrap();
        if (response.message === "Login successful") {
          toast({ title: "Success", description: "Login successful!" });
          setMode("login");
          setEmail("");
          setPassword("");
          router.push("/admin/dashboard");
        } else {
          setOtpError("Invalid OTP. Please try again.");
          setOtp(Array(6).fill(""));
        }
      } else if (mode === "reset-otp") {
        // Hypothetical Redux action for verifying reset OTP
        const response = await dispatch({ type: "auth/verifyResetOtp", payload: { email, otp: otpValue } }).unwrap();
        if (response.message === "OTP verified") {
          setOtpError("");
          setMode("reset-password");
          setOtp(Array(6).fill(""));
        } else {
          setOtpError("Invalid OTP. Please try again.");
          setOtp(Array(6).fill(""));
        }
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
      const action = mode === "otp" ? login({ email, password }) : { type: "auth/requestResetOtp", payload: { email } };
      const response = await dispatch(action).unwrap();
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

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    setIsLoading(true);
    try {
      // Hypothetical Redux action for resetting password
      const response = await dispatch({ type: "auth/resetPassword", payload: { email, password: newPassword } }).unwrap();
      if (response.message === "Password reset successful") {
        toast({ title: "Success", description: "Password reset successful!" });
        setMode("login");
        setEmail("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
      } else {
        setError(response.message || "Failed to reset password");
      }
    } catch (err) {
      setError(err?.message || "Failed to reset password");
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

  const renderOtpInputs = (otpArray, handleChange, handleKeyDown, idPrefix) => (
    <div className="flex justify-center space-x-2 mb-6">
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
          className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20"
          autoFocus={index === 0}
          disabled={isLoading}
        />
      ))}
    </div>
  );

  if (isCheckingAuth || (isTokenChecked && isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex pb-8 lg:h-screen lg:pb-0">
      <div className="hidden w-1/2 bg-gray-100 lg:block">
        <Image
          src="/images/cover.png"
          alt="Admin panel visual"
          fill
          className="h-full w-full object-cover"
          priority
        />
      </div>

      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="w-full max-w-md space-y-8 px-4 sm:px-6">
          {mode === "login" && (
            <>
              <div className="text-center">
                <h2 className="mt-6 text-3xl font-bold text-gray-900">
                  Admin Panel
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Sign in to manage your platform
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="w-5 h-5" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLoginSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="sr-only">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                      className="w-full h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      placeholder="Email address"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="relative">
                    <Label htmlFor="password" className="sr-only">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      className="w-full h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-primary/20 focus:outline-none pr-10"
                      placeholder="Password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="text-end">
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setEmail("");
                        setPassword("");
                        setMode("reset-email");
                      }}
                      className="ml-auto inline-block text-sm underline text-primary hover:text-primary/80"
                      disabled={isLoading}
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 font-semibold"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Sending OTP...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}

          {mode === "reset-email" && (
            <>
              <div className="text-center">
                <h2 className="mt-6 text-3xl font-bold text-gray-900">
                  Reset Password
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Enter your email to receive a verification code
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="w-5 h-5" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleResetEmailSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="sr-only">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                      className="w-full h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      placeholder="Email address"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 font-semibold"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Sending OTP...
                      </div>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </div>
              </form>
              <button
                onClick={() => {
                  setError("");
                  setEmail("");
                  setMode("login");
                }}
                className="mt-4 text-sm text-primary hover:underline"
                disabled={isLoading}
              >
                Back to Sign In
              </button>
            </>
          )}

          {mode === "reset-otp" && (
            <>
              <div className="text-center">
                <h2 className="mt-6 text-3xl font-bold text-gray-900">
                  Verify OTP
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-semibold text-primary">
                    {maskEmail(email)}
                  </span>
                </p>
              </div>

              {otpError && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="w-5 h-5" />
                  <AlertDescription>{otpError}</AlertDescription>
                </Alert>
              )}

              {renderOtpInputs(otp, handleOtpChange, handleOtpKeyDown, "otp")}

              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                <Button
                  variant="outline"
                  disabled={isResendDisabled || isLoading}
                  onClick={handleResendOtp}
                  className="w-full sm:w-auto"
                >
                  {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
                </Button>
                <Button
                  onClick={handleOtpSubmit}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Verifying...
                    </div>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </div>
              <button
                onClick={() => {
                  setError("");
                  setOtp(Array(6).fill(""));
                  setOtpError("");
                  setMode("reset-email");
                }}
                className="mt-4 text-sm text-primary hover:underline"
                disabled={isLoading}
              >
                Back
              </button>
            </>
          )}

          {mode === "reset-password" && (
            <>
              <div className="text-center">
                <h2 className="mt-6 text-3xl font-bold text-gray-900">
                  Set New Password
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Enter your new password
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="w-5 h-5" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleResetPasswordSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Label htmlFor="new-password" className="sr-only">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      name="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      className="w-full h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-primary/20 focus:outline-none pr-10"
                      placeholder="New Password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="relative">
                    <Label htmlFor="confirm-password" className="sr-only">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      className="w-full h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-primary/20 focus:outline-none pr-10"
                      placeholder="Confirm Password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 font-semibold"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Changing Password...
                      </div>
                    ) : (
                      "Change"
                    )}
                  </Button>
                </div>
              </form>
              <button
                onClick={() => {
                  setError("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setMode("login");
                }}
                className="mt-4 text-sm text-primary hover:underline"
                disabled={isLoading}
              >
                Back to Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}