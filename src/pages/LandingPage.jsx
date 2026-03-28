import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingGlassScene from "../components/FloatingGlassScene";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);

  function handleGetStarted() {
    if (isLeaving) {
      return;
    }

    setIsLeaving(true);

    window.setTimeout(() => {
      navigate("/register");
    }, 700);
  }

  return (
    <div className={`landing-shell glass-page ${isLeaving ? "landing-shell--leaving" : ""}`}>
      <FloatingGlassScene variant="auth" />

      <section className="landing-minimal">
        <div className="landing-minimal__copy">
          <h1 className="landing-minimal__headline">
            <span className="landing-minimal__typed">Welcome to Bookmark Manager</span>
          </h1>
        </div>

        <div className="landing-minimal__actions">
          <div className="landing-minimal__launch" aria-hidden="true">
            <span className="landing-minimal__launch-plane">{"\u2708"}</span>
            <span className="landing-minimal__launch-trail" />
          </div>
          <button
            className="button landing-minimal__button"
            type="button"
            onClick={handleGetStarted}
            disabled={isLeaving}
          >
            Get started
          </button>
        </div>

        <div className="landing-minimal__visual" aria-hidden="true">
          <span className="landing-minimal__splash landing-minimal__splash--one" />
          <span className="landing-minimal__splash landing-minimal__splash--two" />
          <span className="landing-minimal__splash landing-minimal__splash--three" />
          <span className="landing-minimal__emoji-cup">{"\uD83E\uDD64"}</span>
          <span className="landing-minimal__droplet landing-minimal__droplet--one" />
          <span className="landing-minimal__droplet landing-minimal__droplet--two" />
          <span className="landing-minimal__droplet landing-minimal__droplet--three" />
        </div>
      </section>
    </div>
  );
}
