"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransitionPanel } from '@/components/ui/transition-panel';
import { AccountTab } from "./account.tab";
import { VipTab } from "./vips.tab";
import { DeckTab } from "./deck.tab";

interface Props {
    IsVip: boolean
}

export const SettingContainer = ({ IsVip }: Props) => {
    const [activeTab, setActiveTab] = useState("account");

    return (
        <div className="container mx-auto py-6 px-2">
            <h1 className="text-4xl font-bold mb-4">Setting {"Mock Up"}</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full md:w-1/3">
                    <TabsTrigger value="account">บัญชี</TabsTrigger>
                    {IsVip && (
                        <>
                            <TabsTrigger value="vips">หมอดู</TabsTrigger>
                            <TabsTrigger value="deck">สร้างไผ่</TabsTrigger>
                        </>
                    )}
                </TabsList>

                <TransitionPanel
                    activeIndex={
                        activeTab === "account" ? 0 :
                        activeTab === "vips" ? 1 : 2
                    }
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    variants={{
                        enter: { opacity: 0, x: 20 },
                        center: { opacity: 1, x: 0 },
                        exit: { opacity: 0, x: -20 }
                    }}
                >
                    {activeTab === "account" && <AccountTab />}
                    {activeTab === "vips" && <VipTab />}
                    {activeTab === "deck" && <DeckTab />}
                </TransitionPanel>
            </Tabs>
        </div>
    );
};
