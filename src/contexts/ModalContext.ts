"use client";

import { createContext } from "react";

import { EditFortuneTellerModalProps } from "@/containers/modal/editfortuneteller";
import { CreateFortuneTellerModalProps } from "@/containers/modal/fortuneteller";
import { GptAnswerModalProps } from "@/containers/modal/gptanswer";
import { CategoryModalProps } from "@/containers/modal/Catagory";
import { UseDisclosureReturn } from "@/hooks/useDisclosure";
import { UserPromptModalProps } from "@/containers/modal/userpropt";
import { SelectCardModalProps } from "@/containers/modal/selectcard";
import { SelectDeskModalProps } from "@/containers/modal/selectdesk";
import { CardCountModalProps } from "@/containers/modal/pickcardcount";

interface ModalContextInterface {
    auth: UseDisclosureReturn;
    catagory: UseDisclosureReturn<CategoryModalProps>;
    selectcard: UseDisclosureReturn<SelectCardModalProps>;
    gptanswer: UseDisclosureReturn<GptAnswerModalProps>;
    userpromt: UseDisclosureReturn<UserPromptModalProps>;
    createfortuneteller: UseDisclosureReturn<CreateFortuneTellerModalProps>;
    editfortuneteller: UseDisclosureReturn<EditFortuneTellerModalProps>;
    selectdesk: UseDisclosureReturn<SelectDeskModalProps>;
    adminTopupSettring: UseDisclosureReturn;
    vipPriceSetting: UseDisclosureReturn;
    vipPurchase: UseDisclosureReturn;
    pickcardcount: UseDisclosureReturn<CardCountModalProps>;
}

const ModalContext = createContext<ModalContextInterface>({} as ModalContextInterface);
export default ModalContext;
