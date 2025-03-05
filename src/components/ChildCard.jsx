import { FilePenLine } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import apiHelper from '../helpers/api-helper';
import DEVELOPMENT_CONFIG from '../helpers/config';

export default function ChildCard({ id, cardTitle, setIsCheckedC }) {
    const [isChecked, setIsChecked] = useState(false);
    const [title, setTitle] = useState("");

    // GET STATUS CHECKED OR UNCHECKED AND SET TITLE
    async function getStatus() {
        setIsChecked(setIsCheckedC)
        setTitle(cardTitle)
    }
    useEffect(() => {
        getStatus(id)
    }, [setIsCheckedC])

    // CHECKED OR UNCHECKED
    const handleComplete = (async () => {
        const newStatus = !isChecked;
        let data = JSON.stringify({
            id,
            is_checked: newStatus
        })
        let result = await apiHelper.postRequest("update-child-card", data)
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setIsChecked(newStatus);
            console.log("MESSAGE IF : ", result?.message)
        } else {
            console.log("MESSAGE ELSE : ", result?.message)
        }
    })

    return (
        <div key={id} className="flex items-start justify-between p-2 border border-gray-300 rounded hover:ring-1 hover:ring-blue-500 group">
            <div className="flex items-center justify-between gap-2 w-full">
                <input
                    type="checkbox"
                    checked={isChecked}
                    className="hidden group-hover:block w-5 h-4.5 appearance-none border-2 border-gray-500 cursor-pointer rounded-full checked:block checked:bg-green-600 checked:border-green-600 bg-center bg-no-repeat focus:outline-none"
                    onChange={() => handleComplete(id)}
                />
                <textarea
                    value={title}
                    className="w-full text-sm border-none resize-none outline-none overflow-hidden"
                    onChange={(e) => {
                        setTitle(e.target.value)
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                    }}
                />
            </div>
            <button className="cursor-pointer">
                <FilePenLine size={18} />
            </button>
        </div>
    )
}
