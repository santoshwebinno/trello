import React, { createContext, useContext, useState } from 'react'

const IndexContext = createContext();

export default function ContextProvider({ children }) {
    const [dashbordDataObj, setDashbordDataObj] = useState({})

    return (
        <IndexContext.Provider value={{ dashbordDataObj, setDashbordDataObj }}>
            {children}
        </IndexContext.Provider>
    )
}

export const useIndexContext = () => useContext(IndexContext)