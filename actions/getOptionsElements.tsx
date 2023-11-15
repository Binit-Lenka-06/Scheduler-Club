import { Options } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


const getOptionElements = async () : Promise<Options[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    })

    const {data, error} = await supabase
        .from('options')
        .select('*')
    
    console.log(data as any)
    if(error){
        console.log(error)
    }

    return data as any || []
}

export default getOptionElements