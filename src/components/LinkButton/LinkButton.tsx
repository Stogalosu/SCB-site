import styles from "./LinkButton.module.css";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

export default function LinkButton(
    { text, link, selected, ...props }:
        { text: string, link: string, selected: boolean }
) {
    if (selected)
        return (
            <a className={styles.linkButtonSelected} href={link}>{text}</a>
        );
    else
        return (
            <a className={styles.linkButton} href={link}>{text}</a>
        );
}