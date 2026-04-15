"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader, X } from "lucide-react";

type SnackbarProps = {
  title: string;
  description: string;
  onClose: () => void;
};

export default function Snackbar({
  title,
  description,
  onClose,
}: SnackbarProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-9999 w-[90%] max-w-md rounded-xl border bg-gray-900 text-white p-4 shadow-lg flex items-start justify-between gap-4">
            <Loader className="animate-spin w-5 h-5 shrink-0 mt-1" />
            <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-gray-300">{description}</p>
            </div>

            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={18} />
            </button>
        </div>,
        document.body
    );
}