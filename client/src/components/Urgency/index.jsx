const Urgency = ({ urgency }) => {
  const urgencyColors = {
    baixa: "bg-urgencyColor-green",
    media: "bg-urgencyColor-yellow",
    urgente: "bg-urgencyColor-red",
  };

  const badgeColor = urgencyColors[urgency];

  return (
    <span
      className={`inline-block py-1 px-6 rounded-full text-sm uppercase text-neutral-200 ${badgeColor}`}
    >
      {urgency}
    </span>
  );
};

export default Urgency;
