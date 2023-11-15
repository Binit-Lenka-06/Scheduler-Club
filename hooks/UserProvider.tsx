"use client";

import { MyUserContextProviders } from "@/hooks/useUser";

interface UserProviderProps {
    children: React.ReactNode;
};

const UserProvider: React.FC<UserProviderProps> = ({
    children
}) => {
    return(
        <MyUserContextProviders>
            {children}
        </MyUserContextProviders>
    )
}

export default UserProvider;