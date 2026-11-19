import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Email validation regex
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPasswordValid = formData.password.trim().length >= 6;

  const emailError =
    touched.email && !formData.email
      ? "Email address is required."
      : touched.email && !isEmailValid
        ? "Please enter a valid email address."
        : "";

  const passwordError =
    touched.password && !formData.password
      ? "Password is required."
      : touched.password && !isPasswordValid
        ? "Password must be at least 6 characters."
        : "";

  const isFormValid = isEmailValid && isPasswordValid;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setStatusMessage(null);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const destination = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isFormValid) return;

    try {
      setIsLoading(true);
      setStatusMessage(null);

      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      setStatusMessage({
        type: "success",
        text: response.message || "Login successful!",
      });

      // Replace Login in history so clicking Back doesn't return to /login
      navigate(destination, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setStatusMessage(null);

      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await googleLogin(idToken);

      setStatusMessage({
        type: "success",
        text: response.message || "Google login successful!",
      });

      navigate(destination, { replace: true });
    } catch (error) {
      console.error("Google login error:", error);
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || error.message || "Google login failed",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDEBE6] text-[#171717] flex flex-col justify-between selection:bg-[#171717] selection:text-white">
      {/* Simplified Auth Header */}
      <header className="w-full border-b border-[#D5D1C9]/60 bg-[#EDEBE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 rounded-lg py-1 text-[#171717] hover:opacity-85 transition-opacity duration-200"
          >
            <GraduationCap className="w-7 h-7" strokeWidth={2.2} />
            <span className="text-xl font-bold tracking-tight text-[#171717]">
              CampusConnect
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#555555] hover:text-[#171717] transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden bg-white border border-[#D5D1C9] shadow-xl">
          {/* Left Panel: Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-[#EDEBE6] text-xs font-semibold uppercase tracking-wider text-[#171717] mb-3">
                  Student Portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
                  Welcome back!
                </h1>
                <p className="mt-2 text-sm text-[#555555]">
                  Log in to connect with your campus community.
                </p>
              </div>

              {/* Status Message Banner */}
              {statusMessage && (
                <div
                  className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
                    statusMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {statusMessage.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p>{statusMessage.text}</p>
                </div>
              )}

              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-[#D5D1C9] bg-white text-sm font-semibold text-[#171717] hover:bg-[#F7F6F3] transition-colors disabled:opacity-50"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                  )}
                  Continue with Google
                </button>
                <div className="flex items-center gap-2 mb-8 mt-5">
                  <div className="flex-1 border-t border-[#D5D1C9]" />
                  <span className="text-xs text-[#777777]">OR</span>
                  <div className="flex-1 border-t border-[#D5D1C9]" />
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <AuthInput
                  label="University Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="student@university.edu"
                  icon={Mail}
                  error={emailError}
                  autoComplete="email"
                />

                <PasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  error={passwordError}
                  autoComplete="current-password"
                />

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-[#555555] cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-[#D5D1C9] text-[#171717] focus:ring-[#171717]"
                    />
                    Remember this device
                  </label>
                  <a
                    href="#forgot-password"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Please contact your campus administrator or check your university email for password recovery.");
                    }}
                    className="font-semibold text-[#171717] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full mt-4 h-11 flex items-center justify-center rounded-xl bg-[#171717] text-white text-sm font-semibold transition-all hover:bg-[#333333] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-sm"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Logging in...
                    </span>
                  ) : (
                    "Log in to CampusConnect"
                  )}
                </button>
              </form>
            </div>

            <div className="mt-8 pt-6 border-t border-[#D5D1C9]/50 text-center text-xs text-[#555555]">
              Don't have an account yet?{" "}
              <Link
                to="/signup"
                className="font-bold text-[#171717] hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>

          {/* Right Panel: Value Proposition Artwork */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#171717] p-10 flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60 pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md mb-6 border border-white/10">
                Verified Community
              </span>
              <h2 className="text-2xl font-bold leading-tight">
                One campus, endless shared opportunities.
              </h2>
              <p className="mt-3 text-xs text-[#BBBBBB] leading-relaxed">
                Connect with peers across departments for companion activities, trusted peer rentals, second-hand gear, and collaborative campus initiatives.
              </p>
            </div>

            <div className="relative z-10 pt-10 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-[#E5E5E5] font-medium">
                  Active campus network
                </span>
              </div>
              <p className="text-[11px] text-[#888888]">
                Protected with session security, university email verification, and peer ratings.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-[#777777]">
        CampusConnect Student Platform &bull; Built with student security in mind.
      </footer>
    </div>
  );
}
