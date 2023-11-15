import Calender from "@/components/Calendar";
import React from "react"
import 'react-calendar/dist/Calendar.css'
import getEvents from "@/actions/getEvents";
import getFormElements from "@/actions/getFormElements";
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
        <div>
            <Calender user_events={events} forms_got={forms} register_got={registers} fetched_options={options} fetched_clubs={clubs}/>
        </div>
    )
}

export default Schedule