"use client"

import EventsBox from "@/components/Events";
import { Clubs, Events, Forms, Options, Registration, starred_events } from "@/types";
import { useState } from "react";

interface ScheduleComponentProps {
    filtered_events: Events[];
    allow_register?: boolean;
    form_details: Forms[];
    registration_got: Registration[];
    fetchedOption: Options[];
    fetchedClubs: Clubs[];
}

const ScheduleContent: React.FC<ScheduleComponentProps> =({
    filtered_events,
    allow_register,
    form_details,
    registration_got,
    fetchedOption,
    fetchedClubs,
}) => {
    if(filtered_events.length === 0){
        return(
            <div className="py-4 text-neutral-300 px-2">
                No events found on the selected date
            </div>
        )
    }
    const [clubName, setclubName] = useState('')
    console.log("This is the length received in Schedule Components" + fetchedOption.length)
    console.log("This is the length received in Schedule Components for FormData" + form_details.length)
    return(
        <div>
            <div className="flex flex-col gap-y-2">
                {filtered_events
                .sort((a, b) => new Date(a.Event_Start_Data).getTime() - new Date(b.Event_Start_Data).getTime())
                .map((items) => (
                    <EventsBox 
                    key={items.event_id}
                    data={items}
                    register_allow={allow_register}
                    onClick={() => {}}
                    className={allow_register ? "w-2/12" : "w-5/12"}
                    fetchedForm={form_details}
                    fetchedRegister={registration_got}
                    fetchedOptions={fetchedOption}
                    fetchedEvents={filtered_events}
                    fetchedClubs={fetchedClubs}
                    />
                ))}
            </div>
        </div>
    )
}

export default ScheduleContent