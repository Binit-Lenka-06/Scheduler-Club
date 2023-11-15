import { create } from "zustand";

interface AttachementModelStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useAttachementModel = create<AttachementModelStore>((set) => ({
    isOpen: true,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}))

export default useAttachementModel