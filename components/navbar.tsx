"use client"

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import NavBarItems from "./navbaritems";
import Box from "./Box";
import Button from "./Button";
import useAuthModel from "@/hooks/useAuthModel";
import { useUser } from "@/hooks/useUser";
import { AiOutlinePlus } from "react-icons/ai";
import useInfoModel from "@/hooks/useInfoUploadModel";
import { Events, Users } from "@/types";
import ProfileContent from "./ProfileContent";
import EventAddAuthentication from "@/hooks/EventAddAuthentication";
import { FaUserCircle } from "react-icons/fa";
import useEventModel from "@/hooks/useEventAddModel";

export let AuthenticationToken: string | null = null

interface NavBarProps {
    children: React.ReactNode;
    users: Users[];
}

const Navbar: React.FC<NavBarProps> = ({
    children,
    users
}) => {
    console.log(users)
    const pathnames = usePathname();
    const routes = useMemo(() => [
        {
            label: 'Home',
            active: pathnames === '/',
            href: '/'
        },
        {
            label: 'Schedule',
            active: pathnames === '/schedule',
            href: '/schedule',
        },
        {
            label: 'Clubs',
            active: pathnames === '/clubs',
            href: '/clubs'
        },
    ], [pathnames])

    const { onOpen } = useAuthModel();
    const authModel = useAuthModel();
    const {user, userDetails} = useUser();
    const infoModel = useInfoModel()
    const [clubAccess, setClubAccess] = useState<string | null>(null)
    const eventModel = useEventModel()

    const handleClubAccess = (clubAccessValue: string | null) => {
        setClubAccess(clubAccessValue)
        AuthenticationToken = clubAccessValue
        console.log(clubAccess !== null)
    }
    
    return(
        <>
        <div>
            {users.map((items) => (
                <EventAddAuthentication 
                key={items.id}
                data={items}
                onClubAccess={handleClubAccess}
                />
            ))}
        </div>
        <div className="flex flex-row h-fit items-center medium:pr-0 new:pr-0">
            <Box className="w-full">
                <div className="w-full h-20 flex items-center px-1">
                    <nav className="bg-gray-800 flex w-full text-white rounded-2xl backdrop-blur-1xl h-16 items-center justify-end pr-6 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 new:pr-0 relative overflow-hidden">
                        {users.length !== 0 ? (
                            <>
                            <div className="absolute left-0 w-36 new:w-14 medium:w-20">
                                {users.map((item) => (
                                    <ProfileContent 
                                    key={item.id}
                                    onClick={() => {}}
                                    data={item}
                                    />
                                ) )}
                            </div>
                            </>
                        ): user? (
                            <div className="text-white w-fit h-full absolute left-2 flex items-center flex-row gap-x-2">
                                <button className="text-whte" onClick={infoModel.onOpen}>
                                    <FaUserCircle size={30} className="animate-pulse"/>
                                </button>
                            </div>
                        ):(
                            <div>

                            </div>
                        )}
                        <ul className="justify-end flex space-x-10 items-center new:justify-end new:w-full new:space-x-5 new:pr-3 medium:justify-end medium:w-full medium:space-x-6 medium:pr-5">
                            {routes.map((item) => (
                                <NavBarItems key={item.label} {...item}/>
                            ))}         
                        </ul>
                    </nav>
                </div>
            </Box>
            {user ? (
                <div className="w-0">

                </div>
            ): (
                <Button className="w-1/12 h-full new:w-3/12 medium:w-3/12" onClick={authModel.onOpen}>
                    Log In
                </Button>  
            )}          
        </div>
        <div className="w-full flex justify-center">
            <main className="w-full flex-1 overflow-x-auto px-3">
                {children}
            </main>
        </div>
        </>
    )
}

export default Navbar;