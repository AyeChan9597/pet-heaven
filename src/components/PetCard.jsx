
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { FEATURES } from "../settings.js";
import { useSite } from "../context/SiteContext.jsx";


export function PetPicture({
  pet,
  large = false
}) {
  const [failed, setFailed] = useState(false);

  const imageUrl = pet.image || "";

  // Reset error when the image path changes
  useEffect(() => {
    setFailed(false);
  }, [imageUrl]);

  return (
    <div
      className={`pet-picture ${
        large ? "large" : ""
      } ${pet.type.toLowerCase()}`}
    >
      {imageUrl && !failed ? (
        <img
          src={imageUrl}
          alt={`${pet.name}, ${pet.breed}`}
          onError={() => {
            console.error(
              "Failed to load image:",
              imageUrl
            );

            setFailed(true);
          }}
        />
      ) : (
        <span
          role="img"
          aria-label={`${pet.type} illustration`}
        >
          {pet.emoji}
        </span>
      )}
    </div>
  );
}


export default function PetCard({ pet }) {
  const {
    favorites,
    toggleFavorite
  } = useSite();

  const saved = favorites.includes(pet.id);

  return (
    <article className="pet-card">
      <div className="pet-image-wrap">
        <Link
          to={`/pets/${pet.id}`}
          aria-label={`View ${pet.name}`}
        >
          <PetPicture pet={pet} />
        </Link>

        {FEATURES.favorites && (
          <button
            type="button"
            className="heart-button"
            aria-label={
              saved
                ? `Remove ${pet.name} from favorites`
                : `Save ${pet.name}`
            }
            aria-pressed={saved}
            onClick={() =>
              toggleFavorite(pet.id)
            }
          >
            {saved ? "♥" : "♡"}
          </button>
        )}
      </div>

      <div className="pet-card-body">
        <div className="flex-between">
          <h3>{pet.name}</h3>
          <span className="pill">{pet.type}</span>
        </div>

        <p className="muted small">
          {pet.breed} · {pet.age}{" "}
          {pet.age === 1 ? "year" : "years"}
        </p>

        <p>{pet.description}</p>

        <div className="chips">
          {pet.traits.map((trait) => (
            <span key={trait}>
              {trait}
            </span>
          ))}
        </div>

        <div className="flex-between pet-card-bottom">
          <span className="small muted">
            📍 {pet.area}
          </span>

          <Link
            to={`/pets/${pet.id}`}
            className="text-link"
          >
            Meet {pet.name} →
          </Link>
        </div>
      </div>
    </article>
  );
}
