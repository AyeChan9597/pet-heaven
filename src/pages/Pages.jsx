
import { useMemo, useState } from "react";

import {
  Link,
  Navigate,
  useParams
} from "react-router-dom";

import {
  pets,
  careTips,
  quiz
} from "../data/pets.js";

import {
  SITE,
  FEATURES
} from "../settings.js";

import PetCard, {
  PetPicture
} from "../components/PetCard.jsx";

import { useSite } from "../context/SiteContext.jsx";

// =========================================
// REUSABLE HELPERS
// =========================================

export const validEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const validPhone = (value) => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
};

export const formatDate = (date) =>
  new Date(date).toLocaleString("en-SG", {
    dateStyle: "medium"
  });

export function Heading({
  eyebrow,
  title,
  subtitle
}) {
  return (
    <div className="section-heading">
      {eyebrow && (
        <span className="eyebrow">
          {eyebrow}
        </span>
      )}

      <h2>{title}</h2>

      {subtitle && (
        <p className="muted">{subtitle}</p>
      )}
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  subtitle
}) {
  return (
    <section className="page-intro">
      <div className="wrap">
        <span className="eyebrow">
          {eyebrow}
        </span>

        <h1>{title}</h1>

        <p>{subtitle}</p>
      </div>
    </section>
  );
}

export function Field({
  label,
  id,
  children
}) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
      </label>

      {children}
    </div>
  );
}

export function Notice({
  children,
  danger = false
}) {
  return (
    <div
      className={
        danger
          ? "notice danger"
          : "notice"
      }
      role="status"
    >
      {children}
    </div>
  );
}

// =========================================
// 1. HOME PAGE
// =========================================

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">
              🐾 Every pet deserves a loving home
            </span>

            <h1>
              Find a friend.
              <br />
              <em>Change a life.</em>
            </h1>

            <p>
              Explore adorable dogs and cats,
              learn about responsible adoption,
              and find a companion who fits
              your life.
            </p>

            <div className="actions">
              <Link
                className="btn primary"
                to="/pets"
              >
                Find a Pet →
              </Link>

              <Link
                className="btn outline"
                to="/how-it-works"
              >
                How It Works
              </Link>
            </div>

            <div className="hero-mini">
              💗 Thoughtful matching
              {" · "}
              🏠 Responsible rehoming
            </div>
          </div>
          
          <div className="hero-art">
            <img
              src="/images/pets.jpeg"
              alt="A dog and cat together"
              className="hero-pets-img"
            />
          </div>

        </div>
      </section>

      <section className="stats">
        <div className="wrap stats-grid">
          <div>
            <strong>{pets.length}</strong>
            <span>Sample Pets</span>
          </div>

          <div>
            <strong>2</strong>
            <span>Pet Types</span>
          </div>

          <div>
            <strong>{careTips.length}</strong>
            <span>Care Guides</span>
          </div>

          <div>
            <strong>∞</strong>
            <span>Love to Share</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="flex-between">
            <Heading
              eyebrow="Meet them"
              title="Pets looking for a family"
              subtitle="Browse sample profiles of dogs and cats."
            />

            <Link
              className="text-link"
              to="/pets"
            >
              See All Pets →
            </Link>
          </div>

          <div className="pet-grid">
            {pets.slice(0, 3).map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section tinted">
        <div className="wrap">
          <Heading
            eyebrow="Start here"
            title="A simple adoption journey"
            subtitle="Learn how the process could work, from browsing to welcoming a pet."
          />

          <div className="three-grid">
            {[
              [
                "🔎",
                "Discover",
                "Browse and compare profiles."
              ],
              [
                "📝",
                "Apply",
                "Complete the demo adoption form."
              ],
              [
                "🏡",
                "Prepare",
                "Learn how to welcome a pet safely."
              ]
            ].map(([icon, title, description]) => (
              <div
                className="feature"
                key={title}
              >
                <span className="feature-icon">
                  {icon}
                </span>

                <h3>{title}</h3>

                <p>{description}</p>
              </div>
            ))}
          </div>

          <div className="center">
            <Link
              className="btn primary"
              to="/how-it-works"
            >
              See How It Works →
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap callout">
          <div>
            <h2>Make a caring difference</h2>

            <p>
              Explore pet care lessons,
              community feedback and
              responsible adoption.
            </p>
          </div>

          <div className="actions">
            <Link
              className="btn light"
              to="/care"
            >
              Explore Pet Care
            </Link>

            {FEATURES.donations && (
              <Link
                className="btn light"
                to="/donate"
              >
                💝 Donate
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

// =========================================
// 2. PET DIRECTORY
// =========================================

export function PetsPage() {
  const { favorites } = useSite();

  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [size, setSize] = useState("All");
  const [sort, setSort] = useState("name");
  const [saved, setSaved] = useState(false);

  const shown = useMemo(() => {
    return pets
      .filter((pet) => {
        const matchesType =
          type === "All" || pet.type === type;

        const matchesSize =
          size === "All" || pet.size === size;

        const matchesSaved =
          !saved || favorites.includes(pet.id);

        const searchText = `
          ${pet.name}
          ${pet.breed}
          ${pet.area}
          ${pet.traits.join(" ")}
        `.toLowerCase();

        return (
          matchesType &&
          matchesSize &&
          matchesSaved &&
          searchText.includes(
            query.trim().toLowerCase()
          )
        );
      })
      .sort((a, b) => {
        if (sort === "young") {
          return a.age - b.age;
        }

        if (sort === "old") {
          return b.age - a.age;
        }

        return a.name.localeCompare(b.name);
      });
  }, [
    query,
    type,
    size,
    sort,
    saved,
    favorites
  ]);

  const resetFilters = () => {
    setQuery("");
    setType("All");
    setSize("All");
    setSort("name");
    setSaved(false);
  };

  return (
    <>
      <PageIntro
        eyebrow="Adoption directory"
        title="Find Your Perfect Pet"
        subtitle="Search dogs and cats, explore profiles, and save your favorites."
      />

      <section className="section">
        <div className="wrap">
          <div className="filters">
            <Field
              id="search"
              label="Search"
            >
              <input
                id="search"
                placeholder="Name, breed, personality..."
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
              />
            </Field>

            <Field id="type" label="Type">
              <select
                id="type"
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
              >
                <option>All</option>
                <option>Dog</option>
                <option>Cat</option>
              </select>
            </Field>

            <Field id="size" label="Size">
              <select
                id="size"
                value={size}
                onChange={(e) =>
                  setSize(e.target.value)
                }
              >
                <option>All</option>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </Field>

            <Field id="sort" label="Sort">
              <select
                id="sort"
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
              >
                <option value="name">Name</option>
                <option value="young">Youngest</option>
                <option value="old">Oldest</option>
              </select>
            </Field>

            {FEATURES.favorites && (
              <label className="check">
                <input
                  type="checkbox"
                  checked={saved}
                  onChange={(e) =>
                    setSaved(e.target.checked)
                  }
                />

                Saved only
              </label>
            )}
          </div>

          <div className="flex-between result-bar">
            <strong>
              {shown.length} pets found
            </strong>

            <button
              type="button"
              className="text-action"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>

          {shown.length ? (
            <div className="pet-grid">
              {shown.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>No matching pets</h3>

              <p>
                Try different filters
                or a shorter search.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// =========================================
// 3. PET DETAILS
// =========================================

export function PetDetailPage() {
  const { id } = useParams();

  const pet = pets.find(
    (item) => item.id === id
  );

  const {
    favorites,
    toggleFavorite
  } = useSite();

  if (!pet) {
    return <NotFoundPage />;
  }

  const details = [
    ["Type", pet.type],
    ["Breed", pet.breed],
    ["Age", `${pet.age} years`],
    ["Gender", pet.gender],
    ["Size", pet.size],
    ["Location", pet.area],
    [
      "Vaccinated",
      pet.vaccinated ? "Yes" : "Unknown"
    ],
    [
      "Sterilised",
      pet.sterilised ? "Yes" : "Not yet"
    ]
  ];

  return (
    <section className="section">
      <div className="wrap">
        <Link
          className="text-link"
          to="/pets"
        >
          ← Back to pets
        </Link>

        <div className="detail-grid">
          <PetPicture
            pet={pet}
            large
          />

          <div>
            <span className="eyebrow">
              Meet your new friend
            </span>

            <h1>{pet.name} 💗</h1>

            <p className="lead muted">
              {pet.description}
            </p>

            <div className="facts">
              {details.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <h3>Personality</h3>

            <div className="chips">
              {pet.traits.map((trait) => (
                <span key={trait}>
                  {trait}
                </span>
              ))}
            </div>

            <div className="actions">
              <Link
                className="btn primary"
                to={`/adopt/${pet.id}`}
              >
                Apply to Adopt
              </Link>

              {FEATURES.favorites && (
                <button
                  type="button"
                  className="btn outline"
                  onClick={() =>
                    toggleFavorite(pet.id)
                  }
                >
                  {favorites.includes(pet.id)
                    ? "♥ Saved"
                    : "♡ Save Pet"}
                </button>
              )}
            </div>

            <p className="small muted">
              Sample profile only.
              No real animal is available
              for adoption through this site.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// =========================================
// 4. ADOPTION APPLICATION
// =========================================

export function AdoptionPage() {
  const { id } = useParams();

  const pet = pets.find(
    (item) => item.id === id
  );

  const {
    user,
    addAdoption
  } = useSite();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    housing: "",
    experience: "",
    reason: "",
    agree: false
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!pet) {
    return <NotFoundPage />;
  }

  const update = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]:
        e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (
      !validEmail(form.email) ||
      !validPhone(form.phone)
    ) {
      setError(
        "Enter a valid email and phone number."
      );
      return;
    }

    if (form.reason.trim().length < 20) {
      setError(
        "Please provide at least 20 characters about your adoption plans."
      );
      return;
    }

    if (!form.agree) {
      setError(
        "Please acknowledge the demo notice."
      );
      return;
    }

    addAdoption({
      ...form,
      petId: pet.id,
      petName: pet.name
    });

    setError("");
    setSuccess(true);
  };

  return (
    <>
      <PageIntro
        eyebrow="Adoption"
        title={`Adopt ${pet.name}`}
        subtitle="Complete the sample application. Nothing is transmitted to an animal rescue."
      />

      <section className="section">
        <div className="wrap form-grid">
          <aside className="side-card">
            <PetPicture pet={pet} />

            <h2>Meet {pet.name}</h2>

            <p>{pet.description}</p>

            <Notice>
              Demo application only.
              Use fictional information.
            </Notice>
          </aside>

          <div className="panel">
            {success ? (
              <>
                <Notice>
                  Application saved locally!
                  View it under My Activity.
                </Notice>

                <Link
                  className="btn primary"
                  to="/dashboard"
                >
                  My Activity →
                </Link>
              </>
            ) : (
              <form
                className="form-stack"
                onSubmit={submit}
              >
                <h2>Adoption Application</h2>

                <div className="two-grid">
                  <Field
                    id="a-name"
                    label="Full name *"
                  >
                    <input
                      id="a-name"
                      name="name"
                      value={form.name}
                      onChange={update}
                      minLength={2}
                      required
                    />
                  </Field>

                  <Field
                    id="a-email"
                    label="Email *"
                  >
                    <input
                      id="a-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={update}
                      required
                    />
                  </Field>
                </div>

                <Field
                  id="a-phone"
                  label="Phone *"
                >
                  <input
                    id="a-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={update}
                    required
                  />
                </Field>

                <div className="two-grid">
                  <Field
                    id="a-housing"
                    label="Housing *"
                  >
                    <select
                      id="a-housing"
                      name="housing"
                      value={form.housing}
                      onChange={update}
                      required
                    >
                      <option value="">
                        Select...
                      </option>
                      <option>HDB flat</option>
                      <option>Condominium</option>
                      <option>Landed home</option>
                      <option>Other</option>
                    </select>
                  </Field>

                  <Field
                    id="a-exp"
                    label="Pet experience *"
                  >
                    <select
                      id="a-exp"
                      name="experience"
                      value={form.experience}
                      onChange={update}
                      required
                    >
                      <option value="">
                        Select...
                      </option>
                      <option>
                        First-time owner
                      </option>
                      <option>
                        Previous owner
                      </option>
                      <option>
                        Current pet owner
                      </option>
                    </select>
                  </Field>
                </div>

                <Field
                  id="a-reason"
                  label="Why are you a good match? *"
                >
                  <textarea
                    id="a-reason"
                    name="reason"
                    rows={5}
                    value={form.reason}
                    onChange={update}
                    minLength={20}
                    required
                  />
                </Field>

                <label className="check">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={update}
                    required
                  />

                  I understand this application
                  is only saved locally.
                </label>

                {error && (
                  <Notice danger>
                    {error}
                  </Notice>
                )}

                <button
                  className="btn primary full"
                  type="submit"
                >
                  Submit Demo Application
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

// =========================================
// 5. REHOMING / RELEASE
// =========================================

export function ReleasePage() {
  const {
    user,
    addRelease
  } = useSite();

  const [form, setForm] = useState({
    owner: user?.name || "",
    email: user?.email || "",
    petName: "",
    type: "",
    age: "",
    area: "",
    reason: "",
    notes: "",
    agree: false
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]:
        e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (
      !validEmail(form.email) ||
      form.reason.trim().length < 20
    ) {
      setError(
        "Use a valid email and explain your situation in at least 20 characters."
      );
      return;
    }

    if (!form.agree) {
      setError(
        "Please confirm this is a demo."
      );
      return;
    }

    addRelease(form);

    setError("");
    setSuccess(true);
  };

  return (
    <>
      <PageIntro
        eyebrow="Responsible rehoming"
        title="Rehome a Pet"
        subtitle="Learn how the release process could work. This is not a real intake service."
      />

      <section className="section">
        <div className="wrap form-grid">
          <aside className="side-card">
            <div className="big-emoji">
              🏡🐾
            </div>

            <h2>Think it Through</h2>

            <p>
              Consider family support,
              veterinary advice and safe
              alternatives before rehoming
              a pet.
            </p>

            <p>
              Submitting this form does
              not add an animal to
              the public directory.
            </p>
          </aside>

          <div className="panel">
            {success ? (
              <>
                <Notice>
                  Demo rehoming request
                  saved as pending.
                  Check My Activity.
                </Notice>

                <Link
                  className="btn primary"
                  to="/dashboard"
                >
                  My Activity →
                </Link>
              </>
            ) : (
              <form
                className="form-stack"
                onSubmit={submit}
              >
                <h2>Pet Release Request</h2>

                <div className="two-grid">
                  <Field
                    id="r-owner"
                    label="Your name *"
                  >
                    <input
                      id="r-owner"
                      name="owner"
                      value={form.owner}
                      onChange={update}
                      required
                      minLength={2}
                    />
                  </Field>

                  <Field
                    id="r-email"
                    label="Email *"
                  >
                    <input
                      id="r-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={update}
                      required
                    />
                  </Field>
                </div>

                <div className="two-grid">
                  <Field
                    id="r-pet"
                    label="Pet name *"
                  >
                    <input
                      id="r-pet"
                      name="petName"
                      value={form.petName}
                      onChange={update}
                      required
                    />
                  </Field>

                  <Field
                    id="r-type"
                    label="Pet type *"
                  >
                    <select
                      id="r-type"
                      name="type"
                      value={form.type}
                      onChange={update}
                      required
                    >
                      <option value="">
                        Select...
                      </option>
                      <option>Dog</option>
                      <option>Cat</option>
                    </select>
                  </Field>
                </div>

                <div className="two-grid">
                  <Field
                    id="r-age"
                    label="Age (years) *"
                  >
                    <input
                      id="r-age"
                      name="age"
                      type="number"
                      min="0"
                      max="30"
                      value={form.age}
                      onChange={update}
                      required
                    />
                  </Field>

                  <Field
                    id="r-area"
                    label="Area *"
                  >
                    <input
                      id="r-area"
                      name="area"
                      value={form.area}
                      onChange={update}
                      required
                    />
                  </Field>
                </div>

                <Field
                  id="r-reason"
                  label="Reason for rehoming *"
                >
                  <textarea
                    id="r-reason"
                    name="reason"
                    rows={5}
                    value={form.reason}
                    onChange={update}
                    minLength={20}
                    required
                  />
                </Field>

                <Field
                  id="r-notes"
                  label="Care notes (optional)"
                >
                  <textarea
                    id="r-notes"
                    name="notes"
                    rows={3}
                    value={form.notes}
                    onChange={update}
                  />
                </Field>

                <label className="check">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={update}
                    required
                  />

                  I understand this is
                  a local demo request.
                </label>

                {error && (
                  <Notice danger>
                    {error}
                  </Notice>
                )}

                <button
                  className="btn primary full"
                  type="submit"
                >
                  Save Demo Request
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

// =========================================
// 6. ABOUT US
// =========================================

export function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="Our story"
        title="About Pet Heaven"
        subtitle="A friendly student project introducing responsible adoption, rehoming and pet care."
      />

      <section className="section">
        <div className="wrap split">
          <div>
            <Heading
              eyebrow="Who we are"
              title="A caring place to learn"
            />

            <p>
              Pet Heaven is a fictional
              charity-style React website
              designed for coursework.
              It demonstrates pet listings,
              applications, member experiences
              and educational resources.
            </p>

            <p>
              Every pet profile and organization
              detail is sample data.
              Our goal is an easy-to-use,
              accessible design that encourages
              thoughtful ownership.
            </p>

            <Link
              className="btn primary"
              to="/mission"
            >
              Our Mission
            </Link>
          </div>

          <div className="illustration">
            🐕 💗 🐈
          </div>
        </div>
      </section>
    </>
  );
}

// =========================================
// 7. OUR MISSION
// =========================================

export function MissionPage() {
  return (
    <>
      <PageIntro
        eyebrow="Our purpose"
        title="Better Matches. Kinder Futures."
        subtitle="Informed decisions and long-term commitment are at the heart of pet welfare."
      />

      <section className="section">
        <div className="wrap">
          <div className="callout">
            <div>
              <h2>Our Mission</h2>

              <p>
                Help people learn about responsible
                pet adoption and rehoming through
                clear information, engaging
                activities and simple accessible
                tools.
              </p>
            </div>

            <span className="big-emoji">
              🐾
            </span>
          </div>

          <div className="three-grid below">
            {[
              [
                "💗",
                "Compassion",
                "Respect every animal's needs."
              ],
              [
                "📘",
                "Education",
                "Learn what lifelong care involves."
              ],
              [
                "🤝",
                "Community",
                "Share experiences and helpful guidance."
              ]
            ].map(([icon, title, description]) => (
              <article
                className="feature"
                key={title}
              >
                <span className="feature-icon">
                  {icon}
                </span>

                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// =========================================
// 8. PET CARE AND VIDEO GALLERY
// =========================================

export function CarePage() {
  const videos = SITE.videos.filter(
    (video) => video.youtubeId.trim()
  );

  const [selected, setSelected] = useState(0);

  const current =
    videos[selected] || videos[0];

  return (
    <>
      <PageIntro
        eyebrow="Learn together"
        title="Pet Care Learning Centre"
        subtitle="Explore care guides, optional videos and a quiz to prepare for responsible pet ownership."
      />

      <section className="section">
        <div className="wrap">
          <Heading
            eyebrow="Helpful guides"
            title="Essential Care Tips"
          />

          <div className="three-grid">
            {careTips.map((tip) => (
              <article
                className="feature"
                key={tip.title}
              >
                <span className="feature-icon">
                  {tip.icon}
                </span>

                <h3>{tip.title}</h3>
                <p>{tip.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {FEATURES.videos && (
        <section className="section tinted">
          <div className="wrap">
            <Heading
              eyebrow="Watch and learn"
              title="Pet Care Video Gallery"
              subtitle=""
            />

            {current ? (
              <div className="video-grid">
                <div className="video-frame">
                  <iframe
                    title={current.title}
                    src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(current.youtubeId)}`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>

                <div className="video-list">
                  <h3>Choose a Video</h3>

                  {videos.map((video, index) => (
                    <button
                      type="button"
                      key={`${video.title}-${index}`}
                      className={
                        index === selected
                          ? "video-choice selected"
                          : "video-choice"
                      }
                      onClick={() =>
                        setSelected(index)
                      }
                    >
                      ▶ {video.title}

                      <small>
                        {video.description}
                      </small>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="video-placeholder">
                <span>▶️</span>

                <h3>
                  Video gallery is ready
                </h3>

                <p>
                  Open{" "}
                  <code>src/settings.js</code>,
                  then add an embeddable YouTube
                  video ID to one of the video
                  entries. No actual video is
                  configured yet.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {FEATURES.quiz && (
        <section className="section">
          <div className="wrap callout">
            <div>
              <h2>
                Test Your Pet Care Knowledge
              </h2>

              <p>
                Try a short quiz with feedback
                after every question.
              </p>
            </div>

            <Link
              className="btn light"
              to="/quiz"
            >
              Take the Quiz →
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

// =========================================
// 9. COMMUNITY REVIEWS
// =========================================

const sampleReviews = [
  {
    id: "demo-a",
    name: "Alex (sample)",
    rating: 5,
    comment:
      "Easy to browse pets and learn what they need."
  },
  {
    id: "demo-b",
    name: "Jamie (sample)",
    rating: 4,
    comment:
      "Clear adoption information and a friendly design."
  }
];

export function CommunityPage() {
  const {
    reviews,
    addReview,
    user
  } = useSite();

  const [form, setForm] = useState({
    name: user?.name || "",
    rating: "5",
    comment: ""
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();

    if (form.comment.trim().length < 10) {
      setError(
        "Write at least 10 characters."
      );
      return;
    }

    addReview({
      ...form,
      rating: Number(form.rating)
    });

    setForm({
      name: "",
      rating: "5",
      comment: ""
    });

    setSaved(true);
    setError("");
  };

  return (
    <>
      <PageIntro
        eyebrow="Community"
        title="Your Stories Matter"
        subtitle="Read sample reviews and leave browser-only feedback."
      />

      <section className="section">
        <div className="wrap form-grid">
          <div>
            <Heading title="Visitor Feedback" />

            {[
              ...reviews,
              ...sampleReviews
            ].map((review) => (
              <article
                className="review"
                key={review.id}
              >
                <div className="stars">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(
                    5 - review.rating
                  )}
                </div>

                <p>“{review.comment}”</p>

                <strong>{review.name}</strong>
              </article>
            ))}
          </div>

          <div className="panel">
            <form
              className="form-stack"
              onSubmit={submit}
            >
              <h2>Leave a Review</h2>

              <Field
                id="c-name"
                label="Display name *"
              >
                <input
                  id="c-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      name: e.target.value
                    }))
                  }
                  required
                  minLength={2}
                />
              </Field>

              <Field
                id="c-rating"
                label="Rating"
              >
                <select
                  id="c-rating"
                  value={form.rating}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      rating: e.target.value
                    }))
                  }
                >
                  {[5, 4, 3, 2, 1].map(
                    (rating) => (
                      <option
                        key={rating}
                        value={rating}
                      >
                        {rating} stars
                      </option>
                    )
                  )}
                </select>
              </Field>

              <Field
                id="c-comment"
                label="Feedback *"
              >
                <textarea
                  id="c-comment"
                  rows={5}
                  value={form.comment}
                  minLength={10}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      comment: e.target.value
                    }))
                  }
                  required
                />
              </Field>

              {error && (
                <Notice danger>
                  {error}
                </Notice>
              )}

              {saved && (
                <Notice>
                  Review saved locally!
                </Notice>
              )}

              <button
                className="btn primary"
                type="submit"
              >
                Post Review
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

// =========================================
// 10. LOGIN AND SIGNUP
// =========================================

export function AuthPage({ mode }) {
  const {
    user,
    signIn
  } = useSite();

  const signup = mode === "signup";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });

  const [error, setError] = useState("");

  if (user) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  const submit = (e) => {
    e.preventDefault();

    if (
      !validEmail(form.email) ||
      form.password.length < 8
    ) {
      setError(
        "Use a valid email and password at least 8 characters."
      );
      return;
    }

    if (
      signup &&
      (
        form.name.trim().length < 2 ||
        form.password !== form.confirm
      )
    ) {
      setError(
        "Enter your name and matching passwords."
      );
      return;
    }

    signIn({
      name: signup ? form.name : "",
      email: form.email
    });
  };

  return (
    <section className="section tinted">
      <div className="wrap">
        <div className="panel auth-panel">
          <div className="big-emoji">
            🐾
          </div>

          <h1>
            {signup
              ? "Sign Up"
              : "Member Login"}
          </h1>

          <p className="muted">
            {signup
              ? "Create a profile."
              : "Log in to view your activity."}
          </p>

          <Notice>
            Any valid email and password
            of 8+ characters works.
            Passwords are not saved or verified.
            Never enter real credentials.
          </Notice>

          <form
            className="form-stack"
            onSubmit={submit}
          >
            {signup && (
              <Field
                id="auth-name"
                label="Your name *"
              >
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  minLength={2}
                  value={form.name}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      name: e.target.value
                    }))
                  }
                  required
                />
              </Field>
            )}

            <Field
              id="auth-email"
              label="Email *"
            >
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    email: e.target.value
                  }))
                }
                required
              />
            </Field>

            <Field
              id="auth-pass"
              label="Password *"
            >
              <input
                id="auth-pass"
                type="password"
                autoComplete={
                  signup
                    ? "new-password"
                    : "current-password"
                }
                minLength={8}
                value={form.password}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    password: e.target.value
                  }))
                }
                required
              />
            </Field>

            {signup && (
              <Field
                id="auth-confirm"
                label="Confirm password *"
              >
                <input
                  id="auth-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      confirm: e.target.value
                    }))
                  }
                  required
                />
              </Field>
            )}

            {error && (
              <Notice danger>
                {error}
              </Notice>
            )}

            <button
              className="btn primary full"
              type="submit"
            >
              {signup
                ? "Create Profile"
                : "Log In"}
            </button>
          </form>

          <p className="auth-switch">
            {signup
              ? "Already have an account?"
              : "New here?"}{" "}

            <Link
              className="text-link"
              to={
                signup
                  ? "/login"
                  : "/signup"
              }
            >
              {signup
                ? "Login"
                : "Sign Up"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

// =========================================
// 11. MY ACTIVITY DASHBOARD
// =========================================

function ActivityList({
  title,
  items,
  render
}) {
  return (
    <section className="activity-section">
      <h2>
        {title} ({items.length})
      </h2>

      {items.length ? (
        items.map((item) => (
          <article
            className="activity-item"
            key={item.id}
          >
            <div>
              {render(item)}
            </div>

            <small>
              {formatDate(item.createdAt)}
            </small>
          </article>
        ))
      ) : (
        <p className="muted">
          Nothing saved yet.
        </p>
      )}
    </section>
  );
}

export function DashboardPage() {
  const {
    user,
    favorites,
    adoptions,
    releases,
    messages,
    donations
  } = useSite();

  const saved = pets.filter(
    (pet) => favorites.includes(pet.id)
  );

  return (
    <>
      <PageIntro
        eyebrow="Member activity"
        title={
          user
            ? `Welcome, ${user.name}`
            : "My Activity"
        }
        subtitle="Your locally stored favorites, demo applications, and simulated transactions."
      />

      <section className="section">
        <div className="wrap dashboard-grid">
          {!user && (
            <Notice>
              You are browsing as a guest.{" "}

              <Link
                to="/login"
                className="text-link"
              >
                Try demo login
              </Link>.
            </Notice>
          )}

          {FEATURES.favorites && (
            <section className="activity-section">
              <h2>
                ♡ Saved Pets ({saved.length})
              </h2>

              {saved.length ? (
                <div className="pet-grid">
                  {saved.map((pet) => (
                    <PetCard
                      key={pet.id}
                      pet={pet}
                    />
                  ))}
                </div>
              ) : (
                <p className="muted">
                  Use the hearts in the
                  pet directory to save pets.
                </p>
              )}
            </section>
          )}

          <ActivityList
            title="📝 Adoption Applications"
            items={adoptions}
            render={(item) => (
              <>
                <strong>
                  {item.petName} — {item.status}
                </strong>

                <p>{item.name}</p>
              </>
            )}
          />

          <ActivityList
            title="🏡 Rehoming Requests"
            items={releases}
            render={(item) => (
              <>
                <strong>
                  {item.petName} — {item.status}
                </strong>

                <p>
                  {item.type} · {item.area}
                </p>
              </>
            )}
          />

          {FEATURES.donations && (
            <ActivityList
              title="💝 Demo Donations"
              items={donations}
              render={(item) => (
                <>
                  <strong>
                    S${Number(item.amount).toFixed(2)}
                    {" — "}{item.status}
                  </strong>

                  <p>
                    {item.donorName} · {item.method}
                    {" · Ref: "}{item.id}
                  </p>
                </>
              )}
            />
          )}

          <ActivityList
            title="✉ Contact Enquiries"
            items={messages}
            render={(item) => (
              <>
                <strong>
                  {item.topic}
                </strong>

                <p>
                  {item.name} · Saved locally,
                  not sent
                </p>
              </>
            )}
          />
        </div>
      </section>
    </>
  );
}

// =========================================
// 12. INTERACTIVE QUIZ
// =========================================

export function QuizPage() {
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const done = i >= quiz.length;

  const current = quiz[i];

  const check = () => {
    if (answer === null) {
      return;
    }

    if (answer === current.correct) {
      setScore((value) => value + 1);
    }

    setChecked(true);
  };

  const next = () => {
    setI((value) => value + 1);
    setAnswer(null);
    setChecked(false);
  };

  const restart = () => {
    setI(0);
    setAnswer(null);
    setChecked(false);
    setScore(0);
  };

  return (
    <>
      <PageIntro
        eyebrow="Interactive learning"
        title="Pet Care Quiz"
        subtitle="Four quick questions with explanations to improve your pet care knowledge."
      />

      <section className="section">
        <div className="wrap">
          <div className="panel quiz-panel">
            {done ? (
              <div className="center">
                <div className="big-emoji">
                  🏆
                </div>

                <h2>
                  You scored {score} / {quiz.length}
                </h2>

                <p>
                  Keep learning and caring
                  for animals!
                </p>

                <button
                  className="btn primary"
                  type="button"
                  onClick={restart}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <p className="small muted">
                  Question {i + 1} of {quiz.length}
                  {" · "}Score: {score}
                </p>

                <div className="progress">
                  <div
                    style={{
                      width: `${
                        ((i + 1) / quiz.length) * 100
                      }%`
                    }}
                  />
                </div>

                <h2>{current.question}</h2>

                <div className="quiz-answers">
                  {current.options.map(
                    (option, index) => (
                      <button
                        key={option}
                        type="button"
                        disabled={checked}
                        className={`${
                          answer === index
                            ? "selected "
                            : ""
                        }${
                          checked &&
                          index === current.correct
                            ? "correct"
                            : ""
                        }`}
                        aria-pressed={
                          answer === index
                        }
                        onClick={() =>
                          setAnswer(index)
                        }
                      >
                        {String.fromCharCode(
                          65 + index
                        )}
                        . {option}
                      </button>
                    )
                  )}
                </div>

                {checked && (
                  <Notice>
                    {answer === current.correct
                      ? "Correct! "
                      : "Good try! "}
                    {current.why}
                  </Notice>
                )}

                <div className="actions end">
                  {checked ? (
                    <button
                      className="btn primary"
                      type="button"
                      onClick={next}
                    >
                      {i === quiz.length - 1
                        ? "Show Results"
                        : "Next Question →"}
                    </button>
                  ) : (
                    <button
                      className="btn primary"
                      type="button"
                      disabled={answer === null}
                      onClick={check}
                    >
                      Check Answer
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

// =========================================
// 13. SETTINGS
// =========================================

export function SettingsPage() {
  const {
    theme,
    setTheme,
    clearData
  } = useSite();

  const [ask, setAsk] = useState(false);
  const [cleared, setCleared] = useState(false);

  return (
    <>
      <PageIntro
        eyebrow="Personalize"
        title="Settings"
        subtitle="Choose a theme or clear only this browser's saved demo data."
      />

      <section className="section">
        <div className="wrap">
          <div className="panel settings-panel">
            <h2>Appearance</h2>

            {FEATURES.darkMode && (
              <Field
                id="theme"
                label="Color theme"
              >
                <select
                  id="theme"
                  value={theme}
                  onChange={(e) =>
                    setTheme(e.target.value)
                  }
                >
                  <option value="light">
                    Light (mauve & cream)
                  </option>

                  <option value="dark">
                    Dark plum
                  </option>
                </select>
              </Field>
            )}

            <hr />

            <h2>Demo Data</h2>

            <p className="muted">
              Reset favorites, demo account,
              applications, reviews, messages
              and donation simulations
              saved on this device.
            </p>

            {ask ? (
              <div className="actions">
                <button
                  className="btn danger-button"
                  type="button"
                  onClick={() => {
                    clearData();
                    setAsk(false);
                    setCleared(true);
                  }}
                >
                  Confirm Clear
                </button>

                <button
                  className="btn outline"
                  type="button"
                  onClick={() =>
                    setAsk(false)
                  }
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="btn outline"
                type="button"
                onClick={() =>
                  setAsk(true)
                }
              >
                Clear Demo Data
              </button>
            )}

            {cleared && (
              <Notice>
                Local demo data cleared.
              </Notice>
            )}

            <hr />

            <h3>Customize</h3>

            <p>
              Edit <code>src/settings.js</code>{" "}
              for contact details, videos and
              features. Edit{" "}
              <code>src/data/pets.js</code>{" "}
              for pets and images.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

// =========================================
// 14. PAGE NOT FOUND
// =========================================

export function NotFoundPage() {
  return (
    <section className="section">
      <div className="wrap center">
        <div className="big-emoji">
          🐾
        </div>

        <h1>Page not found</h1>

        <p>
          Let's get you back to Pet Heaven.
        </p>

        <Link
          className="btn primary"
          to="/"
        >
          Go Home
        </Link>
      </div>
    </section>
  );
}
