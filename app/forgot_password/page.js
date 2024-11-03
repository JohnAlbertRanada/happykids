"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("")
  const [success, setSuccess] = useState(false)

  async function checkUserExists(email) {
    setSuccess(false)
    setErrorMessage("")
    const usersRef = collection(db, "users"); // Change 'users' to your collection name
    const q = query(usersRef, where("email", "==", email)); // Assuming the field is called 'email'

    try {
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.size)
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
      });

      if (querySnapshot.empty) {
        console.log("No matching documents found.");
        setErrorMessage("This email is not registered.")
      } else if(querySnapshot.size) {
        setErrorMessage("")
        resetPassword(email)
      }
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  }

  async function resetPassword() {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Password reset email sent successfully.");
        setSuccess(true)
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error sending password reset email:", error);
        alert("Error sending password reset email: " + error.message);
      });
  }

  return (
    <div className="w-full h-dvh bg-cover bg-center bg-[url('/images/background_image_v2.png')] flex justify-center items-center relative bg-black">
      <div className="bg-white rounded border-none drop-shadow p-5 flex flex-col">
        <p className="text-3xl text-black">Forgot Password</p>
        {!success && <p className="text-black">Please input the email you sigup with us</p>}
        {!success && <input
          type="email"
          className="rounded border-gray outline-none border h-10 px-2 my-5 text-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />}
        {!success && <button className="bg-green-500 h-8 text-white" onClick={() => checkUserExists(email)}>
          Forgot Password
        </button>}
        <p className="my-2 text-red-500">{errorMessage}</p>
        {success && <p className="my-2 text-green-500">Password reset email sent successfully. Please check your email.</p>}
        <button className="bg-[#766A6A] h-8 text-white" onClick={() => router.replace("/login")}>
          Go to Login
        </button>
      </div>
    </div>
  );
}
