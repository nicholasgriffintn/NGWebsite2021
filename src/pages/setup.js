import styles from '../styles/Page.module.css';
import PageLayout from '../components/pageLayout';

export default function Page() {
  return (
    <PageLayout
      title="Setup"
      hideContent={true}
      showHero={false}
      loadingState={false}
      darkMain={false}
    >
      <div className="standard-page-content">
        <div className={styles['flex-grid']}>
          <div
            className={styles.col}
            style={{ maxWidth: '980px', width: '100%', margin: '0 auto' }}
          >
            <h1>Setup</h1>
            <p>
              Here&apos;s what I&apos;m coding, gaming and watching videos on.
              Recently updated for a better Covid experience in 2020.
            </p>
            <h2>Code</h2>
            <ul>
              <li>Editor: VS Code</li>
              <li>
                Extensions:
                <ul>
                  <li>Auto Rename Tag</li>
                  <li>Bracket Pair Colorizer 2</li>
                  <li>ESLint</li>
                  <li>Material Icon Theme</li>
                  <li>npm</li>
                  <li>npm Intellisense</li>
                  <li>One Dark Pro</li>
                  <li>Prettier</li>
                  <li>Synk</li>
                  <li>Tabnine</li>
                  <li>Docker</li>
                  <li>GitLens</li>
                  <li>Live Server</li>
                  <li>SonarLint</li>
                  <li>TODO Highlight</li>
                </ul>
              </li>
            </ul>
            <h2>Office</h2>
            <ul>
              <li>Personal MacBook Pro (13-inch, M1, 2020, 16GB RAM)</li>
              <li>
                Windows 10 Desktop
                <ul>
                  <li>AMD Ryzen 5 3600</li>
                  <li>Samsung 970 Evo Plus 500 GB PCIe NVMe M.2</li>
                  <li>MSI MAG B550 Tommahawk Motherboard ATX</li>
                  <li>Corsair TM-M Series 650 Watt 80 Plus Gold</li>
                  <li>G.Skill F4-3600C17D Trident Z DDR4 3600 (16GB x 2)</li>
                  <li>Gigabyte RTX 2080</li>
                  <li>NZXT H510</li>
                  <li>
                    TP-Link Arch TX3000E AX3000 Wi-Fi Bluetooth 5.0 PCI Express
                    Adapter
                  </li>
                  <li>NZXT Internal USB Hub</li>
                  <li>NZXT Kraken X53 240mm</li>
                </ul>
              </li>
              <li>Razer Deathadder Elite Mouse</li>
              <li>Razer Huntsman Opto-Mechanical Switch Keyboard</li>
              <li>Razer Ergonomic Wrist Rest Pro</li>
              <li>Razer Gigantus V2 XXL</li>
              <li>Razer Thunderbolt™ 4 Dock Chroma</li>
              <li>Razer Seiren X </li>
              <li>AOC CU34G2/BK 34&quot; Widescreen WLED Monitor</li>
              <li>FLEXISPOT EC1 Height Adjustable Electric Standing Desk</li>
              <li>
                Creative Sound Blaster X3 Hi-Res 7.1 Discrete External USB DAC
                and Amplifier
              </li>
              <li>Razer Basilisk X Hyperspeed</li>
              <li>Sony MDR-1000X</li>
              <li>Apple Airpods</li>
              <li>Audio-Technica ATH-M50X Headphones</li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
