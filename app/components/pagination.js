


export default function Pagination({start = 0, finish = 0, handleNext, handlePrev, pageLimit, word}) {
  return <div className="flex flex-row w-full my-2 justify-end items-center gap-2">
    <button className="p-2 border rounded" onClick={() => handlePrev(finish - pageLimit, finish)}>
      Prev
    </button>
    <p>{start + 1}-{finish} {word}</p>
    <button className="p-2 border rounded" onClick={() => handleNext(finish, finish + pageLimit)}>
      Next
    </button>
  </div>
}