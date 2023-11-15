import { Registration } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


const getRegistrations = async () : Promise<Registration[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    })

    const {data, error} = await supabase
        .from('registrations')
        .select('*')
    
    console.log(data as any)
    if(error){
        console.log(error)
    }

    return data as any || []
}

export default getRegistrations