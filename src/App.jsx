
import {
  Route,
  Routes
} from "react-router-dom";

import Layout from "./components/Layout.jsx";

import { FEATURES } from "./settings.js";

import {
  HomePage,
  PetsPage,
  PetDetailPage,
  AdoptionPage,
  ReleasePage,
  AboutPage,
  MissionPage,
  CarePage,
  CommunityPage,
  AuthPage,
  DashboardPage,
  QuizPage,
  SettingsPage,
  NotFoundPage
} from "./pages/Pages.jsx";

import HowItWorksPage from "./pages/HowItWorksPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import DonatePage from "./pages/DonatePage.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/pets"
          element={<PetsPage />}
        />

        <Route
          path="/pets/:id"
          element={<PetDetailPage />}
        />

        <Route
          path="/adopt/:id"
          element={<AdoptionPage />}
        />

        <Route
          path="/release"
          element={<ReleasePage />}
        />

        <Route
          path="/how-it-works"
          element={<HowItWorksPage />}
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/mission"
          element={<MissionPage />}
        />

        <Route
          path="/care"
          element={<CarePage />}
        />

        {FEATURES.quiz && (
          <Route
            path="/quiz"
            element={<QuizPage />}
          />
        )}

        {FEATURES.community && (
          <Route
            path="/community"
            element={<CommunityPage />}
          />
        )}

        <Route
          path="/contact"
          element={<ContactPage />}
        />

        {FEATURES.donations && (
          <Route
            path="/donate"
            element={<DonatePage />}
          />
        )}

        <Route
          path="/login"
          element={<AuthPage mode="login" />}
        />

        <Route
          path="/signup"
          element={<AuthPage mode="signup" />}
        />

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/settings"
          element={<SettingsPage />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </Layout>
  );
}
