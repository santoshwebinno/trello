import {
  Minimize2,
  Maximize2,
  Plus,
  BookCopy,
  Ellipsis,
  X,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import ChildCard from "./ChildCard";
import apiHelper from "../helpers/api-helper";
import DEVELOPMENT_CONFIG from "../helpers/config";

export default function TaskCard({ id, title }) {
  const [isClose, setIsClose] = useState(true);

  const [addCard, setAddCard] = useState(false);

  // OPEN AND CLOSE ADD CARD MODAL
  const handleOpenAddCard = () => {
    setAddCard(true);
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };
  const handleCloseAddCard = () => {
    setAddCard(false);
  }

  const [newValue, setNewValue] = useState("")
  const [childCard, setChildCard] = useState([]);

  // GET CHILD CARDS
  async function handleGetChildCard(id) {
    let result = await apiHelper.getRequest(`display-child-cards?id=${id}`)
    if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
      setChildCard(result?.body)
    } else {
      setChildCard([])
    }
  }
  useEffect(() => {
    handleGetChildCard(id);
  }, [])

  const handleValidation = () => {
    let isValid = true
    if (newValue.trim() === "") {
      isValid = false;
    }
    return isValid
  }
  // CREATE CHILD CARD ( ADD CARD )
  async function handleCreateChildCard(e) {
    e.preventDefault();
    if (!handleValidation()) {
      handleCloseAddCard()
      return
    }
    let data = JSON.stringify({
      title: newValue,
      description: "",
      is_checked: false,
      dashbord_c_id: id,
    })
    let result = await apiHelper.postRequest("create-child-card", data)
    if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
      handleCloseAddCard()
      setNewValue("")
      handleGetChildCard(id) // UPDATE CONTENT
      console.log("MESSAGE IF : ", result.message)
    }
    else {
      console.log("MESSAGE ELSE : ", result.message)
    }
  }

  const scrollRef = useRef(null);
  return (
    <>
      {isClose ? (
        <div
          key={id}
          className="bg-white text-gray-600 font-medium p-3 cursor-pointer min-w-72 rounded-xl shadow-md flex flex-col space-y-2"
        >
          <div className="flex items-start justify-between gap-2 pb-2 mb-1">
            <h2 className="text-sm font-semibold flex-1 w-3/4 break-words whitespace-normal">
              {title}
            </h2>
            <div className="flex items-center gap-4">
              <button
                className="cursor-pointer"
                onClick={() => setIsClose(false)}
              >
                <Minimize2 size={16} strokeWidth={2.5} className="rotate-45" />
              </button>
              <button className="cursor-pointer">
                <Ellipsis size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="pb-1 mb-1 flex-1 overflow-y-auto max-h-96"
          >
            <div className="space-y-3 p-1">
              {childCard && (
                <>
                  {childCard?.child_cards?.map((item) => (
                    <ChildCard
                      key={item.id}
                      id={item.id}
                      cardTitle={item.title}
                      setIsCheckedC={item.is_checked}
                    />
                  ))
                  }
                </>
              )}

              {addCard && (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={newValue}
                    placeholder="Enter a title or pase a link"
                    className="w-full h-fit text-sm text-gray-700 font-normal border-2 border-blue-500 rounded resize-none outline-none px-2 py-2"
                    onChange={((e) => setNewValue(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCreateChildCard(e);
                      }
                    }}
                  />
                  <div className="flex gap-1">
                    <button className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 rounded cursor-pointer"
                      onClick={handleCreateChildCard}
                    >
                      Add card
                    </button>
                    <button
                      className="text-gray-500 p-2 rounded hover:bg-gray-300 cursor-pointer"
                      onClick={handleCloseAddCard}
                    >
                      {" "}
                      <X size={22} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className={`${addCard ? "hidden" : "flex"
              } items-center justify-between gap-2 pt-1`}
          >
            <div className="hover:bg-[#d0d4db] py-2 rounded w-full">
              <button
                className="flex items-center px-0.5 gap-1.5 cursor-pointer w-full"
                onClick={handleOpenAddCard}
              >
                <Plus size={18} strokeWidth={2} />
                <span className="text-sm font-semibold">Add a Card</span>
              </button>
            </div>
            <button className="hover:bg-[#d0d4db] p-2 rounded cursor-pointer">
              <BookCopy size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      ) : (
        <div
          key={title}
          className="cursor-pointer flex flex-col items-center bg-white text-gray-600 rounded-xl px-3 py-2 w-10 h-fit space-y-2"
        >
          <button className="" onClick={() => setIsClose(true)}>
            <Maximize2 size={16} strokeWidth={2.5} className="rotate-45" />
          </button>
          <div className="flex items-center gap-2 rotate-0 writing-vertical-lr">
            <h2 className="text-sm font-semibold">{title}</h2>
            <span className="text-xs mt-1">5</span>
          </div>
        </div>
      )}
    </>
  );
}
