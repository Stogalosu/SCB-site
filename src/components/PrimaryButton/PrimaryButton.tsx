"use client";

import styles from "./PrimaryButton.module.css";
import React from "react";

export default function PrimaryButton({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
    return (
        <button className={styles.primaryButton} onClick={onClick}>
            {children}
        </button>
    )
}