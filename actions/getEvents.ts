import { Events } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


const getEvents = async () : Promise<Events[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    })

    const {data, error} = await supabase
        .from('events')
        .select('*')
    
    if(error){
        console.log(error)
    }

    return data as any || []
}

export default getEvents