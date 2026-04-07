import styles from '@/styles/VideoHero.module.css';

export default function VideoHero() {
    return (
        <section className={styles.hero}>
            {/* ── Background Video ── */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className={styles.video}
            >
                <source src="/videos/nebula6.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* ── Cinematic Blur Overlay ── */}
            <div className={styles.blurOverlay} />

            {/* ── Architectural 2x2 Grid ── */}
            <div className={styles.gridContainer}>

                {/* 1. Top Left: Identity */}
                <div className={styles.gridItemTopLeft}>
                    <h1 className={styles.title}>MOHAMED SALEH</h1>
                    <div className={styles.separator} />
                    <p className={styles.subtitle}>CRAFTED CODE</p>
                </div>

                {/* 2. Top Right: Empty Space */}
                <div className={styles.gridItemEmpty} />

                {/* 3. Bottom Left: Empty Space */}
                <div className={styles.gridItemEmpty} />

                {/* 4. Bottom Right: About Me Section ── */}
                <div className={styles.gridItemBottomRight}>
                    <div className={styles.aboutContent}>
                        <h2 className={styles.aboutHeader}>ABOUT ME</h2>
                        <p className={styles.aboutText}>
                            A developer focused on high-end digital experiences.
                            Crafting clean code and cinematic interfaces with
                            a passion for modern web architecture and seamless animations.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
