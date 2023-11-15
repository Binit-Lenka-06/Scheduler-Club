import { useSupabaseClient } from "@supabase/auth-helpers-react";

const getEventsByDate =  async (date: Date) => {
    const supabase = useSupabaseClient()

    try {
        const {data, error} = await supabase
            .from('events')
            .select('*')
            .gte('Event_Start_Data', date)
            .lt('Event_End_Data', date)
        
        if(error){
            console.log(error)
        }

        return data as any || []
    } catch(error) {
        console.error(error)
        return []
    }
}

export default getEventsByDate