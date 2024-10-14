import { PiXBold } from "react-icons/pi";
import { db } from "../firebase";
import { Timestamp } from "firebase/firestore";

export default function ViewItem({
  title,
  item,
  preferredOrder,
  keyReplacement,
  handleCancel,
}) {
  let orderedObject = {};
  preferredOrder.forEach((key) => {
    if (item.hasOwnProperty(key)) {
      orderedObject[key] = item[key];
    }
  });

  function isFirebaseTimestamp(value) {
    // Check if the value is an instance of Firebase's Timestamp
    console.log(Timestamp);
    return value instanceof Timestamp;
  }

  return (
    <div className="rounded p-5 flex flex-col bg-white">
      <div className="w-full flex flex-row justify-between items-center mb-5">
        <p className="text-2xl font-medium text-[#766A6A]">View {title}</p>
        <button
          className="bg-transparent outline-none border-none w-min h-min"
          onClick={() => handleCancel()}
        >
          <PiXBold size={20} color="#766A6A" />
        </button>
      </div>
      {Object.entries(orderedObject).map(([key, value]) => (
        <div className="flex flex-row text-black my-1">
          <p className="min-w-36">{keyReplacement[key] || key}</p>
          {Array.isArray(value) ? (
            <div className="flex flex-col w-full justify-start items-start">
              {value.map((data) => {
                return <div className="flex-wrap flex flex-col">
                  <p><b>{data.role}:</b> {data.message}</p>
                </div>;
              })}
            </div>
          ) : (
            <p>
              {isFirebaseTimestamp(value)
                ? value.toDate().toDateString()
                : value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
