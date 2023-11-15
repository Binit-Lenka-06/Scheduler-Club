"use client";

import AttachementViewer from "@/components/AttachementViewer";
import AuthModel from "@/components/AuthModel";
import EventModel from "@/components/EventAddModel";
import EventUpdateModel from "@/components/EventUpdateModel";
import FormModel from "@/components/FormModel";
import FormModelForMember from "@/components/FormModelForMember";
import InfoModel from "@/components/InfoModel";
import Modal from "@/components/Modal";
import { Forms } from "@/types";
import React, { useEffect, useState } from "react";


const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)
    
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted) {
        return null
    }
    // console.log("The form got is + " + forms)
    return (
        <div className="h-fit">
            <AuthModel />
            <InfoModel />
            <EventModel />
            <FormModel />
            <FormModelForMember />
            <EventUpdateModel />
        </div>
    )
}

export default ModalProvider;