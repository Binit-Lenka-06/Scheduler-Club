import Box from "@/components/Box";
import Calender from "@/components/Calendar";
import Reminder from "@/components/Reminder";
import React from "react"
import 'react-calendar/dist/Calendar.css'
import getEvents from "@/actions/getEvents";
import ScheduleContent from "./components/ScheduleComponent";
import ReminderItems from "@/components/ReminderItems";
import EventItems from "@/components/EventItems";
import getEventsByDate from "@/actions/getEventsByDate";
import getFormElements from "@/actions/getFormElements";
import FormContentForGet from "./components/FormContents";
import getRegistrations from "@/actions/getRegistration";
import getOptionElements from "@/actions/getOptionsElements";
import getClubsElement from "@/actions/getClubs";
import getStarredElements from "@/actions/getStarredEvents";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers"

export const revalidate = 0

const Schedule = async () => {
    const events = await getEvents()
    const forms = await getFormElements()
    const registers = await getRegistrations()
    const options = await getOptionElements()
    const clubs = await getClubsElement()
    const starredEvents = await getStarredElements()
    console.log("Forms:", forms);
    console.log("The length received in Page.tsx" + options.length)

    const supabase = createServerComponentClient({
        cookies: cookies
    })
    
    const {
        data: sessionData,
        error: sessionError
    } = await supabase.auth.getSession();
    
    const filtered_starred_events = events.filter((event) => {
        const starred_Events = starredEvents.find(
            (starredEvents) => 
                starredEvents.event_id === event.event_id &&
                starredEvents.user_id === sessionData.session?.user.id
        );
        return starred_Events !== undefined
    })
    console.log(filtered_starred_events)
    return(
        <>
        <div className="w-full h-full flex 2xl: flex-row gap-x-1 scrollbar new:flex-col md:flex-row new:gap-y-2 new:justify-center pr-2 new:pr-0 basic:flex-col basic:gap-y-2 basic:pr-0">
            <div className="flex w-3/4 h-fit flex-col gap-y-4 scrollbar new:w-full overflow-hidden medium:w-full basic:w-full">
                <Box className="py-0 w-full h-fit rounded-lg new:w-full flex flex-col gap-y-4 px-0">
                    <Calender user_events={events} forms_got={forms} register_got={registers} fetched_options={options} fetched_clubs={clubs}/>
                </Box>
            </div>
            <div className="flex flex-col gap-y-3 w-1/4 medium:w-full">
                <div className="py-4 h-fit w-full rounded-lg bg-[#10151c] flex flex-col gap-y-4 px-2 new:w-full medium:w-full basic:w-full">
                    <Box className="w-full h-fit text-white">
                        Starred Events
                    </Box>
                    <Box className="w-full h-fit rounded-lg bg-[rgba(16,21,26,0.2)] text-neutral-400 flex flex-col gap-y-2 max-h-[280px] overflow-auto scrollbar py-1">
                        <ScheduleContent allow_register={false}  filtered_events={filtered_starred_events} form_details={forms} registration_got={registers} fetchedOption={options} fetchedClubs={clubs}/>
                    </Box>
                </div>
                <div className="py-4 w-full rounded-lg bg-[#10151c] flex flex-col gap-y-3">
                    <Box className="w-full h-fit rounded-lg bg-[rgba(16,21,26,0.2)] px-5 text-white">
                        Reminders
                    </Box>
                    <ReminderItems />
                    <div className="px-5 w-full h-fit scrollbar max-h-[150px] flex flex-col gap-y-2 overflow-auto">
                        <Reminder />
                        <Reminder />
                        <Reminder />
                        <Reminder />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Schedule