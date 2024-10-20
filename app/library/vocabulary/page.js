"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

import {
  PiCaretCircleLeftBold,
  PiCheckBold,
  PiLockSimpleBold,
} from "react-icons/pi";

export default function Vocabulary() {
  const router = useRouter();

  const [words, setWords] = useState([]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true)

  const currentWord = words.find(
    (word) => word.level === user.currentVocabulary.level
  ) ?? { id: "#", level: 1 };

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
    const userId = localStorage.getItem("user_id");

    const docRef = doc(db, "users", userId);

    // Fetch the document from Firestore
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    setUser(docSnap.data());

    const wordRef = collection(db, "vocabulary");
    const q = query(wordRef, orderBy("level", "asc"));

    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    const result = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    console.log(result);
    setWords(result);
    setLoading(false)
  };

  const goToWord = (id) => {
    router.push(`/library/vocabulary/${id}`);
  };

  async function getVocabularyDone() {
    const userId = localStorage.getItem("user_id");
    const userDocRef = doc(db, "users", userId);
    const libraryDocRef = doc(userDocRef, "library", "vocabulary");
    const docSnap = await getDoc(libraryDocRef);
    console.log(docSnap.data());
    setDone(docSnap.data().done);
    // // Get all documents from the "orders" subcollection
    // getDocs(libraryCollectionRef)
    //     .then((querySnapshot) => {
    //       console.log(querySnapshot.docs)
    //         querySnapshot.forEach((doc) => {
    //             console.log(`${doc.id} => `, doc.data());
    //         });
    //     })
    //     .catch((error) => {
    //         console.error('Error getting subcollection: ', error);
    //     });
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
      <div className="flex flex-row w-full items-center ml-10">
        <PiCaretCircleLeftBold
          color="white"
          size={40}
          onClick={() => router.back()}
        />
        <p className="text-white text-3xl font-semibold ml-5">
          Library - Vocabulary
        </p>
      </div>
      {loading ? (
        <div className="flex flex-1 justify-center items-center">
          <p className="animate-bounce text-3xl text-white font-semibold">
            Loading ...
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 sm:max-h-[calc(100%_-_230px)] max-h-[calc(100%_-_200px)] sm:w-[calc(100%_-_80px)] w-[calc(100%_-_40px)] sm:mx-10 mx-5 mt-5 overflow-y-scroll">
          {words?.map((word, index) => {
            return (
              <button
                key={index}
                onClick={() => goToWord(word.id)}
                disabled={
                  currentWord.level > word.level ||
                  currentWord.level < word.level
                }
                className="w-full bg-[#766A6A] rounded flex justify-center items-center h-16"
              >
                {currentWord.id === word.id ? (
                  <p className="text-white text-lg">{word?.word}</p>
                ) : currentWord.level > word.level ? (
                  <div className="flex flex-row gap-3 items-center">
                    <p className="text-white text-opacity-50 text-lg">
                      {word?.word}
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
