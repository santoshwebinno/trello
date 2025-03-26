import React from "react";
import { X } from "lucide-react";
import { useIndexContext } from "../context/IndexContext";

const Member = ({ setIsOpenJoinMember }) => {
    const { boardUsers, joinedUsers } = useIndexContext();
    // console.log("joinedUsers", joinedUsers)

    const closeMemberBoard = () => {
        setIsOpenJoinMember(false)
    }

    let extractFirst = (name) => {
        const fName = name?.charAt(0);
        return fName
    }

    return (
        <div className="bg-white text-gray-700 rounded-lg shadow-xl w-80 p-3 border border-gray-200 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <p></p>
                <h2 className="text-sm font-normal">Members</h2>
                <button
                    className="hover:bg-gray-300 rounded cursor-pointer p-1.5"
                    onClick={closeMemberBoard}
                >
                    <X size={18} />
                </button>
            </div>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search members"
                className="w-full p-2 text-gray-600 text-sm border border-blue-600 rounded-sm focus:outline-none focus:ring-none"
            />

            {/* Board & Card members List */}
            {!!boardUsers && boardUsers?.length > 0 &&
                <div className="">
                    <h3 className="text-gray-600 text-xs font-semibold mb-2">Board members</h3>
                    <ul className="flex flex-col gap-2">
                        {boardUsers?.map((value) => (
                            <li
                                key={value.id}
                                className="flex items-center justify-between p-1 px-2 bg-gray-200 rounded-md cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 flex items-center justify-center bg-yellow-500 font-bold rounded-full">
                                        {extractFirst(value.name)}
                                    </div>
                                    <span className="text-sm">{value.name}</span>
                                </div>
                                <X size={16} />
                            </li>
                        ))}
                    </ul>
                </div>
            }
        </div>
    );
};

export default Member;