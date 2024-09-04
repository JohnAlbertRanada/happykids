"use client";

import Image from "next/image";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import { PiEye, PiEyeClosed } from "react-icons/pi";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("user_id")) {
      router.replace("/");
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = (email, password) => {
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
      });
  };
  return (
    <div className="w-full h-dvh bg-cover bg-center bg-[url('/images/background_image.jpg')] flex flex-col">
      <nav className="flex flex-row justify-between items-center w-full pr-10">
        <div className="sm:size-40 size-28 relative">
          <Image
            src="/images/logo.png"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>
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
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-10 px-5 h-12 text-black bg-transparent rounded w-80 outline-none border border-black placeholder:text-black focus:border-cyan-500"
        />

        <div className="w-80 relative h-12 my-5 ">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-5 h-12 text-black bg-transparent rounded w-full outline-none border border-black placeholder:text-black focus:border-cyan-500"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowPassword((prev) => !prev);
            }}
            className="absolute bottom-0 right-0 z-10 h-12 px-2 flex justify-center items-center"
          >
            {showPassword ? <PiEye size={15} color="black" /> : <PiEyeClosed size={15} color="black" />}
          </button>
        </div>
        <button className="bg-transparent text-gray-500 outline-none text-sm mb-2 text-start">
          Forgot Password?
        </button>
        <button
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
