import React from "react";
import { create } from "zustand";

interface FormModelStore {
    isOpen: boolean;
    children: React.ReactNode[];
    openedId: string | null;
    onOpen: (id: string) => void;
    onClose: () => void;
    addComponent: (component: React.ReactNode) => void;
    removeComponent: (key: string) => void;
    setChildren: (children: React.ReactNode[]) => void;
}

const useFormModel = create<FormModelStore>((set) => ({
    isOpen: false,
    children: [],
    openedId: null,
    onOpen: (id) => set({ isOpen: true, openedId: id }),
    onClose: () => set({ isOpen: false, children: [], openedId: null }),
    addComponent: (component) =>
        set((state) => ({ children: [...state.children, component] })),
    removeComponent: (key) =>
        set((state) => ({
            children: state.children.filter(
                (child) => React.isValidElement(child) && (child as React.ReactElement).key !== key
            ),
        })),
    setChildren: (children) => set({ children }),
}));

export default useFormModel;
