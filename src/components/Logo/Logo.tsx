import styles from "./Logo.module.css";

export default function Logo({ link }: { link?: string }) {
    return (
        // <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
        //     <polyline points="5,5 13,13 5,5 45,5 37,13 45,5 45,45 37,37 45,45 5,45 13,37 5,45 5,5"
        //               style={{ fill: "none", stroke: "white", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }}/>
        //     <rect width="24" height="24" x="13" y="13" fill="none" stroke="white" strokeWidth="2" />
        //     <rect width="12" height="12" x="13" y="13" fill="white" />
        //     <rect width="12" height="12" x="25" y="25" fill="white" />
        // </svg>
        <a className={styles.svgLink} href={link ?? ""}>
            <svg width="40" height="40" className={styles.svgDefault}>
                <polyline points="5,5 11,11 5,5 35,5 29,11 35,5 35,35 29,29 35,35 5,35 11,29 5,35 5,5"
                          style={{ fill: "none", stroke: "white", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }}/>
                <rect width="18" height="18" x="11" y="11" fill="none" stroke="white" strokeWidth="2" />
                <rect width="9" height="9" x="11" y="11" fill="white" />
                <rect width="9" height="9" x="20" y="20" fill="white" />
            </svg>
            <svg width="40" height="40" className={styles.svgHover}>
                <polyline points="5,5 11,11 5,5 35,5 29,11 35,5 35,35 29,29 35,35 5,35 11,29 5,35 5,5"
                          style={{ fill: "none", stroke: "white", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }}/>
                <rect width="18" height="18" x="11" y="11" fill="none" stroke="white" strokeWidth="2" />
                <rect width="9" height="9" x="11" y="20" fill="white" />
                <rect width="9" height="9" x="20" y="11" fill="white" />
            </svg>
        </a>
    )
}