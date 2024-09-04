"use client";

import Image from "next/image";
import { useEffect, useState } from 'react';
import { auth, db } from '@/app/firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useRouter } from "next/navigation";

export default function WordPronunciation() {

  const router = useRouter()

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
    fetchData()
  },[])

  const fetchData = async () => {
    const wordRef = collection(db, "word_pronunciation");
    const q = query(wordRef, orderBy("level", "asc"));

    const querySnapshot = await getDocs(q);
    console.log(querySnapshot)
    const result = querySnapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    setWords(result)
  };

  const goToWord = (id) => {
    router.push(`/activity/word_pronunciation/${id}`)
  }

  return <div className="w-full h-dvh bg-cover bg-center bg-[url('/images/background_image.jpg')] flex flex-col relative">
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
    <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 sm:max-h-[calc(100%_-_210px)] max-h-[calc(100%_-_180px)] sm:w-[calc(100%_-_80px)] w-[calc(100%_-_40px)] sm:mx-10 mx-5 overflow-y-scroll">
      {words?.map((word, index) => {
        return <button key={index} onClick={() => goToWord(word.id)} className="w-full bg-[#766A6A] rounded flex justify-center items-center h-16">
          <p className="text-white text-lg">{word.word}</p>
        </button>
      })}
    </div>
  </div>;
}
