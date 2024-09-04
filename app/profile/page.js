"use client";

import "chart.js/auto";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Radar } from "react-chartjs-2";
import { useState, useEffect } from "react";

import { auth, db } from "@/app/firebase.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState({})

  useEffect(() => {
    init()
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


  const RadarData = {
    labels: [
      "Finger Strength",
      "Power",
      "Endurance",
      "Stability",
      "Flexability",
    ],
    datasets: [
      {
        label: "March",
        backgroundColor: "rgba(34, 202, 236, .2)",
        borderColor: "rgba(34, 202, 236, 1)",
        pointBackgroundColor: "rgba(34, 202, 236, 1)",
        poingBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(34, 202, 236, 1)",
        data: [13, 10, 12, 6, 5],
      },
    ],
  };

  const RadarOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scale: {
      ticks: {
        min: 0,
        max: 16,
        stepSize: 2,
        showLabelBackdrop: false,
        backdropColor: "rgba(203, 197, 11, 1)",
      },
      angleLines: {
        color: "rgba(255, 255, 255, .3)",
        lineWidth: 1,
      },
      gridLines: {
        color: "rgba(255, 255, 255, .3)",
        circular: true,
      },
    },
  };

  return (
    <div className="w-full h-dvh bg-cover bg-center bg-[url('/images/background_image.jpg')] flex flex-col relative">
      <nav className="flex flex-row justify-between items-center w-full sm:pr-10 pr-5">
        <div className="sm:size-32 size-24 relative">
          <Image
            src="/images/logo.png"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex flex-row items-center sm:space-x-3 space-x-1">
          <p className="sm:text-3xl text-base text-white font-bold">{user?.stars}</p>
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
      <div className="flex flex-row flex-wrap w-[calc(100%_-_80px)] sm:max-h-[calc(100%_-_210px)] max-h-[calc(100%_-_180px)] mx-10 justify-evenly items-center overflow-y-scroll">
        <div className="flex flex-col lg:w-[calc(50%_-_16px)] w-[calc(100%_-_16px)] lg:my-0 my-3 mx-2 p-5 bg-[#d9d9d9] lg:h-full max-h-fit">
          <div className="flex flex-row items-center space-x-5">
            <div className="size-20 relative">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/enhancing-english-learning.appspot.com/o/level_2.webp?alt=media&token=34927a2e-6f03-456b-83b8-8d4b48a14368"
                alt="Profile Pic"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col items-start">
              <div className="p-1 my-1 text-sm outline-none border-none w-fit bg-[#766A6A]">
                <p className="text-white">{user?.firstName} {user?.lastName}</p>
              </div>
              <button className="p-1 my-1 text-sm outline-none border-none w-fit bg-[#766A6A]">
                <p className="text-white">Edit your Profile</p>
              </button>
              <button onClick={() => {
                localStorage.removeItem("user_id")
                router.replace("/login")
              }} className="p-1 my-1 text-xs outline-none border-none w-fit bg-[#766A6A]">
                <p className="text-white">Logout</p>
              </button>
            </div>
          </div>
          <div className="flex flex-col bg-[#766A6A] p-3 my-2">
            <button className="p-1 my-1 outline-none border-none bg-[#d9d9d9]">
              <p className="text-gray-600">Learning and Sound Settings</p>
            </button>
            <button className="p-1 my-1 outline-none border-none bg-[#d9d9d9]">
              <p className="text-gray-600">Change Password</p>
            </button>
            <button className="p-1 my-1 outline-none border-none bg-[#d9d9d9]">
              <p className="text-gray-600">Terms of Use</p>
            </button>
            <button className="p-1 my-1 outline-none border-none bg-[#d9d9d9]">
              <p className="text-gray-600">Policy</p>
            </button>
          </div>
        </div>
        {/* <div className="flex justify-center items-center lg:w-[calc(50%_-_16px)] w-[calc(100%_-_16px)] md:my-0 my-2 mx-2 p-5 bg-[#d9d9d9] lg:h-full max-h-fit">
          <Radar data={RadarData} options={RadarOptions} />
        </div> */}
      </div>
      <div className="flex flex-row justify-evenly items-start w-full h-20 fixed bottom-0 left-0">
        <button
          className="size-14 relative"
          onClick={() => router.push("/")}
        >
          <Image
            src="/images/home.png"
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
        <button className="size-14 relative">
          <Image
            src="/images/profile-active.png"
            alt="Profile"
            fill
            className="object-contain"
          />
        </button>
      </div>
    </div>
  );
}
