
import { useState } from "react";

import { SITE } from "../settings.js";

import { useSite } from "../context/SiteContext.jsx";

import {
  Field,
  Notice,
  validEmail,
  validPhone
} from "./Pages.jsx";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  topic: "General Enquiry",
  message: ""
};

export default function ContactPage() {
  const { addMessage } = useSite();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (
      form.name.trim().length < 2 ||
      !validEmail(form.email) ||
      !validPhone(form.phone)
    ) {
      setError(
        "Enter a valid name, email and phone number."
      );
      return;
    }

    if (form.message.trim().length < 10) {
      setError(
        "Enter at least 10 characters in the message."
      );
      return;
    }

    addMessage(form);

    setSuccess(true);
    setError("");
    setForm(emptyForm);
  };

  // Uses the location configured in settings.js.
  const mapUrl =
    SITE.mapsEmbedUrl ||
    `https://maps.google.com/maps?q=${
      encodeURIComponent(SITE.mapsQuery)
    }&output=embed`;

  const directions =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(SITE.mapsQuery);

  return (
    <section className="section contact-page">
      <div className="wrap">
        <div className="contact-grid">
          {/* CONTACT INFORMATION */}
          <div className="contact-info">
            <span className="eyebrow">
              Get in touch
            </span>

            <h1>Contact Us</h1>

            <p>
              Questions about the project?
              Send us an enquiry and explore
              the example contact details below.
            </p>

            <div className="contact-lines">
              <div>
                <b>✉ Email</b>

                <a href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
              </div>

              <div>
                <b>☎ Phone</b>

                <a
                  href={`tel:${SITE.phone.replace(
                    /[^\d+]/g,
                    ""
                  )}`}
                >
                  {SITE.phone}
                </a>
              </div>

              <div>
                <b>📍 Address</b>

                <span>
                  {SITE.address}
                </span>
              </div>

              <div>
                <b>🕒 Opening Hours</b>

                <span>
                  {SITE.hours}
                </span>
              </div>
            </div>

            <p className="small muted">
            </p>
          </div>

          {/* ENQUIRY FORM */}
          <div className="enquiry-card">
            <h2>Send Us an Enquiry</h2>

            <p>
              This is a demo form.
              Messages are stored in your browser.
            </p>

            <form
              className="form-stack"
              onSubmit={submit}
            >
              <Field
                id="contact-name"
                label="Name *"
              >
                <input
                  id="contact-name"
                  name="name"
                  value={form.name}
                  onChange={update}
                  required
                  minLength={2}
                />
              </Field>

              <Field
                id="contact-email"
                label="Email *"
              >
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  required
                />
              </Field>

              <Field
                id="contact-phone"
                label="Contact number *"
              >
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={update}
                  required
                />
              </Field>

              <Field
                id="contact-topic"
                label="Enquiry type"
              >
                <select
                  id="contact-topic"
                  name="topic"
                  value={form.topic}
                  onChange={update}
                >
                  {[
                    "General Enquiry",
                    "Adoption",
                    "Rehoming",
                    "Donation",
                    "Volunteering",
                    "Feedback"
                  ].map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="contact-message"
                label="Message *"
              >
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={update}
                  minLength={10}
                  required
                  placeholder="Please type your message here..."
                />
              </Field>

              {error && (
                <Notice danger>
                  {error}
                </Notice>
              )}

              {success && (
                <Notice>
                  Message saved locally.
                  No email was sent.
                </Notice>
              )}

              <button
                className="btn peach"
                type="submit"
              >
                ✉ Send Message
              </button>
            </form>
          </div>
        </div>

        {/* GOOGLE MAPS */}
        <div className="map-heading">
          <div>
            <span className="eyebrow">
              Location
            </span>

            <h2>Find Us on Google Maps</h2>

            <p className="muted">
              Showing {SITE.mapsQuery} until
              a verified location is configured.
            </p>
          </div>

          <a
            className="btn outline"
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Google Maps ↗
          </a>
        </div>

        <div className="map-frame">
          <iframe
            title="Google Maps location preview"
            src={mapUrl}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <p className="small muted">
            The map above is a live Google Maps
        </p>
      </div>
    </section>
  );
}
