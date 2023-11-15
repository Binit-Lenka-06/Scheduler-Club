import { create } from "zustand";

interface EventModelStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useEventModel = create<EventModelStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}))

export default useEventModel