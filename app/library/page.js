"use client";

import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PiSpeakerSimpleHighFill, PiUser } from "react-icons/pi";
import { db } from "../firebase";

export default function Library() {

  const router = useRouter();

  const [user, setUser] = useState(null)

  useEffect(() => {
    init()
  },[])

  async function init() {
    const userId = localStorage.getItem("user_id");

    const userRef = doc(db, "users", userId);

    // Fetch the document from Firestore
    const userSnap = await getDoc(userRef);
    console.log(userSnap.data());
    setUser(userSnap.data());
  }

  const playAudio = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

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
      <p className="font-semibold text-3xl ml-10 my-5 text-white">Library</p>
      <div className="flex flex-row flex-wrap justify-center sm:max-h-[calc(100%_-_210px)] max-h-[calc(100%_-_180px)] sm:w-[calc(100%_-_80px)] w-[calc(100%_-_40px)] sm:mx-10 mx-5 sm:space-x-3 space-x-0 overflow-y-scroll">
        <div className="flex flex-col p-5 my-3 text-xs outline-none lg:w-[calc(33%_-_24px)] md:w-[calc(50%_-_24px)] w-[calc(100%_-_24px)] border-none rounded bg-[#d9d9d9]">
          <p className="text-gray-600 text-xl font-bold tracking-wider text-start">
            Vocabulary
          </p>
          <p className="text-gray-800 font-bold sm:text-3xl text-2xl mt-5">mouth</p>
          <p className="text-gray-600 font-semibold text-sm mb-5">/maʊθ/</p>
          <button className="p-2 rounded-full bg-[#766A6A] w-fit h-fit mb-5" onClick={() => playAudio("mouth")}>
            <PiSpeakerSimpleHighFill size="20" />
          </button>
          <button onClick={() => router.push("library/vocabulary")} className="bg-[#766A6A] text-white h-10 px-5 rounded mt-auto">
            Start Learning
          </button>
        </div>
        <div className="flex flex-col p-5 my-3 text-xs outline-none lg:w-[calc(33%_-_24px)] md:w-[calc(50%_-_24px)] w-[calc(100%_-_24px)] border-none rounded bg-[#d9d9d9]">
          <p className="text-gray-600 text-xl font-bold tracking-wider text-start">
            Sentence Practice
          </p>
          <p className="text-gray-800 font-bold sm:text-3xl text-2xl mt-5">
            The bag is color red.
          </p>
          <p className="text-gray-600 font-semibold text-sm mb-5">
            /ðə bæɡ ɪz ˈkʌlər rɛd/
          </p>
          <button className="p-2 rounded-full bg-[#766A6A] w-fit h-fit mb-5" onClick={() => playAudio("The bag is color red.")}>
            <PiSpeakerSimpleHighFill size="20" />
          </button>
          <button className="bg-[#766A6A] text-white h-10 px-5 mt-auto rounded" onClick={() => router.push("library/sentence_practice")}>
            Start Learning
          </button>
        </div>
        <div className="flex flex-col p-5 my-3 text-xs outline-none lg:w-[calc(33%_-_24px)] md:w-[calc(50%_-_24px)] w-[calc(100%_-_24px)] border-none rounded bg-[#d9d9d9]">
          <p className="text-gray-600 text-xl font-bold tracking-wider text-start">
            Conversation
          </p>
          <div className="flex flex-row my-5">
            <div className="relative flex justify-center items-center size-10 rounded-full bg-white border border-black">
              <PiUser size={25} color="black" />
              <button className="absolute -bottom-2 -right-2 z-10 p-2 rounded-full bg-[#766A6A] w-fit h-fit" onClick={() => playAudio("Is it a banana?")}>
                <PiSpeakerSimpleHighFill size={10} />
              </button>
            </div>
            <div className="border border-gray-500 rounded p-2 ml-5">
              <p className="text-black sm:text-xl text-lg">Is it a banana?</p>
            </div>
          </div>
          <div className="flex flex-row w-full justify-end mb-5">
            <div className="border border-gray-500 rounded p-2 mr-5">
              <p className="text-black sm:text-xl text-lg">No, it isn't. It's an apple.</p>
            </div>
            <div className="relative flex justify-center items-center size-10 rounded-full bg-white border border-black">
              <PiUser size={25} color="black" />
              <button className="absolute -bottom-2 -right-2 z-10 p-2 rounded-full bg-[#766A6A] w-fit h-fit" onClick={() => playAudio("No, it isn't. It's an apple.")}>
                <PiSpeakerSimpleHighFill size={10} />
              </button>
            </div>
          </div>
          <button className="bg-[#766A6A] text-white h-10 px-5 mt-auto rounded" onClick={() => router.push('/library/conversation')}>
            Start Learning
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-evenly items-start w-full h-20 fixed bottom-0 left-0">
        <button className="size-14 relative" onClick={() => router.push('/')}>
          <Image
            src="/images/home.png"
            alt="Home"
            fill
            className="object-contain"
          />
        </button>
        <button className="size-14 relative">
          <Image
            src="/images/book-active.png"
            alt="Library"
            fill
            className="object-contain"
          />
        </button>
        <button className="size-14 relative" onClick={() => router.push('/activity')}>
          <Image
            src="/images/search.png"
            alt="Activity"
            fill
            className="object-contain"
          />
        </button>
        <button className="size-14 relative" onClick={() => router.push('/profile')}>
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
