"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import {
  PiEyeBold,
  PiPencilBold,
  PiTrashBold,
  PiUserBold,
} from "react-icons/pi";
import { db } from "@/app/firebase";
import {
  collection,
  endBefore,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
} from "firebase/firestore";
import Pagination from "@/app/components/pagination";
import { useRouter } from "next/navigation";
import DeleteItem from "@/app/components/delete_item";
import ViewItem from "@/app/components/view_item";

export default function AdminConversation() {
  const router = useRouter();

  const [addedWord, setAddedWord] = useState({
    conversations: [],
    level: 1,
    star: 1,
  });
  const [inputName, setInputName] = useState("");
  const [words, setWords] = useState([]);
  const [start, setStart] = useState(0);
  const [finish, setFinish] = useState(0);
  const [lastUser, setLastUser] = useState({});
  const [modalOpen, setModalOpen] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const pageLimit = 10;

  const selectedItem = words.find((word) => word.id === selectedItemId);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const inputId = document.getElementById(inputName);
    if (inputName && inputId) {
      inputId.focus();
    }
  }, [inputName, addedWord]);

  const fetchData = async () => {
    console.log(start, finish);
    const userRef = collection(db, "conversation");
    const userQuery = query(userRef, orderBy("level"), limit(pageLimit));
    const querySnapshot = await getDocs(userQuery);
    console.log(querySnapshot);
    setFinish(start + querySnapshot.size);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const result = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    console.log(result);
    setWords(result);
    if (querySnapshot.size && querySnapshot.size > 0) {
      setLastUser(lastVisible);
    }
  };

  const handleNext = async (start, finish) => {
    console.log(start, finish);
    const userRef = collection(db, "conversation");
    const userQuery = query(
      userRef,
      orderBy("level"),
      startAfter(lastUser),
      limit(pageLimit)
    );
    const querySnapshot = await getDocs(userQuery);
    if (querySnapshot.size !== 0) {
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      console.log(querySnapshot);
      setStart(start);
      setFinish(start + querySnapshot.size);
      const result = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      console.log(result);
      setWords(result);
      if (querySnapshot.size && querySnapshot.size > 0) {
        setLastUser(lastVisible);
      }
    }
  };

  const handlePrev = async (start, finish) => {
    console.log(start, finish);
    const userRef = collection(db, "conversation");
    const userQuery = query(
      userRef,
      orderBy("level"),
      endBefore(lastUser),
      limit(pageLimit)
    );
    const querySnapshot = await getDocs(userQuery);
    if (querySnapshot.size !== 0 && start !== 0) {
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      console.log(querySnapshot);
      setStart(start - querySnapshot.size);
      setFinish(start);
      const result = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      console.log(result);
      setWords(result);
      if (querySnapshot.size && querySnapshot.size > 0) {
        setLastUser(lastVisible);
      }
    }
  };

  function openModal(modal, id) {
    setSelectedItemId(id);
    if (modal === "edit") {
      const selectedItem = words.find((word) => word.id === id);
      setAddedWord({
        conversations: selectedItem.conversations,
        level: selectedItem.level,
        star: selectedItem.star,
      });
    }
    setModalOpen(modal);
  }

  function handleCancel() {
    setSelectedItemId(null);
    setAddedWord({
      conversations: [],
      level: 1,
      star: 1,
    });
    setModalOpen("");
  }

  function handleDelete() {}

  function handleAdd() {}

  function handleEdit() {}

  const preferredOrder = ["id", "level", "conversations", "star"];
  const keyReplacement = {
    id: "ID",
    level: "Level",
    conversations: "Conversations",
    star: "Star",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputName(name);
    setAddedWord((prevState) => ({
      ...prevState,
      [name]: name === "level" || name === "star" ? Number(value) : value, // Ensure level is a number
    }));
  };

  const AddItem = () => {
    return (
      <div className="rounded p-5 flex flex-col bg-white">
        <p className="text-2xl font-medium text-[#766A6A] mb-5">Add Conversation</p>
        {/* <InputField
          label="Conversations"
          name="word"
          type="text"
          value={addedWord.word}
          onChange={handleChange}
        /> */}
        
        <InputField
          label="Level"
          name="level"
          type="number"
          value={addedWord.level}
          onChange={handleChange}
        />
        <InputField
          label="Star"
          name="star"
          type="number"
          value={addedWord.star}
          onChange={handleChange}
        />
        <div className="flex flex-row justify-end items-center gap-2 mt-10">
          <button
            className="text-white p-2 bg-red-500"
            onClick={() => handleCancel()}
          >
            Cancel
          </button>
          <button
            className="text-white p-2 bg-[#766A6A]"
            onClick={() => handleAdd()}
          >
            Add
          </button>
        </div>
      </div>
    );
  };

  const EditItem = () => {
    return (
      <div className="rounded p-5 flex flex-col bg-white">
        <p className="text-2xl font-medium text-[#766A6A] mb-5">
          Edit Conversation
        </p>
        {/* <InputField
          label="Sentence"
          name="word"
          type="text"
          value={addedWord.word}
          onChange={handleChange}
        /> */}
        <InputField
          label="Level"
          name="level"
          type="number"
          value={addedWord.level}
          onChange={handleChange}
        />
        <InputField
          label="Star"
          name="star"
          type="number"
          value={addedWord.star}
          onChange={handleChange}
        />
        <div className="flex flex-row justify-end items-center gap-2 mt-10">
          <button
            className="text-white p-2 bg-red-500"
            onClick={() => handleCancel()}
          >
            Cancel
          </button>
          <button
            className="text-white p-2 bg-[#766A6A]"
            onClick={() => handleEdit()}
          >
            Edit
          </button>
        </div>
      </div>
    );
  };

  const InputField = ({ label, name, type, value, onChange }) => {
    return (
      <div className="flex flex-row items-center justify-between gap-3 my-2">
        <p className="text-[#766A6A]">{label}</p>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className="border border-gray-800 rounded outline-none px-2 h-8 text-black"
        />
      </div>
    );
  };

  return (
    <div className="w-full h-dvh bg-cover bg-center bg-opacity-80 bg-[url('/images/background_image_v2.png')] flex flex-col bg-black relative">
      {modalOpen === "delete" && (
        <div className="absolute w-full h-full top-0 left-0 z-50 flex justify-center items-center bg-black bg-opacity-95">
          <DeleteItem
            title="Conversation"
            item={selectedItem}
            handleDelete={handleDelete}
            handleCancel={handleCancel}
          />
        </div>
      )}
      {modalOpen === "view" && (
        <div className="absolute w-full h-full top-0 left-0 z-50 flex justify-center items-center bg-black bg-opacity-95">
          <ViewItem
            title="Conversation"
            item={selectedItem}
            preferredOrder={preferredOrder}
            keyReplacement={keyReplacement}
            handleCancel={handleCancel}
          />
        </div>
      )}
            {modalOpen === "add" && (
        <div className="absolute w-full h-full top-0 left-0 z-50 flex justify-center items-center bg-black bg-opacity-95">
          {" "}
          <AddItem />{" "}
        </div>
      )}

      {modalOpen === "edit" && (
        <div className="absolute w-full h-full top-0 left-0 z-50 flex justify-center items-center bg-black bg-opacity-95">
          {" "}
          <EditItem />{" "}
        </div>
      )}
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
          <p className="sm:text-2xl text-base text-white font-bold">Admin</p>
          <PiUserBold size={30} />
        </div>
      </nav>
      <div className="flex flex-row items-center rounded bg-[#d9d9d9] p-1 mx-10 my-5 gap-2 w-min">
        <button
          className="text-black rounded w-40 h-10"
          onClick={() => router.push("/admn")}
        >
          Users
        </button>
        <button className="bg-[#766A6A] text-white rounded w-40 h-10">
          Library
        </button>
        <button
          className="text-black rounded w-40 h-10"
          onClick={() => router.push("/admn/activity/word_pronunciation")}
        >
          Activity
        </button>
      </div>
      <div className="flex flex-row ml-auto items-center rounded bg-[#d9d9d9] p-1 mx-10 mb-5 gap-2 w-min">
        <button
          className="text-black rounded w-40 h-10"
          onClick={() => router.push("/admn/library/vocabulary")}
        >
          Vocabulary
        </button>
        <button
          className="text-black rounded w-40 h-10"
          onClick={() => router.push("/admn/library/sentence_practice")}
        >
          Sentence Practice
        </button>
        <button className="bg-[#766A6A] text-white rounded w-40 h-10">
          Conversation
        </button>
      </div>
      <button
        className="bg-[#766A6A] text-white rounded w-40 h-10 mx-10 mb-5"
        onClick={() => setModalOpen("add")}
      >
        Add Conversation
      </button>
      <div className="flex flex-1 flex-col justify-start items-start mx-10 w-[calc(100%_-_80px)]">
        <table className="w-full border rounded bg-[#766A6A]">
          <thead>
            <tr className="border">
              <th className="text-start p-2">ID</th>
              <th className="text-start p-2">Conversation</th>
              <th className="text-start p-2">Level</th>
              <th className="text-start p-2">Stars</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {words.map((word, index) => {
              return (
                <tr key={index} className="border">
                  <td className="text-start p-2">{word.id}</td>
                  <td className="text-start p-2">Conversation {index + 1}</td>
                  <td className="text-start p-2">{word.level}</td>
                  <td className="text-start p-2">{word.star}</td>
                  <td className="flex flex-row items-center justify-center p-2 gap-2">
                    <button
                      className="outline-none border-none bg-transparent"
                      onClick={() => openModal("view", word.id)}
                    >
                      <PiEyeBold size={20} />
                    </button>
                    <button
                      className="outline-none border-none bg-transparent"
                      onClick={() => openModal("edit", word.id)}
                    >
                      <PiPencilBold size={20} />
                    </button>
                    <button
                      className="outline-none border-none bg-transparent"
                      onClick={() => openModal("delete", word.id)}
                    >
                      <PiTrashBold size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination
          start={start}
          finish={finish}
          handleNext={handleNext}
          handlePrev={handlePrev}
          pageLimit={pageLimit}
          word="conversations"
        />
      </div>
    </div>
  );
}
