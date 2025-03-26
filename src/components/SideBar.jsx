import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  UserRound,
  Settings,
  Columns2,
  Table2,
  CalendarDays,
  Plus,
  ChevronDown,
  Ellipsis,
  Star,
} from "lucide-react";
import CreateBoard from "./CreateBoard";
import CloseBoard from "./CloseBoard";
import { useIndexContext } from "../context/IndexContext";
import InviteMembers from "./InviteMembers";
import { useNavigate } from "react-router-dom";

export default function SideBar() {
  const { handleOnDashbord, boardData, getBoards } = useIndexContext();

  let dashbordCID = parseInt(localStorage.getItem("dashbordCID"), 10);
  let sideBarStatus = JSON.parse(localStorage.getItem("sideBarStatus")) ?? true;
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(sideBarStatus);
  const handleOpenSideBarModal = async (e) => {
    e.preventDefault();
    let newStatus = !isSidebarOpen;
    localStorage.setItem("sideBarStatus", newStatus);
    setIsSidebarOpen(newStatus);
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("dashbordCID");
    navigate("/");
  };

  useEffect(() => {
    getBoards();
  }, []);

  // OPEN CREATE BOARD
  const [openCreateBoard, setOpenCreateBoard] = useState(false);
  const handleOpenCreateBoard = () => {
    setOpenCreateBoard(true);
  };

  const [yourBoard, setYourBoard] = useState(false);
  const [openBoard, setOpenBoard] = useState(false);
  const [removeBoard, setRemoveBoard] = useState(false);

  const [boardTitle, setBoardTitle] = useState({
    id: "",
    title: "",
  });

  // OPEN YOUR BOARD ( FOR SORTING )
  const handleOpenYourBoard = () => {
    setYourBoard(true);
    setRemoveBoard(false);
  };

  // OPEN BOARD ( LIST OF BOARDS )
  const handleOpenBoard = (e, id, title) => {
    e.stopPropagation();
    setBoardTitle({ id, title });
    setOpenBoard(true);
    setRemoveBoard(true);
  };

  const [openInvite, setOpenInvite] = useState(false);
  const handleOpenInvite = () => {
    if (!!dashbordCID) {
      setOpenInvite(true);
    }
  };

  const board_title = { title: "Your Boards" };
  return (
    <>
      <div
        className={`bg-[#4f37b2] transition-all duration-300 border border-[#8d99b9] relative z-10 overflow-auto overflow-x-hidden custom-scrollbar ${isSidebarOpen ? "w-65" : "w-9"
          }`}
      >
        <button
          className={`absolute top-3.5 transition-all ${isSidebarOpen
            ? "left-54 hover:bg-[#948ab7] rounded p-1.5 w-8"
            : "left-1.5 bg-[#614ab8] hover:bg-[#271a83] rounded-full p-1 w-7"
            }`}
          onClick={(e) => handleOpenSideBarModal(e)}
        >
          {isSidebarOpen ? (
            <ChevronLeft size={20} strokeWidth={2.5} />
          ) : (
            <ChevronRight size={20} strokeWidth={2.5} />
          )}
        </button>

        {isSidebarOpen && (
          <div className="space-y-3 p-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#8d99b9]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 text-white flex items-center justify-center font-bold rounded cursor-pointer">
                  T
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold cursor-pointer">
                    Trello Workspace
                  </span>
                  <span className="text-xs py-1">Premium</span>
                </div>
              </div>
            </div>

            <div className="">
              <ul className="space-y-1">
                <li className="flex items-center gap-2 cursor-pointer p-0.5 rounded hover:bg-[#918ca555] w-full">
                  <Columns2 size={18} />
                  <span className="text-sm">Boards</span>
                </li>
                <li className="flex items-center gap-2 cursor-pointer p-0.5 rounded hover:bg-[#918ca555] w-full justify-between">
                  <span className="flex items-center gap-2">
                    <UserRound size={18} />
                    <span className="text-sm">Members</span>
                  </span>
                  <button
                    className="hover:bg-[#948ab7] rounded p-1 w-7"
                    onClick={handleOpenInvite}
                  >
                    <Plus size={20} strokeWidth={2.5} />
                  </button>
                </li>
                <li className="flex items-center gap-2 cursor-pointer p-0.5 rounded hover:bg-[#918ca555] w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Settings size={18} />
                    <span className="text-sm font-semibold">
                      Workspace settings
                    </span>
                  </span>
                  <button className="p-1 w-7">
                    <ChevronDown size={20} strokeWidth={2.5} />
                  </button>
                </li>
              </ul>
            </div>

            <div className="">
              <span className="text-xs uppercase text-gray-700 bg-white px-1 py-0.5 rounded-sm">
                Premium
              </span>
              <div className="mt-2">
                <div className="flex items-center justify-between group">
                  <h2 className="text-sm font-semibold">Workspace Views</h2>
                  <span className="flex items-center gap-1">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#948ab7] rounded p-1 w-7">
                      <Ellipsis size={18} strokeWidth={2.5} />
                    </button>
                    <button className="hover:bg-[#948ab7] rounded p-1 w-7">
                      <Plus size={20} strokeWidth={2.5} />
                    </button>
                  </span>
                </div>
                <ul className="mt-1 space-y-1">
                  <li className="flex items-center gap-2 cursor-pointer p-0.5 rounded hover:bg-[#918ca555] w-full justify-between group">
                    <span className="flex items-center gap-2">
                      <Table2 size={18} />
                      <span className="text-sm italic">Table</span>
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#948ab7] rounded p-1 w-7">
                      <Ellipsis size={18} strokeWidth={2.5} />
                    </button>
                  </li>
                  <li className="flex items-center gap-2 cursor-pointer p-0.5 rounded hover:bg-[#918ca555] w-full justify-between group">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={18} />
                      <span className="text-sm italic">Calendar</span>
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200hover:bg-[#948ab7] rounded p-1 w-7">
                      <Ellipsis size={18} strokeWidth={2.5} />
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="">
              <div className="flex items-center justify-between group">
                <h2 className="text-sm font-semibold">Your Boards</h2>
                <div className="flex items-center gap-1">
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#948ab7] rounded p-1 w-7"
                    onClick={handleOpenYourBoard}
                  >
                    <Ellipsis size={18} strokeWidth={2.5} />
                  </button>
                  <button
                    className="hover:bg-[#948ab7] rounded p-1 w-7"
                    onClick={handleOpenCreateBoard}
                  >
                    <Plus size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              {boardData && boardData.length > 0 ? (
                <>
                  <ul className="mt-1 space-y-2">
                    {boardData.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-2 cursor-pointer p-0.5 rounded hover:bg-[#918ca555] w-full justify-between group"
                        onClick={() => handleOnDashbord(item.id)}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-6 bg-purple-500 rounded`}
                            style={{
                              backgroundColor: item?.bg_color?.startsWith("#")
                                ? item?.bg_color
                                : "transparent",
                              backgroundSize: "cover",
                            }}
                          ></span>
                          <span className="text-sm">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            className="hover:bg-[#948ab7] rounded p-1 w-7"
                            onClick={(e) =>
                              handleOpenBoard(e, item.id, item.title)
                            }
                          >
                            <Ellipsis size={18} strokeWidth={2.5} />
                          </button>
                          <button className="hover:p-0.5">
                            <Star size={20} strokeWidth={2.5} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <div>
                    <p>You do not have any boards</p>
                  </div>
                </>
              )}
              <button
                className="w-full bg-gray-400 py-1 rounded mt-2 hover:bg-gray-500"
                onClick={handleLogOut}
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateBoard open={openCreateBoard} setOpen={setOpenCreateBoard} />
      <InviteMembers openInvite={openInvite} setOpenInvite={setOpenInvite} />

      <CloseBoard
        boardTitle={board_title}
        open={yourBoard}
        setOpen={setYourBoard}
        removeBoard={removeBoard}
      />
      <CloseBoard
        boardTitle={boardTitle}
        open={openBoard}
        setOpen={setOpenBoard}
        removeBoard={removeBoard}
      />
    </>
  );
}
