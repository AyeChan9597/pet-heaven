
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const SiteContext = createContext(null);

const prefix = "pet-heaven-v2-";

const uid = () =>
  globalThis.crypto?.randomUUID?.() ||
  `demo-${Date.now()}-${Math.random()}`;

function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(prefix + key);

      if (!saved) {
        return initial;
      }

      const parsed = JSON.parse(saved);

      if (
        Array.isArray(initial) &&
        !Array.isArray(parsed)
      ) {
        return initial;
      }

      return parsed;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        prefix + key,
        JSON.stringify(value)
      );
    } catch {
      // Local storage may be unavailable.
    }
  }, [key, value]);

  return [value, setValue];
}

export function SiteProvider({ children }) {
  const [theme, setTheme] = useStored(
    "theme",
    "light"
  );

  const [user, setUser] = useStored(
    "user",
    null
  );

  const [favorites, setFavorites] = useStored(
    "favorites",
    []
  );

  const [adoptions, setAdoptions] = useStored(
    "adoptions",
    []
  );

  const [releases, setReleases] = useStored(
    "releases",
    []
  );

  const [reviews, setReviews] = useStored(
    "reviews",
    []
  );

  const [messages, setMessages] = useStored(
    "messages",
    []
  );

  const [donations, setDonations] = useStored(
    "donations",
    []
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const add = (setter, data) => {
    const record = {
      ...data,
      id: uid(),
      createdAt: new Date().toISOString()
    };

    setter((old) => [record, ...old]);

    return record;
  };

  const toggleFavorite = (id) => {
    setFavorites((old) =>
      old.includes(id)
        ? old.filter((value) => value !== id)
        : [...old, id]
    );
  };

  const signIn = ({ name, email }) => {
    setUser({
      name: name || email.split("@")[0],
      email
    });
  };

  const clearData = () => {
    setUser(null);
    setFavorites([]);
    setAdoptions([]);
    setReleases([]);
    setReviews([]);
    setMessages([]);
    setDonations([]);
  };

  return (
    <SiteContext.Provider
      value={{
        theme,
        setTheme,

        user,
        signIn,
        signOut: () => setUser(null),

        favorites,
        toggleFavorite,

        adoptions,
        releases,
        reviews,
        messages,
        donations,

        addAdoption: (data) =>
          add(setAdoptions, {
            ...data,
            status: "Submitted (demo)"
          }),

        addRelease: (data) =>
          add(setReleases, {
            ...data,
            status: "Pending (demo)"
          }),

        addReview: (data) =>
          add(setReviews, data),

        addMessage: (data) =>
          add(setMessages, data),

        addDonation: (data) =>
          add(setDonations, {
            ...data,
            status: "Simulation only — no charge"
          }),

        clearData
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);

  if (!context) {
    throw new Error(
      "useSite must be used within SiteProvider"
    );
  }

  return context;
}
