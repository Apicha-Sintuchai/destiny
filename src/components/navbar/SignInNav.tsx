import { Button } from "../ui/button";
import Image from "next/image";
import { SearchBar } from "@/components/common/search";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useAuth } from "@/contexts/auth.context";
import { Progress } from "@/components/ui/progress";
import { Turn as Hamburger } from "hamburger-react";
import { useModal } from "@/hooks/useModal";

interface SignInNavInterFace {
    logout: () => void;
    isVip: boolean;
    isAdmin: boolean;
}

export const SignInnav = ({ logout, isVip, isAdmin }: SignInNavInterFace) => {
    const { user } = useAuth();
    const { vipPurchase } = useModal();

    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showHamburger, setShowHamburger] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            const scrollThreshold = window.innerHeight * 0.4;

            if (window.scrollY > scrollThreshold) {
                setShowSearchBar(true);
            } else {
                setShowSearchBar(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="flex justify-between items-center p-6 h-18 overflow-hidden bg-background">
            <div className="flex items-center gap-2">
                <div
                    className={` cursor-pointer w-[160px] h-[100px] relative`}
                    onClick={() => router.push("/")}
                >
                    <Image
                        src="/logo/destinylogo1.png"
                        fill
                        className={` object-contain`}
                        alt="logo"
                    />
                </div>
                <div
                    className={`transition-all duration-300 hidden sm:flex ease-in-out ${
                        showSearchBar
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}
                >
                    <div>
                        <SearchBar width="300" />
                    </div>
                </div>
            </div>
            <div className={`flex gap-4 items-center`}>
                <div className={`w-30 hidden md:flex items-center flex-col gap-2`}>
                    <div className={` text-xs`}> EXP: {user?.experience} </div>
                    <Progress value={(user?.experience ?? 0) / 10} className="" />
                </div>
                {!isVip && (
                    <div>
                        <Button
                            className={`bg-linear-30 from-yellow-500 to-yellow-800 `}
                            onClick={vipPurchase.state.onOpen}
                        >
                            สมัคร VIP
                        </Button>
                    </div>
                )}

                <Popover open={showHamburger} onOpenChange={setShowHamburger}>
                    <PopoverTrigger asChild>
                        <Button size="icon" className={`flex justify-center items-center relative`}>
                            <div className={`absolute`}>
                                <Hamburger size={20} rounded toggled={showHamburger} />
                            </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={`w-50`} align="end" sideOffset={18}>
                        <div className={`flex flex-col gap-2`}>
                            <Button
                                className="text-normal py-4 hover:text-chart-1 text-foreground rounded-md Btn1"
                                onClick={() => router.push("/topup")}
                            >
                                เติมเงิน
                            </Button>
                            <div className={`relative`}>
                                {isVip && (
                                    <Badge
                                        className={`absolute -left-2 -top-1 text-[8px] px-3 bg-linear-30 from-yellow-500 to-yellow-300`}
                                    >
                                        VIP
                                    </Badge>
                                )}
                                {isAdmin && (
                                    <Badge
                                        className={`absolute -left-2 -top-1 text-[8px] px-3 bg-linear-30 from-red-500 to-red-300`}
                                    >
                                        ADMIN
                                    </Badge>
                                )}
                                <Button
                                    className="text-normal py-4 hover:text-chart-1 w-full text-foreground rounded-md Btn1"
                                    onClick={() => router.push("/setting")}
                                >
                                    การตั้งค่า
                                </Button>
                            </div>
                            <Button
                                className="text-normal py-4 text-foreground rounded-md transition-all duration-500 bg-destructive hover:bg-red-500"
                                onClick={logout}
                            >
                                ออกจากระบบ
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};
