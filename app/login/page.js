"use client";

import Image from "next/image";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import { PiEye, PiEyeClosed } from "react-icons/pi";

export default function Login() {
  const router = useRouter();

  // useEffect(() => {
  //   if (localStorage.getItem("user_id")) {
  //     router.replace("/");
  //   }
  // }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const login = (email, password) => {
    setErrorMessage("");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User signed in:", user);
        localStorage.setItem("user_id", user.uid);
        router.replace("/");
        // Redirect or perform further actions after successful login
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing in:", errorCode, errorMessage);
        // Display an error message to the user
        if (errorCode === "auth/invalid-credential") {
          setErrorMessage("The email or password is incorrect");
        } else if (errorCode === "auth/invalid-email") {
          setErrorMessage("Please input a valid email");
        } else if(errorCode === "auth/too-many-requests") {
          setErrorMessage("Too many failed login attempts. Please try again later or try changing/resetting your password.");
        }
      });
  };
  return (
    <div className="w-full h-dvh bg-cover bg-center bg-opacity-80 bg-[url('/images/background_image_v2.png')] flex flex-col bg-black">
      <nav className="flex flex-row justify-end items-center w-full px-10 mt-5">
        <div className="flex flex-row">
          <button
            className="text-lg font-medium text-white bg-lime-600 rounded p-2"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </button>
        </div>
      </nav>
      <form
        action=""
        className="flex flex-col mx-auto p-5 rounded max-w-fit max-h-fit"
      >
        <div className="sm:size-28 size-20 relative self-center">
          <Image
            src="/images/logo-v2.png"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-10 px-5 h-12 text-black rounded w-80 outline-none border-none placeholder:text-black font-medium focus:border-cyan-500"
        />

        <div className="w-80 relative h-12 my-5 ">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-5 h-12 text-black rounded w-full outline-none border-none font-medium placeholder:text-black focus:border-cyan-500"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowPassword((prev) => !prev);
            }}
            className="absolute bottom-0 right-0 z-10 h-12 px-2 flex justify-center items-center"
          >
            {showPassword ? (
              <PiEye size={15} color="black" />
            ) : (
              <PiEyeClosed size={15} color="black" />
            )}
          </button>
        </div>
        <button
          className="bg-transparent text-white outline-none text-sm mb-2 text-start"
          onClick={(e) => {
            e.preventDefault();
            router.push("/forgot_password");
          }}
        >
          Forgot Password?
        </button>
        <p className="text-red-500 mb-2">{errorMessage}</p>
        <button
          disabled={!email || !password}
          onClick={(e) => {
            e.preventDefault();
            login(email, password);
          }}
          className="p-5 rounded bg-cyan-500 text-white font-medium text-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
}
