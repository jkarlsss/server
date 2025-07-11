interface InfoPillProps {
  text: string,
  image: string
}

const InfoPill = ({ text, image }: InfoPillProps) => {
  return (
    <figure className="info-pill">
      <img src={image} alt="calendar" />
      <figcaption>{text}</figcaption>
    </figure>
  )
}

export default InfoPill