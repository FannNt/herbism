"use client";

import { useState, useCallback } from "react";
import { PopupType } from "../components/CustomPopup";

interface PopupState {
    isOpen: boolean;
    type: PopupType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
    autoClose?: number;
}

export function usePopup() {
    const [popupState, setPopupState] = useState<PopupState>({
        isOpen: false,
        type: "info",
        title: "",
        message: "",
    });

    const showPopup = useCallback(
        ({
            type = "info",
            title,
            message,
            confirmText,
            cancelText,
            onConfirm,
            onCancel,
            showCancel = false,
            autoClose,
        }: Omit<PopupState, "isOpen">) => {
            setPopupState({
                isOpen: true,
                type,
                title,
                message,
                confirmText,
                cancelText,
                onConfirm,
                onCancel,
                showCancel,
                autoClose,
            });
        },
        []
    );

    const closePopup = useCallback(() => {
        setPopupState((prev) => ({ ...prev, isOpen: false }));
    }, []);
    const showSuccess = useCallback(
        (title: string, message: string, autoClose?: number) => {
            showPopup({ type: "success", title, message, autoClose });
        },
        [showPopup]
    );
    const showError = useCallback(
        (title: string, message: string) => {
            showPopup({ type: "error", title, message });
        },
        [showPopup]
    );

    const showWarning = useCallback(
        (title: string, message: string, onConfirm?: () => void, showCancel = true) => {
            showPopup({ type: "warning", title, message, onConfirm, showCancel });
        },
        [showPopup]
    );
    const showInfo = useCallback(
        (title: string, message: string) => {
            showPopup({ type: "info", title, message });
        },
        [showPopup]
    );

    return {
        popupState,
        showPopup,
        closePopup,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };
}
