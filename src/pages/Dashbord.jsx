import React, { useCallback, useRef, useState } from "react";
import TaskCard from "../components/TaskCard";
import {
    Bell,
    CalendarDays,
    ChevronDown,
    Columns2,
    Ellipsis,
    Plus,
    Star,
    Table2,
    UsersRound,
    X,
} from "lucide-react";
import apiHelper from "../helpers/api-helper";
import DEVELOPMENT_CONFIG from "../helpers/config";
import { useIndexContext } from "../context/IndexContext";
import { DndContext } from "@dnd-kit/core";
import Description from "../components/Description";
import { toast, ToastContainer } from "react-toastify";

export default function Dashbord() {
    const [newListCard, setNewListCard] = useState(false);
    const [newListTitle, setNewListTitle] = useState("");

    const { dashbordDataObj, handleOnDashbord, setBoardData, setDashbordDataObj } = useIndexContext();

    const listRef = useRef(null);

    // OPEN AND CLOSE ADD LIST
    const handleNewListCardOpen = () => {
        setNewListCard(true);
        setTimeout(() => {
            if (listRef.current) {
                listRef.current.focus();
            }
        }, 100);
    };
    const handleNewListCardClose = () => {
        setNewListCard(false);
    };

    const success = (msg) => {
        toast.success(msg,
            {
                autoClose: 5000,
            });
    }
    const error = (msg) => {
        toast.success(msg,
            {
                autoClose: 5000,
            });
    }

    const handleValidation = () => {
        let isValid = true
        if (newListTitle.trim() === "") {
            isValid = false;
        }
        return isValid
    }
    // CREATE DASHBORD CARD ( ADD LIST )
    async function handleCreateDashbordCard(e) {
        e.preventDefault();
        if (!handleValidation()) {
            return
        }
        let data = JSON.stringify({
            title: newListTitle,
            board_id: dashbordDataObj?.id // OR FROM LS
        })
        let result = await apiHelper.postRequest("create-dashbord-card", data)
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            handleNewListCardClose()
            setNewListTitle("")
            handleOnDashbord(dashbordDataObj?.id) // UPDATE CONTENT
            success(result.message)
        } else {
            error(result.message)
        }
    }

    // DREAG AND DROP HANDLE
    const handleDragEnd = useCallback(
        async (event) => {
            //   console.log("=======================>>>>>>>>>>>");
            const { active, over } = event;

            if (!over) return;

            const taskId = active.id;
            const newStatus = over.id;

            //   console.log("taskId-child, newStatus-dachbord-card ", taskId, newStatus);

            // UPDATE PARENT OF CHILD CARD
            const data = JSON.stringify({
                id: taskId,
                dashbord_c_id: newStatus,
            });
            let result = await apiHelper.postRequest("update-child-card", data);
            if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
                // UPDATE CONTENT ( OR FROM LS )
                handleOnDashbord(dashbordDataObj?.id);
                console.log("MESSAGE IF : ", result?.message);
            } else {
                console.log("MESSAGE ELSE : ", result?.message);
            }
        },
        [dashbordDataObj]
    );

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleToggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogOut = () => {
        handleToggleMenu()
        localStorage.removeItem("token")
        setBoardData([])
        setDashbordDataObj({})
    }

    const [allNotification, setAllNotification] = useState([])
    async function getNotification() {
        let result = await apiHelper.getRequest("get-notification")
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setAllNotification(result?.body)
        } else {
            setAllNotification([])
        }
    }

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const handleToggleNotifications = () => {
        getNotification()
        setIsNotificationOpen(!isNotificationOpen);
    }
    const handleCloseAll = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsNotificationOpen(false);
            setIsMenuOpen(false);
        }
    }

    return (
        <>
            <div
                className="flex-1 overflow-auto overflow-y-hidden bg-[#8636a5]"
                style={{
                    backgroundColor: dashbordDataObj?.bg_color?.startsWith("#")
                        ? dashbordDataObj?.bg_color
                        : "8636a5",
                    backgroundSize: "cover",
                }}
            >
                {/* HEADER */}
                <div className="fixed w-full flex items-center bg-[#50247e] p-3 border-t border-[#8d99b9] gap-2 z-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-bold cursor-pointer hover:bg-[#918ca555] inline-block p-1 px-2 rounded">
                            {dashbordDataObj.title || "Your Board"}
                        </h1>
                        <button className="hover:bg-[#948ab7] rounded cursor-pointer p-2">
                            <Star size={16} strokeWidth={2.5} />
                        </button>
                        <button className="hover:bg-[#948ab7] rounded cursor-pointer p-2">
                            <UsersRound size={16} strokeWidth={2.5} />
                        </button>
                        <button className="flex items-center gap-1 cursor-pointer text-sm font-semibold bg-amber-50 text-gray-700 px-2.5 py-2 rounded">
                            <Columns2 size={15} strokeWidth={2.5} />
                            <span className="">Board</span>
                        </button>
                        <ul>
                            <li>
                                <button className="flex items-center gap-1 hover:bg-[#948ab7] rounded cursor-pointer text-sm font-semibold text-white px-2.5 py-2">
                                    <Table2 size={15} strokeWidth={2.5} />
                                    <span className="">Table</span>
                                </button>
                            </li>
                        </ul>
                        <button className="hover:bg-[#948ab7] rounded cursor-pointer p-2">
                            <ChevronDown size={15} strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className=" flex items-center gap-2 relative" tabIndex={0} onBlur={handleCloseAll}>
                        <button className="hover:bg-[#948ab7] rounded p-1 w-6 cursor-pointer"
                            onClick={handleToggleNotifications}
                        >
                            <Bell size={15} strokeWidth={2.5} />
                        </button>
                        {isNotificationOpen && (
                            <div className="absolute h-92 w-80 top-8 left-2 bg-white border rounded shadow-md p-3">
                                <h3 className="text-gray-700 text-lg border-b border-b-gray-300">Notifications</h3>
                                <>
                                    {allNotification && allNotification.length > 0 ?
                                        (
                                            <ul className="text-gray-600 text-sm mt-3 max-h-72 flex flex-col gap-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
                                                {allNotification.map((value) => (
                                                    < li key={value.id} className="border border-gray-200 p-2 rounded" >{value.message}</li>
                                                ))
                                                }
                                            </ul>
                                        ) : (
                                            <div className="h-72 flex items-center justify-center">
                                                <p className="text-gray-700 text-lg ">No Notification</p>
                                            </div>
                                        )
                                    }
                                </>
                            </div>
                        )}
                        <button className="hover:bg-[#948ab7] rounded p-1 w-6 cursor-pointer">
                            <CalendarDays size={15} strokeWidth={2.5} />
                        </button>
                        <button className="hover:bg-[#948ab7] rounded p-1 w-6 cursor-pointer"
                            onClick={handleToggleMenu}
                        >
                            <Ellipsis size={15} strokeWidth={2.5} />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute top-8 right-0 bg-white border rounded shadow-md p-2">
                                <button
                                    className="text-gray-500 bg-gray-200 text-base px-3 py-1 rounded hover:bg-gray-300"
                                    onClick={handleLogOut}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {/* CONTENT */}

                <div className="flex gap-4 mt-16 p-3 w-fit ">
                    <DndContext onDragEnd={handleDragEnd}>
                        {!!dashbordDataObj &&
                            dashbordDataObj?.dashbord_cards?.map((value) => (
                                <TaskCard key={value.id} id={value.id} values={value} />
                            ))}
                    </DndContext>

                    {dashbordDataObj.id && (
                        <>
                            {newListCard ? (
                                <div className="bg-white h-fit p-2 rounded-xl min-w-72 flex flex-col gap-2">
                                    <textarea
                                        ref={listRef}
                                        value={newListTitle}
                                        placeholder="Enter list name..."
                                        className="w-full h-10 text-sm text-gray-700 font-semibold border-2 border-blue-500 rounded-sm resize-none outline-none px-2 py-2"
                                        onChange={(e) => setNewListTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleCreateDashbordCard(e);
                                            }
                                        }}
                                    />
                                    <div className="flex gap-1">
                                        <button
                                            className="text-sm bg-blue-600 hover:bg-blue-700 px-3 rounded cursor-pointer"
                                            onClick={handleCreateDashbordCard}
                                        >
                                            Add list
                                        </button>
                                        <button
                                            className="text-gray-500 p-2 rounded hover:bg-gray-300 cursor-pointer"
                                            onClick={handleNewListCardClose}
                                        >
                                            {" "}
                                            <X size={22} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-fit">
                                    <button
                                        className="flex items-center gap-2 p-2 px-3 bg-[#955db6] rounded-xl min-w-72 hover:bg-[#824da3] transition-colors duration-200 cursor-pointer"
                                        onClick={handleNewListCardOpen}
                                    >
                                        <Plus size={18} strokeWidth={3} />
                                        <span className="text-sm font-semibold">
                                            Add another list
                                        </span>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div >

            <Description />
            <ToastContainer rtl />
        </>
    );
}
