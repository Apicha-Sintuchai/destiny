import Image from 'next/image'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
    width?: string
}

export function SearchBar({ width }: SearchBarProps) {
    return (
        <div
            className="relative flex"
            style={width ? { width: `${width}px` } : undefined}
        >
            <Image
                src='/icon/stars.gif'
                alt="star"
                width={25}
                height={25}
                className="left-3 absolute top-1/2 -translate-y-1/2"
            />
            <Input
                placeholder="วันนี้เป็นยังไงบ้าง..."
                className="rounded-full h-10 w-full transition-all line-clamp-1 !text-base duration-500 !bg-black/40 focus:!bg-black/80 !ring-primary px-10"
            />
            <Button
                variant="outline"
                size="icon"
                className="absolute bg-transparent h-full right-0 rounded-r-full w-10 flex pr-1"
            >
                <i className="fa-solid fa-magnifying-glass text-foreground"></i>
            </Button>
        </div>
    )
}
