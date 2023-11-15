"use client";

import { Users } from "@/types";

interface EventAddAuthenticationProps {
    data: Users;
    onClubAccess: (clubAccess: string | null) => void
}

const EventAddAuthentication: React.FC<EventAddAuthenticationProps> = ({
    data,
    onClubAccess
}) => {
    onClubAccess(data.club_id_access)
    return null;
}

export default EventAddAuthentication