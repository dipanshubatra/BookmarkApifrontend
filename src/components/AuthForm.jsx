import { Link } from "react-router-dom";
import FloatingGlassScene from "./FloatingGlassScene";
import MessageBanner from "./MessageBanner";

export default function AuthForm({
  title,
  subtitle,
  submitLabel,
  footerPrompt,
  footerLinkLabel,
  footerLinkTo,
  onSubmit,
  error,
  notice,
  isSubmitting,
  successState
}) {
  return (
    <div className="auth-shell glass-page glass-page--auth">
      <FloatingGlassScene variant="auth" />

      <div className="auth-layout">
        <section className="auth-hero panel panel--hero">
          <div className="auth-hero__copy">
            <div className="auth-hero__floaters" aria-hidden="true">
              <span className="auth-hero__floater auth-hero__floater--one">Try It Now</span>
              <span className="auth-hero__floater auth-hero__floater--two">No more chaos</span>
            </div>

            <p className="eyebrow">Find anything in seconds.</p>

            <div className="auth-hero__headline-block">
              <h1 className="auth-hero__title">Bookmark smarter.</h1>
              <div className="auth-hero__typed" aria-label="Not harder.">
                <span className="auth-hero__typed-text">Not harder.</span>
              </div>
            </div>

            <p className="auth-hero__lead">
              Keep everything important close, searchable, and easy to reach whenever you
              need it.
            </p>
          </div>

          <div className="auth-hero__chips">
            <span className="glass-chip">Try It Now</span>
            <span className="glass-chip">Fast search</span>
            <span className="glass-chip">Saved links</span>
          </div>

          <div className="auth-hero__cards">
            <article className="floating-glass-card">
              <strong>Save Important Links</strong>
              <span>
                Keep your most valuable resources organized and always within reach
                no more digging through endless tabs or bookmarks.
              </span>
            </article>
            <article className="floating-glass-card">
              <strong>No more lost tabs.</strong>
              <span>
                Everything you save stays structured and easy to find so you never
                lose track of important content again.
              </span>
            </article>
          </div>
        </section>

        <div className="auth-card">
          <div className="auth-card__header">
            <p className="eyebrow">Bookmark Manager</p>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          <MessageBanner kind="success" message={notice} />
          <MessageBanner kind="error" message={error} />

          <form className="auth-form" onSubmit={onSubmit}>
            <label className="field">
              <span>Username</span>
              <input
                name="username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete={submitLabel === "Sign in" ? "current-password" : "new-password"}
                required
                disabled={isSubmitting}
              />
            </label>

            <button
              className={`button button--full auth-submit ${
                submitLabel === "Sign in" ? "auth-submit--signin" : "auth-submit--register"
              }`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Please wait..." : submitLabel}
            </button>
          </form>

          <p className="auth-card__footer">
            {footerPrompt} <Link to={footerLinkTo}>{footerLinkLabel}</Link>
          </p>
        </div>
      </div>

      {successState ? (
        <div className={`auth-success auth-success--${successState.kind}`} role="status" aria-live="polite">
          <div className="auth-success__card">
            <div className="auth-success__visual" aria-hidden="true">
              {successState.kind === "register" ? (
                <>
                  <span className="auth-success__trail auth-success__trail--one" />
                  <span className="auth-success__trail auth-success__trail--two" />
                  <span className="auth-success__plane">{"\u2708"}</span>
                  <span className="auth-success__stamp">Registered</span>
                </>
              ) : (
                <>
                  <span className="auth-success__tick-ring" />
                  <span className="auth-success__tick-ring auth-success__tick-ring--inner" />
                  <span className="auth-success__tick-circle">
                    <span className="auth-success__tick-mark" />
                  </span>
                </>
              )}
            </div>
            <strong>{successState.title}</strong>
            <p>{successState.message}</p>
            {successState.kind === "login" ? (
              <div className="auth-success__actions">
                <span className="auth-success__button">Success</span>
                <span className="auth-success__hint">Opening your dashboard...</span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
