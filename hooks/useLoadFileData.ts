import { Events } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadFileData = (events: string) => {
    const supabaseClient = useSupabaseClient();

    const {data: attachedData} = supabaseClient
        .storage
        .from('attachement')
        .getPublicUrl(events);
    
    return attachedData.publicUrl;
}

export default useLoadFileData