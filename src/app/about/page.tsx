import Image from "next/image";
import styles from "./about.module.css";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main className={`${styles.about} section`}>
      <Image
        src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1100&q=80"
        alt="Indian festive attire"
        width={900}
        height={1100}
      />
      <div>
        <p className="eyebrow">Our story</p>
        <h1 className="title">Graceful ethnic wear for women who live in motion.</h1>
        <p className="copy">
          Poonam Attire blends Indian craft inspiration with modern silhouettes,
          premium fabric choices, and careful finishing. The collection is
          designed for festive days, office routines, family moments, and the
          quiet confidence of looking beautifully put together.
        </p>
        <div className={styles.values}>
          <span>Premium fabric curation</span>
          <span>Trustworthy sizing</span>
          <span>Modern Indian luxury</span>
        </div>
      </div>
    </main>
  );
}
