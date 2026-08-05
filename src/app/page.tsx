import Image from "next/image";
import styles from "./page.module.css";
import NavBar from "@/components/NavBar/NavBar";

export default function Home() {
  return (
      <>
        <NavBar selectedPage="/"></NavBar>
        <div className={styles.main}>
            Placeholder
        </div>
    </>
  );
}
