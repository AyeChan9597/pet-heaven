
import { useState } from "react";
import { Link } from "react-router-dom";

import { useSite } from "../context/SiteContext.jsx";

import {
  Field,
  Notice,
  PageIntro,
  validEmail
} from "./Pages.jsx";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD"
  }).format(value);

export default function DonatePage() {
  const {
    user,
    addDonation
  } = useSite();

  const [choice, setChoice] = useState("25");
  const [custom, setCustom] = useState("");

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    method: "PayNow",
    note: "",
    agree: false
  });

  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");

  const amount =
    choice === "custom"
      ? Number(custom)
      : Number(choice);

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
      !Number.isFinite(amount) ||
      amount < 1 ||
      amount > 10000
    ) {
      setError(
        "Choose an amount between S$1 and S$10,000."
      );
      return;
    }

    if (
      !validEmail(form.email) ||
      form.name.trim().length < 2
    ) {
      setError(
        "Enter a name and valid email."
      );
      return;
    }

    if (!form.agree) {
      setError(
        "Acknowledge this is not a real payment."
      );
      return;
    }

    const record = addDonation({
      donorName: form.name.trim(),
      amount: Math.round(amount * 100) / 100,
      method: form.method,
      note: form.note.trim()
    });

    setReceipt(record);
    setError("");
  };

  return (
    <>
      <PageIntro
        eyebrow="Charity support"
        title="Support Our Mission 💝"
        subtitle="Experience a simulated donation checkout. No funds are collected."
      />

      <section className="section">
        <div className="wrap form-grid">
          <aside className="side-card">
            <div className="big-emoji">
              🐾💗
            </div>

            <h2>Care Makes a Difference</h2>

            <p>
              Real donations can help fund
              nutrition, veterinary treatment,
              safe environments and education.
            </p>

            <Notice>
              This project is fictional.
              Do not enter real payment information.
              No money is charged.
            </Notice>
          </aside>

          <div className="panel">
            {receipt ? (
              <div className="receipt">
                <div className="big-emoji">
                  🧾
                </div>

                <h2>
                  Demo Transaction Recorded
                </h2>

                <Notice>
                  No funds were transferred.
                  This is a local simulation only.
                </Notice>

                <dl>
                  <div>
                    <dt>Reference</dt>
                    <dd>{receipt.id}</dd>
                  </div>

                  <div>
                    <dt>Amount</dt>
                    <dd>
                      {formatMoney(receipt.amount)}
                    </dd>
                  </div>

                  <div>
                    <dt>Method</dt>
                    <dd>{receipt.method}</dd>
                  </div>

                  <div>
                    <dt>Status</dt>
                    <dd>{receipt.status}</dd>
                  </div>
                </dl>

                <div className="actions">
                  <button
                    type="button"
                    className="btn outline"
                    onClick={() =>
                      setReceipt(null)
                    }
                  >
                    New Demo Donation
                  </button>

                  <Link
                    to="/dashboard"
                    className="btn primary"
                  >
                    My Activity
                  </Link>
                </div>
              </div>
            ) : (
              <form
                className="form-stack"
                onSubmit={submit}
              >
                <h2>Demo Donation</h2>

                <fieldset className="amount-field">
                  <legend>
                    Choose an amount (SGD)
                  </legend>

                  <div className="amount-buttons">
                    {[10, 25, 50, 100].map(
                      (value) => (
                        <button
                          type="button"
                          key={value}
                          className={
                            choice === String(value)
                              ? "selected"
                              : ""
                          }
                          aria-pressed={
                            choice === String(value)
                          }
                          onClick={() =>
                            setChoice(String(value))
                          }
                        >
                          {formatMoney(value)}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    className={
                      choice === "custom"
                        ? "custom-amount selected"
                        : "custom-amount"
                    }
                    onClick={() =>
                      setChoice("custom")
                    }
                  >
                    Custom amount
                  </button>

                  {choice === "custom" && (
                    <Field
                      id="custom-amount"
                      label="Custom amount *"
                    >
                      <input
                        id="custom-amount"
                        type="number"
                        min="1"
                        max="10000"
                        step="0.01"
                        value={custom}
                        onChange={(e) =>
                          setCustom(e.target.value)
                        }
                        required
                      />
                    </Field>
                  )}
                </fieldset>

                <Field
                  id="d-name"
                  label="Donor name *"
                >
                  <input
                    id="d-name"
                    name="name"
                    value={form.name}
                    onChange={update}
                    minLength={2}
                    required
                  />
                </Field>

                <Field
                  id="d-email"
                  label="Email *"
                >
                  <input
                    id="d-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={update}
                    required
                  />
                </Field>

                <Field
                  id="d-method"
                  label="Payment method (simulation) *"
                >
                  <select
                    id="d-method"
                    name="method"
                    value={form.method}
                    onChange={update}
                  >
                    <option>
                      PayNow
                    </option>

                    <option>
                      Credit/Debit Card
                    </option>

                    <option>
                      Bank Transfer
                    </option>
                  </select>
                </Field>

                <Field
                  id="d-note"
                  label="Message (optional)"
                >
                  <textarea
                    id="d-note"
                    name="note"
                    rows={3}
                    value={form.note}
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

                  I understand no real
                  transaction takes place.
                </label>

                {error && (
                  <Notice danger>
                    {error}
                  </Notice>
                )}

                <div className="total">
                  <span>Simulation total</span>

                  <strong>
                    {formatMoney(
                      Number.isFinite(amount)
                        ? amount
                        : 0
                    )}
                  </strong>
                </div>

                <button
                  className="btn primary full"
                  type="submit"
                >
                  Simulate Donation
                </button>

                <p className="small muted center">
                  No card number, CVV, or banking
                  details are requested.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
