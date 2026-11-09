import PolicyLayout from "../../components/PolicyLayout";
import PolicyTable from "../../components/PolicyTable";

const PrivacyPolicyPageEn = () => {
  return (
    <PolicyLayout title="Privacy Policy" lang="en" alternatePath="/privacy">
      <div className="flex flex-col gap-3">
        <p>
          Yachapan (the "Service") values your personal information. This policy
          explains what information we collect, why, and how long we keep it.
        </p>
        <p className="text-neutral-005">Effective date: October 31, 2026</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">
          1. Information we collect
        </h2>
        <PolicyTable
          caption="Information we collect"
          headers={["When", "What"]}
          rows={[
            [
              "Email sign-up",
              "Email address, password (stored encrypted), nickname",
            ],
            [
              "Kakao / Google login",
              "Kakao / Google account ID, email address (if you agree to share it), nickname",
            ],
            [
              "Starting as a guest",
              "An automatically generated nickname (no email or other details)",
            ],
            [
              "While using the Service",
              "Balance game result (philosopher type), debate history (topic, stance, win/loss, time), 1-Minute Philosophy notes and bookmarks",
            ],
            ["Automatically", "IP address, cookies for staying logged in"],
          ]}
        />
        <p>
          Arguments, rebuttals and chat messages written during a debate are
          kept in server memory only while the game is in progress and are not
          stored after the game ends.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">2. How we use it</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Identifying members, logging in and keeping you logged in</li>
          <li>
            Debate matching, running games, AI judging and AI opponents (bots)
          </li>
          <li>
            Providing features such as match history, philosopher type and
            1-Minute Philosophy
          </li>
          <li>Sending password reset codes</li>
          <li>Security, such as blocking repeated requests (IP address)</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">3. Retention</h2>
        <PolicyTable
          caption="Retention period"
          headers={["Item", "Retention"]}
          rows={[
            [
              "Member information and usage history",
              "Until you delete your account (or ask us to delete it)",
            ],
            [
              "Guest accounts",
              "Deleted automatically 14 days after creation if not kept logged in",
            ],
            ["Login cookie", "14 days (deleted immediately when you log out)"],
            ["Password reset code", "3 minutes"],
            ["IP records for blocking repeated requests", "Up to 24 hours"],
            ["Balance game result cookie before login", "1 hour"],
          ]}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">
          4. Service providers we share data with
        </h2>
        <p>
          We use the following providers to run the Service, and they process
          personal information on our behalf.
        </p>
        <PolicyTable
          caption="Service providers"
          headers={["Provider", "Purpose", "Information shared"]}
          rows={[
            [
              "Kakao, Google",
              "Social login",
              "Account information provided by each provider at login",
            ],
            [
              "Liner",
              "AI judging, AI opponents, 1-Minute Philosophy articles",
              "Debate topic, stance, arguments, rebuttals and chat (no nickname or email)",
            ],
            [
              "Google (Gmail)",
              "Sending password reset emails",
              "Email address, reset code",
            ],
            [
              "Amazon Web Services",
              "Servers and database",
              "All information stored by the Service",
            ],
            ["Vercel", "Website hosting", "Access logs"],
            [
              "Paddle (Paddle.com)",
              "Processing payments and refunds",
              "Email address, payment details (card details go directly to Paddle and are not stored by us), country",
            ],
          ]}
        />
        <p>
          Except as described above, we do not share your personal information
          with third parties.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">5. Your rights</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            You can ask to see, correct or delete (close the account) your
            personal information at any time.
          </li>
          <li>You can change your nickname directly on My Page.</li>
          <li>
            For other requests, email us at the address below and we will handle
            them without delay.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">6. Cookies</h2>
        <p>
          We use cookies to keep you logged in and to keep your balance game
          result before you log in. You can block cookies in your browser
          settings, but you may then not stay logged in.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">7. Security</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Passwords are stored with one-way encryption.</li>
          <li>All communication is encrypted with HTTPS.</li>
          <li>Access to personal information is limited to the operators.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">8. Privacy contact</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Privacy officer: Sumin Park</li>
          <li>
            Email:{" "}
            <a
              href="mailto:yachaphilosophy@gmail.com"
              className="wrap-anywhere underline underline-offset-2"
            >
              yachaphilosophy@gmail.com
            </a>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">9. Changes</h2>
        <p>
          If this policy changes, we will announce it in the Service at least 7
          days before the change takes effect.
        </p>
      </section>
    </PolicyLayout>
  );
};

export default PrivacyPolicyPageEn;
