import { Clubs } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


const getClubsElement = async () : Promise<Clubs[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    })

    const {data, error} = await supabase
        .from('clubs')
        .select('*')
    
    console.log(data as any)
    if(error){
        console.log(error)
    }

    return data as any || []
}

export default getClubsElement