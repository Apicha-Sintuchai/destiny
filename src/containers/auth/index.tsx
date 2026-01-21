import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { AuthModalSignIn } from "./sign-in";
import { AuthModalSignUp } from "./sign-up";
import { UseDisclosureReturn } from "@/hooks/useDisclosure";

const AuthModal = ({ disclosure }: { disclosure: UseDisclosureReturn }) => {
    const [activeTab, setActiveTab] = useState<"sign-in" | "sign-up">("sign-in");

    return (
        <Dialog open={disclosure.state.isOpen} onOpenChange={disclosure.state.onClose}>
            <DialogContent className="sm:max-w-[450px] bg-card z-100">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        ยินดีต้อนรับ
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        เข้าสู่ระบบหรือสร้างบัญชีใหม่เพื่อเริ่มต้นใช้งาน
                    </DialogDescription>
                </DialogHeader>

                <Tabs
                    value={activeTab}
                    onValueChange={(event) => setActiveTab(event as "sign-in" | "sign-up")}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="sign-in">เข้าสู่ระบบ</TabsTrigger>
                        <TabsTrigger value="sign-up">สมัครสมาชิก</TabsTrigger>
                    </TabsList>

                    <AuthModalSignIn onCloseModal={disclosure.state.onClose}/>

                    <AuthModalSignUp switchToSignIn={() => setActiveTab("sign-in")}/>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal
