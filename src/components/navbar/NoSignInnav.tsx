import { useModal } from "@/hooks/useModal";
import { Button } from "../ui/button";
import Image from "next/image";
import { SearchBar } from "@/components/common/search";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const NoSignInnav = () => {
    const { auth } = useModal();
    const [showSearchBar, setShowSearchBar] = useState(false);
    const route = useRouter()

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
            {/*<h1 className="text-4xl font-bold">Destiny</h1>*/}
            <div className="flex items-center gap-2">
                <div className={` cursor-pointer`} onClick={() => route.push("/")} >
                    <Image src="/logo/destinylogo1.png" width={160} height={100} alt="logo" />
                </div>
                <div
                    className={`transition-all duration-300 hidden sm:flex ease-in-out ${
                        showSearchBar
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}
                >
                    <SearchBar width="300" />
                </div>
            </div>
            <div>
                <Button
                    className="text-normal py-4 hover:text-chart-1 text-foreground rounded-full Btn1"
                    onClick={auth.state.onOpen}
                >
                    เข้าสู่ระบบ
                </Button>
            </div>
        </div>
    );
};

export default NoSignInnav;
