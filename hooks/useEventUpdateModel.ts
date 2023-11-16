import { Events } from "@/types";
import { create } from "zustand";

interface EventUpdateModelStore {
    isOpen: boolean;
    onOpen: (id: string, data:Events[], events: Events) => void;
    onClose: () => void;
    eventId: string | null;
    eventData: Events[] | null;
    event: Events | null;
};

const useEventUpdateModel = create<EventUpdateModelStore>((set) => ({
    isOpen: false,
    onOpen: (id, data, events) => set({isOpen: true, eventId:id, eventData:data, event: events}),
    onClose: () => set({isOpen: false}),
    eventId: null,
    eventData: null,
    event: null

}))

export default useEventUpdateModel
