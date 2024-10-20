"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  PiCaretCircleLeftBold,
  PiMicrophone,
  PiSpeakerSimpleHighFill,
  PiStop,
  PiUser,
} from "react-icons/pi";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useParams, useRouter } from "next/navigation";

export default function ConversationItem() {
  const router = useRouter();
  const idRef = useRef(0);
  let mediaRecorderRef = useRef();
  let audioChunks = [];

  const params = useParams();
  console.log(params);
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentScriptId, setCurrentScriptId] = useState(0);
  const [recording, setRecording] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    init(id);
  }, []);

  async function init(id) {
    setLoading(true);
    const userId = localStorage.getItem("user_id");

    const userRef = doc(db, "users", userId);

    // Fetch the document from Firestore
    const userSnap = await getDoc(userRef);
    console.log(userSnap.data());
    setUser(userSnap.data());
    const docRef = doc(db, "conversation", id);

    // Fetch the document from Firestore
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());

    setConversations(docSnap.data().conversations);
    setLoading(false);
  }

  const playAudio = (text) => {
    console.log(text);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    speechSynthesis.speak(utterance);
  };

  async function wordDone() {
    const userId = localStorage.getItem("user_id");
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, {
      currentConversation: {
        level: Number(word.level + 1),
        started: new Date(),
      },
      stars: Number(user.stars + word.star),
    });
    router.replace("/library/conversation");
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
                Library - Conversation
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
                  Library - Conversation
                </p>
              </div>
              <button
                className="rounded bg-[#766A6A] text-white p-2"
                onClick={() => wordDone()}
              >
                DONE
              </button>
            </div>
            <div
              className="flex flex-col w-full overflow-y-scroll my-5"
              id="scroll"
            >
              {conversations.map((conversation, index) => {
                return conversation.role === "computer" ? (
                  <div
                    className={`flex flex-row w-[calc(100%_-_20px)] justify-start mb-5`}
                  >
                    <div className="relative flex justify-center items-center size-10 rounded-full bg-white border border-black mr-5">
                      <PiUser size={25} color="black" />
                      <button
                        className="absolute -bottom-2 -right-2 z-10 p-2 rounded-full bg-[#766A6A] w-fit h-fit"
                        onClick={() => playAudio(conversation.message)}
                      >
                        <PiSpeakerSimpleHighFill size={10} />
                      </button>
                    </div>
                    <div className="border border-gray-500 rounded p-2">
                      <p
                        id={index.toString()}
                        className={`text-black sm:text-xl text-lg relative w-[max-content]`}
                      >
                        {conversation.message}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`flex flex-row w-[calc(100%_-_36px)] justify-end mb-5`}
                  >
                    <div className="border border-gray-500 rounded p-2">
                      <p
                        id={index.toString()}
                        className={`text-black sm:text-xl text-lg relative w-[max-content]`}
                      >
                        {conversation.message}
                      </p>
                    </div>
                    <div className="relative flex justify-center items-center size-10 rounded-full bg-white border border-black ml-5">
                      <PiUser size={25} color="black" />
                      <button
                        className="absolute -bottom-2 -right-2 z-10 p-2 rounded-full bg-[#766A6A] w-fit h-fit"
                        onClick={() => playAudio(conversation.message)}
                      >
                        <PiSpeakerSimpleHighFill size={10} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
