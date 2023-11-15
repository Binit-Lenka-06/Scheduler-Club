import useEventUpdateModel from "@/hooks/useEventUpdateModel"
import Modal from "./Modal"
import Input from "./Input"
import { useState } from "react"
import DatePicker from "react-tailwindcss-datepicker"
import dayjs from "dayjs"
import Select from "./Select"
import Button from "./Button"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { MdDelete } from "react-icons/md"
import useLoadImageData from "@/hooks/useLoadImageData"
import uniqid from "uniqid"
import { useRouter } from "next/navigation"
import Image from "next/image"

const EventUpdateModel = () => {

    const eventUpdateModel = useEventUpdateModel()
    const [selectedValue, setSelectedValue] = useState('None');
    const [newEventName, setNewEventName] = useState('');
    const supabase = useSupabaseClient()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const onChange = (open: boolean) => {
        if(!open){
            setNewEventName('');
            setDate({ startDate: null, endDate: null });
            setendDate({ startDate: null, endDate: null });
            setregistrationDealine({ startDate: null, endDate: null });
            setSelectedValue('None');
            eventUpdateModel.onClose()
        }
    }
    const [date, setDate] = useState({
        startDate: null,
        endDate: null
    })
    const [enddate, setendDate] = useState({
        startDate: null,
        endDate: null
    })
    const [registrationDealine, setregistrationDealine] = useState({
        startDate: null,
        endDate: null
    })
    const handleSelectChange = (events: any) => {
        const value = events.target.value;
        setSelectedValue(value)
        console.log("Selected Value : ", value)
    }
    const handleEventNameChange = async () => {
        setIsLoading(true)
        const {error} = await supabase
            .from('events')
            .update({"Event_Name": newEventName})
            .eq('event_id', eventUpdateModel.eventId)

        console.log("Updated")
        setNewEventName('')
        setSelectedValue('None')
        setIsLoading(false)
        router.refresh()
        eventUpdateModel.onClose()
    }
    const handleEventDateChange = async () =>{
        setIsLoading(true)
        if((date.startDate !== null && enddate.startDate !== null) && (date.startDate < enddate.startDate) && (date.startDate ?? new Date() > (eventUpdateModel.event?.Registration_Deadline ?? new Date()))){
            if(date.startDate !== null){
                const {error} = await supabase
                    .from('events')
                    .update({"Event_Start_Data": date.startDate})
                    .eq('event_id', eventUpdateModel.eventId)
            }
            if(enddate.startDate !== null){
                const {error} = await supabase
                    .from('events')
                    .update({"Event_End_Data": enddate.startDate})
                    .eq('event_id', eventUpdateModel.eventId)
            }
            setDate({startDate: null, endDate: null})
            setendDate({startDate: null, endDate: null})
            setSelectedValue('None')
        } else {
            console.log("Both Dates must be entered")
        }
        setIsLoading(false)
        router.refresh()
        eventUpdateModel.onClose()
    }
    const hadleEventRegistrationDeadlineChange = async () => {
        setIsLoading(true)
        if(registrationDealine.startDate ?? new Date() < (eventUpdateModel.event?.Event_Start_Data ?? new Date())){
            const {error} = await supabase
                .from('events')
                .update({"Registration_Deadline": registrationDealine.startDate})
                .eq('event_id', eventUpdateModel.eventId)
        }
        setSelectedValue('None')
        setIsLoading(false)
        router.refresh()
        eventUpdateModel.onClose()
    }
    return(
        <Modal
        title="Update your Event Details"
        description="The changes will be updated on the events all the prior registrations will remain intact"
        isOpen={eventUpdateModel.isOpen}
        onChange={onChange}
        >
            {eventUpdateModel.eventData?.filter((id) => id.event_id === eventUpdateModel.eventId).map((items) => (
                <div className="flex flex-col gap-y-4" key={items.event_id}>
                    <div className="px-2 border w-full rounded-md">
                        <Select className="p-4 w-full rounded-md" onChange={handleSelectChange}>
                            <option value={"None"}>What do you want to Change ?? </option>
                            <option value={"name"}>Name</option>
                            <option value={"dates"}>Start and End Date</option>
                            <option value={"deadlines"}>Deadline</option>
                            {/* <option value={"logo"}>Logo of the event</option>
                            <option value={"attachements"}>Attachements</option> */}
                        </Select>
                    </div>
                    {selectedValue === "name" ? (
                        <>
                        <Input 
                        placeholder="Enter New Event Name"
                        className="py-4 text-base"
                        onChange={(e) => setNewEventName(e.target.value)}
                        disabled={isLoading}
                        />
                        <Button onClick={handleEventNameChange} disabled={isLoading}>
                            Update Event Name
                        </Button>
                        </>
                    ):(
                        <div></div>
                    )}
                    {selectedValue === "dates" ? (
                        <>
                        <DatePicker
                        minDate={new Date()}
                        value={date}
                        useRange={false}
                        asSingle={true}
                        onChange={(values: any) => {
                            setDate(values)
                        }}
                        displayFormat="DD/MM/YYYY"
                        inputClassName={"bg-[#404040] w-full rounded-md p-3 focus:ring-0 focus:outline-none placeholder:text-white text-white"}
                        primaryColor={"red"}
                        readOnly={false}
                        placeholder={(items.Event_Start_Data).toString()}
                        disabled={isLoading}
                        />

                        <DatePicker
                        minDate={date.startDate}
                        value={enddate}
                        useRange={false}
                        asSingle={true}
                        onChange={(values: any) => {
                            setendDate(values)
                        }}
                        displayFormat="DD/MM/YYYY"
                        inputClassName={"bg-[#404040] w-full rounded-md p-3 focus:ring-0 focus:outline-none placeholder:text-white text-white"}
                        primaryColor={"red"}
                        readOnly={false}
                        placeholder={(items.Event_End_Data).toString()}
                        disabled={isLoading}
                        />
                        <Button onClick={handleEventDateChange} disabled={isLoading}>
                            Update Start and End Date
                        </Button>
                        </>
                    ):(
                        <div></div>
                    )}
                    {selectedValue === "deadlines" && items.Registration_Deadline !== null? (
                        <>
                        <DatePicker
                        maxDate={new Date(items.Event_Start_Data)}
                        value={registrationDealine}
                        useRange={false}
                        asSingle={true}
                        onChange={(values: any) => {
                            setregistrationDealine(values)
                        }}
                        displayFormat="DD/MM/YYYY"
                        inputClassName={"bg-[#404040] w-full rounded-md p-3 focus:ring-0 focus:outline-none placeholder:text-white text-white"}
                        primaryColor={"red"}
                        readOnly={false}
                        placeholder={(items.Registration_Deadline).toString()}
                        disabled={isLoading}
                        />

                        <Button onClick={hadleEventRegistrationDeadlineChange} disabled={isLoading}>
                            Update Registration Deadline
                        </Button>
                        </>
                    ):(
                        items.Registration_Deadline === null && selectedValue == "deadlines"? (
                            <div className="w-full flex justify-center text-neutral-400">
                                The event is OPEN
                            </div>
                        ) : null
                    )}
                    {selectedValue === "logo"? (
                        <>
                        <div>Add New Upload</div>
                        <Input 
                        type="file"
                        accept="/image/*"
                        />
                        <div className="text-center text-neutral-400">Current Logo</div>
                        <div className="flex w-full h-fit justify-center">
                            <div className="flex flex-row justify-between w-1/2 h-fit">
                                <Image src={useLoadImageData(items) ?? "/images/OSS.svg"} alt="Image"/>
                            </div>
                        </div>
                        <Button onClick={() => {}} type="button">
                            Replace Old Image
                        </Button>
                        </>
                    ):(
                        <div>

                        </div>
                    )}
                </div>
            ))}
        </Modal>
    )
}

export default EventUpdateModel