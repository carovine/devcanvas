import { useState } from "react";
import "./Landing.css";
import Login from "./Login";
import Signup from "./Signup";
import { Link } from "react-router-dom";
import Logo from "../../components/utils/Logo";

function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const toggleSignupModal = () => {
    setIsSignupModalOpen(!isSignupModalOpen);
  }
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          {/* <h1 className="logo">
            &lt;_<span>DevCanvas</span>
          </h1> */}
          <Logo/>
          <p className="tagline">
            // A Visual Architecture Workspace for Developers
          </p>
          <p className="description">
            Plan, connect and build software visually. From architecture
            diagrams to code snippets all in one infinite canvas.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={toggleLoginModal}>
              Login
            </button>
            <button className="btn-secondary" onClick={toggleSignupModal}>
              Sign Up
            </button>
          </div>
        </div>
        {isLoginModalOpen && <Login setIsLoginModalOpen={setIsLoginModalOpen} setIsSignupModalOpen={setIsSignupModalOpen} />}
        {isSignupModalOpen && <Signup setIsSignupModalOpen={setIsSignupModalOpen} setIsLoginModalOpen={setIsLoginModalOpen} />}
        <Link to="/main">dummy button for main</Link>
      </section>
    </>
  );
}

export default LandingPage;
