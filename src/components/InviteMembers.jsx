import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { X, Link } from "lucide-react";

const style = {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    p: 2,
};

export default function InviteMembers({ openInvite, setOpenInvite }) {
    const [email, setEmail] = useState("");

    const handleClose = () => {
        setOpenInvite(false);
    };

    return (
        <div>
            <Modal
                open={openInvite}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="rounded-xl">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg text-gray-700 font-normal">Invite to Workspace</h2>
                            <button
                                className="text-gray-400 hover:text-white"
                                onClick={handleClose}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <input
                            type="email"
                            placeholder="Email address or name"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 bg-white text-sm text-gray-600 font-normal border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex items-center justify-between mt-8 gap-3">
                            <p className=" text-sm text-gray-900">
                                Invite someone to this Workspace with a link:
                            </p>
                            <button
                                className="flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 text-sm text-gray-900 font-medium py-2 px-4 rounded-md"
                                onClick={() => alert("Invite sent")}
                            >
                                <Link size={16} /> Invite
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
