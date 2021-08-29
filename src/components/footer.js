import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="footer-main-wrap">
      <div className="footer-topbar">
        <div className="container"></div>
      </div>
      <div className="footer-mainbar">
        <div className="container">
          <nav className="footer-navbar">
            <div className="footer-navbar-logo">
              <Link href="/">
                <a>
                  <Image
                    src="/avatar.png"
                    alt="Nicholas Griffin"
                    width="32"
                    height="32"
                    priority={true}
                  />
                </a>
              </Link>
            </div>
            <div className="footer-navbar-copyright">
              <span>
                Copyright © {new Date().getFullYear()} Nicholas Griffin
              </span>
            </div>
            <div className="footer-navbar-links">
              <ul>
                <li>
                  <a
                    href="https://github.com/nicholasgriffintn/NGWebsite2021"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source Code
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
