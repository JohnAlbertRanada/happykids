"use client";

import Image from "next/image";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/app/firebase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setDoc, doc, average } from "firebase/firestore";
import { PiEye, PiEyeClosed } from "react-icons/pi";

export default function Signup() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("user_id")) {
      router.replace("/");
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const createUser = (email, password, firstName, lastName) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User created:", user);
        await setDoc(doc(db, "users", user.uid), {
          currentImage: "/images/level_1.jpg",
          firstName: firstName,
          lastName: lastName,
          stars: 0,
          email: email,
          createdAt: new Date(),
          currentVocabulary: {
            level: 1,
            started: new Date()
          },
          currentSentencePractice: {
            level: 1,
            started: new Date()
          },
          currentConversation: {
            level: 1,
            started: new Date()
          },
          currentWordPronunciation: {
            level: 1,
            started: new Date()
          },
          currentSentencePronunciation: {
            level: 1,
            started: new Date()
          },
          currentScriptedSpeech: {
            level: 1,
            started: new Date()
          },
          pronunciation_average: {
            average: 0,
            count: 0
          },
          intonation_average: {
            average: 0,
            count: 0
          },
          fluency_average: {
            average: 0,
            count: 0
          }
          // Add more fields as needed
        });
        // const usersCollectionRef = collection(db, "users");

        // // Reference to a specific document in the "users" collection (e.g., a user with ID 'userID')
        // const userDocRef = doc(usersCollectionRef, user.uid);

        // // Reference to a subcollection within that specific document (e.g., "orders" subcollection)
        // const libraryCollectionRef = collection(userDocRef, "library");
        
        router.replace("/login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error creating user:", errorCode, errorMessage);
      });
  };
  return (
    <div className="w-full h-dvh bg-cover bg-center bg-opacity-80 bg-[url('/images/background_image_v2.png')] flex flex-col bg-black">
      <nav className="flex flex-row justify-end items-center w-full px-10 mt-5">
        <div className="flex flex-row">
          <button
            className="text-lg font-medium text-white bg-lime-600 rounded p-2"
            onClick={() => router.push("/login")}
          >
            Log In
          </button>
        </div>
      </nav>
      <form className="flex flex-col mx-auto p-5 rounded max-w-fit max-h-fit">
        <div className="sm:size-28 size-20 relative self-center">
          <Image
            src="/images/logo-v2.png"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-10 px-5 h-12 text-black rounded w-80 outline-none border-none placeholder:text-black font-medium focus:border-cyan-500"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="mt-5 px-5 h-12 text-black rounded w-full outline-none border-none font-medium placeholder:text-black focus:border-cyan-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-5 px-5 h-12 text-black rounded w-full outline-none border-none font-medium placeholder:text-black focus:border-cyan-500"
        />
        <div className="w-80 relative h-12 my-5 ">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-5 h-12 text-black rounded w-full outline-none border-none font-medium placeholder:text-black focus:border-cyan-500"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowPassword((prev) => !prev);
            }}
            className="absolute bottom-0 right-0 z-10 h-12 px-2 flex justify-center items-center"
          >
            {showPassword ? (
              <PiEye size={15} color="black" />
            ) : (
              <PiEyeClosed size={15} color="black" />
            )}
          </button>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            createUser(email, password, firstName, lastName);
          }}
          className="p-5 rounded bg-cyan-500 text-white font-medium text-lg"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
