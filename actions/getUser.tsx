import { Users } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getUsers = async () : Promise<Users[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const {data, error} = await supabase
        .from('users')
        .select('*')
    
    if(error) {
        console.log(error)
    }

    return (data as any) || []
}

export default getUsers