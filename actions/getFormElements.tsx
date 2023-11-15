import { Forms } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


const getFormElements = async () : Promise<Forms[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    })

    const {data, error} = await supabase
        .from('FormData')
        .select('*')
    
    console.log(data as any)
    if(error){
        console.log(error)
    }

    return data as any || []
}

export default getFormElements