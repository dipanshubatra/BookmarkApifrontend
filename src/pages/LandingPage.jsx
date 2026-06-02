import { useNavigate } from "react-router-dom";
import FloatingGlassScene from "../components/FloatingGlassScene";

export default function LandingPage() {
  const navigate = useNavigate();

  function handleGetStarted() {
    navigate("/register");
  }

  return (
    <div className="landing-shell glass-page">
      <FloatingGlassScene variant="auth" />

      <section className="landing-minimal">
        <div className="landing-minimal__shape landing-minimal__shape--one" aria-hidden="true" />
        <div className="landing-minimal__shape landing-minimal__shape--two" aria-hidden="true" />
        <div className="landing-minimal__shape landing-minimal__shape--three" aria-hidden="true" />
        <div className="landing-minimal__shape landing-minimal__shape--four" aria-hidden="true" />
        <div className="landing-minimal__shape landing-minimal__shape--five" aria-hidden="true" />

        <div className="landing-minimal__copy">
          <h1 className="landing-minimal__headline">
            <span className="landing-minimal__typed">Bookmark</span>
            <span className="landing-minimal__typed landing-minimal__typed--accent">
              Manager
            </span>
          </h1>
          <p className="landing-minimal__subtitle">
            Craft a calmer workspace for saving, organizing, and finding every important link.
          </p>
        </div>

        <div className="landing-minimal__actions">
          <button
            className="button landing-minimal__button"
            type="button"
            onClick={handleGetStarted}
          >
            Get started
          </button>
        </div>
      </section>
    </div>
  );
}
