"use client";

import { EditFortuneTellerModalProps } from "@/containers/modal/editfortuneteller";
import { CreateFortuneTellerModalProps } from "@/containers/modal/fortuneteller";
import { GptAnswerModalProps } from "@/containers/modal/gptanswer";
import { Spinner } from "@/components/ui/spinner";
import ModalContext from "@/contexts/ModalContext";
import { useDisclosure, UseDisclosureReturn } from "@/hooks/useDisclosure";
import { lazy, PropsWithChildren, Suspense, useMemo } from "react";
import { CategoryModalProps } from "@/containers/modal/Catagory";
import { UserPromptModalProps } from "@/containers/modal/userpropt";
import { SelectCardModalProps } from "@/containers/modal/selectcard";
import { SelectDeskModalProps } from "@/containers/modal/selectdesk";
import { CardCountModalProps } from "@/containers/modal/pickcardcount";

const modalComponents = {
    auth: lazy(() => import("@/containers/auth")),
    catagory: lazy(() => import("@/containers/modal/Catagory")),
    selectcard: lazy(() => import("@/containers/modal/selectcard")),
    gptanswer: lazy(() => import("@/containers/modal/gptanswer")),
    userpromt: lazy(() => import("@/containers/modal/userpropt")),
    createfortuneteller: lazy(() => import("@/containers/modal/fortuneteller")),
    editfortuneteller: lazy(() => import("@/containers/modal/editfortuneteller")),
    selectdesk: lazy(() => import("@/containers/modal/selectdesk")),
    adminTopupSettring: lazy(() => import("@/containers/modal/topup")),
    vipPriceSetting: lazy(() => import("@/containers/modal/vip-price-setting")),
    VipPurchase: lazy(() => import("@/containers/modal/vip-purchase")),
    pickcardcount: lazy(() => import("@/containers/modal/pickcardcount")),  
} as const;

type ModalType = keyof typeof modalComponents;

type ModalState = {
    type: ModalType;
    disclosure: UseDisclosureReturn<any>;
    allowedWhen: boolean;
};

export default function ModalProvider({ children }: Readonly<PropsWithChildren>) {
    const auth = useDisclosure<any>();
    const catagory = useDisclosure<CategoryModalProps>();
    const selectcard = useDisclosure<SelectCardModalProps>();
    const gptanswer = useDisclosure<GptAnswerModalProps>();
    const userpromt = useDisclosure<UserPromptModalProps>();
    const createfortuneteller = useDisclosure<CreateFortuneTellerModalProps>();
    const editfortuneteller = useDisclosure<EditFortuneTellerModalProps>();
    const selectdesk = useDisclosure<SelectDeskModalProps>();
    const adminTopupSettring = useDisclosure<any>();
    const vipPriceSetting = useDisclosure<any>();
    const vipPurchase = useDisclosure<any>();
    const pickcardcount = useDisclosure<CardCountModalProps>();

    const modalStates: ModalState[] = useMemo(
        () => [
            { type: "auth", disclosure: auth, allowedWhen: true },
            { type: "catagory", disclosure: catagory, allowedWhen: true },
            { type: "selectcard", disclosure: selectcard, allowedWhen: true },
            { type: "gptanswer", disclosure: gptanswer, allowedWhen: true },
            { type: "userpromt", disclosure: userpromt, allowedWhen: true },
            { type: "createfortuneteller", disclosure: createfortuneteller, allowedWhen: true },
            { type: "editfortuneteller", disclosure: editfortuneteller, allowedWhen: true },
            { type: "selectdesk", disclosure: selectdesk, allowedWhen: true },
            { type: "adminTopupSettring", disclosure: adminTopupSettring, allowedWhen: true },
            { type: "vipPriceSetting", disclosure: vipPriceSetting, allowedWhen: true },
            { type: "VipPurchase", disclosure: vipPurchase, allowedWhen: true },
            { type: "pickcardcount", disclosure: pickcardcount, allowedWhen: true },
        ],
        [
            auth,
            catagory,
            selectcard,
            gptanswer,
            userpromt,
            createfortuneteller,
            editfortuneteller,
            selectdesk,
            adminTopupSettring,
            vipPriceSetting,
            vipPurchase,
            pickcardcount,
        ],
    );

    const openModals = useMemo(
        () => modalStates.filter((modal) => modal.disclosure.state.isOpen && modal.allowedWhen),
        [modalStates],
    );

    const getModalComponents = () => {
        return openModals
            .map((modal) => {
                const Component = modalComponents[modal.type] as React.ComponentType<any>;
                if (!Component) return null;
                const { type, disclosure } = modal;
                return (
                    <Suspense key={type} fallback={<Spinner className="size-8" />}>
                        <Component disclosure={disclosure} />
                    </Suspense>
                );
            })
            .filter(Boolean);
    };

    return (
        <ModalContext.Provider
            value={{
                auth,
                catagory,
                selectcard,
                gptanswer,
                userpromt,
                createfortuneteller,
                editfortuneteller,
                selectdesk,
                adminTopupSettring,
                vipPriceSetting,
                vipPurchase,
                pickcardcount,
            }}
        >
            {getModalComponents()}
            {children}
        </ModalContext.Provider>
    );
}
