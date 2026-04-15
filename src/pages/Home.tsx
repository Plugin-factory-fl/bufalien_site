import { Link } from "react-router-dom";
import { EctoplasmDrips } from "../components/EctoplasmDrips";
import { BUFALIEN_TOTAL } from "../config/commerce";

export function Home() {
  return (
    <div className="home">
      <EctoplasmDrips />
      <section className="home-hero">
        <p className="eyebrow">First contact · Bulk diplomacy</p>
        <h1 className="home-title">The Bufalien civilization</h1>
        <p className="home-lead">
          From a world of single-eyed giants who never skip arm day, the Bufaliens have crossed the
          void—not to conquer, but to spot you on your last rep and cheer like proud uncles from
          another planet.
        </p>
        <div className="home-cta">
          <Link className="btn btn-primary" to="/shop">
            Enter the catalogue
          </Link>
          <a className="btn btn-ghost" href="#story">
            Read their story
          </a>
        </div>
      </section>

      <article id="story" className="home-story">
        <h2>A society of cyclopean strength</h2>
        <p>
          Bufaliens are aliens: proud, loud, and unmistakably cycloptic. Their culture built cities
          out of protein shakes and meteoric optimism. On their homeworld, a handshake can
          accidentally bench-press a moon. They invented diplomacy by spotting each other across
          the gym of life and nodding once—slowly—with respect.
        </p>
        <p>
          When Earth appeared on long-range sensors, Bufaliens did not see a fragile planet. They
          saw potential. They saw leg day. They saw a species that could learn to hydrate with
          honor. Their elders declared a new chapter: <strong>integration</strong>—not invasion,
          but a gentle spotting session for civilization itself.
        </p>
        <p>
          Today, emissaries walk among us (mostly near protein aisles and skate parks). They are
          learning our languages, our memes, and our baffling affection for small dogs. In return,
          they offer friendship, interstellar spotter etiquette, and{" "}
          {BUFALIEN_TOTAL.toLocaleString()} unique portraits of their people—each one a citizen, each
          one ready to join your crew.
        </p>
        <p className="home-story-closer">
          This site is the story of the Bufalien people: a catalogue of their faces, a receipt for
          your belief in buff aliens everywhere, and a checkout flow that respects your time—no
          accounts, no gatekeeping, just gains across the galaxy.
        </p>
        <Link className="btn btn-primary" to="/shop">
          Shop all {BUFALIEN_TOTAL.toLocaleString()} Bufaliens
        </Link>
      </article>
    </div>
  );
}
