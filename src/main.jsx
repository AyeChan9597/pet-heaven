
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { SiteProvider } from "./context/SiteContext.jsx";
import App from "./App.jsx";

import "./styles.css";

class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error(
      "Pet Heaven render error:",
      error,
      info
    );
  }

  render() {
    if (this.state.error) {
      return (
        <main
          style={{
            padding: 32,
            fontFamily: "sans-serif"
          }}
        >
          <h1>Pet Heaven couldn't load</h1>

          <p>
            Check the browser Console,
            or copy this error for debugging.
          </p>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere"
            }}
          >
            {String(
              this.state.error.stack ||
              this.state.error
            )}
          </pre>
        </main>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <SiteProvider>
          <App />
        </SiteProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
