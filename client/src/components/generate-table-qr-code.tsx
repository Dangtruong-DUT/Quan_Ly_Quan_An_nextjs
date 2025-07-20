"use client";

import { Button } from "@/components/ui/button";
import { getTableLink } from "@/helpers/common";
import { Download } from "lucide-react";
import { useLocale } from "next-intl";
import QRCode from "qrcode";
import { useCallback, useEffect, useMemo, useRef } from "react";

type QRcodeGenerateProps = {
    token: string;
    tableNumber: number;
    width?: number;
};

export default function QRcodeTableGenerate({ token, tableNumber, width = 200 }: QRcodeGenerateProps) {
    const locale = useLocale();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const url = getTableLink({ token, tableNumber, locale });

    // Create a virtual canvas to generate the QR code
    // This is to avoid rendering the QR code directly in the DOM
    const virtualCanvas = useMemo(() => {
        const canvas = document.createElement("canvas");
        QRCode.toCanvas(canvas, url, {
            width: width - 10,
        });
        return canvas;
    }, [url, width]);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = width;
            canvas.height = width + 70;
            const ctx = canvas.getContext("2d")!;
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(virtualCanvas, 0, 0, width, width);
            ctx.fillStyle = "#000";
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.fillText(`Bàn số: ${tableNumber}`, width / 2, width + 15);
            ctx.fillText("Quét mã để order món", width / 2, width + 50);
        }
    }, [url, canvasRef, width, virtualCanvas, tableNumber]);

    const handleDownload = useCallback(() => {
        if (!canvasRef.current) return;
        const link = document.createElement("a");
        link.download = `table-${tableNumber}.png`;
        link.href = canvasRef.current.toDataURL("image/png");
        link.click();
    }, [canvasRef, tableNumber]);
    return (
        <div className="flex items-center gap-2">
            <canvas ref={canvasRef} className="rounded-sm" />
            <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download />
            </Button>
        </div>
    );
}
