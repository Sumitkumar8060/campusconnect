import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  User,
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

export default function SignUpPage() {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    agreedToTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Field validations
  const isFullNameValid = formData.fullName.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPasswordValid = formData.password.length >= 8;
  const doPasswordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword.length > 0;
  const isTermsValid = formData.agreedToTerms === true;

  const fullNameError =
    touched.fullName && !isFullNameValid ? "Please enter your full name." : "";

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
        ? "Password must be at least 8 characters long."
        : "";

  const confirmPasswordError =
    touched.confirmPassword && !formData.confirmPassword
      ? "Please confirm your password."
      : touched.confirmPassword && !doPasswordsMatch
        ? "Passwords do not match."
        : "";

  const termsError =
    touched.agreedToTerms && !isTermsValid
      ? "You must accept the Terms of Service to continue."
      : "";

  const isFormValid =
    isFullNameValid &&
    isEmailValid &&
    isPasswordValid &&
    doPasswordsMatch &&
    isTermsValid;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreedToTerms: true,
    });

    if (!isFormValid) return;

    try {
      setIsLoading(true);
      setStatusMessage(null);

      const response = await register({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setStatusMessage({
        type: "success",
        text: response.message || "Registration successful! Redirecting to dashboard...",
      });

      // Replace registration history entry when redirecting to dashboard
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 700);
    } catch (error) {
      console.error("Registration error:", error);
      setStatusMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Registration failed. Please check your details and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsGoogleLoading(true);
      setStatusMessage(null);

      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await googleLogin(idToken);

      setStatusMessage({
        type: "success",
        text: response.message || "Google registration successful!",
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Google signup error:", error);
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || error.message || "Google registration failed",
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
          {/* Left Panel: Sign Up Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-[#EDEBE6] text-xs font-semibold uppercase tracking-wider text-[#171717] mb-3">
                  New Student Registration
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
                  Join your campus community.
                </h1>
                <p className="mt-2 text-sm text-[#555555]">
                  Create your account and start connecting with fellow students.
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
                  onClick={handleGoogleSignup}
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
                <div className="flex items-center gap-3 mb-5 mt-5">
                  <div className="flex-1 border-t border-[#D5D1C9]" />
                  <span className="text-xs text-[#777777]">OR</span>
                  <div className="flex-1 border-t border-[#D5D1C9]" />
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <AuthInput
                  id="fullName"
                  name="fullName"
                  label="Full Name"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={fullNameError}
                  icon={User}
                  required
                  autoComplete="name"
                />

                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                  <AuthInput
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={emailError}
                    icon={Mail}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PasswordInput
                    id="password"
                    name="password"
                    label="Password"
                    placeholder="Min 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={passwordError}
                    required
                    autoComplete="new-password"
                  />

                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={confirmPasswordError}
                    required
                    autoComplete="new-password"
                  />
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-0.5 h-4 w-4 rounded border-[#D5D1C9] text-[#171717] focus:ring-[#171717] accent-[#171717] cursor-pointer"
                    />
                    <span className="text-xs text-[#555555] leading-normal">
                      I agree to the{" "}
                      <a
                        href="#terms"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Terms of Service: CampusConnect is an exclusive peer platform for students to share services and connect.");
                        }}
                        className="text-[#171717] font-semibold underline underline-offset-2"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#privacy"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Privacy Policy: Your student data is kept private and never sold to third parties.");
                        }}
                        className="text-[#171717] font-semibold underline underline-offset-2"
                      >
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                  {termsError && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {termsError}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className={`w-full mt-4 h-11 inline-flex items-center justify-center rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow-sm ${
                    !isFormValid || isLoading
                      ? "bg-[#171717]/40 cursor-not-allowed"
                      : "bg-[#171717] hover:bg-[#333333] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Navigation Link */}
            <div className="mt-8 pt-6 border-t border-[#D5D1C9]/70 text-center text-xs text-[#555555]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#171717] hover:underline underline-offset-4 cursor-pointer ml-1"
              >
                Log in
              </Link>
            </div>
          </div>

          {/* Right Panel: Lifestyle Image & Campus Message (Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 relative bg-[#171717] text-white p-8 flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 opacity-40">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                alt="Students collaborating together"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/60 to-transparent" />

            <div className="relative z-10 flex justify-end">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-medium text-white/90">
                100% Student Verified
              </span>
            </div>

            <div className="relative z-10 space-y-3">
              <h2 className="text-xl font-bold text-white leading-snug">
                "One single place for roommates, shared rides, second-hand books, and campus buddies."
              </h2>
              <p className="text-xs text-white/70">
                Sign up with your university email to get started.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="py-6 text-center text-xs text-[#777777]">
        © 2026 CampusConnect. All rights reserved.
      </footer>
    </div>
  );
}
