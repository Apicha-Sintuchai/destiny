"use client";

import { useState } from "react";

type UseDisclosureProps = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onChange: (isOpen: boolean | undefined) => void;
};

export type UseDisclosureReturn<T = undefined, C = {}> = {
    state: UseDisclosureProps;
    data: T;
    setData: React.Dispatch<React.SetStateAction<T>>;
    closure: Partial<C>;
};

function useCustomDisclosure<T, C = {}>(init?: T, closure?: C): UseDisclosureReturn<T, C> {
    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);
    const onChange = (isOpen: boolean | undefined) => setIsOpen(isOpen ?? false);

    const [data, setData] = useState<T>(init ?? (undefined as T));

    return {
        state: {
            isOpen,
            onClose,
            onOpen,
            onChange,
        },
        data,
        setData,
        closure: closure ?? ({} as C),
    };
}

export { useCustomDisclosure as useDisclosure };
