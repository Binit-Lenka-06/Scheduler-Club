import { Events } from "@/types"
import EventsBox from "./Events";
import getEvents from "@/actions/getEvents";
import { useEffect, useState } from "react";
import ScheduleContent from "@/app/schedule/components/ScheduleComponent";


const EventContainer = async () => {
    const events = await getEvents();
    return(
        <div>
            <ScheduleContent user_events={events} allow_register/>
        </div>
    )
}
export default EventContainer