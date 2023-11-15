"use client"

import { AiOutlinePlus } from "react-icons/ai"
import Box from "./Box"
import { AuthenticationToken } from "./navbar"
import useEventModel from "@/hooks/useEventAddModel"

const EventItems = () => {
    const eventModel = useEventModel();
    const authtoken = AuthenticationToken
    return (
        <Box className="w-full h-fit mb-5 text-white flex justify-between px-4 new:flex new:w-full new:justify-between">
            <div>
                Upcoming Events
            </div>
            {authtoken !== null ? (
                <button className="w-fit h-fit" onClick={eventModel.onOpen}>
                    <AiOutlinePlus onClick={eventModel.onOpen} size={20} className="text-neutral-400 cursor-pointer hover:text-white transition" />
                </button>
            ): (
                <div>

                </div>
            )}
        </Box>
    )
}

export default EventItems