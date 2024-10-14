"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {useState, useEffect} from "react";
import { auth, db } from "@/app/firebase.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState({})
  const [lastLesson, setLastLesson] = useState({})

  useEffect(() => {
    init()
  },[])

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        console.log("User logged in (auth state changed):", user);
      } else {
        // No user is logged in
        console.log("No user is logged in (auth state changed).");
      }
    });
  },[])

  async function init() {
    const userId = localStorage.getItem("user_id")

    if(!localStorage.getItem("user_id")) {
      router.replace("/login")
    }

    console.log(userId)
    const docRef = doc(db, "users", userId);

    // Fetch the document from Firestore
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    setUser(docSnap.data())
  }

  return (
    <div className="w-full h-dvh bg-cover bg-center bg-[url('/images/background_image_v2.png')] flex flex-col relative bg-black">
      <nav className="flex flex-row justify-between items-center w-full sm:px-10 px-5 mt-2">
        <div className="sm:size-28 size-20 relative">
          <Image
            src="/images/logo-v2.png"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex flex-row items-center sm:space-x-3 space-x-1">
          <p className="sm:text-3xl text-base text-white font-bold">{user?.stars ?? 0}</p>
          <div className="sm:size-14 size-10 relative">
            <Image
              src="/images/star.png"
              alt="Star"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </nav>
      <div className="flex flex-col sm:max-h-[calc(100%_-_210px)] max-h-[calc(100%_-_180px)] sm:w-[calc(100%_-_80px)] w-[calc(100%_-_40px)] sm:mx-10 mx-5 overflow-y-scroll">
        <h1 className="text-white sm:text-2xl text-lg font-bold">Welcome back,</h1>
        <p className="sm:text-lg text-sm text-white">{user?.firstName} {user?.lastName}</p>
        <div className="flex flex-row my-5 justify-evenly flex-wrap">
          <div className="flex flex-col my-5">
            <p className="sm:text-lg text-base font-bold text-white">You have learned</p>
            <div className="flex flex-row space-x-1 mt-5">
              <div className="sm:h-24 sm:w-28 h-20 w-24 rounded bg-[#d9d9d9] flex flex-col justify-center items-center">
                <p className="text-black text-sm">Vocabulary</p>
                <p className="text-black font-bold text-2xl">0</p>
              </div>
              <div className="sm:h-24 sm:w-28 h-20 w-24 rounded bg-[#d9d9d9] flex flex-col justify-center items-center">
                <p className="text-black text-sm">Sentence</p>
                <p className="text-black font-bold text-2xl">0</p>
              </div>
              <div className="sm:h-24 sm:w-28 h-20 w-24 rounded bg-[#d9d9d9] flex flex-col justify-center items-center">
                <p className="text-black text-sm">Conversation</p>
                <p className="text-black font-bold text-2xl">0</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col my-5">
            <p className="sm:text-lg text-base font-bold text-white">Last Lesson</p>
            <div className="bg-[#d9d9d9] p-2 sm:w-80 w-64 rounded flex flex-col mt-5">
              <p className="text-gray-500 font-bold sm:text-xl text-base italic">
                Vocabulary (mouth)
              </p>
              <button className="bg-[#766A6A] text-white text-xs h-10 px-5 mt-3 rounded">
                Continue Learning
              </button>
            </div>
          </div>
          <div className="flex flex-col my-5">
            <p className="sm:text-lg text-base font-bold text-white">Last Activity</p>
            <div className="bg-[#d9d9d9] p-2 sm:w-80 w-64 rounded flex flex-col mt-5">
              <p className="text-gray-500 font-bold sm:text-xl text-base italic">
                Scripted Speech (mouth)
              </p>
              <button className="bg-[#766A6A] text-white text-xs h-10 px-5 mt-3 rounded">
                Continue Activity
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-evenly items-start w-full h-20 fixed bottom-0 left-0">
        <button className="size-14 relative">
          <Image
            src="/images/home-active.png"
            alt="Home"
            fill
            className="object-contain"
          />
        </button>
        <button
          className="size-14 relative"
          onClick={() => router.push("/library")}
        >
          <Image
            src="/images/book.png"
            alt="Library"
            fill
            className="object-contain"
          />
        </button>
        <button
          className="size-14 relative"
          onClick={() => router.push("/activity")}
        >
          <Image
            src="/images/search.png"
            alt="Activity"
            fill
            className="object-contain"
          />
        </button>
        <button
          className="size-14 relative"
          onClick={() => router.push("/profile")}
        >
          <Image
            src="/images/profile.png"
            alt="Profile"
            fill
            className="object-contain"
          />
        </button>
      </div>
    </div>
  );
}
