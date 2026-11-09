import { Link } from "react-router-dom";

import PolicyLayout from "../../components/PolicyLayout";
import { SELLER_EMAIL } from "../../utils/seller";

type Product = {
  name: string;
  price: string;
  description: string;
};

const PRODUCTS: Product[] = [
  {
    name: "Pass",
    price: "₩3,000",
    description: "Unlocks additional features on the debate platform.",
  },
  {
    name: "Attack Pack",
    price: "₩1,000",
    description: "A bundle of additional features to use during debates.",
  },
];

const PricingPageEn = () => {
  return (
    <PolicyLayout title="Pricing" lang="en" alternatePath="/pricing">
      <p>
        Yachapan is a web-based interactive debate platform where users debate
        with other users with the help of AI. Core debate features are free. The
        digital add-ons below can be purchased one time to unlock additional
        features.
      </p>

      <ul className="flex flex-col gap-3">
        {PRODUCTS.map((product) => (
          <li
            key={product.name}
            className="flex flex-col gap-2 rounded-[10px] bg-neutral-009 px-4 py-3.5"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-subhead-m7 text-white">{product.name}</h2>
              <p className="shrink-0 text-subhead-m7 text-main">
                {product.price}
              </p>
            </div>
            <p>{product.description}</p>
            <p className="text-caption-r2 text-neutral-005">
              One-time purchase · No subscription
            </p>
          </li>
        ))}
      </ul>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">Notes</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            All products are delivered digitally through our website. We do not
            sell physical goods.
          </li>
          <li>
            All products are one-time purchases. They are not recurring
            subscriptions.
          </li>
          <li>
            Prices are in South Korean won (KRW). Taxes may be added depending
            on your country.
          </li>
          <li>Payments are processed by our reseller Paddle (Paddle.com).</li>
          <li>
            See our{" "}
            <Link to="/en/refund" className="underline underline-offset-2">
              Refund Policy
            </Link>{" "}
            and{" "}
            <Link to="/en/terms" className="underline underline-offset-2">
              Terms of Service
            </Link>
            .
          </li>
          <li>
            Contact:{" "}
            <a
              href={`mailto:${SELLER_EMAIL}`}
              className="wrap-anywhere underline underline-offset-2"
            >
              {SELLER_EMAIL}
            </a>
          </li>
        </ul>
      </section>
    </PolicyLayout>
  );
};

export default PricingPageEn;
