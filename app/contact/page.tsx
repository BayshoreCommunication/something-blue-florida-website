import ContactForm from "components/contact/ContactForm";

export const metadata = {
  title: "Contact Us | Something Blue Florida Wedding Photography",
  description: "Get in touch with Team Something Blue to capture your wedding day. Inquire about photography, videography, engagement sessions, and bespoke pricing packages.",
};

export default function ContactPage() {
  return (
    <main className="bg-[#FAF8F5] min-h-screen pt-32 pb-16">
      <ContactForm />
    </main>
  );
}
