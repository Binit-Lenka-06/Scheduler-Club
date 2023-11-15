"use client"

import Image from "next/image"
import Button from "./Button"
import { Clubs, Events, Forms, Options, Registration, starred_events } from "@/types";
import { useEffect, useState } from "react";
import { Form } from 'react-bootstrap';
import { AuthenticationToken } from "./navbar";
import useLoadImageData from "@/hooks/useLoadImageData";
import { BiTimer } from "react-icons/bi"
import useFormModel from "@/hooks/useFormModel";
import uniqid from "uniqid"
import { AiOutlinePaperClip, AiFillStar } from 'react-icons/ai';
import useLoadFileData from "@/hooks/useLoadFileData";
import { IoClose } from 'react-icons/io5';
import useFormModelForMember from "@/hooks/useFormModalForMember";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import useEventUpdateModel from "@/hooks/useEventUpdateModel";
import { FaEdit } from "react-icons/fa";
import { BsPencil } from 'react-icons/bs';
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface EventProps {
    // eventname: string;
    clubname?: string;
    eventdetails?: string;
    image?: string;
    register_allow?: boolean;
    data: Events;
    onClick: (id: string) => void;
    fetchedForm: Forms[];
    className: React.ReactNode;
    fetchedRegister: Registration[];
    fetchedOptions: Options[];
    fetchedEvents: Events[];
    fetchedClubs: Clubs[];
}

export let EitherSelected = false;

const EventsBox: React.FC<EventProps> = ({
    // eventname,
    clubname,
    eventdetails,
    image,
    register_allow,
    data,
    onClick,
    fetchedForm,
    className,
    fetchedRegister,
    fetchedOptions,
    fetchedEvents,
    fetchedClubs,
}) => {
    const [isSelected, setIsSelected] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
    const authToken = AuthenticationToken
    const formModel = useFormModel()
    const { user } = useUser()
    const club = fetchedClubs.find((id) => id.club_id === data.club_id);
    console.log(club)
    const clubName = club ? club.club_name : '';
    const formModelForMember = useFormModelForMember()
    const userRegisteredForms = fetchedRegister.filter((form) => form.user_id === user?.id);
    const isformregistered = userRegisteredForms.some((form) => form.event_id === data.event_id)
    const isFormCreated = fetchedForm.some((form) => form.formId === data.event_id)
    const supabaseClient = useSupabaseClient()
    const router = useRouter()
    console.log("This is the length of the fetched forms" + fetchedOptions.length)
    console.log(new Date(data.Event_Start_Data) >= new Date(2023, 10, 28))
    console.log(new Date(data.Event_End_Data) >= new Date(2023, 10, 28))
    const handleOnClick = (event_id: string) => {
        const uniqueID = uniqid();
        console.log("Unique Form ID : " + uniqueID)
        if(isSelected){
            console.log(`Update Details for: ${data.event_id}`)
        } else {
            console.log(`Selected Event Id: ${data.event_id}`)
        }
        if(authToken !== null && data.club_id === authToken) {
            setSelectedEventId(event_id);
            formModel.onOpen(event_id)
        } else {
            console.log("Entered")
            formModelForMember.onOpen(data.event_id, fetchedForm, fetchedOptions)
            console.log(formModelForMember.eventId)
        }
    }
    const handleCheckBoxChange = () => {
        setIsChecked(!isChecked)
        setIsSelected(!isSelected)
        EitherSelected = isSelected
    }

    const handleDoubleClick = () => {
        setIsSelected(true)
        setIsChecked(true)
        EitherSelected = isSelected
    }
    const handleSingleClick = () => {
        setIsSelected(false)
        setIsChecked(false)
        EitherSelected = isSelected
    }
    const [AttachmentClicked, SetAttachmentClicked] = useState(false);
    const [AttachedFile, SetAttachedFile] = useState('')
    const handleAttachementClick = (event_attached_path: string) => {
        console.log(event_attached_path)
        SetAttachedFile(event_attached_path)
        console.log(AttachedFile)
        SetAttachmentClicked(true) 
    }
    const [scrollPosition, setScrollPosition] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
          setScrollPosition(window.scrollY);
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const attachmentStyle = {
        top: `${scrollPosition}px`,
    };
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [downloadPrompt, setDownloadPrompt] = useState(false);
    const handleLoadError = () => {
        // This function will be called when the iframe encounters an error
        setDownloadPrompt(true);
    };
    const isFormRegistered = fetchedForm.some((form) => form.formId === data.event_id);

    const handleResponses = (event_id: string) => {
        router.push(`/forms?id=${event_id}`)
    }
    console.log("These are the registration Deadline" + new Date(new Date(data.Registration_Deadline).setHours(23, 59, 59)))

    //Handling Event Updation
    const eventUpdateModel = useEventUpdateModel();
    const handleEventUpdate = (event_id: string) => {
        eventUpdateModel.onOpen(event_id, fetchedEvents, data)
    }

    const handleStarAddition = async (event_id: string) => {
        const {data: SupabaseData, error} = await supabaseClient
            .from('starred_events')
            .insert({"event_id": event_id, "user_id": user?.id})
        if(error){
            console.log("Something Went Wrong")
        } else {
            console.log("Data Updated Succesfully")
        }

        router.refresh()
    }
    return(
        <>
        <div className={`w-full h-20 border rounded-xl p-3 flex flex-row items-center transition-all cursor-pointer ${isSelected? "border border-indigo-500 shadow-indigo-500 shadow-sm": "border-neutral-500 hover:shadow-indigo-500 hover:shadow-sm"} mainClass`} onClick={handleSingleClick}>
            <div className={`w-fit h-full items-center ${isSelected? "flex": "hidden"} checkbox_class`}>
            <Form.Check
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckBoxChange}
                className="custom-checkbox"
            />
            </div>
            <div className={`medium:w-36 new:w-5/12 w-2/12 basic:2/12 h-full rounded-xl mr-3 relative ${className} select-none`}>
                <Image className="object-fit grayscale hover:grayscale-0 transition scale-75" fill src={useLoadImageData(data) || "/images/Spark.svg"} alt=""/>
            </div>
            <div className="w-full h-20 flex flex-col justify-center gap-y-2 mr-2 overflow-hidden relative">
                <div className="text-neutral-300 flex flex-row items-center absolute top-[12px] truncate gap-x-2">
                    {data.event_attachement_path !== null ? (
                        <div onClick={() => handleAttachementClick(data.event_attachement_path)} className="flex items-center gap-x-2 truncate">
                        <div>
                            {data.Event_Name}
                        </div>
                        <button className="w-fit h-full items-center inline-block">
                            <AiOutlinePaperClip className="" size={20} style={{ transform: 'rotate(-45deg)'}}/>
                        </button>
                        </div>
                    ) : (
                        <span>{data.Event_Name}</span>
                    )}
                </div>

                <div className="text-neutral-400 flex flex-row w-fit items-center gap-x-1 widthproperty select-none">
                    {data.Event_Start_Data !== data.Event_End_Data ? (
                        <div className="text-sm truncate movetext inline-block absolute bottom-[15px]">
                            <BiTimer size={20} className="timer_icon inline-block mr-2 text-white" />
                            {`${new Date(data.Event_Start_Data).toLocaleString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/\//g, '/')} - ${new Date(data.Event_End_Data).toLocaleString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/\//g, '/')} by ${clubName}`}
                        </div>
                    ) : (
                        <div className="text-sm truncate movetext inline-block absolute bottom-[15px]">
                            <BiTimer size={20} className="timer_icon inline-block mr-2 text-white" />
                            {`${new Date(data.Event_Start_Data).toLocaleString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/\//g, '/')} by ${clubName}`}
                        </div>
                    )}
                </div>
            </div>
            {register_allow ? (
                <div className="flex justify-end w-full items-center gap-x-5">
                    {authToken !== null && authToken === data.club_id? (
                        <div className="w-fit h-full text-neutral-500 rounded-lgopacity-50 text-sm select-none hover:text-white transition" onClick={() => handleEventUpdate(data.event_id)}>
                            <BsPencil />
                        </div>
                    ): (
                        <div></div>
                    )}
                    {authToken !== data.club_id ? (
                        <button type="button" onClick={() => handleStarAddition(data.event_id)}>
                            <AiFillStar size={23} className={`hover:text-yellow-500 text-white`}/>
                        </button>
                    ):(
                        <div></div>
                    )}
                    {authToken !== null? (
                        data.club_id === authToken ? (
                            isFormCreated? (
                                <Button className={`w-3/5 text-white flex justify-center select-none truncate`} onClick={() => handleResponses(data.event_id)}>
                                    View Responses
                                </Button>
                            ):(
                                data.registration_required ?(
                                    <Button className={`w-3/5 text-white flex justify-center select-none truncate`} onClick={() => handleOnClick(data.event_id)} disabled={new Date(new Date(data.Registration_Deadline).setHours(23, 59, 59)) < new Date()}>
                                        Create Form
                                    </Button>
                                ):(
                                    <Button className={`w-3/5 text-white flex justify-center select-none truncate`} disabled={true}>
                                        Open
                                    </Button>
                                )
                            )
                        ):(
                            isformregistered? (
                                <Button className={`w-3/5 text-white flex justify-center select-none truncate`} onClick={() => {}} disabled={true}>
                                    Registered
                                </Button>
                            ):(
                                data.registration_required?(
                                    new Date(new Date(data.Registration_Deadline).setHours(23, 59, 59)) < new Date() ? (
                                        <Button className={`w-3/5 text-white flex justify-center select-none truncate`} onClick={() => {}} disabled={true}>
                                            Closed
                                        </Button>
                                    ):(
                                        <Button className={`w-3/5 text-white flex justify-center select-none truncate`} onClick={() => handleOnClick(data.event_id)} disabled={false}>
                                            Register
                                        </Button>
                                    )
                                ):(
                                    <Button className={`w-3/5 text-white flex justify-center select-none truncate`} onClick={() => {}} disabled={true}>
                                        Open
                                    </Button>
                                )
                            )
                        )
                    ): (
                        isformregistered? (
                            <Button className={`w-3/5 text-white flex justify-center select-none truncate`} onClick={() => {}} disabled={true}>
                                Registered
                            </Button>
                        ):(
                            data.registration_required ?(
                                new Date(new Date(data.Registration_Deadline).setHours(23, 59, 59)) < new Date() ? (
                                    <Button className={`w-3/5 text-white flex justify-center select-none truncate`} onClick={() => {}} disabled={true}>
                                        Closed
                                    </Button>
                                ):(
                                    <Button className={`w-3/5 text-white flex justify-center select-none truncate`} onClick={() => handleOnClick(data.event_id)} disabled={false}>
                                        Register
                                    </Button>
                                )
                            ) : (
                                <Button className={`w-3/5 text-white flex justify-center select-none truncate`} onClick={() => {}} disabled={true}>
                                    Open
                                </Button>
                            )
                        )
                    )}
                </div>
            ): (
                <div className="flex justify-end w-full items-center gap-x-5">
                    <AiFillStar size={23} className="text-yellow-500"/>
                </div>
            )}
        </div>
        <div className={`absolute w-full h-full z-10 bg-transparent backdrop-blur-md left-0 flex ${AttachmentClicked? "fixed" : "hidden"} overflow-auto items-center`} style={attachmentStyle} onClick={() => {SetAttachmentClicked(false)}}>
            <div className="w-[52%] h-fit bg-neutral-900 opacity-[0.98] left-[50%] max-h-[850px] absolute translate-x-[-45%] rounded-md shadow-sm new:w-full new:h-full basic:w-full basic:h-full basic:left-0 basic:translate-x-0 overflow-auto scrollbar basic:top-0 basic:max-h-full medium:w-full medium:left-0 medium:translate-x-0 pb-2">
                <button className="absolute top-2 right-2" onClick={() => {SetAttachmentClicked(false)}}>
                    <IoClose className="text-neutral-400 hover:text-white" size={20}/>
                </button>
                <div className="text-xl font-bold text-white w-full flex justify-center pt-3 pb-1 px-3">Attachements</div>
                <div className="text-sm loading-normal text-white w-full flex justify-center pb-5 px-3">These attachements have been ruled out as an extension of the event details</div>
                <div className="w-full px-2 rounded-md">
                    {downloadPrompt? (
                        <div>
                            <p>Unable to preview the file. Do you want to download it?</p>
                            <button onClick={() => setDownloadPrompt(false)}>No</button>
                            <a href={useLoadFileData(AttachedFile)} download>
                            <button>Yes</button>
                            </a>
                        </div>
                    ):(
                        <div className="w-full px-2 rounded-md">
                        {AttachedFile !== null ? (
                            <div className="w-full flex justify-center">
                            <iframe
                                title="PDF Viewer"
                                src={useLoadFileData(AttachedFile)}
                                width="100%"
                                height="600px"
                                style={{ border: 'none' }}
                                className="flex justify-center"
                                onError={handleLoadError}
                            ></iframe>
                            </div>
                    ):(
                        <p className="w-full flex justify-center text-sm text-neutral-400 pb-4">No Attachments Uploaded</p>
                        )}
                    </div>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}

export default EventsBox