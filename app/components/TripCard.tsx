import { Link, useLocation } from "react-router";
import { Badge } from "./ui/badge";
import { BadgeCheckIcon } from "lucide-react";
import { cn } from "../lib/utils";

const TripCard = ({
  id,
  name,
  location,
  imageUrl,
  tags,
  price,
}: TripCardProps) => {
  const path = useLocation();

  return (
    <Link
      className="trip-card"
      to={
        path.pathname === "/" || path.pathname.startsWith("/travel")
          ? `/travel/${id}`
          : `/trips/${id}`
      }
    >
      <img src={imageUrl} alt={name} />
      <article>
        <h2>{name}</h2>
        <figure>
          <img src="/assets/icons/location-mark.svg" alt="Location"
            className="size-4"
          />
          <figcaption>{location}</figcaption>
        </figure>
      </article>
      <div className="mt-5 pl-[18px] pr-3.5 pb-5">
        {tags.map((tag, index) => (
          <Badge variant={index === 0 ? "outline" : "secondary"} key={tag}>
            <BadgeCheckIcon className="size-4" />
            {tag}
          </Badge>
        ))}
      </div>
      <article className="tripCard-pill">{price}</article>
    </Link>
  );
};

export default TripCard;
