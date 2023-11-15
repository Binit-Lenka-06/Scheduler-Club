"use client"

import useInfoModel from "@/hooks/useInfoUploadModel"
import Modal from "./Modal"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Input from "./Input"
import { useState } from "react"
import Button from "./Button"
import { useUser } from "@/hooks/useUser"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { Toast } from "react-hot-toast"
import uniqid from "uniqid"
import toast from "react-hot-toast/headless"
import { error } from "console"

const InfoModel = () => {
    const infoModel = useInfoModel()
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useUser()
    const supabaseClient = useSupabaseClient();
    const router = useRouter()
    const {onClose, isOpen} = useInfoModel();

    const onChange = (open: boolean) => {
        if(!open){
            infoModel.onClose();
        }
    }

    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            full_name: '',
            avatar: null
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true)

            const ImageFile = values.avatar?.[0]

            if(user){
                console.log("found user")
            }
            if(ImageFile) {
                console.log(ImageFile.path)
            }
            if(!ImageFile || !user) {
                toast.error("Missing Fields")
                console.log("Missing Fields")
                return
            }

            const uniqueID = uniqid()

            const {
                data: imageData,
                error: imageError
            } = await supabaseClient
                .storage
                .from('images')
                .upload(`image-${values.full_name}-${uniqueID}`, ImageFile, {
                    cacheControl: '3600',
                    upsert: false
                })
            
            if(!imageError){
                console.log("Image Uploaded Succesfully")
            }
            if(imageError) {
                setIsLoading(false)
                return console.log("Failed Image Upload")
            }

            const {
                error: supabaseError
            } = await supabaseClient
                .from('users')
                .insert({
                    id: user.id,
                    full_name: values.full_name,
                    avatar_url: imageData.path
                })
            
            if(supabaseError) {
                setIsLoading(false)
                return console.log(supabaseError.message)
            }

            router.refresh()
            setIsLoading(false)
            console.log("Success")
            infoModel.onClose()
        } catch (error) {
            console.log("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }
    return(
        <Modal 
        title="Welcome to Profile"
        description="Complete your profile for better experience"
        isOpen={isOpen}
        onChange={onChange}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Input 
                id="full_name"
                disabled={isLoading}
                {...register('full_name', {required: true})}
                placeholder="What should we call you?"
                />
                <Input 
                id="avatar"
                disabled={isLoading}
                type="file"
                accept="image/*"
                {...register("avatar", {required: true})}
                />
                <Button disabled={isLoading} type="submit">
                    Update Profile
                </Button>
            </form>
        </Modal>
    )
}

export default InfoModel