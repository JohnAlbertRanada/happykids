"use client";

import { useState } from "react";
import Image from "next/image";
import { PiEye, PiEyeClosed, PiUserBold } from "react-icons/pi";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  
  const router  = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function login(email, password) {
    setErrorMessage("")
    if(email === "happykid@gmail.com" && password === "SanGregorio") {
      localStorage.setItem("admin_uid", "95af4d25-a8a9-4527-a4dc-d69f4cea0400");
      router.replace("/admn/");
    } else {
      setErrorMessage("The email or password is incorrect");
    }
  }

  return (
    <div className="w-full h-dvh bg-cover bg-center bg-opacity-80 bg-[url('/images/background_image_v2.png')] flex flex-col justify-center bg-black relative">
      <form
        action=""
        className="flex flex-col justify-center mx-auto p-5 rounded max-w-fit max-h-fit"
      >
        <div className="sm:size-28 size-20 relative self-center">
          <Image
            src="/images/logo-v2.png"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex flex-row items-center justify-center sm:space-x-3 space-x-1">
          <p className="sm:text-2xl text-base text-white font-bold">Admin</p>
          <PiUserBold size={30} />
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
