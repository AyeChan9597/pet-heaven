
import {
  useEffect,
  useState
} from "react";

import {
  Link,
  NavLink,
  useLocation
} from "react-router-dom";

import {
  SITE,
  FEATURES
} from "../settings.js";

import { useSite } from "../context/SiteContext.jsx";

const nav = [
  ["/", "Home"],
  ["/pets", "Find a Pet"],
  ["/how-it-works", "How It Works"],
  ["/release", "Rehome"],
  ["/care", "Pet Care"],
  ["/about", "About"],
  ["/mission", "Mission"],
  ["/contact", "Contact"]
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();

  const {
    user,
    signOut,
    theme,
    setTheme,
    favorites
  } = useSite();

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(
      theme === "light"
        ? "dark"
        : "light"
    );
  };

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="wrap header-inner">
          <Link to="/" className="logo">
            🐾 Pet<span>Heaven</span>
          </Link>

          <button
            type="button"
            className="menu-toggle"
            aria-controls="site-nav"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? "✕ Close" : "☰ Menu"}
          </button>

          <nav
            id="site-nav"
            className={
              open
                ? "navigation open"
                : "navigation"
            }
            aria-label="Main navigation"
          >
            {nav.map(([to, text]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "nav-active"
                    : ""
                }
              >
                {text}
              </NavLink>
            ))}

            {FEATURES.community && (
              <NavLink
                to="/community"
                className={({ isActive }) =>
                  isActive
                    ? "nav-active"
                    : ""
                }
              >
                Community
              </NavLink>
            )}

            {FEATURES.donations && (
              <NavLink
                to="/donate"
                className="donate-link"
              >
                💝 Donate
              </NavLink>
            )}

            {FEATURES.favorites && (
              <Link
                to="/dashboard"
                title="Saved pets"
              >
                ♡ {favorites.length}
              </Link>
            )}

            <Link
              className="nav-account"
              to={
                user
                  ? "/dashboard"
                  : "/login"
              }
            >
              {user ? "My Activity" : "Login"}
            </Link>

            {user && (
              <button
                type="button"
                className="text-action"
                onClick={signOut}
              >
                Logout
              </button>
            )}

            {FEATURES.darkMode && (
              <button
                type="button"
                className="icon-button"
                aria-label="Toggle dark mode"
                onClick={toggleTheme}
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>
            )}
          </nav>
        </div>
      </header>

      <main
        id="main"
        className="page-enter"
        key={pathname}
      >
        {children}
      </main>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <Link className="logo" to="/">
              🐾 Pet<span>Heaven</span>
            </Link>

            <p>{SITE.tagline}</p>

            <small>
              Student charity website
              demonstration. Pet profiles
              and services are fictional.
            </small>
          </div>

          <div>
            <h3>Explore</h3>

            <Link to="/pets">
              Find a Pet
            </Link>

            <Link to="/how-it-works">
              How It Works
            </Link>

            <Link to="/release">
              Rehome a Pet
            </Link>

            <Link to="/care">
              Pet Care & Videos
            </Link>
          </div>

          <div>
            <h3>Information</h3>

            <Link to="/about">
              About Us
            </Link>

            <Link to="/mission">
              Our Mission
            </Link>

            <Link to="/contact">
              Contact
            </Link>

            <Link to="/settings">
              Settings
            </Link>
          </div>

          <div>
            <h3>Get Involved</h3>

            {FEATURES.community && (
              <Link to="/community">
                Community Reviews
              </Link>
            )}

            {FEATURES.donations && (
              <Link to="/donate">
                Donate
              </Link>
            )}

            <Link to="/dashboard">
              My Activity
            </Link>

            <Link to="/signup">
              Sign Up
            </Link>
          </div>
        </div>

        <div className="wrap copyright">
          © {new Date().getFullYear()} Pet Heaven
          {" · "}Coursework
          {" · "}No real adoptions or payments
        </div>
      </footer>
    </>
  );
}
