"use client";
import { useState } from "react";
import { useStudents } from "@/hooks/useStudents";
import { Mail, Lock, Eye, EyeClosed, ArrowRight } from "lucide-react"; 

export default function Login() {
  const [user, setUser] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });
  const { loginSubmit } = useStudents();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 font-sans text-[#111111] antialiased selection:bg-[#ffdad4] selection:text-[#090100] relative overflow-hidden bg-[#fff8f6]">
      
      <div className="fixed inset-0 -z-10 bg-linear-to-br from-[#d00000] via-[#d50000] to-[#c30000]" />

      
      <main className="w-full max-w-240 bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden relative z-10 transition-transform duration-500 hover:scale-[1.01]">
        
        <div className="hidden lg:flex w-1/2 bg-neutral-100/50 p-8 flex-col items-center justify-center border-r border-neutral-200/50">
          <img
            src="/images/login.png"
            alt="Premium education illustration"
            width={400}
            height={400}
            loading="lazy"
            className="w-full h-auto object-cover max-w-100px drop-shadow-2xl mix-blend-multiply"
          />
          <div className="mt-8 text-center px-6">
            <h3 className="text-xl font-semibold text-[#111111] mb-2">
              Elevate Your Learning
            </h3>
            <p className="text-sm text-[#666666]">
              Access premium courses, interactive modules, and expert-led
              tutorials.
            </p>
          </div>
        </div>

        {/* Mobile  */}
        <div className="flex lg:hidden w-full h-[200px] bg-neutral-100/50 p-4 justify-center items-center border-b border-neutral-200/50">
          <img
            src="/images/login.png"
            alt="Premium education illustration"
            width={300}
            height={200}
            loading="lazy"
            className="h-full w-auto object-contain drop-shadow-lg mix-blend-multiply"
          />
        </div>

        
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
         
          <div className="flex flex-col items-center lg:items-start w-full mb-8 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-[#a20000] mb-4 tracking-tight">
              My Zone Online
            </h1>
            <h2 className="text-[28px] text-[#111111] mb-2 font-semibold">
              Welcome back
            </h2>
            <p className="text-base text-[#666666]">
              Enter your details to access your dashboard.
            </p>
          </div>

          {/* Login Form */}
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={(e) => loginSubmit(e, user.username, user.password)}
          >
            {/* Email Input */}
            <div className="flex flex-col gap-1 group">
              <label
                htmlFor="email"
                className="text-xs font-medium text-[#111111] uppercase tracking-wider ml-1 group-focus-within:text-[#a20000] transition-colors"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[#999999] group-focus-within:text-[#a20000] transition-colors" />
                  
                
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="name@school.edu"
                  required
                  autoComplete="email"
                  
                  onChange={(e) =>
                      setUser((prev) => ({ ...prev, username: e.target.value }))
                    }
                  className="w-full bg-white/80 border border-neutral-300 rounded-2xl pl-10 pr-4 py-2 pb-3 text-base text-[#111111] placeholder:text-[#999999] focus:border-[#a20000] focus:ring-2 focus:ring-[#a20000]/20 transition-all outline-none h-12 shadow-sm"
                />
              </div>
            </div>

            
            <div className="flex flex-col gap-1 relative group">
              <div className="flex justify-between items-center ml-1 mr-1">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-[#111111] uppercase tracking-wider group-focus-within:text-[#a20000] transition-colors"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[#999999] group-focus-within:text-[#a20000] transition-colors" />
                  
                
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  
                  onChange={(e) =>
                      setUser((prev) => ({ ...prev, password: e.target.value }))
                    }
                  className="w-full bg-white/80 border border-neutral-300 rounded-2xl pl-10 pr-10 py-2 text-base text-[#111111] placeholder:text-[#999999] focus:border-[#a20000] focus:ring-2 focus:ring-[#a20000]/20 transition-all outline-none h-12 shadow-sm"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  

                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#111111] transition-colors focus:outline-none"
                >
                  {showPassword ? (<EyeClosed size={20}/>) : (<Eye size={20}/>)}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="peer sr-only"
                />
                <div
                  className={`w-4 h-4 border border-neutral-300 rounded flex items-center justify-center transition-colors ${
                    remember ? "bg-[#a20000] border-[#a20000]" : "bg-white"
                  }`}
                >
                  <svg
                    className={`w-3 h-3 text-white transition-opacity ${
                      remember ? "opacity-100" : "opacity-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                    />
                  </svg>
                </div>
                <span className="text-sm text-[#666666] group-hover:text-[#111111] transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-xs font-medium text-[#666666] hover:text-[#a20000] transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
             

              className="w-full mt-2 h-12 bg-linear-to-b from-[#d00000] via-[#d50000] to-[#c30000] text-white rounded-xl text-base font-semibold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(208,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(208,0,0,0.23)]"
            >
             Sign in
              <ArrowRight className="material-symbols-outlined text-xl" />
          
              
            </button>

            {/* Sign Up Link */}
            <p className="text-sm text-[#666666] text-center mt-1">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="text-[#a20000] font-medium hover:underline underline-offset-4"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}


