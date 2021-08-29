import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="header-main-wrap">
      <div className="header-topbar">
        <div className="container"></div>
      </div>
      <div className="header-mainbar">
        <div className="container">
          <nav className="header-navbar">
            <div className="header-navbar-logo">
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
            <div className="header-navbar-links">
              <ul>
                <li>
                  <Link href="/projects">
                    <a>Projects</a>
                  </Link>
                </li>
                <li>
                  <Link href="/blog">
                    <a>Blog</a>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <a>Contact</a>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
