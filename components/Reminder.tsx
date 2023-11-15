"use client"

import Box from "./Box";
import { FaBell } from "react-icons/fa"

interface ReminderProps {
    remind?: boolean;
}
const Reminder: React.FC<ReminderProps> = ({
    remind
}) => {
    return(
        <Box className="w-full h-20 rounded-lg border border-neutral-500 p-2 hover:shadow-sm hover:shadow-indigo-500 transition cursor-pointer flex flex-row justify-between items-center">
            <div className="flex flex-col gap-y-1">
                <div className="text-xl text-neutral-300">
                    GRAPHICA
                </div>
                <div className="text-neutral-500 text-sm">
                    on 28 October 2023
                </div>
            </div>
            <div className="h-full w-fit flex justify-center items-center mr-3">
                <FaBell size={23} className={remind? "text-indigo-500": "hover:text-indigo-500 text-white"}/>
            </div>
        </Box>
    )
}

export default Reminder;