import useEventModel from "@/hooks/useEventAddModel"
import Modal from "./Modal"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Input from "./Input"
import DatePicker from "react-tailwindcss-datepicker"
import { useState } from "react"
import Button from "./Button"
import dayjs from "dayjs"
import { useUser } from "@/hooks/useUser"
import uniqid from "uniqid"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { AuthenticationToken } from "./navbar"
import { useRouter } from "next/navigation"
import Box from "./Box"

const EventModel = () => {
    const [date, setDate] = useState({
        startDate: null,
        endDate: null
    })

    const [endDate, setEndDate] = useState({
        startDate: null,
        endDate: null
    })

    const [deadlineDate, setDeadlineDate] = useState({
        startDate: null,
        endDate: null
    })
    const {isOpen} = useEventModel()
    const eventModel = useEventModel()
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useUser()
    const supabaseClient = useSupabaseClient()
    const authToken = AuthenticationToken
    const router = useRouter()
    const [registrationRequired, setRegistrationRequired] = useState(Boolean)
    const onChange = (open: boolean) => {
        if(!open) {
            eventModel.onClose();
        }
    }
    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            event_name: '',
            event_image: null,
            event_attachments: null
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try{
            console.log("Started")
            setIsLoading(true)
            console.log("Value Changed")

            console.log(values.event_name)
            console.log(date.startDate)
            console.log(endDate.startDate)
            console.log(authToken)
            if(!user){
                console.log("Missing User")
                return
            }
            console.log("Going into the right direction")
            try{
                console.log("Entered into try")
                const uniqueID = uniqid()
                const imageFile = values.event_image?.[0]
                const attachedFile = values.event_attachments?.[0]
                console.log("Don't know wheter I will reach here or not but possibly I wont")
                console.log(imageFile)
                console.log(attachedFile)
                let imageFilePath = "image-default-lorem";
                let attachedFilePath = null;
                if(attachedFile !== undefined){
                    const {
                        data: attachedData,
                        error: attachedError
                    } = await supabaseClient
                        .storage
                        .from('attachement')
                        .upload(`attach-${values.event_name}-${uniqueID}`, attachedFile, {
                            cacheControl: '3600',
                            upsert: false
                        })
                    
                    if(attachedError) {
                        return console.log(attachedError)
                    }
                    attachedFilePath = attachedData.path
                }
                if(imageFile !== undefined){
                    const {
                        data: imageDate,
                        error: imageError
                    } = await supabaseClient
                        .storage
                        .from('images')
                        .upload(`image-${values.event_name}-${uniqueID}`, imageFile, {
                            cacheControl: '3600',
                            upsert: false
                        })
                    
                    if(imageError) {
                        return console.log("Failed Image Upload")
                    }
                    imageFilePath = imageDate.path;
                }
                const {
                    error: supabaseError
                } = await supabaseClient
                    .from('events')
                    .insert({
                        Event_Name: values.event_name,
                        Event_Start_Data: date.startDate,
                        Event_End_Data: endDate.startDate,
                        Registration_Deadline: deadlineDate.startDate,
                        event_image_path: imageFilePath,
                        registration_required: registrationRequired,
                        event_attachement_path: attachedFilePath,
                        club_id: authToken
                    })
    
                if(supabaseError){
                    setIsLoading(false)
                    return console.log(supabaseError.message)
                }
            } catch {
                console.log("Entered into the correct place")
                console.log("No Image or attachment Uploaded")
            }
            router.refresh()
            setIsLoading(false)
            console.log("Event Created")
            date.startDate = null
            endDate.startDate = null
            reset()
            eventModel.onClose()
        } catch (error) {
            console.log("Something Went Wrong")
        } finally {
            console.log("Hi")
            setIsLoading(false)
        }
    }
    return(
        <Modal 
        title="Add Your Events"
        description="Events will be added from the face of your organisation"
        isOpen={isOpen}
        onChange={onChange}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <div className="flex flex-row gap-x-2 rounded-md h-12 overflow-hidden">
                    <Box className="bg-[#404040] h-full flex items-center rounded-md px-2 text-neutral-400 w-full justify-center">
                        Registration Required
                    </Box>
                    <div className="flex justify-end gap-x-4 w-full">
                        <div className={`h-full items-center rounded-md w-2/5 flex justify-center cursor-pointer ${registrationRequired? "bg-[#404040] opacity-100" : "bg-[#404040] opacity-25"} transition`} onClick={() => setRegistrationRequired(true)}>
                            Yes
                        </div>
                        <div className={`bg-[#404040] h-full items-center rounded-md w-2/5 flex justify-center cursor-pointer ${!registrationRequired? "bg-[#404040] opacity-100" : "bg-[#404040] opacity-25"} transition`} onClick={() => setRegistrationRequired(false)}>
                            No
                        </div>
                    </div>
                </div>
                <Input 
                id="Event_name"
                disabled={isLoading}
                {...register('event_name', {required: true})}
                placeholder="Event Name"
                />
                
                <div className="flex flex-col gap-y-2">
                    <div>Event Start Date</div>
                    <DatePicker
                    minDate={new Date()}
                    value={date}
                    useRange={false}
                    asSingle={true}
                    popoverDirection="down"
                    onChange={(values: any) => {
                        setDate({startDate: values, endDate: values})
                    }}
                    displayFormat="DD/MM/YYYY"
                    inputClassName={"bg-[#404040] w-full rounded-md p-3 focus:ring-0 focus:outline-none placeholder:text-white text-white"}
                    primaryColor={"red"}
                    readOnly={false}
                    />
                </div>

                <div className="flex flex-col gap-y-2">
                    <div>Event End Date</div>
                    <DatePicker
                    minDate={date.startDate}
                    value={endDate}
                    useRange={false}
                    asSingle={true}
                    popoverDirection="down"
                    onChange={(values: any) => {
                        setEndDate(values)
                    }}
                    displayFormat="DD/MM/YYYY"
                    inputClassName={"bg-[#404040] w-full rounded-md p-3 focus:ring-0 focus:outline-none placeholder:text-white text-white"}
                    primaryColor={"red"}
                    readOnly={false}
                    />
                </div>

                <div className={`flex flex-col gap-y-2 ${registrationRequired? "visible": "hidden"}`}>
                    <div>Event Registration Deadline</div>
                    <DatePicker
                    maxDate={date.startDate}
                    value={deadlineDate}
                    useRange={false}
                    asSingle={true}
                    popoverDirection="down"
                    onChange={(values: any) => {
                        setDeadlineDate(values)
                    }}
                    displayFormat="DD/MM/YYYY"
                    inputClassName={"bg-[#404040] w-full rounded-md p-3 focus:ring-0 focus:outline-none placeholder:text-white text-white"}
                    primaryColor={"red"}
                    readOnly={false}
                    disabled={!registrationRequired}
                    />
                </div>

                <div className="flex flex-col gap-y-2">
                    <div>Logo Of the Event</div>
                    <Input 
                    id="event_image"
                    disabled={isLoading}
                    type="file"
                    accept="image/*"
                    {...register("event_image")}
                    />
                </div>
                <div className="flex flex-col gap-y-2">
                    <div className="flex flex-row items-center gap-x-2">Attachment for Event Details <p className="text-neutral-400">(.pdf, .png, .jpg, .jpeg)</p></div>
                    <Input 
                    id="event_attachments"
                    disabled={isLoading}
                    type="file"
                    accept=".pdf, .jpg, .jpeg, .png"
                    {...register("event_attachments")}
                    />
                </div>
                <Button disabled={isLoading} type="submit">
                    Upload Event
                </Button>
            </form>
        </Modal>
    )
}

export default EventModel