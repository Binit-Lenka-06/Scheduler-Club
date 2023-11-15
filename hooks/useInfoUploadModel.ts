import { create } from "zustand";

interface InfoModelStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useInfoModel = create<InfoModelStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}))

export default useInfoModel