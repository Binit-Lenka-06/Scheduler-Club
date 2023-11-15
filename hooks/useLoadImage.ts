import { Users } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadImage = (user: Users) => {
    const supabaseClient = useSupabaseClient();
    
    if(!user){
        return null
    }

    const {data: imageData} = supabaseClient
        .storage
        .from('images')
        .getPublicUrl(user.avatar_url);
    
    return imageData.publicUrl;
}

export default useLoadImage