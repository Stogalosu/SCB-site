import LinkButton from "@/components/LinkButton/LinkButton";
import Spacer from "@/components/Spacer";
import styles from "./NavBar.module.css";
import TopUserButtons from "@/components/UserButtons/UserButtons";
import Logo from "@/components/Logo/Logo";

export default function NavBar({ selectedPage }: { selectedPage: string }) {
    return (
        <div className={styles.topBar}>
            <Spacer width={10} />
            {/*<LinkButton*/}
            {/*    text="Home"*/}
            {/*    link="/"*/}
            {/*    selected={selectedPage === "/"}*/}
            {/*/>*/}
            <Logo/>
            <LinkButton
                text="Dashboard"
                link="/dashboard"
                selected={selectedPage === "/dashboard"}
            />
            <LinkButton
                text="Play"
                link="/play"
                selected={selectedPage === "/play"}
            />
            <div className={styles.itemToEnd}>
                <TopUserButtons selectedPage={selectedPage}/>
            </div>
            <Spacer width={10} height={1}/>
        </div>
    );
}