"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { PiCaretCircleLeftBold } from "react-icons/pi";

export default function WordPronunciation() {
  const router = useRouter();

  // const words = [
  //   {
  //     id: "1",
  //     word: "build"
  //   },
  //   {
  //     id: "2",
  //     word: "drill"
  //   },
  //   {
  //     id: "3",
  //     word: "glasses"
  //   },
  //   {
  //     id: "4",
  //     word: "hammer"
  //   },
  //   {
  //     id: "5",
  //     word: "level"
  //   },
  //   {
  //     id: "6",
  //     word: "measuring"
  //   },
  //   {
  //     id: "7",
  //     word: "nail"
  //   },
  //   {
  //     id: "8",
  //     word: "power"
  //   },
  //   {
  //     id: "9",
  //     word: "repair"
  //   },
  //   {
  //     id: "10",
  //     word: "safety"
  //   },
  //   {
  //     id: "11",
  //     word: "screw"
  //   },
  //   {
  //     id: "12",
  //     word: "tools"
  //   }
  // ]

  const [words, setWords] = useState([]);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (word) => {
  //     setWords(word);
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const wordRef = collection(db, "word_pronunciation");
    const q = query(wordRef, orderBy("level", "asc"));

    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    const result = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    setWords(result);
  };

  const goToWord = (id) => {
    router.push(`/activity/word_pronunciation/${id}`);
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
      <div className="flex flex-row w-full items-center ml-10">
        <PiCaretCircleLeftBold color="white" size={40} onClick={() => router.back()} />
        <p className="text-white text-3xl font-semibold ml-5">
          Activity - Word Pronunciation
        </p>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 sm:max-h-[calc(100%_-_230px)] max-h-[calc(100%_-_2000px)] sm:w-[calc(100%_-_80px)] w-[calc(100%_-_40px)] sm:mx-10 mx-5 mt-5 overflow-y-scroll">
        {words?.map((word, index) => {
          return (
            <button
              key={index}
              onClick={() => goToWord(word.id)}
              className="w-full bg-[#766A6A] rounded flex justify-center items-center h-16"
            >
              <p className="text-white text-lg">{word.word}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
