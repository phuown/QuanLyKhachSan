"use client";
import { useState } from "react";
import { SignUp, SignIn } from "@clerk/nextjs";

export default function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
      >
        Book Now
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>

            {isSignUp ? (
              <>
                <SignUp
                  routing="hash"
                  signInUrl="#"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none",
                    },
                  }}
                />
                <p className="text-center mt-4 text-sm text-gray-600">
                  Đã có tài khoản?{" "}
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Đăng nhập
                  </button>
                </p>
              </>
            ) : (
              <>
                <SignIn
                  routing="hash"
                  signUpUrl="#"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none",
                    },
                  }}
                />
                <p className="text-center mt-4 text-sm text-gray-600">
                  Chưa có tài khoản?{" "}
                  <button
                    onClick={() => setIsSignUp(true)}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Đăng ký
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
