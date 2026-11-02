import type { Metadata } from "next";
import { ReactNode } from "react";
import Container from "components/layout/Container";

export const metadata: Metadata = {
  title: "Privacy Policy | Something Blue Florida Wedding Photography",
  description:
    "How Something Blue Wedding Photography collects, uses and protects your information on somethingblueflorida.com.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

const EMAIL = "hello@somethingblueflorida.com";

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#BF9F72] underline underline-offset-4 hover:text-[#0b0c10] transition-colors"
    >
      {children}
    </a>
  );
}

function EmailLink() {
  return (
    <a
      href={`mailto:${EMAIL}`}
      className="text-[#BF9F72] underline underline-offset-4 hover:text-[#0b0c10] transition-colors"
    >
      {EMAIL}
    </a>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl sm:text-[28px] text-[#0b0c10] font-serif leading-snug">
        {title}
      </h2>
      {children}
    </section>
  );
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2 pl-1">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rotate-45 bg-[#BF9F72]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#FAF8F5] min-h-screen pt-32 pb-20">
      <Container className="max-w-[820px] px-6 sm:px-12">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="font-script text-[48px] sm:text-[64px] text-gray-800 leading-none mb-3">
            Privacy Policy
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4 select-none">
            <div className="h-[1px] w-16 bg-[#BF9F72]/50" />
            <span className="text-[#BF9F72] text-[8px] transform rotate-45">◆</span>
            <div className="h-[1px] w-16 bg-[#BF9F72]/50" />
          </div>
          <p className="text-[11px] font-semibold tracking-[0.25em] text-gray-600 uppercase font-serif">
            Last updated: Oct 29, 2026
          </p>
        </div>

        <div className="space-y-10 text-[15px] sm:text-base leading-relaxed text-gray-700 font-serif">
          <div className="space-y-4">
            <p>
              Something Blue Wedding Photography (&ldquo;Something Blue,&rdquo; &ldquo;we,&rdquo;
              &ldquo;us&rdquo;) respects your privacy. This policy explains what information we
              collect through somethingblueflorida.com and its portfolio pages (the
              &ldquo;Site&rdquo;), how we use it, and the choices you have.
            </p>
            <p>
              We are a wedding photography and videography studio based in Florida. Questions
              about this policy can be sent to <EmailLink />.
            </p>
          </div>

          <Section title="Information We Collect">
            <p>
              <strong className="text-[#0b0c10] font-normal">Information you give us.</strong>{" "}
              When you send an inquiry through our contact form, we collect:
            </p>
            <List
              items={[
                "Your name",
                "Email address and phone number",
                "Wedding date, venue, budget and coverage length",
                "The services you're interested in and anything else you choose to tell us",
              ]}
            />
            <p>We also keep the details you share when you email, call or text us.</p>
            <p>
              <strong className="text-[#0b0c10] font-normal">
                Information collected automatically.
              </strong>{" "}
              When you visit the Site, we and our partners use cookies and similar technologies to
              collect:
            </p>
            <List
              items={[
                "Device and browser type, IP address and approximate location (city or region)",
                "Pages you view, how long you stay and how you reached the Site, such as the ad or search you clicked",
                "Actions you take, such as submitting the form or tapping our phone number or email link",
              ]}
            />
          </Section>

          <Section title="How We Use Your Information">
            <p>We use your information to:</p>
            <List
              items={[
                "Reply to your inquiry, check our availability and send package details",
                "Plan, book and deliver your photography or videography services",
                "Send occasional messages about your booking or gallery",
                "Understand how visitors use the Site and improve it",
                "Measure and improve our advertising, including showing our ads to people who have visited the Site",
                "Protect the Site from spam and misuse, and meet legal obligations",
              ]}
            />
            <p>We will not add you to a marketing mailing list without your permission.</p>
          </Section>

          <Section title="Cookies, Analytics and Advertising">
            <p>
              We use Google Analytics to understand how visitors find and use the Site. We use
              Google Ads to advertise our services and to measure which ads lead to inquiries.
            </p>
            <p>
              We also use remarketing. This means Google and other third-party vendors may use
              cookies to show our ads to you on other websites after you visit the Site. These
              vendors use cookies to serve ads based on your past visits to our Site and other
              websites.
            </p>
            <p>You can control this in several ways:</p>
            <List
              items={[
                <>
                  Turn off personalized ads in{" "}
                  <ExternalLink href="https://adssettings.google.com">
                    Google&apos;s Ad Settings
                  </ExternalLink>
                </>,
                <>
                  Install the{" "}
                  <ExternalLink href="https://tools.google.com/dlpage/gaoptout">
                    Google Analytics Opt-out Browser Add-on
                  </ExternalLink>
                </>,
                <>
                  Opt out of many third-party vendors at{" "}
                  <ExternalLink href="https://www.aboutads.info/choices">aboutads.info</ExternalLink>
                </>,
                "Block or delete cookies in your browser settings; the Site will still work",
              ]}
            />
            <p>
              You can read how Google uses data from sites that use its services at{" "}
              <ExternalLink href="https://policies.google.com/technologies/partner-sites">
                policies.google.com/technologies/partner-sites
              </ExternalLink>
              .
            </p>
          </Section>

          <Section title="How We Share Information">
            <p>We do not sell your personal information. We share it only:</p>
            <List
              items={[
                "With service providers who help us run the business, such as website hosting, email, scheduling, contract and payment tools, gallery delivery, and Google Analytics and Google Ads. They may use your information only to provide services to us.",
                "With your wedding vendors, such as your planner or venue, only when needed to coordinate your day or when you ask us to.",
                "For legal reasons, when required by law or to protect our rights, safety or property.",
                "In a business transfer, if Something Blue is sold or merged, as part of that transaction.",
              ]}
            />
          </Section>

          <Section title="How Long We Keep Information">
            <p>
              We keep inquiry details for as long as needed to respond and follow up. If you book
              with us, we keep your client records for as long as needed to deliver your services
              and meet tax and legal requirements. We delete or anonymize information we no longer
              need.
            </p>
          </Section>

          <Section title="How We Protect Information">
            <p>
              We use reasonable safeguards, including encrypted (HTTPS) connections and
              password-protected accounts. No website or email system is completely secure, so
              please don&apos;t send sensitive details such as payment card numbers through our
              contact form.
            </p>
          </Section>

          <Section title="Your Choices and Rights">
            <p>You can ask us to:</p>
            <List
              items={[
                "Tell you what personal information we hold about you",
                "Correct information that is wrong",
                "Delete your information, unless we must keep it for legal or contract reasons",
                "Stop sending you any non-essential emails",
              ]}
            />
            <p>
              Email <EmailLink /> with your request. We will respond within 30 days. Depending on
              where you live, you may have additional rights under your state&apos;s privacy laws,
              and we will honor them.
            </p>
          </Section>

          <Section title="Children's Privacy">
            <p>
              The Site is meant for adults planning a wedding. We do not knowingly collect personal
              information from children under 13 through the Site.
            </p>
          </Section>

          <Section title="Links to Other Websites">
            <p>
              The Site links to other sites, such as Instagram, Facebook and our portfolio pages.
              Those sites have their own privacy policies, and we are not responsible for how they
              handle your information.
            </p>
          </Section>

          <Section title="Changes to This Policy">
            <p>
              We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at
              the top shows when it last changed.
            </p>
          </Section>

          <Section title="Contact Us">
            <p className="text-[#0b0c10]">Something Blue Wedding Photography</p>
            <List
              items={[
                <>
                  Email: <EmailLink />
                </>,
                <>
                  Phone:{" "}
                  <a
                    href="tel:+15095921745"
                    className="text-[#BF9F72] underline underline-offset-4 hover:text-[#0b0c10] transition-colors"
                  >
                    +1 (509) 592-1745
                  </a>
                </>,
              ]}
            />
          </Section>
        </div>
      </Container>
    </main>
  );
}
