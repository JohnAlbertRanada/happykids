"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, updatePassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

export default function ChangePassword() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        console.log("User logged in (auth state changed):", user);
        setCurrentUser(user);
      } else {
        // No user is logged in
        console.log("No user is logged in (auth state changed).");
      }
    });
  }, []);

  async function init() {
    if (!localStorage.getItem("user_id")) {
      router.replace("/login");
    }
  }

  async function changePassword(newPassword, confirmPassword) {
    if (newPassword && confirmPassword) {
      if (newPassword === confirmPassword) {
        updatePassword(currentUser, newPassword)
          .then(() => {
            console.log("Password updated successfully.");
          })
          .catch((error) => {
            console.error("Error updating password:", error.message);
          });
      }
    }
  }

  return (
    <div className="w-full h-dvh bg-cover bg-center bg-[url('/images/background_image_v2.png')] flex justify-center items-center relative bg-black">
      <div className="bg-white rounded border-none drop-shadow py-5 px-10 flex flex-col">
        <p className="text-3xl text-black">Change Password</p>
        <input
          type="text"
          className="rounded border-gray outline-none border h-10 px-2 my-2 text-black"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="text"
          className="rounded border-gray outline-none border h-10 px-2 my-2 text-black"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          disabled={!newPassword || !confirmPassword}
          className="bg-[#766A6A] h-10 disabled:bg-[#c5b2b2]"
          onClick={() => changePassword(newPassword, confirmPassword)}
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
