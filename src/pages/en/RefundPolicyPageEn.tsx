import PolicyLayout from "../../components/PolicyLayout";
import { SELLER_EMAIL } from "../../utils/seller";

const RefundPolicyPageEn = () => {
  return (
    <PolicyLayout title="Refund Policy" lang="en" alternatePath="/refund">
      <div className="flex flex-col gap-3">
        <p>
          This policy explains refunds for Yachapan's paid digital products
          (such as the Pass and the Attack Pack).
        </p>
        <p className="text-neutral-005">Effective date: November 10, 2026</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">1. Refund period</h2>
        <p>You can request a full refund within 14 days of your purchase.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">
          2. How to request a refund
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Email us at the address below with your order number (or payment
            receipt) and the reason for the refund.
          </li>
          <li>
            You can also request a refund directly from Paddle using the link in
            your receipt email.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">3. Processing time</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>We process refund requests within 3 business days.</li>
          <li>
            Refunds go back to your original payment method. Depending on your
            card issuer or payment provider, it may take 5–10 business days to
            arrive.
          </li>
          <li>Once refunded, the product can no longer be used.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">4. Payment processing</h2>
        <p>
          Payments and refunds are processed by our reseller Paddle
          (Paddle.com).
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">5. Contact</h2>
        <p>
          Email:{" "}
          <a
            href={`mailto:${SELLER_EMAIL}`}
            className="wrap-anywhere underline underline-offset-2"
          >
            {SELLER_EMAIL}
          </a>
        </p>
      </section>
    </PolicyLayout>
  );
};

export default RefundPolicyPageEn;
