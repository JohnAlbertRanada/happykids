"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { auth, db } from "@/app/firebase.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState({});
  const [learnedCount, setLearnedCount] = useState({
    vocabulary: 0,
    sentence: 0,
    conversation: 0
  })
  const [currentVocabulary, setCurrentVocabulary] = useState();
  const [currentSentencePractice, setCurrentSentencePractice] = useState();
  const [currentConversation, setCurrentConversation] = useState();
  const [currentWordPronunciation, setCurrentWordPronunciation] = useState();
  const [currentSentencePronunciation, setCurrentSentencePronunciation] =
    useState();
  const [currentScriptedSpeech, setCurrentScriptedSpeech] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        console.log("User logged in (auth state changed):", user);
      } else {
        // No user is logged in
        console.log("No user is logged in (auth state changed).");
      }
    });
  }, []);

  async function init() {
    setLoading(true);
    const userId = localStorage.getItem("user_id");

    if (!localStorage.getItem("user_id")) {
      router.replace("/login");
    } else {
      console.log(userId);
      const docRef = doc(db, "users", userId);

      // Fetch the document from Firestore
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());
      setUser(docSnap.data());
      const vocabularyQuery = query(
        collection(db, "vocabulary"),
        where("level", "==", docSnap.data().currentVocabulary.level)
      );
      const vocabularySnap = await getDocs(vocabularyQuery);
      const vocabularyResult = vocabularySnap.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setCurrentVocabulary(vocabularyResult[0]);
      const sentencePracticeQuery = query(
        collection(db, "sentence_practice"),
        where("level", "==", docSnap.data().currentSentencePractice.level)
      );
      const sentencePracticeSnap = await getDocs(sentencePracticeQuery);
      const sentencePracticeResult = sentencePracticeSnap.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setCurrentSentencePractice(sentencePracticeResult[0]);
      const conversationQuery = query(
        collection(db, "conversation"),
        where("level", "==", docSnap.data().currentConversation.level)
      );
      const conversationSnap = await getDocs(conversationQuery);
      const conversationResult = conversationSnap.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setCurrentConversation(conversationResult[0]);

      const wordPronunciationQuery = query(
        collection(db, "word_pronunciation"),
        where("level", "==", docSnap.data().currentWordPronunciation.level)
      );
      const wordPronunciationSnap = await getDocs(wordPronunciationQuery);
      const wordPronunciationResult = wordPronunciationSnap.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setCurrentWordPronunciation(wordPronunciationResult[0]);
      const sentencePronunciationQuery = query(
        collection(db, "sentence_pronunciation"),
        where("level", "==", docSnap.data().currentSentencePronunciation.level)
      );
      const sentencePronunciationSnap = await getDocs(
        sentencePronunciationQuery
      );
      const sentencePronunciationResult = sentencePronunciationSnap.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setCurrentSentencePronunciation(sentencePronunciationResult[0]);
      const scriptedSpeechQuery = query(
        collection(db, "scripted_speech"),
        where("level", "==", docSnap.data().currentScriptedSpeech.level)
      );
      const scriptedSpeechSnap = await getDocs(scriptedSpeechQuery);
      const scriptedSpeechResult = scriptedSpeechSnap.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setCurrentScriptedSpeech(scriptedSpeechResult[0]);
      setLearnedCount({
        vocabulary: vocabularyResult[0].level + wordPronunciationResult[0].level - 2,
        sentence: sentencePracticeResult[0].level + sentencePronunciationResult[0].level - 2,
        conversation: conversationResult[0].level + scriptedSpeechResult[0].level - 2,
      })
      setLoading(false);
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
      {loading ? (
        <div className="flex flex-1 justify-center items-center">
          <p className="animate-bounce text-3xl text-white font-semibold">
            Loading ...
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:max-h-[calc(100%_-_210px)] max-h-[calc(100%_-_180px)] sm:w-[calc(100%_-_80px)] w-[calc(100%_-_40px)] sm:mx-10 mx-5 overflow-y-scroll">
          <h1 className="text-white sm:text-2xl text-lg font-bold">
            Welcome back,
          </h1>
          <p className="sm:text-lg text-sm text-white">
            {user?.firstName} {user?.lastName}
          </p>
          <div className="flex flex-col my-5 justify-evenly flex-wrap">
            <div className="flex flex-col my-5">
              <p className="sm:text-lg text-base font-bold text-white">
                You have learned
              </p>
              <div className="flex flex-row space-x-1 mt-5">
                <div className="sm:h-24 sm:w-28 h-20 w-24 rounded bg-[#d9d9d9] flex flex-col justify-center items-center">
                  <p className="text-black text-sm">Vocabulary</p>
                  <p className="text-black font-bold text-2xl">{learnedCount.vocabulary}</p>
                </div>
                <div className="sm:h-24 sm:w-28 h-20 w-24 rounded bg-[#d9d9d9] flex flex-col justify-center items-center">
                  <p className="text-black text-sm">Sentence</p>
                  <p className="text-black font-bold text-2xl">{learnedCount.sentence}</p>
                </div>
                <div className="sm:h-24 sm:w-28 h-20 w-24 rounded bg-[#d9d9d9] flex flex-col justify-center items-center">
                  <p className="text-black text-sm">Conversation</p>
                  <p className="text-black font-bold text-2xl">{learnedCount.conversation}</p>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-row flex-wrap gap-5">
              <div className="flex flex-col my-5">
                <p className="sm:text-lg text-base font-bold text-white">
                  Current Vocabulary
                </p>
                <div className="bg-[#d9d9d9] p-2 sm:w-80 w-64 rounded flex flex-col mt-5">
                  <div className="text-ellipsis text-gray-500 font-bold sm:text-xl text-base italic overflow-x-hidden whitespace-nowrap">
                    Level {currentVocabulary.level} - {currentVocabulary.word}
                  </div>
                  <button className="bg-[#766A6A] text-white text-xs h-10 px-5 mt-3 rounded" onClick={() => router.push(`/library/vocabulary/${currentVocabulary.id}`)}>
                    Continue Learning
                  </button>
                </div>
              </div>
              <div className="flex flex-col my-5">
                <p className="sm:text-lg text-base font-bold text-white">
                  Current Sentence Practice
                </p>
                <div className="bg-[#d9d9d9] p-2 sm:w-80 w-64 rounded flex flex-col mt-5">
                  <div className="text-ellipsis text-gray-500 font-bold sm:text-xl text-base italic overflow-x-hidden whitespace-nowrap">
                    Level {currentSentencePractice.level} -{" "}
                    {currentSentencePractice.word}
                  </div>
                  <button className="bg-[#766A6A] text-white text-xs h-10 px-5 mt-3 rounded"  onClick={() => router.push(`/library/sentence_practice/${currentSentencePractice.id}`)}>
                    Continue Learning
                  </button>
                </div>
              </div>
              <div className="flex flex-col my-5">
                <p className="sm:text-lg text-base font-bold text-white">
                  Current Conversation
                </p>
                <div className="bg-[#d9d9d9] p-2 sm:w-80 w-64 rounded flex flex-col mt-5">
                  <div className="text-ellipsis text-gray-500 font-bold sm:text-xl text-base italic overflow-x-hidden whitespace-nowrap">
                    Level {currentConversation.level} - Conversation{" "}
                    {currentConversation.level}
                  </div>
                  <button className="bg-[#766A6A] text-white text-xs h-10 px-5 mt-3 rounded"  onClick={() => router.push(`/library/conversation/${currentConversation.id}`)}>
                    Continue Learning
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-row flex-wrap gap-5">
              <div className="flex flex-col my-5">
                <p className="sm:text-lg text-base font-bold text-white">
                  Current Word Pronunciation
                </p>
                <div className="bg-[#d9d9d9] p-2 sm:w-80 w-64 rounded flex flex-col mt-5">
                  <div className="text-ellipsis text-gray-500 font-bold sm:text-xl text-base italic overflow-x-hidden whitespace-nowrap">
                    Level {currentWordPronunciation.level} -{" "}
                    {currentWordPronunciation.word}
                  </div>
                  <button className="bg-[#766A6A] text-white text-xs h-10 px-5 mt-3 rounded"  onClick={() => router.push(`/library/word_pronunciation/${currentWordPronunciation.id}`)}>
                    Continue Activity
                  </button>
                </div>
              </div>
              <div className="flex flex-col my-5">
                <p className="sm:text-lg text-base font-bold text-white">
                  Current Sentence Pronunciation
                </p>
                <div className="bg-[#d9d9d9] p-2 sm:w-80 w-64 rounded flex flex-col mt-5">
                  <div className="text-ellipsis text-gray-500 font-bold sm:text-xl text-base italic overflow-x-hidden whitespace-nowrap">
                    Level {currentSentencePronunciation.level} -{" "}
                    {currentSentencePronunciation.word}
                  </div>
                  <button className="bg-[#766A6A] text-white text-xs h-10 px-5 mt-3 rounded"  onClick={() => router.push(`/library/sentence_pronunciation/${currentSentencePronunciation.id}`)}>
                    Continue Activity
                  </button>
                </div>
              </div>
              <div className="flex flex-col my-5">
                <p className="sm:text-lg text-base font-bold text-white">
                  Current Scripted Speech
                </p>
                <div className="bg-[#d9d9d9] p-2 sm:w-80 w-64 rounded flex flex-col mt-5 text-ellipsis">
                  <div className="text-ellipsis text-gray-500 font-bold sm:text-xl text-base italic overflow-x-hidden whitespace-nowrap">
                    Level {currentScriptedSpeech.level} - Speech{" "}
                    {currentScriptedSpeech.level}
                  </div>
                  <button className="bg-[#766A6A] text-white text-xs h-10 px-5 mt-3 rounded"  onClick={() => router.push(`/library/scripted_speech/${currentScriptedSpeech.id}`)}>
                    Continue Activity
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-row justify-evenly items-start w-full h-20 fixed bottom-0 left-0">
        <button className="size-14 relative">
          <Image
            src="/images/home-active.png"
            alt="Home"
            fill
            className="object-contain"
          />
        </button>
        <button
          className="size-14 relative"
          onClick={() => router.push("/library")}
        >
          <Image
            src="/images/book.png"
            alt="Library"
            fill
            className="object-contain"
          />
        </button>
        <button
          className="size-14 relative"
          onClick={() => router.push("/activity")}
        >
          <Image
            src="/images/search.png"
            alt="Activity"
            fill
            className="object-contain"
          />
        </button>
        <button
          className="size-14 relative"
          onClick={() => router.push("/profile")}
        >
          <Image
            src="/images/profile.png"
            alt="Profile"
            fill
            className="object-contain"
          />
        </button>
      </div>
    </div>
  );
}
