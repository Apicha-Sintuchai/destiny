import { useRef } from "react";

import { useModal } from "./useModal";
import { SelectedCard } from "@/containers/modal/selectcard";
import { AgentPrediction } from "@/actions/agent/agent.action";
import { CardCategory, getDeckByIdWithCategory, getDecks } from "@/actions/deck/deck.action";
import { useAuth } from "@/contexts/auth.context";
import { shuffleArray } from "@/utils/utils";

interface IFortuneTeller {
    id: string;
    name: string;
    character: string;
}

export const useGptAnswer = () => {
    const { catagory, userpromt, selectcard, selectdesk, gptanswer, pickcardcount } = useModal();

    const fortuneTeller = useRef<IFortuneTeller>({
        id: "",
        name: "",
        character: "",
    });
    const deck_id = useRef<string>("");
    const selectCategoryRef = useRef<string>("");
    const selectCategoryTypeRef = useRef<CardCategory>("LOVE");
    const userPromptRef = useRef<string>("");
    const selectedCardsRef = useRef<SelectedCard>({ name: "", nickname: "", description: "", userpickcardcount: 0 });

    const { user } = useAuth();

    const handleSelectDeckModal = async () => {
        const deck = await getDecks(100, 0);

        selectdesk.setData({
            next: () => {
                handleCategoryModal();

                selectdesk.state.onClose();
            },
            selectDeck: (id: string) => {
                deck_id.current = id;
            },
            decks: deck,
        });
        selectdesk.state.onOpen();
    };

    const handleCategoryModal = () => {
        catagory.setData({
            next: () => {
                handlePromptModal();

                catagory.state.onClose();
            },
            selectCategory: (value: string, type: CardCategory) => {
                selectCategoryRef.current = value;
                selectCategoryTypeRef.current = type;
            },
        });
        catagory.state.onOpen();
    };

    const handlePromptModal = () => {
        userpromt.setData({
            next: () => {
                handlePickCardCountModal();

                userpromt.state.onClose();
            },
            setUserPrompt: (value: string) => {
                userPromptRef.current = value;
            },
        });
        userpromt.state.onOpen();

    };


    const handlePickCardCountModal = () => {
        pickcardcount.setData({
            next: () => {
                handleSelectCardModal();

                pickcardcount.state.onClose();
            },
            selectCount: (value: number) => {
                selectedCardsRef.current.userpickcardcount = value;
            },
        });
        pickcardcount.state.onOpen();
    }

    const handleSelectCardModal = async () => {
        const cards = await getDeckByIdWithCategory(deck_id.current, selectCategoryTypeRef.current);

        const shuffledCards = shuffleArray(
            cards.map((card) => ({
                name: card.name,
                nickname: card.nickName ?? card.name,
                description: card.description,
                image: card.media.url,
            })),
        );

        selectcard.setData({
            next: () => {
                handleGptAnswer();

                selectcard.state.onClose();
            },
            selectCard: (value: SelectedCard) => {
                selectedCardsRef.current = value;
            },
            fortunetellerId: fortuneTeller.current.id,
            title: selectCategoryRef.current,
            cards: shuffledCards,
            userpickcardcount: selectedCardsRef.current.userpickcardcount,
        });
        selectcard.state.onOpen();
    };

    const handleGptAnswer = async () => {
        try {
            gptanswer.setData({
                isLoading: true,
            });
            gptanswer.state.onOpen();

            if (!user) throw new Error("โปรดเข้าสู่ระบบก่อน");

            const response = await AgentPrediction({
                cardName: selectedCardsRef.current.name,
                card_nickname: selectedCardsRef.current.nickname,
                card_description: selectedCardsRef.current.description,
                birthdate: user.birthday.toString(),
                fortune_teller_id: fortuneTeller.current.id,
                catagory: selectCategoryRef.current,
                user_id: user.id,
                prompt: userPromptRef.current,
                deck_id: deck_id.current,
            });

            gptanswer.setData({
                isLoading: false,
                ...response,
            });
        } catch (error: any) {
            gptanswer.setData({
                isLoading: false,
                success: false,
                message: error.message,
            });
        }
    };

    const startPrediction = ({ id, name, character }: IFortuneTeller) => {
        fortuneTeller.current.id = id;
        fortuneTeller.current.name = name;
        fortuneTeller.current.character = character;

        handleSelectDeckModal();
    };

    return {
        handleAnswerGpt: startPrediction,
    };
};
