export interface UserDetails {
    id: string;
    full_name: string;
    avatar_url?: string;
}

export interface Users {
    id: string;
    full_name: string;
    avatar_url: string;
    club_id_access: string;
}

export interface Events {
    event_id: string;
    Event_Name: string;
    Event_Start_Data: Date;
    Event_End_Data: Date;
    Number_Of_Registration: Int8Array;
    Registration_Deadline: Date | null;
    registration_required: Boolean;
    created_at: string;
    event_image_path: string;
    prize_pool: Int8Array | null;
    club_id: string;
    event_attachement_path: string;
}

export interface Forms {
    id: Int8Array;
    formId: string;
    componentId: string;
    componentName: string;
    componentType: string;
    componentInputType: string;
    componentValue: string;
    created_at: string;
}

export interface Registration {
    id: Int8Array;
    user_id: string;
    event_id: string;
    component_id: string;
    component_value: string;
    created_at: string;
    [key: string]: any;
}

export interface Options {
    optionId: string;
    formId: string;
    componentId: string;
    optionValue: string;
    limitValue: string;
}

export interface Clubs {
    club_id: string;
    club_name: string;
    club_description: string;
    instagram_url: string;
    LinkedIn_url: string;
}

export interface starred_events {
    id: Int8Array;
    event_id: string;
    user_id: string;
}