
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  PageIntro,
  Heading
} from "./Pages.jsx";

const adoptSteps = [
  {
    icon: "🔎",
    title: "Explore Pets",
    description:
      "Search dogs and cats and read their profiles.",
    link: "/pets"
  },
  {
    icon: "💗",
    title: "Choose a Companion",
    description:
      "Consider daily routines, space and long-term care.",
    link: "/pets"
  },
  {
    icon: "📝",
    title: "Apply to Adopt",
    description:
      "Complete the sample form on your chosen pet's profile.",
    link: "/pets"
  },
  {
    icon: "📋",
    title: "Check My Activity",
    description:
      "View your application saved locally in the browser.",
    link: "/dashboard"
  },
  {
    icon: "🏡",
    title: "Prepare Your Home",
    description:
      "Review care guides and provide a safe welcome.",
    link: "/care"
  }
];

const rehomeSteps = [
  {
    icon: "💭",
    title: "Consider Alternatives",
    description:
      "Explore support options before deciding to rehome.",
    link: "/care"
  },
  {
    icon: "🐾",
    title: "Collect Pet Details",
    description:
      "Prepare age, temperament, health and care information.",
    link: "/release"
  },
  {
    icon: "📄",
    title: "Fill the Release Form",
    description:
      "Explain your circumstances and submit a demo request.",
    link: "/release"
  },
  {
    icon: "📋",
    title: "Check My Activity",
    description:
      "Your request is marked pending locally; no real intake occurs.",
    link: "/dashboard"
  },
  {
    icon: "💗",
    title: "Prioritize Welfare",
    description:
      "Learn about safe, responsible transitions and screening.",
    link: "/care"
  }
];

const faq = [
  {
    question: "Is this a real adoption service?",
    answer:
      "No. All animals and submissions are for coursework demonstration only."
  },
  {
    question: "Do I need to log in?",
    answer:
      "No. Forms work as a guest. The optional login is only a mock interface."
  },
  {
    question: "Where do I see my application?",
    answer:
      "Open My Activity to view submissions stored in this browser."
  },
  {
    question: "Can I rehome my own pet?",
    answer:
      "You can test the rehoming form. It does not contact a rescue organization."
  },
  {
    question: "How do donations work?",
    answer:
      "Donations are simulated. No real payment information is collected."
  }
];

export default function HowItWorksPage() {
  const [tab, setTab] = useState("adopt");
  const [index, setIndex] = useState(0);

  const steps =
    tab === "adopt"
      ? adoptSteps
      : rehomeSteps;

  const current = steps[index];

  const switchTab = (value) => {
    setTab(value);
    setIndex(0);
  };

  return (
    <>
      <PageIntro
        eyebrow="Step-by-step"
        title="How It Works"
        subtitle="Explore responsible adoption and rehoming from start to finish."
      />

      <section className="section">
        <div className="wrap">
          <div
            className="tabs"
            role="group"
            aria-label="Choose a process"
          >
            <button
              type="button"
              className={
                tab === "adopt"
                  ? "selected"
                  : ""
              }
              aria-pressed={tab === "adopt"}
              onClick={() =>
                switchTab("adopt")
              }
            >
              🐶 I Want to Adopt
            </button>

            <button
              type="button"
              className={
                tab === "rehome"
                  ? "selected"
                  : ""
              }
              aria-pressed={tab === "rehome"}
              onClick={() =>
                switchTab("rehome")
              }
            >
              🏡 I Need to Rehome
            </button>
          </div>

          <Heading
            title={
              tab === "adopt"
                ? "Your Adoption Journey"
                : "Responsible Rehoming"
            }
            subtitle="Select any step, or use Next and Previous to follow the full process."
          />

          <div className="how-grid">
            <div className="step-list">
              {steps.map((step, number) => (
                <button
                  key={step.title}
                  type="button"
                  className={
                    index === number
                      ? "step selected"
                      : "step"
                  }
                  aria-pressed={index === number}
                  onClick={() =>
                    setIndex(number)
                  }
                >
                  <span className="step-icon">
                    {step.icon}
                  </span>

                  <span>
                    <small>
                      STEP {number + 1}
                    </small>

                    <strong>
                      {step.title}
                    </strong>

                    <span>
                      {step.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="panel step-detail">
              <div className="step-art">
                {current.icon}
              </div>

              <span className="eyebrow">
                STEP {index + 1} OF {steps.length}
              </span>

              <h2>{current.title}</h2>

              <p>{current.description}</p>

              <div className="progress">
                <div
                  style={{
                    width: `${
                      ((index + 1) /
                        steps.length) *
                      100
                    }%`
                  }}
                />
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="btn outline"
                  disabled={index === 0}
                  onClick={() =>
                    setIndex((value) =>
                      Math.max(0, value - 1)
                    )
                  }
                >
                  ← Previous
                </button>

                {index < steps.length - 1 ? (
                  <button
                    type="button"
                    className="btn primary"
                    onClick={() =>
                      setIndex((value) =>
                        Math.min(
                          steps.length - 1,
                          value + 1
                        )
                      )
                    }
                  >
                    Next Step →
                  </button>
                ) : (
                  <Link
                    className="btn primary"
                    to={
                      tab === "adopt"
                        ? "/pets"
                        : "/release"
                    }
                  >
                    Get Started →
                  </Link>
                )}
              </div>

              <Link
                className="text-link"
                to={current.link}
              >
                Go to related page →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section tinted">
        <div className="wrap">
          <Heading
            eyebrow="Before adoption"
            title="Are You Ready?"
            subtitle="Think about the responsibilities of caring for an animal."
          />

          <div className="four-grid">
            {[
              ["🏠", "Suitable Housing"],
              ["💰", "Long-Term Budget"],
              ["🕒", "Time and Commitment"],
              ["🩺", "Health and Safety"]
            ].map(([icon, title]) => (
              <article
                className="feature"
                key={title}
              >
                <span className="feature-icon">
                  {icon}
                </span>

                <h3>{title}</h3>

                <p>
                  Consider these responsibilities
                  before welcoming an animal.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap faq-wrap">
          <Heading
            eyebrow="Help"
            title="Frequently Asked Questions"
          />

          {faq.map((item) => (
            <details
              key={item.question}
              className="faq"
            >
              <summary>
                {item.question}
              </summary>

              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
