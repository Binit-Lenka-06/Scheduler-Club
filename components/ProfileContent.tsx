"use client"

import useEventModel from "@/hooks/useEventAddModel";
import useLoadImage from "@/hooks/useLoadImage";
import { Users } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProfileContentProps {
    data: Users;
    onClick: (id: string) => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
    data,
    onClick
}) => {
    const imagePath = useLoadImage(data)
    const supabaseClient = useSupabaseClient();
    const router = useRouter()
    const eventModel = useEventModel()
    const HandleLogOut = async () => {
        const {error} = await supabaseClient.auth.signOut();
        router.refresh()
        if(error) {
            console.log(error.message);
        } else {
            console.log('Logged Out')
        }
    }
    if(imagePath === null){
        return(
            <div>
                Loading....
            </div>
        )
    }
    return(
        <div className="relative group flex flex-row items-center justify-center rounded-2xl overflow-hidden gap-x-4 bg-transparent cursor-pointer hover:bg-neutral-400/10 transition p-3 w-full" onClick={HandleLogOut}>
            <div className="relative aspect-square w-full h-full rounded-full overflow-hidden">
                <Image className="object-contain" src={imagePath || '/images/oss.svg'} fill alt="Image"/>
            </div>
            <div className="font-semibold truncate w-full new:hidden medium:hidden">
                {data.full_name}
            </div>
        </div>
        // <div className="text-white">
        //     <div className="h-full w-fit">
        //         <Image className="object-cover" src={imagePath || '/images/oss.svg'} fill alt="Image"/>
        //     </div>
        //     {data.full_name}
        // </div>
    )
}

export default ProfileContent