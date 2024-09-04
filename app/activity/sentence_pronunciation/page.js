"use client";

import Image from "next/image";
import { useEffect, useState } from 'react';
import { auth, db } from '@/app/firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useRouter } from "next/navigation";

export default function SentencePronunciation() {

  const router = useRouter()

  const [sentences, setSentences] = useState([]);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (sentence) => {
  //     setSentences(sentence);
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    fetchData()
  },[])

  const fetchData = async () => {
    const wordRef = collection(db, "sentence_pronunciation");
    const q = query(wordRef, orderBy("level", "asc"));

    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    setSentences(result)
  };

  const goToSentence = (id) => {
    router.push(`/activity/sentence_pronunciation/${id}`)
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
    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 sm:max-h-[calc(100%_-_210px)] max-h-[calc(100%_-_180px)] sm:w-[calc(100%_-_80px)] w-[calc(100%_-_40px)] sm:mx-10 mx-5 overflow-y-scroll">
      {sentences?.map((sentence, index) => {
        return <button key={index} onClick={() => goToSentence(sentence.id)} className="w-full bg-[#766A6A] rounded flex justify-center items-center h-16">
          <p className="text-white text-lg">{sentence.word}</p>
        </button>
      })}
    </div>
  </div>;
}
