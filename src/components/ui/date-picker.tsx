"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { th } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
    if (!date) {
        return "";
    }
    return date.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function isValidDate(date: Date | undefined) {
    if (!date) {
        return false;
    }
    return !isNaN(date.getTime());
}

interface DatePickerProps {
    value?: Date;
    onChange: (date: Date) => void;
    label?: string;
}

export function DatePicker({ onChange, value }: DatePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [month, setMonth] = React.useState<Date | undefined>(value);

    return (
        <div className="flex flex-col gap-3">
            <div className="relative flex gap-2">
                <Input
                    value={value ? formatDate(value) : ""}
                    readOnly
                    placeholder="เลือกวันที่..."
                    onClick={() => setOpen(true)}
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">เลือกวันที่</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0 z-999"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                    >
                        <Calendar
                            mode="single"
                            selected={value}
                            month={month}
                            captionLayout="dropdown"
                            onMonthChange={setMonth}
                            locale={th}
                            onSelect={(date) => {
                                if (!date) return;
                                onChange(new Date(date));
                                setOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
