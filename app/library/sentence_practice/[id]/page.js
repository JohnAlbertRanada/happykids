"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { auth, db } from "@/app/firebase.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  query,
  collection,
  getDocs,
  limit,
  where,
} from "firebase/firestore";
import {
  PiCaretCircleLeftBold,
  PiEar,
  PiMicrophone,
  PiSpeakerHighFill,
  PiStarFill,
} from "react-icons/pi";
import { onAuthStateChanged } from "firebase/auth";

export default function SentencePracticeItem() {
  const router = useRouter();
  const params = useParams();
  console.log(params);
  const { id } = params;

  const audioRef = useRef(null);

  const playAudio = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
    setAudioPlayed(true);
  };

  const [word, setWord] = useState(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isCurrent, setIsCurrent] = useState(false);
  const [star, setStar] = useState(0)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        console.log("User logged in (auth state changed):", user);
        setCurrentUser(user);
        init(id, user);
      } else {
        // No user is logged in
        console.log("No user is logged in (auth state changed).");
      }
    });
  }, []);

  async function init(id, user) {
    const docRef = doc(db, "sentence_practice", id);
    const userRef = doc(db, "users", user.uid);

    // Fetch the document from Firestore
    const docSnap = await getDoc(docRef);
    const userSnap = await getDoc(userRef);
    setStar(userSnap.data().stars)
    console.log(docSnap.data());
    console.log(userSnap.data());

    setWord(docSnap.data());

    if (user && userSnap.data().currentSentencePractice) {
      const currentDocRef = doc(
        db,
        "sentence_practice",
        userSnap.data().currentSentencePractice.id
      );
      const currentDocSnap = await getDoc(currentDocRef);
      if (
        currentDocSnap.data().level < docSnap.data().level &&
        currentDocSnap.data().id !== docSnap.data().id
      ) {
        const currentVocabulary = {
          id: id,
          started: new Date(),
        };
        updateDoc(userRef, {currentVocabulary: currentVocabulary})
          .then(() => {
            console.log("Document successfully updated!");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      } else if(currentDocSnap.data().id === docSnap.data().id) {
        setIsCurrent(true)
      }
    } else {
      const q = query(
        collection(db, "sentence_practice"),
        where("level", "==", 1),
        limit(1)
      );

      getDocs(q)
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const document = querySnapshot.docs[0]; // Get the first document

            // Reference to the document
            const docRef = doc(db, "users", user.uid);

            const currentVocabulary = {
              id: document.id,
              started: new Date(),
            };

            // Update the document
            updateDoc(docRef, {currentVocabulary: currentVocabulary})
              .then(() => {
                console.log(`Document ${document.id} successfully updated!`);
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
              });
          } else {
            console.log("No matching documents found.");
          }
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
        });
    }
  }

  function handleStar(stars, addStar, currentUser) {
    const userRef = doc(db, "users", currentUser.uid);
    updateDoc(userRef, {stars: stars + addStar}).then(() => {
      console.log(`Document ${document.id} successfully updated!`);
      router.replace('/library/sentence_practice')
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
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
      <div className="flex justify-center items-center sm:h-[calc(100%_-_180px)] h-[calc(100%_-_150px)] sm:w-[calc(100%_-_80px)] w-[calc(100%_-_40px)] sm:mx-10 mx-5 pt-5 overflow-y-scroll">
        <div className="flex flex-col h-full w-[calc(100%_-_20px)] rounded p-5 bg-[#d9d9d9]">
          <div className="flex flex-row w-full items-center justify-between">
          <div className="flex flex-row w-full items-center">
          <PiCaretCircleLeftBold
                color="black"
                size={35}
                onClick={() => router.back()}
              />
              <p className="sm:text-2xl text-lg text-black font-semibold ml-2">
                Library - Sentence Practice
              </p>
            </div>
            {audioPlayed && isCurrent && (
              <button className="rounded bg-[#766A6A] text-white p-2" onClick={() => handleStar(star, word.star, currentUser)}>
                DONE
              </button>
            )}
          </div>
          <div className="flex flex-row w-full mt-5">
            <div className="flex flex-col flex-1 justify-center items-center">
              <p className="text-black md:text-5xl text-3xl font-bold text-center mb-2">
                {word?.word}
              </p>
              <p className="text-black text-xl font-medium text-center">
                Pronunciation: <b>{word?.pronunciation}</b>
              </p>
              <p className="text-black text-xl font-medium text-center">
                In Tagalog: <b>{word?.tagalog}</b>
              </p>
              <div className="flex flex-row mt-5 text-2xl text-black items-center">
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
      </div>
    </div>
  );
}
