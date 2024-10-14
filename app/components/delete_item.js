


export default function DeleteItem({title, item, handleCancel, handleDelete}) {
  return <div className="rounded p-5 flex flex-col bg-white">
    <p className="text-2xl font-medium text-[#766A6A] mb-5">Delete {title}</p>
    <p className="text-[#766A6A]">Are you sure you want to delete {title} with ID <b>{item.id}</b> ?</p>
    <div className="flex flex-row justify-end items-center gap-2 mt-10">
      <button className="text-white p-2 bg-red-500" onClick={() => handleCancel()}>Cancel</button>
      <button className="text-white p-2 bg-[#766A6A]" onClick={() => handleDelete(item.id)}>Confirm</button>
    </div>
  </div>
}