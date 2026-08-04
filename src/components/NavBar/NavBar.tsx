import LinkButton from "@/components/LinkButton/LinkButton";
import Spacer from "@/components/Spacer";
import styles from "./NavBar.module.css";

export default function NavBar({ selectedPage }: { selectedPage: string }) {
    return (
        <div className={styles.topBar}>
            <Spacer width={10} />
            <LinkButton
                text="Home"
                link="/"
                selected={selectedPage === "/"}
            />
            <LinkButton
                text="Dashboard"
                link="/dashboard"
                selected={selectedPage === "/dashboard"}
            />
            <LinkButton
                text="Login"
                link={"/login"}
                selected={selectedPage === "/login"}
            />
            <LinkButton
                text="Sign up"
                link={"/signup"}
                selected={selectedPage === "/signup"}
            />
        </div>
    );
}