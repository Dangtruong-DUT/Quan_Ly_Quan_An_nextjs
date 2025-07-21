"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

export function Modal({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(true);
    const router = useRouter();

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            router.back();
        }
        setOpen(isOpen);
    };
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <SheetTitle className="hidden">menu</SheetTitle> {children}
            </DialogContent>
        </Dialog>
    );
}
