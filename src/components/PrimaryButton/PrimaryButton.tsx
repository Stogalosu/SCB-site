"use client";

import styles from "./PrimaryButton.module.css";
import React from "react";

export default function PrimaryButton({ children, link, onClick }: { children: React.ReactNode, link?: string, onClick?: () => void }) {
    if(onClick)
        return (
            <button className={styles.primaryButton} onClick={onClick}>
                {children}
            </button>
        );
    if(link)
        return (
            <a className={styles.primaryButton} href={link}>
                {children}
            </a>
        );
}