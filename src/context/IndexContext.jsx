import React, { createContext, useContext, useState } from 'react'
import DEVELOPMENT_CONFIG from '../helpers/config';
import apiHelper from '../helpers/api-helper';

const IndexContext = createContext();

export default function ContextProvider({ children }) {
    const [dashbordDataObj, setDashbordDataObj] = useState({})

    const [openDescription, setOpenDescription] = useState(false)
    const [childCardDetails, setChildCardDetails] = useState({})

    // const [isChecked, setIsChecked] = useState(false);

    // DISPLAY BOARD DATA ( TASK CARD WITH CHILD CARD )
    const handleOnDashbord = (async (id) => {
        console.log("Enter in handle===========OnDashbord")
        localStorage.setItem("dashbordCID", id)
        let result = await apiHelper.getRequest(`display-board?b_id=${id}`)
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setDashbordDataObj(result?.body)
        }
        else {
            setDashbordDataObj({})
        }
    })
    

    // OPEN DESCRIPTION MODAL AND GET CHILD CARD DATA
    const handleOpenDescriptionModal = (async (id) => {

        let result = await apiHelper.getRequest(`get-child-card?c_id=${id}`)
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setOpenDescription(true)
            setChildCardDetails(result?.body)
        } else {
            setOpenDescription(true)
            setChildCardDetails({})
        }
    })

    // CHECKED OR UNCHECKED CHILD CARD
    // const handleComplete = (async (e, id) => {
    //     e.preventDefault();
    //     // const newStatus = !isChecked;
    //     // let data = JSON.stringify({
    //     //     id,
    //     //     is_checked: newStatus
    //     // })
    //     // let result = await apiHelper.postRequest("update-child-card-status", data)
    //     // if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
    //     //     setIsChecked(newStatus);
    //     //     console.log("MESSAGE IF : ", result?.message)
    //     // } else {
    //     //     console.log("MESSAGE ELSE : ", result?.message)
    //     // }
    // })


    return (
        <IndexContext.Provider value={{
            dashbordDataObj, setDashbordDataObj, handleOnDashbord,
            openDescription, setOpenDescription, handleOpenDescriptionModal,
            childCardDetails, setChildCardDetails
        }}>
            {children}
        </IndexContext.Provider>
    )
}

export const useIndexContext = () => useContext(IndexContext)