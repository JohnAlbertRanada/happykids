"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  PiEyeBold,
  PiPencilBold,
  PiTrashBold,
  PiUserBold,
} from "react-icons/pi";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  endBefore,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
} from "firebase/firestore";
import Pagination from "../components/pagination";
import { useRouter } from "next/navigation";
import DeleteItem from "../components/delete_item";
import ViewItem from "../components/view_item";

export default function AdminUsers() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(0);
  const [finish, setFinish] = useState(0);
  const [lastUser, setLastUser] = useState({});
  const [modalOpen, setModalOpen] = useState(""); //view, add, edit, delete
  const [selectedItemId, setSelectedItemId] = useState(null);
  const pageLimit = 10;

  const selectedItem = users.find((user) => user.id === selectedItemId);

  useEffect(() => {
    if(localStorage.getItem("admin_uid")) {
      fetchData();
    } else {
      router.replace('/admn/login')
    }
  }, []);

  const fetchData = async () => {
    console.log(start, finish);
    const userRef = collection(db, "users");
    const userQuery = query(userRef, orderBy("firstName"), limit(pageLimit));
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
    setUsers(result);
    if (querySnapshot.size && querySnapshot.size > 0) {
      setLastUser(lastVisible);
    }
  };

  const handleNext = async (start, finish) => {
    console.log(start, finish);
    const userRef = collection(db, "users");
    const userQuery = query(
      userRef,
      orderBy("firstName"),
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
      setUsers(result);
      if (querySnapshot.size && querySnapshot.size > 0) {
        setLastUser(lastVisible);
      }
    }
  };

  const handlePrev = async (start, finish) => {
    console.log(start, finish);
    const userRef = collection(db, "users");
    const userQuery = query(
      userRef,
      orderBy("firstName"),
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
      setUsers(result);
      if (querySnapshot.size && querySnapshot.size > 0) {
        setLastUser(lastVisible);
      }
    }
  };

  function openModal(modal, id) {
    setSelectedItemId(id);
    setModalOpen(modal);
  }

  function handleCancel() {
    setSelectedItemId(null);
    setModalOpen("");
  }

  async function handleDelete() {
    try {
      const response = await fetch(
        `http://localhost:3000/user/${selectedItemId}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        const docRef = doc(db, "users", selectedItemId);
        await deleteDoc(docRef);
        const userRef = collection(db, "users");
        const userQuery = query(userRef, orderBy("firstName"), limit(pageLimit));
        const querySnapshot = await getDocs(userQuery);
        console.log(querySnapshot);
        setStart(0);
        setFinish(querySnapshot.size);
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        const result = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        console.log(result);
        setUsers(result);
        if (querySnapshot.size && querySnapshot.size > 0) {
          setLastUser(lastVisible);
        }
        setModalOpen("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Define the preferred key order
  const preferredOrder = [
    "id",
    "currentImage",
    "firstName",
    "lastName",
    "email",
    "stars",
    "createdAt",
  ];
  const keyReplacement = {
    id: "ID",
    currentImage: "Current Image",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    stars: "Stars",
    createdAt: "Created At",
  };

  return (
    <div className="w-full h-dvh bg-cover bg-center bg-opacity-80 bg-[url('/images/background_image_v2.png')] flex flex-col bg-black relative">
      {modalOpen === "delete" && (
        <div className="absolute w-full h-full top-0 left-0 z-50 flex justify-center items-center bg-black bg-opacity-95">
          <DeleteItem
            title="User"
            item={selectedItem}
            handleDelete={handleDelete}
            handleCancel={handleCancel}
          />
        </div>
      )}
      {modalOpen === "view" && (
        <div className="absolute w-full h-full top-0 left-0 z-50 flex justify-center items-center bg-black bg-opacity-95">
          <ViewItem
            title="User"
            item={selectedItem}
            preferredOrder={preferredOrder}
            keyReplacement={keyReplacement}
            handleCancel={handleCancel}
          />
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
        <button className="bg-[#766A6A] text-white rounded w-40 h-10">
          Users
        </button>
        <button
          className="text-black rounded w-40 h-10"
          onClick={() => router.push("/admn/library/vocabulary")}
        >
          Library
        </button>
        <button
          className="text-black rounded w-40 h-10"
          onClick={() => router.push("/admn/activity/word_pronunciation")}
        >
          Activity
        </button>
      </div>
      <div className="flex flex-1 flex-col justify-start items-start mx-10 w-[calc(100%_-_80px)]">
        <table className="w-full border rounded bg-[#766A6A]">
          <thead>
            <tr className="border">
              <th className="text-start p-2">ID</th>
              <th className="text-start p-2">First Name</th>
              <th className="text-start p-2">Last Name</th>
              <th className="text-start p-2">Email</th>
              <th className="text-start p-2">Stars</th>
              <th className="text-start p-2">Created At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              return (
                <tr key={index} className="border">
                  <td className="text-start p-2">{user.id}</td>
                  <td className="text-start p-2">{user.firstName}</td>
                  <td className="text-start p-2">{user.lastName}</td>
                  <td className="text-start p-2">{user.email}</td>
                  <td className="text-start p-2">{user.stars}</td>
                  <td className="text-start p-2">
                    {user.createdAt.toDate().toDateString()}
                  </td>
                  <td className="flex flex-row items-center justify-center p-2 gap-2">
                    <button
                      className="outline-none border-none bg-transparent"
                      onClick={() => openModal("view", user.id)}
                    >
                      <PiEyeBold size={20} />
                    </button>
                    {/* <button className="outline-none border-none bg-transparent">
                      <PiPencilBold size={20} />
                    </button> */}
                    <button
                      className="outline-none border-none bg-transparent"
                      onClick={() => openModal("delete", user.id)}
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
          word="users"
        />
      </div>
    </div>
  );
}
