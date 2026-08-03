import styles from "./LinkButton.module.css";

export default function LinkButton(
    { text, link, selected, ...props }:
        { text: string, link: string, selected: boolean }
        & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
) {
    if (selected)
        return (
            <a className={styles.linkButtonSelected} {...props} href={link}>{text}</a>
        );
    else
        return (
            <a className={styles.linkButton} {...props} href={link}>{text}</a>
        );
}