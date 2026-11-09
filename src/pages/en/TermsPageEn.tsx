import { Link } from "react-router-dom";

import PolicyLayout from "../../components/PolicyLayout";
import { SELLER_EMAIL, SELLER_NAME_EN } from "../../utils/seller";

const TermsPageEn = () => {
  return (
    <PolicyLayout title="Terms of Service" lang="en" alternatePath="/terms">
      <div className="flex flex-col gap-3">
        <p>
          These Terms set out the conditions for using Yachapan (the "Service"),
          operated by {SELLER_NAME_EN} (the "Operator"). By using the Service,
          you agree to these Terms.
        </p>
        <p className="text-neutral-005">Effective date: November 10, 2026</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">1. The Service</h2>
        <p>
          The Service is a web-based debate platform where users debate with
          other users with the help of AI. Core features such as debate
          matching, AI judging and 1-Minute Philosophy are free. Some additional
          features are offered as paid digital products.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">2. Accounts</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            You can sign up with an email address or a Kakao or Google account,
            or use the Service as a guest.
          </li>
          <li>
            You are responsible for your account and may not transfer or lend it
            to anyone else.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">
          3. Paid products and payment
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Paid products and their prices are listed on our{" "}
            <Link to="/en/pricing" className="underline underline-offset-2">
              Pricing
            </Link>{" "}
            page.
          </li>
          <li>
            All paid products are one-time purchases. There are no
            subscriptions.
          </li>
          <li>
            Products are delivered digitally to your account as soon as payment
            is complete.
          </li>
          <li>
            Our order process is conducted by our online reseller Paddle.com.
            Paddle.com is the Merchant of Record for all our orders. Paddle
            provides all customer service inquiries and handles returns.
          </li>
          <li>
            Refunds follow our{" "}
            <Link to="/en/refund" className="underline underline-offset-2">
              Refund Policy
            </Link>
            .
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">4. User conduct</h2>
        <p>You must not:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>use abusive or hateful language, or harass other users;</li>
          <li>
            post other people's personal information or impersonate others;
          </li>
          <li>
            disrupt the Service or access it by automated means without
            permission;
          </li>
          <li>violate any applicable law.</li>
        </ul>
        <p>
          The Operator may restrict access to the Service if any of the above is
          found.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">
          5. Content and AI judging
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>You are responsible for what you write during debates.</li>
          <li>
            AI judgments and AI-generated content are for reference only. Their
            accuracy or any particular outcome is not guaranteed.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">
          6. Changes to or suspension of the Service
        </h2>
        <p>
          The Operator may change the Service or temporarily suspend it, for
          example for maintenance, and will give advance notice of important
          changes in the Service. If a purchased product is affected, it will be
          handled under our Refund Policy.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">7. Privacy</h2>
        <p>
          Personal information is handled under our{" "}
          <Link to="/en/privacy" className="underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">
          8. Changes to these Terms
        </h2>
        <p>
          If these Terms change, we will announce it in the Service at least 7
          days before the change takes effect.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">9. Operator and contact</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Operator: {SELLER_NAME_EN}</li>
          <li>
            Email:{" "}
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

export default TermsPageEn;
