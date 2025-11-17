// src/App.jsx

import React from "react";

// ⬅️ Change this import path and name
import AboutSection from "./components/AboutSection/AboutSection";
import Services from "./components/Services/Services";
import Landing from "./components/Landing/Landing";
import ContactUs from "./components/ContactUs/ContactUs";
import PhotoGallery from "./components/PhotoGallery/PhotoGallery";
import Footer from "./components/Footer/Footer";
import "./App.css";

import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <Landing />
          <main className="page-wrapper">
            {/* nav and hero section*/}
            {/*<Landing />*/}
            <AboutSection />
            <Services />
            <ContactUs />
            <PhotoGallery />
            {/* Auth info - you can move this or style it as needed */}
            {user && (
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                <p>Hello {user.username}</p>
                <button onClick={signOut}>Sign out</button>
              </div>
            )}
          </main>
          <Footer />
        </>
      )}
    </Authenticator>
  );
}

export default App;
