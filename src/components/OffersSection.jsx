import { Gift, Percent, Truck } from "lucide-react";

export default function OffersSection() {
  const offers = [
    { code: "AURORA10", title: "10% Discount", desc: "Use this code for a quick discount.", icon: Percent },
    { code: "STUDENT15", title: "Student Offer", desc: "Special student discount for project demo.", icon: Gift },
    { code: "FREESHIP", title: "Free Delivery", desc: "Remove delivery fee from your order.", icon: Truck }
  ];

  return (
    <section className="offersSection">
      {offers.map((offer) => {
        const Icon = offer.icon;
        return (
          <article className="offerCard" key={offer.code}>
            <span><Icon size={20} /></span>
            <div>
              <strong>{offer.title}</strong>
              <p>{offer.desc}</p>
              <code>{offer.code}</code>
            </div>
          </article>
        );
      })}
    </section>
  );
}
