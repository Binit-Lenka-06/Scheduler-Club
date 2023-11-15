import { create } from "zustand";

interface FormAddModelStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useFormAddModel = create<FormAddModelStore>((set) => ({
    isOpen: true,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}))

export default useFormAddModel