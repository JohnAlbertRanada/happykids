"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { auth, db } from "@/app/firebase.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import {
  PiCaretCircleLeftBold,
  PiEar,
  PiMicrophone,
  PiSpeakerHighFill,
  PiStarFill,
  PiStop,
} from "react-icons/pi";

export default function SentencePronunciationItem() {
  const router  = useRouter()
  const params = useParams();
  console.log(params);
  const { id } = params;

  let mediaRecorderRef = useRef();
  let audioChunks = [];

  let audioRef = useRef();

  const playAudio = (text) => {
    console.log(text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  const [word, setWord] = useState(null);

  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    init(id);
  }, []);

  async function init(id) {
    setLoading(true);
    const docRef = doc(db, "sentence_pronunciation", id);

    // Fetch the document from Firestore
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());

    setWord(docSnap.data());
    setLoading(false);
  }

  async function startSpeaking() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.start();
    setRecording(true);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      document.getElementById("audioPreview").src =
        URL.createObjectURL(audioBlob);
      document.getElementById("audioBlob").value = await blobToBase64(
        audioBlob
      );
      let newAudio = await blobToBase64(audioBlob);
      submitAudio(word.word, newAudio);
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
    setWaiting(true);
    const referenceText = reference;
    const audioBlob = document.getElementById("audioBlob").value;
    console.log(audio);

    const formData = new FormData();
    formData.append("referenceText", referenceText.replace(/[.,?!]/g, ''));
    formData.append("audio", dataURLtoBlob(audio));

    try {
      const response = await fetch(
        "http://localhost:3000/rate/word_pronunciation",
        {
          method: "POST",
          body: formData,
        }
      );

      const results = await response.json();
      console.log(results, typeof results);
      setWaiting(false);
      setResult(JSON.parse(results));
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function retry() {
    document.getElementById("audioPreview").src = null;
    document.getElementById("audioBlob").value = null;
    setRecording(false);
    setResult();
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
      <div className="flex justify-center items-center sm:h-[calc(100%_-_180px)] h-[calc(100%_-_150px)] sm:w-[calc(100%_-_80px)] w-[calc(100%_-_40px)] sm:mx-10 mx-5 mt-5 overflow-y-scroll">
        {loading ? (
          <div className="flex flex-col h-full w-[calc(100%_-_20px)] rounded p-5 bg-[#d9d9d9]">
            <p className="sm:text-2xl text-lg text-black font-semibold">
              Sentence Pronunciation
            </p>
            <div className="flex flex-1 justify-center items-center">
              <p className="animate-bounce text-3xl text-black">Loading ...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full w-[calc(100%_-_20px)] rounded p-5 bg-[#d9d9d9]">
            <div className="flex flex-row w-full items-center">
            <PiCaretCircleLeftBold
                color="black"
                size={35}
                onClick={() => router.back()}
              />
              <p className="sm:text-2xl text-lg text-black font-semibold ml-2">
                Activity - Sentence Pronunciation
              </p>
            </div>
            <div className="flex flex-row w-full mt-5">
              <div className="flex flex-col flex-1 justify-center items-center pl-10">
                <p className="text-black md:text-5xl text-3xl font-bold  text-center mb-2">
                  {word?.word}
                </p>
                <p className="text-black text-2xl font-medium text-center">
                  {word?.pronunciation}
                </p>
                <div className="flex flex-row mt-5 text-2xl text-black items-center">
                  {word?.star} <PiStarFill color="yellow" className="ml-2" />
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => playAudio(word?.word)}
                  className="flex justify-center items-center w-10 h-10 rounded-full bg-[#766A6A] outline-none"
                >
                  <PiSpeakerHighFill size={20} color="white" />
                </button>
                <button
                  className="flex justify-center items-center w-10 h-10 rounded-full bg-[#766A6A] outline-none"
                  onClick={() => {
                    const audio = document.getElementById("audioPreview");
                    audio.play();
                  }}
                >
                  <audio id="audioPreview"></audio>
                  <input type="hidden" id="audioBlob" name="audio" />
                  <PiEar size={20} color="white" />
                </button>
              </div>
            </div>
            {waiting ? (
              <div class="flex flex-col w-full justify-center items-center flex-grow space-x-5">
                <p className="text-black">Waiting on the result</p>
                <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : result ? (
              <div class="flex flex-row w-full justify-center items-center flex-grow space-x-5">
                <div class="relative size-32">
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
                        result.penalty > result.average_score || result.transcription === null
                          ? 0
                          : 100 -
                            Math.round(result.average_score - result.penalty)
                      }
                      stroke-linecap="round"
                    ></circle>
                  </svg>

                  <div class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                    <span class="text-center text-2xl font-bold text-[#766A6A] dark:text-[#766A6A]">
                      {result.penalty > result.average_score || result.transcription === null
                        ? 0
                        : (result.average_score - result.penalty).toFixed(2)}
                      %
                    </span>
                  </div>
                </div>
                <button
                  className="bg-[#766A6A] text-white h-10 p-2 rounded"
                  onClick={() => retry()}
                >
                  Try again
                </button>
                <button className="bg-[#8e8282] text-white h-10 p-2 rounded">
                  Next
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 flex-grow w-full justify-center items-center">
                {recording ? (
                  <button
                    className="outline-none flex justify-center items-center md:size-20 size-16 rounded-full bg-[#766A6A] relative"
                    onClick={() => stopSpeaking(word.word)}
                  >
                    <div className="absolute -z-0 animate-ping flex justify-center items-center md:size-14 size-10 rounded-full bg-[#766A6A]" />
                    <PiStop size={40} color="white" />
                  </button>
                ) : (
                  <button
                    className="outline-none flex justify-center items-center md:size-20 size-16 rounded-full bg-[#766A6A] relative"
                    onClick={() => startSpeaking()}
                  >
                    <div className="absolute -z-0 animate-ping flex justify-center items-center md:size-14 size-10 rounded-full bg-[#766A6A]" />
                    <PiMicrophone size={40} color="white" />
                  </button>
                )}
                <p className="text-lg text-gray-800">Click the mic to speak</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
