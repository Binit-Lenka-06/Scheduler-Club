import { Events } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadImageData = (events: Events) => {
    const supabaseClient = useSupabaseClient();
    
    if(!events){
        return null
    }

    const {data: imageData} = supabaseClient
        .storage
        .from('images')
        .getPublicUrl(events.event_image_path);
    
    return imageData.publicUrl;
}

export default useLoadImageData