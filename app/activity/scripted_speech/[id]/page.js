"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  PiMicrophone,
  PiSpeakerSimpleHighFill,
  PiStop,
  PiUser,
} from "react-icons/pi";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useParams } from "next/navigation";

export default function ScriptedSpeechItem() {
  const idRef = useRef(0);
  let mediaRecorderRef = useRef();
  let audioChunks = [];
  // const conversations = [
  //   {
  //     role: "computer",
  //     message:
  //       "Good afternoon! Welcome to The Happy Café. May I take your order?",
  //     character: "Waiter/Waitress",
  //   },
  //   {
  //     role: "user",
  //     message:
  //       "Good afternoon! Yes, please. Can I have a burger and a glass of orange juice, please?",
  //     character: "Customer",
  //   },
  //   {
  //     role: "computer",
  //     message: "Sure! Would you like cheese or ketchup on your burger?",
  //     character: "Waiter/Waitress",
  //   },
  //   {
  //     role: "user",
  //     message: "I’d like both, please.",
  //     character: "Customer",
  //   },
  //   {
  //     role: "computer",
  //     message: "Anything else?",
  //     character: "Waiter/Waitress",
  //   },
  //   {
  //     role: "user",
  //     message: "Yes, I’d also like a chocolate cake for dessert.",
  //     character: "Customer",
  //   },
  //   {
  //     role: "computer",
  //     message:
  //       "Great choice! That will be 250 pesos. How would you like to pay?",
  //     character: "Waiter/Waitress",
  //   },
  //   {
  //     role: "user",
  //     message: "I’ll pay with cash.",
  //     character: "Customer",
  //   },
  // ];

  const params = useParams();
  console.log(params);
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentScriptId, setCurrentScriptId] = useState(0);
  const [recording, setRecording] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    init(id);
  }, []);

  async function init(id) {
    setLoading(true);
    const docRef = doc(db, "scripted_speech", id);

    // Fetch the document from Firestore
    const docSnap = await getDoc(docRef);
    console.log("Scripted Speech: ", docSnap.data());

    setConversations(docSnap.data().conversations);
    setLoading(false);
  }

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (started) {
      playAudio(conversations[0].message);
    }
  }, [started]);

  const playAudio = (text) => {
    console.log(text);
    // window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text);

    speechSynthesis.speak(utterance);
    smoothScroll("box" + idRef.current);
    triggerAnimation(idRef.current.toString());

    // Add an event listener for when the speech ends
    utterance.addEventListener("end", () => {
      console.log("Speech has finished.");
      if (conversations.length - 1 !== idRef.current) {
        if (conversations[idRef.current].role === "computer") {
          setCurrentScriptId((prev) => prev + 1);
          idRef.current = idRef.current + 1;
          let id = idRef.current;
          console.log(id);
          smoothScroll("box" + idRef.current);
          triggerAnimation(idRef.current.toString());
        }
      }
    });
  };

  function smoothScroll(target) {
    const element = document.getElementById(target);
    const container = document.getElementById("scroll");
    const parent = element.parentElement; // Ensure it's the correct parent

    const elementRect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    const relativeTop = elementRect.top - parentRect.top;
    const relativeLeft = elementRect.left - parentRect.left;
    if (element && container.clientHeight < relativeTop) {
      element.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    }

    console.log("Relative Top:", relativeTop);
    console.log("Relative Left:", relativeLeft);
    console.log("Element height:", container.clientHeight);
  }

  function triggerAnimation(id) {
    // Get the element to animate
    const box = document.getElementById(id);
    console.log(box);
    // Add the Tailwind animation class (e.g., bounce)
    box.className +=
      "relative w-[max-content] before:absolute before:inset-0 before:animate-typewriter before:bg-[#d9d9d9] after:absolute after:inset-0 after:w-[0.125em] after:animate-caret";

    // Optional: Remove the class after animation duration to allow re-triggering
    // setTimeout(() => {
    //   box.classList.remove('animate-bounce');
    // }, 1000); // Adjust this duration to match the animation duration (1s here)
  }

  async function startSpeaking(sentence) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.start();
    setRecording(true);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      // document.getElementById("audioPreview").src =
      //   URL.createObjectURL(audioBlob);
      document.getElementById("audioBlob").value = await blobToBase64(
        audioBlob
      );
      let newAudio = await blobToBase64(audioBlob);
      submitAudio(sentence, newAudio);
    };
  }

  async function stopSpeaking(reference) {
    mediaRecorderRef.current.stop();
    audioChunks = [];
    console.log(reference);
    setRecording(false);
  }

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function dataURLtoBlob(dataURL) {
    console.log(dataURL);
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let index = 0; index < byteString.length; index++) {
      ia[index] = byteString.charCodeAt(index);
    }

    return new Blob([ab], { type: mimeString });
  }

  async function submitAudio(reference, audio) {
    const referenceText = reference;
    const audioBlob = document.getElementById("audioBlob").value;
    console.log(audio);

    const formData = new FormData();
    formData.append("referenceText", referenceText.replace(/[.,?!]/g, ""));
    formData.append("audio", dataURLtoBlob(audio));

    try {
      const response = await fetch(
        "http://localhost:3000/rate/word_pronunciation",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      console.log(result, typeof result);
      let data = JSON.parse(result);
      setResults((prev) => [...prev, { ...data, id: currentScriptId }]);

      // setWaiting(false);
      // setResult(JSON.parse(results));
    } catch (error) {
      console.error("Error:", error);
    }
    // const referenceText = reference;
    // const audioBlob = document.getElementById("audioBlob").value;
    // console.log(audio);

    // const formData = new FormData();
    // formData.append("referenceText", referenceText);
    // formData.append("audio", dataURLtoBlob(audio));

    // try {
    //   const response = await fetch(
    //     "http://localhost:3000/rate/word_pronunciation",
    //     {
    //       method: "POST",
    //       body: formData,
    //     }
    //   );

    //   const result = await response.json();
    //   console.log(result);
    // } catch (error) {
    //   console.error("Error:", error);
    // }
    if (idRef.current !== conversations.length - 1) {
      setCurrentScriptId((prev) => prev + 1);
      idRef.current = idRef.current + 1;
      playAudio(conversations[idRef.current].message);
    }
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
            <p className="sm:text-2xl text-lg text-black font-semibold">
              Scripted Speech
            </p>
            {/* {audioPlayed && <button className="rounded bg-[#766A6A] text-white p-2">
              DONE
            </button>} */}
          </div>
          {started ? (
            <div
              className="flex flex-col w-full overflow-y-scroll my-5"
              id="scroll"
            >
              {conversations.map((conversation, index) => {
                return conversation.role === "computer" ? (
                  <div
                    className={`flex flex-row w-[calc(100%_-_20px)] justify-start mb-5 ${
                      index > currentScriptId && "invisible"
                    }`}
                    id={"box" + index}
                  >
                    <div className="relative flex justify-center items-center size-10 rounded-full bg-white border border-black mr-5">
                      <PiUser size={25} color="black" />
                      <button
                        className="absolute -bottom-2 -right-2 z-10 p-2 rounded-full bg-[#766A6A] w-fit h-fit"
                        onClick={null}
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
                    className={`flex flex-row w-[calc(100%_-_36px)] justify-end mb-5 ${
                      index > currentScriptId && "invisible"
                    }`}
                    id={"box" + index}
                  >
                    {results.find((result) => result.id === index) !== undefined && <div class="relative size-12 mr-2">
                      <svg
                        class="size-full -rotate-90"
                        viewBox="0 0 36 36"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          class="stroke-current text-gray-200 dark:text-neutral-700"
                          stroke-width="2"
                        ></circle>

                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          class="stroke-current text-[#766A6A] dark:text-[#766A6A]"
                          stroke-width="2"
                          stroke-dasharray="100"
                          stroke-dashoffset={
                            results.find((result) => result.id === index)
                              ?.penalty >
                            results.find((result) => result.id === index)?.average_score || results.find((result) => result.id === index).transcription === null
                              ? 0
                              : 100 -
                                Math.round(
                                  results.find((result) => result.id === index)
                                    ?.average_score -
                                    results.find(
                                      (result) => result.id === index
                                    )?.penalty
                                )
                          }
                          stroke-linecap="round"
                        ></circle>
                      </svg>

                      <div class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                        <span class="text-center text-xs font-bold text-[#766A6A] dark:text-[#766A6A]">
                          {results.find((result) => result.id === index)
                            ?.penalty >
                          results.find((result) => result.id === index)?.average_score || results.find((result) => result.id === index).transcription === null
                            ? 0
                            : (
                                results.find((result) => result.id === index)
                                  ?.average_score -
                                results.find((result) => result.id === index)
                                  ?.penalty
                              ).toFixed(2)}
                          %
                        </span>
                      </div>
                    </div>}
                    <input type="hidden" id="audioBlob" name="audio" />
                    {recording ? (
                      <button
                        className="outline-none flex justify-center items-center md:size-10 size-8 rounded-full bg-[#766A6A] mr-2"
                        onClick={() => stopSpeaking(conversation.message)}
                      >
                        <PiStop size={12} color="white" />
                      </button>
                    ) : (
                      <button
                        className="outline-none flex justify-center items-center md:size-10 size-8 rounded-full bg-[#766A6A] mr-2"
                        onClick={() => startSpeaking(conversation.message)}
                      >
                        <PiMicrophone size={12} color="white" />
                      </button>
                    )}
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
                        onClick={null}
                      >
                        <PiSpeakerSimpleHighFill size={10} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <button
              className="rounded bg-[#766A6A] text-white p-2 w-min m-auto"
              onClick={() => {
                setStarted(true);
              }}
              disabled={conversations.length === 0}
            >
              START
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
