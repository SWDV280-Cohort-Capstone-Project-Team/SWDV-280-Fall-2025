// src/App.jsx

import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";

// ⬅️ Change this import path and name
import AboutSection from "./components/AboutSection/AboutSection";
import Services from "./components/Services/Services";
import Landing from "./components/Landing/Landing";
import ContactUs from "./components/ContactUs/ContactUs";
import PhotoGallery from "./components/PhotoGallery/PhotoGallery";
import Footer from "./components/Footer/Footer";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import "./App.css";
import "./adminRoutes.css";
import "@aws-amplify/ui-react/styles.css";

import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

function PublicHome() {
  return (
    <>
      <Landing />
      <main className="page-wrapper">
        <AboutSection />
        <Services />
        <ContactUs />
        <PhotoGallery />

        <section className="admin-cta">
          <div>
            <h2>Admin Portal</h2>
            <p>Team members can sign in to manage site content and data.</p>
          </div>
          <Link to="/login" className="admin-cta__button">
            Go to Login
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    if (user) {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-back">
          ← Back to site
        </Link>
        <h1>Admin Sign In</h1>
        <p>Use your Amplify credentials to access internal tools.</p>
        <Authenticator />
      </div>
    </div>
  );
}

function AdminRoute() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      navigate("/", { replace: true });
    }
  };

  return <AdminPanel user={user} signOut={handleSignOut} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicHome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
