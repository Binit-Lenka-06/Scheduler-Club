import { Forms, Options } from "@/types";
import { create } from "zustand";

interface FormModelForMemberStore {
    isOpen: boolean;
    onOpen: (id: string, data: Forms[], optionData: Options[]) => void;
    onClose: () => void;
    eventId: string | null;
    eventData: Forms[] | null;
    componentOptions: Options[] | null;
};

const useFormModelForMember = create<FormModelForMemberStore>((set) => ({
    isOpen: false,
    onOpen: (id, data, options) => set({isOpen: true, eventId: id, eventData: data, componentOptions:options}),
    onClose: () => set({isOpen: false, eventData: null, componentOptions: null}),
    eventId: null,
    eventData: null,
    componentOptions: null
}))

export default useFormModelForMember