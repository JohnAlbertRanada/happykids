"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { auth, db } from "@/app/firebase.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { PiEar, PiMicrophone, PiSpeakerHighFill } from "react-icons/pi";

export default function VocabularyItem() {
  const params = useParams();
  console.log(params);
  const { id } = params;

  const audioRef = useRef(null);

  const playAudio = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const [word, setWord] = useState(null);

  useEffect(() => {
    init(id);
  }, []);

  async function init(id) {
    const docRef = doc(db, "word_pronunciation", id);

    // Fetch the document from Firestore
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());

    setWord(docSnap.data());
  }

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
          <p className="sm:text-3xl text-base text-white font-bold">0</p>
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
      <div className="flex justify-center items-center sm:h-[calc(100%_-_180px)] h-[calc(100%_-_150px)] sm:w-[calc(100%_-_80px)] w-[calc(100%_-_40px)] sm:mx-10 mx-5 overflow-y-scroll">
        <div className="flex flex-col h-full w-[calc(100%_-_20px)] rounded p-5 bg-[#d9d9d9]">
          <p className="sm:text-2xl text-lg text-black font-semibold">
            Vocabulary
          </p>
          <div className="flex flex-row w-full mt-5">
            <div className="flex flex-col flex-1 justify-center items-center">
              <p className="text-black md:text-5xl text-3xl font-bold text-center mb-2">
                {word?.word}
              </p>
              <p className="text-black text-2xl font-medium text-center">
                {word?.pronunciation}
              </p>
            </div>
          </div>
          <div className="flex flex-col space-y-2 flex-grow w-full justify-center items-center">
            <button onClick={() => playAudio(word?.word)} className="outline-none flex justify-center items-center md:size-20 size-16 rounded-full bg-[#766A6A]">
              <PiSpeakerHighFill size={40} color="white" />
            </button>
            <p className="text-lg text-gray-800">Click to play sound</p>
          </div>
        </div>
      </div>
    </div>
  );
}
