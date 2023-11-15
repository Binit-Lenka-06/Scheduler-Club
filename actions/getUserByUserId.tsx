import { Users } from "@/types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const getUserById = async () : Promise<Users[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    })
    
    const {
        data: sessionData,
        error: sessionError
    } = await supabase.auth.getSession();

    if(sessionError) {
        console.log(sessionError.message);
        return []
    }

    const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionData.session?.user.id)
    
    if(error){
        console.log(error.message)
    }

    return (data as any) || []
}

export default getUserById