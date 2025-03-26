import React, { createContext, useContext, useState } from 'react'
import DEVELOPMENT_CONFIG from '../helpers/config';
import apiHelper from '../helpers/api-helper';

const IndexContext = createContext();

export default function ContextProvider({ children }) {
    const [dashbordDataObj, setDashbordDataObj] = useState({})

    const [boardData, setBoardData] = useState([]);

    const [boardUsers, setBoardUsers] = useState([])

    const [joinedUsers, setJoinedUsers] = useState([])

    const [openDescription, setOpenDescription] = useState(false)
    const [childCardDetails, setChildCardDetails] = useState({})

    // DISPLAY BOARD DATA ( TASK CARD WITH CHILD CARD )
    const handleOnDashbord = (async (id) => {
        console.log("Enter in handle===========OnDashbord context")
        localStorage.setItem("dashbordCID", id)
        let result = await apiHelper.getRequest(`display-board?board_id=${id}`)
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setDashbordDataObj(result?.body)
        } else {
            setDashbordDataObj({})
        }
    })

    // GET BOARDS WHEN USER IS LOGED IN
    async function getBoards() {
        console.log("getBoards function run ======>>> context");
        let result = await apiHelper.getRequest("get-boards");
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setBoardData(result?.body);
            let dashbordCID = parseInt(localStorage.getItem("dashbordCID"), 10);
            if (result.body?.length > 0) {
                if (dashbordCID) {
                    handleOnDashbord(dashbordCID);
                } else {
                    handleOnDashbord(result?.body[0]?.id);
                }
            }
        } else {
            setBoardData([]);
        }
    }

    // GET BOARD USERS
    async function getBoardUsers(id) {
        let result = await apiHelper.getRequest(`get-board-users?board_id=${id}`)
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setBoardUsers(result?.body)
        } else {
            setBoardUsers([])
        }
    }

    // JOIN AND LEAVE SINGLE USER
    const handleJoinLeaveUser = async (e, c_id) => {
        e.preventDefault();
        let data = JSON.stringify({
            c_id
        })
        let result = await apiHelper.postRequest("join-user-on-card", data)
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            // setJoinedUsers([])
        }
    }

    // GET CARD JOINED USERS
    async function getCardJoinedUsers(c_id) {
        let result = await apiHelper.getRequest(`get-card-joined-user?c_id=${c_id}`)
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setJoinedUsers(result?.body)
        } else {
            setJoinedUsers([])
        }
    }

    async function getChildCardDetails(c_id) {
        let result = await apiHelper.getRequest(`get-child-card?c_id=${c_id}`)
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setChildCardDetails(result?.body)
        } else {
            setChildCardDetails({})
        }
    }


    // OPEN DESCRIPTION MODAL AND GET CHILD CARD DATA
    const handleOpenDescriptionModal = (async (id) => {
        await getChildCardDetails(id)
        await getCardJoinedUsers(id)
        setOpenDescription(true)
        // let result = await apiHelper.getRequest(`get-child-card?c_id=${id}`)
        // if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
        //     setOpenDescription(true)
        //     setChildCardDetails(result?.body)
        // } else {
        //     setOpenDescription(false)
        //     setChildCardDetails({})
        // }
    })

    // CHECKED OR UNCHECKED CHILD CARD
    const handleComplete = async (e, id) => {
        e.preventDefault();
        const newStatus = !childCardDetails?.history?.is_checked;
        let data = JSON.stringify({
            c_id: id,
            is_checked: newStatus,
        });
        let result = await apiHelper.postRequest("update-child-card-status", data);
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setChildCardDetails((prev) => ({
                ...prev,
                history: {
                    ...prev.history,
                    is_checked: newStatus,
                },
            }));
        } else { }
    };

    const handleValidation = () => {
        let isValid = true;
        if (childCardDetails?.history.title.trim() === "") {
            isValid = false;
        }
        return isValid;
    };
    // UPDATE CHILD CARD TITLE
    const handleUpdateChildCardTitle = async (e, id, title) => {
        e.preventDefault();
        if (!handleValidation()) {
            return;
        }
        let data = JSON.stringify({
            c_id: id,
            title,
        });
        let result = await apiHelper.postRequest("update-child-card-title", data);
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setChildCardDetails((prev) => ({
                ...prev,
                history: {
                    ...prev.history,
                    title: title,
                },
            }));
        } else { }
    };

    return (
        <IndexContext.Provider
            value={{
                dashbordDataObj, setDashbordDataObj, handleOnDashbord,
                boardData, setBoardData, getBoards,
                boardUsers, setBoardUsers, getBoardUsers,
                joinedUsers, setJoinedUsers, handleJoinLeaveUser,
                getCardJoinedUsers,
                openDescription, setOpenDescription, handleOpenDescriptionModal,
                childCardDetails, setChildCardDetails,
                handleComplete,
                handleUpdateChildCardTitle,
            }}
        >
            {children}
        </IndexContext.Provider>
    )
}

export const useIndexContext = () => useContext(IndexContext)