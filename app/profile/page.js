"use client";

import "chart.js/auto";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Radar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth, db } from "@/app/firebase.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { PiPenBold, PiPencilBold, PiX, PiXBold } from "react-icons/pi";

export default function Profile() {
  const router = useRouter();

  const characters = [
    {
      stars: 0,
      image: "/images/level_1.jpg",
    },
    {
      stars: 0,
      image: "/images/level_2.jpg",
    },
    {
      stars: 0,
      image: "/images/level_3.jpg",
    },
    {
      stars: 0,
      image: "/images/level_4.jpg",
    },
    {
      stars: 0,
      image: "/images/level_5.jpg",
    },
    {
      stars: 0,
      image: "/images/level_6.jpg",
    },
    {
      stars: 0,
      image: "/images/level_7.jpg",
    },
    {
      stars: 0,
      image: "/images/level_8.jpg",
    },
    {
      stars: 0,
      image: "/images/level_9.jpg",
    },
    {
      stars: 0,
      image: "/images/level_10.jpg",
    },
  ];
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        console.log("User logged in (auth state changed):", user.email);
      } else {
        // No user is logged in
        console.log("No user is logged in (auth state changed).");
      }
    });
  }, []);

  async function init() {
    const userId = localStorage.getItem("user_id");

    if (!localStorage.getItem("user_id")) {
      router.replace("/login");
    }

    console.log(userId);
    const docRef = doc(db, "users", userId);

    // Fetch the document from Firestore
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    setUser(docSnap.data());
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

  async function logout() {
    signOut(auth)
      .then(() => {
        // User successfully signed out
        alert("You have been logged out successfully.");
        console.log("User logged out successfully.");
        // Optionally redirect the user to a login or home page
        localStorage.removeItem("user_id");
        router.replace("/login");
      })
      .catch((error) => {
        // Handle errors if sign-out fails
        console.error("Error logging out:", error);
        alert("Error logging out: " + error.message);
      });
  }

  return (
    <div className="w-full h-dvh bg-cover bg-center bg-[url('/images/background_image_v2.png')] flex flex-col relative bg-black">
      {showModal && <div className="absolute top-0 left-0 w-full h-full z-50 flex justify-center items-center bg-black bg-opacity-50">
        <div className="bg-white p-5 rounded drop-shadow w-[calc(100%_-_120px)] sm:max-h-[calc(100%_-_210px)] max-h-[calc(100%_-_180px)] lg:w-[calc(50%_-_56px)]">
          <div className="flex flex-row justify-between items-center">
            <p className="text-3xl font-bold text-[#766A6A]">Characters</p>
            <button className="m-0 p-0 outline-none border-none" onClick={() => setShowModal(false)}>
              <PiXBold size={20} color="#766A6A" />
            </button>
          </div>
          <div className="flex flex-row flex-wrap gap-5 w-full justify-center items-center mt-5">
            {characters.map((character) => {
              return (
                <div className="size-[calc(w-[100%_*_.20])] flex flex-col">
                  <div className="sm:size-24 size-16 relative">
                    <Image
                      src={character.image}
                      alt="Character"
                      fill
                      className="object-contain rounded-full"
                    />
                  </div>
                  <div className="flex flex-row justify-center items-center w-full space-x-2">
                    <p className="text-black font-bold text-lg">
                      {character.stars}
                    </p>
                    <div className="size-8 relative">
                      <Image
                        src="/images/star.png"
                        alt="Star"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>}
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
          <p className="sm:text-3xl text-base text-white font-bold">
            {user?.stars ?? 0}
          </p>
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
            <div className="size-20 relative group">
              <Image
                src={user?.currentImage}
                alt="Profile Pic"
                fill
                className="object-cover rounded-full"
              />
              <button className="justify-center items-center group-hover:flex hidden absolute top-0 left-0 z-10 w-full h-full bg-black bg-opacity-50 rounded-full outline-none border-none" onClick={() => setShowModal(true)}>
                <PiPencilBold size={20} />
              </button>
            </div>
            <div className="flex flex-col items-start">
              <div className="p-1 my-1 text-sm outline-none border-none w-fit bg-[#766A6A]">
                <p className="text-white">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              {/* <button className="p-1 my-1 text-sm outline-none border-none w-fit bg-[#766A6A]">
                <p className="text-white">Edit your Profile</p>
              </button> */}
              <button
                onClick={() => logout()}
                className="p-1 my-1 text-xs outline-none border-none w-fit bg-[#766A6A]"
              >
                <p className="text-white">Logout</p>
              </button>
            </div>
          </div>
          <div className="flex flex-col bg-[#766A6A] p-3 my-2">
            {/* <button className="p-1 my-1 outline-none border-none bg-[#d9d9d9]">
              <p className="text-gray-600">Learning and Sound Settings</p>
            </button> */}
            <button
              className="p-1 my-1 outline-none border-none bg-[#d9d9d9]"
              onClick={() => router.push("/change_password")}
            >
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
        <button className="size-14 relative" onClick={() => router.push("/")}>
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
