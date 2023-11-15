"use client";

import { useState } from 'react'
import Datepicker from "react-tailwindcss-datepicker";
import Box from "./Box";
import ScheduleContent from "@/app/schedule/components/ScheduleComponent";
import { Clubs, Events, Forms, Options, Registration } from "@/types";
import EventItems from "./EventItems";
import { generateDate, months } from '@/hooks/calender';
import { RxCaretLeft, RxCaretRight } from "react-icons/rx"
import Reminder from './Reminder';
import ReminderItems from './ReminderItems';

interface CalenderProps {
  user_events: Events[];
  forms_got: Forms[];
  register_got: Registration[];
  fetched_options: Options[];
  fetched_clubs: Clubs[]
}
const Calender: React.FC<CalenderProps> = ({
  user_events,
  forms_got,
  register_got,
  fetched_options,
  fetched_clubs
}) => {
  console.log(fetched_options.length)
  const [datselectDate, setdatSelectDate] = useState({
    startDate: null,
    endDate: null
  })
  let [filteredEvents, setFilteredEvents] = useState<Events[]>([]);
  const handleOnClick = (values: any) => {
    setSelectDate(new Date(values?.startDate))
    setMonth(new Date(values?.startDate).getMonth())
    setYearnew(new Date(values?.startDate).getFullYear())
    console.log("Started")
    let SelectedDate = new Date(values?.startDate);
    console.log(SelectedDate)
    setdatSelectDate(values)
    const adjustedDate = SelectedDate;
    const SelectedEvents = user_events.filter((items) => {
        if(items.Event_Start_Data === items.Event_End_Data && adjustedDate.toISOString() === new Date(items.Event_Start_Data).toISOString()){
          console.log(adjustedDate.toISOString())
          console.log(new Date(items.Event_Start_Data).toISOString())
          console.log("Entered into the correct sequence")
          return true
        }
        const startCheck = adjustedDate && new Date(items.Event_Start_Data) <= adjustedDate;
        const EndCheck = adjustedDate && new Date(items.Event_End_Data) >= adjustedDate;
        return adjustedDate && startCheck && EndCheck;
    });
    setFilteredEvents(SelectedEvents);
    filteredEvents = SelectedEvents;
    console.log(filteredEvents);
    console.log(filteredEvents === null);
    console.log("Event Added")
  }

  const handleClickMain = (value: any) => {
    setdatSelectDate({startDate: null, endDate:null})
    console.log("Entered into Date Section")
    const selectedDate = value
    setMonth(value.getMonth())
    setYearnew(value.getFullYear())
    console.log(selectedDate)
    const SelectedEvents = user_events.filter((items) => {
        if(items.Event_Start_Data === items.Event_End_Data && selectedDate.toDateString() === new Date(items.Event_Start_Data).toDateString()){
            console.log(selectedDate.toDateString())
            console.log(new Date(items.Event_Start_Data).toDateString())
            console.log("Entered into the correct sequence")
            return true
        }
        const startCheck = selectedDate && new Date(items.Event_Start_Data).setHours(0, 0, 0) <= selectedDate;
        const EndCheck = selectedDate && new Date(items.Event_End_Data).setHours(0, 0, 0) >= selectedDate;
        return selectedDate && startCheck && EndCheck;
    })
    console.log(SelectedEvents)
    setFilteredEvents(SelectedEvents);
    filteredEvents = SelectedEvents
  }
const days = ["S", "M", "T", "W", "T", "F", "S"];
const [month, setMonth] = useState(new Date().getMonth())
const [yearnew, setYearnew] = useState(new Date().getFullYear())
const [selectDate, setSelectDate] = useState(new Date())
  return(
    <div className="w-full h-full flex 2xl: flex-row gap-x-1 scrollbar new:flex-col md:flex-row new:gap-y-2 new:justify-center pr-2 new:pr-0 basic:flex-col basic:gap-y-2 basic:pr-0">
        <div className="flex w-3/4 h-fit flex-col gap-y-4 scrollbar new:w-full overflow-hidden medium:w-full basic:w-full">
            <Box className="py-0 w-full h-fit rounded-lg new:w-full flex flex-col gap-y-4 px-0">
                <div className="flex flex-row w-full gap-x-2 new:flex-col new:gap-y-2 medium:flex-col medium:gap-y-2">
                    <div className="flex flex-col w-2/5 new:w-full gap-y-4 medium:w-full ">
                        <div className=" rounded-lg flex gap-y-4 flex-col">
                            <div className="w-full h-fit bg-[#10151c] p-4 rounded-lg">
                                <div className="flex justify-between items-center px-4">
                                    <h1 className="select-none font-semibold">
                                        {months[month]}, {yearnew}
                                    </h1>
                                    <div className="flex gap-10 items-center ">
                                        <RxCaretLeft
                                            className="w-5 h-5 cursor-pointer hover:scale-105 transition-all text-white"
                                            onClick={() => {
                                                if(month === 0){
                                                    setMonth(11)
                                                    setYearnew(yearnew-1)
                                                } else {
                                                    setMonth(month - 1)
                                                }
                                            }}
                                        />
                                        <h1
                                            className="cursor-pointer hover:scale-105 transition-all select-none"
                                            onClick={() => {
                                                setSelectDate(new Date())
                                                setMonth(new Date().getMonth())
                                                setYearnew(new Date().getFullYear())
                                                handleClickMain(new Date())
                                            }}
                                        >
                                            Today
                                        </h1>
                                        <RxCaretRight
                                            className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                                            onClick={() => {
                                                if(month === 11){
                                                    setMonth(0)
                                                    setYearnew(yearnew+1)
                                                } else {
                                                    setMonth(month+1)
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 ">
                                    {days.map((day, index) => {
                                        return (
                                            <h1
                                                key={index}
                                                className="text-sm text-center h-14 w-14 grid place-content-center text-gray-500 select-none"
                                            >
                                                {day}
                                            </h1>
                                        );
                                    })}
                                </div>

                                <div className=" grid grid-cols-7 ">
                                    {generateDate(yearnew, month).map(
                                        ({ current_month, date, today }, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className={`p-2 text-center h-14 grid place-content-center text-sm`}
                                                    onClick={() => {handleClickMain(date)}}
                                                >
                                                    <h1
                                                        className={`h-10 w-10 rounded-full grid place-content-center hover:bg-indigo-500 hover:text-white transition-all cursor-pointer select-none ${current_month ? "": "text-neutral-600"} ${today? "bg-red-600 text-white": ""} ${selectDate.toDateString() === date.toDateString() ? "bg-indigo-500 text-white": ""}`}
                                                        onClick={() => setSelectDate(date)}
                                                    >
                                                        {date.getDate()}
                                                    </h1>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                            <div className="h-fit 2xl:hidden xl:hidden medium:block basic:visible new:visible">
                                <Datepicker value={datselectDate} onChange={(values) => handleOnClick(values)} useRange={false} asSingle={true} popoverDirection="down"
                                inputClassName={"bg-[#10151c] w-full rounded-lg p-3 focus:ring-0 focus:outline-none py-4"}
                                primaryColor={"red"}
                                displayFormat={"DD/MM/YYYY"}
                                placeholder="Select Event Date"
                                readOnly={true}
                                />
                            </div>
                            <div className="h-fit medium:hidden visible">
                                <Datepicker value={datselectDate} onChange={(values) => handleOnClick(values)} useRange={false} asSingle={true} popoverDirection="up"
                                inputClassName={"bg-[#10151c] w-full rounded-lg p-3 focus:ring-0 focus:outline-none py-4"}
                                primaryColor={"red"}
                                displayFormat={"DD/MM/YYYY"}
                                placeholder="Select Event Date"
                                readOnly={true}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="px-2 flex flex-col gap-y-4 h-fit new:px-0 new:visible new:w-full medium:w-full medium:visible medium:px-0 w-3/5 new:flex-col-reverse new:gap-y-2 medium:flex medium:flex-col-reverse">
                        <div className="py-4 h-fit w-full rounded-lg bg-[#10151c] medium:w-full new:visible gap-y-2">
                            <EventItems />
                            <Box className="w-full h-fit flex flex-col gap-y-2 max-h-[280px] overflow-auto scrollbar new:w-full">
                                <ScheduleContent allow_register={true} filtered_events={user_events.filter((date) => new Date(date.Event_Start_Data) > new Date())} form_details={forms_got} registration_got={register_got} fetchedOption={fetched_options} fetchedClubs={fetched_clubs}/>
                            </Box>
                        </div>
                        <Box className="bg-[#10151c] rounded-lg px-0 py-2">
                            <div className="pt-3 pb-1 bg-[#10151c] px-4 rounded-lg w-full">
                                Events
                            </div>
                        <div className="w-full bg-[#10151c] px-0 rounded-lg flex flex-col py-3 new:w-full max-h-[250px] overflow-auto scrollbar">
                            {filteredEvents? (
                            <Box className="w-full h-fit new:w-full">
                                <ScheduleContent filtered_events={filteredEvents} allow_register={true} form_details={forms_got} registration_got={register_got} fetchedOption={fetched_options} fetchedClubs={fetched_clubs}/>
                            </Box>
                            ):(
                            <div>

                            </div>
                            )}
                        </div>
                        </Box>
                    </div>
                </div>
            </Box>
        </div>
        <div className="flex flex-col gap-y-3 w-1/4 medium:w-full">
                <div className="py-4 h-fit w-full rounded-lg bg-[#10151c] flex flex-col gap-y-4 px-2 new:w-full medium:w-full basic:w-full">
                    <Box className="w-full h-fit text-white">
                        Starred Events
                    </Box>
                    <Box className="w-full h-fit rounded-lg bg-[rgba(16,21,26,0.2)] text-neutral-400 flex flex-col gap-y-2 max-h-[280px] overflow-auto scrollbar py-1">
                        <ScheduleContent allow_register={false}  filtered_events={user_events} form_details={forms_got} registration_got={register_got} fetchedOption={fetched_options} fetchedClubs={fetched_clubs}/>
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
  )
}

export default Calender