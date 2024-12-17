"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { auth, db } from "@/app/firebase.js";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  PiCaretCircleLeftBold,
  PiEar,
  PiMicrophone,
  PiSpeakerHighFill,
  PiStarFill,
} from "react-icons/pi";

export default function VocabularyItem() {
  const router = useRouter();
  const params = useParams();
  console.log(params);
  const { id } = params;

  const audioRef = useRef(null);

  const playAudio = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setAudioPlayed(true);
    };
    speechSynthesis.speak(utterance);
  };

  const [word, setWord] = useState(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init(id);
  }, []);

  async function init(id) {
    const userId = localStorage.getItem("user_id");

    const userRef = doc(db, "users", userId);

    // Fetch the document from Firestore
    const userSnap = await getDoc(userRef);
    console.log(userSnap.data());
    setUser(userSnap.data());

    const docRef = doc(db, "vocabulary", id);

    // Fetch the document from Firestore
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());

    setWord(docSnap.data());
    setLoading(false);
  }

  async function wordDone() {
    const userId = localStorage.getItem("user_id");
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, {
      currentVocabulary: {
        level: Number(word.level + 1),
        started: new Date(),
      },
      stars: Number(user.stars + word.star),
    });
    router.replace("/library/vocabulary");
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
      <div className="flex justify-center items-center sm:h-[calc(100%_-_180px)] h-[calc(100%_-_150px)] sm:w-[calc(100%_-_80px)] w-[calc(100%_-_40px)] sm:mx-10 mx-5 pt-5 overflow-y-scroll">
        {loading ? (
          <div className="flex flex-col h-full w-[calc(100%_-_20px)] rounded p-5 bg-[#d9d9d9]">
            <div className="flex flex-row w-full items-center">
                <PiCaretCircleLeftBold
                  color="black"
                  size={35}
                  onClick={() => router.back()}
                />
                <p className="sm:text-2xl text-lg text-black font-semibold ml-2">
                  Library - Vocabulary
                </p>
              </div>
            <div className="flex flex-1 justify-center items-center">
              <p className="animate-bounce text-3xl text-black">Loading ...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full w-[calc(100%_-_20px)] rounded p-5 bg-[#d9d9d9]">
            <div className="flex flex-row w-full items-center justify-between">
              <div className="flex flex-row w-full items-center">
                <PiCaretCircleLeftBold
                  color="black"
                  size={35}
                  onClick={() => router.back()}
                />
                <p className="sm:text-2xl text-lg text-black font-semibold ml-2">
                  Library - Vocabulary
                </p>
              </div>
              {audioPlayed && (
                <button
                  className="rounded bg-[#766A6A] text-white p-2"
                  onClick={() => wordDone()}
                >
                  DONE
                </button>
              )}
            </div>
            <div className="flex flex-row w-full mt-5">
              <div className="flex flex-col flex-1 justify-center items-center">
                <p className="text-black md:text-5xl text-4xl font-bold text-center mb-2">
                  {word?.word}
                </p>
                <p className="text-black text-xl font-medium text-center">
                  Pronunciation: <b>{word?.pronunciation}</b>
                </p>
                <p className="text-black text-2xl font-medium text-center">
                  In Tagalog: <b>{word?.tagalog}</b>
                </p>
                <p className="text-black text-2xl font-medium text-center italic mt-2">
                  {word?.description}
                </p>
                <div className="flex flex-row mt-5 text-5xl text-black items-center">
                  {word?.star} <PiStarFill color="yellow" className="ml-2" />
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2 flex-grow w-full justify-center items-center">
              <button
                onClick={() => playAudio(word?.word)}
                className="outline-none flex justify-center items-center md:size-20 size-16 rounded-full bg-[#766A6A]"
              >
                <PiSpeakerHighFill size={40} color="white" />
              </button>
              <p className="text-lg text-gray-800">Click to play sound</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
