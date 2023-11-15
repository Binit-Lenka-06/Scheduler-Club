"use client"

import { AiOutlinePlus } from "react-icons/ai"
import Box from "./Box"

const ReminderItems = () => {
    return(
        <Box className="w-full h-fit flex flex-row justify-between px-5">
            <div className="text-neutral-400">
                Add Reminder
            </div>
            <AiOutlinePlus onClick={()=>{}} size={20} className="text-neutral-400 cursor-pointer hover:text-white transition" />
        </Box>
    )
}

export default ReminderItems