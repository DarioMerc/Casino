import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [balance,setBalance] = useState()

    useEffect(() => {
        fetch(`/api/user/${localStorage.getItem("user")}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                if(data.status != 404){
                    setUser(data.user);
                    setBalance(data.user.balance);
                }
            });
    },[balance]);

    return (
        <UserContext.Provider value={{ user, setUser, balance, setBalance }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;