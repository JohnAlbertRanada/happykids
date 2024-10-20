"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { PiCaretCircleLeftBold, PiCheckBold, PiLockSimpleBold } from "react-icons/pi";

export default function SentencePronunciation() {
  const router = useRouter();

  const [sentences, setSentences] = useState([]);
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)


  const currentSentence = sentences.find(
    (sentence) => sentence.level === user.currentSentencePronunciation.level
  ) ?? { id: "#", level: 1 };

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (sentence) => {
  //     setSentences(sentence);
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userId = localStorage.getItem("user_id");

    const docRef = doc(db, "users", userId);

    // Fetch the document from Firestore
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    setUser(docSnap.data());
    const wordRef = collection(db, "sentence_pronunciation");
    const q = query(wordRef, orderBy("level", "asc"));

    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    setSentences(result);
    setLoading(false)
  };

  const goToSentence = (id) => {
    router.push(`/activity/sentence_pronunciation/${id}`);
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
        <PiCaretCircleLeftBold
          color="white"
          size={40}
          onClick={() => router.back()}
        />
        <p className="text-white text-3xl font-semibold ml-5">
          Activity - Sentence Pronunciation
        </p>
      </div>
      {loading ? (
        <div className="flex flex-1 justify-center items-center">
          <p className="animate-bounce text-3xl text-white font-semibold">
            Loading ...
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 sm:max-h-[calc(100%_-_230px)] max-h-[calc(100%_-_2000px)] sm:w-[calc(100%_-_80px)] w-[calc(100%_-_40px)] sm:mx-10 mx-5 mt-5 overflow-y-scroll">
          {sentences?.map((sentence, index) => {
            return (
              <button
                key={index}
                onClick={() => goToSentence(sentence.id)}
                disabled={
                  currentSentence.level > sentence.level ||
                  currentSentence.level < sentence.level
                }
                className="w-full bg-[#766A6A] rounded flex justify-center items-center h-16"
              >
                {currentSentence.id === sentence.id ? (
                  <p className="text-white text-lg">{sentence?.word}</p>
                ) : currentSentence.level > sentence.level ? (
                  <div className="flex flex-row gap-3 items-center">
                    <p className="text-white text-opacity-50 text-lg">
                      {sentence?.word}
                    </p>
                    <PiCheckBold />
                  </div>
                ) : (
                  <PiLockSimpleBold />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
