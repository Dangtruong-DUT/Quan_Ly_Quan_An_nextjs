"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useCallback, useState } from "react";

interface QuantityProps {
    initialValue?: number;
    onChange: (value: number) => void;
    disable?: boolean;
}

export default function Quantity({ initialValue = 0, disable = false, onChange }: QuantityProps) {
    const [value, setValue] = useState<number>(initialValue);
    const handleIncrement = useCallback(() => {
        onChange(value + 1);
        setValue((prev) => prev + 1);
    }, [value, onChange]);

    const handleDecrement = useCallback(() => {
        onChange(value > 0 ? value - 1 : 0);
        setValue((prev) => (prev > 0 ? prev - 1 : 0));
    }, [value, onChange]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = parseInt(e.target.value, 10);
            if (!isNaN(newValue) && newValue >= 0) {
                onChange(newValue);
                setValue(newValue);
            }
        },
        [onChange]
    );
    return (
        <div className="flex gap-1 ">
            <Button className="h-6 w-6 p-0" onClick={handleDecrement} disabled={value <= 0 || disable}>
                <Minus className="w-3 h-3" />
            </Button>
            <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="h-6 p-1 w-8 text-center"
                value={value}
                onChange={handleChange}
                disabled={disable}
            />
            <Button
                className={cn("h-6 w-6 p-0", {
                    "pointer-events-none": disable,
                })}
                onClick={handleIncrement}
            >
                <Plus className="w-3 h-3" />
            </Button>
        </div>
    );
}
