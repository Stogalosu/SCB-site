import Image from "next/image";
import styles from "./page.module.css";
import NavBar from "@/components/NavBar/NavBar";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import { User } from "lucide-react";

export default function Home() {
  return (
      <>
        <NavBar selectedPage="/"></NavBar>
        <div className={styles.main}>
            <div className={styles.content}>
                <h1>Smart Chess Board</h1>
                <p>
                    Have you ever wanted to play chess but didn't have an opponent?
                    Coincidentally, at the same time, were you tired of playing chess on your phone all the time?
                </p>
                <p>
                    Well, you're in luck! With the Smart Chess Board you can now play against the computer on a real physical magnificent chess board!
                    You make your own moves and the board makes the computer's.
                    You can also connect you phone/laptop to the board, make your moves on the screen and your wish is the board's command!
                    This way, you also get a history of all your games!
                </p>
                <p>
                    <del>Start using it right now!</del> Start playing regular chess right now by making an account!
                </p>
                <div style={{ alignSelf: "center" }}>
                    <PrimaryButton link="/signup">
                        <User/>
                        <span style={{ fontSize: "16px" }}>Sign up</span>
                    </PrimaryButton>
                </div>
                <Image
                    src="/images/20260628_163842.jpg"
                    alt="Smart Chess Board"
                    width={760}
                    height={570}
                    priority
                    style={{ width: "100%", aspectRatio: "4/3", border: "2px solid black", borderRadius: "8px"}}
                />
                <p style={{ alignSelf: "center" }}>
                    <b><u>Disclaimer</u></b> None of this actually works yet
                </p>
            </div>
        </div>
    </>
  );
}
