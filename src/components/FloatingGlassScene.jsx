export default function FloatingGlassScene({ variant = "dashboard" }) {
  return (
    <div className={`glass-background glass-background--${variant}`} aria-hidden="true">
      <span className="glass-background__orb glass-background__orb--1" />
      <span className="glass-background__orb glass-background__orb--2" />
      <span className="glass-background__orb glass-background__orb--3" />
      <span className="glass-background__grid" />
      <span className="glass-background__panel glass-background__panel--1" />
      <span className="glass-background__panel glass-background__panel--2" />
    </div>
  );
}
