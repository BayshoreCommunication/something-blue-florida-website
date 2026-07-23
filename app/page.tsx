"use client";

import ContactForm from "components/contact/ContactForm";
import Hero from "components/home/Hero";
import Introduction from "components/home/Introduction";
import PortfolioGrid from "components/home/PortfolioGrid";
import RecentStories from "components/home/RecentStories";

export default function Home() {
  return (
    <div>
      <Hero />
      <Introduction />
      <PortfolioGrid />
      <RecentStories />
      <ContactForm />
    </div>
  );
}
