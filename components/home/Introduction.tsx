"use client";

import Container from "components/layout/Container";

export default function Introduction() {
  return (
    <section className="bg-[#FAF8F5] py-6 sm:py-8 border-b border-gray-100 relative z-20">
      <Container className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
        {/* Section Heading */}
        <div className="mb-8">
          <span className="block text-[13px] sm:text-[20px] font-medium tracking-[0.25em] text-[#BF9F72] uppercase mb-4">
            A Decade of
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-4.5xl font-normal text-[#0b0c10] tracking-wide leading-tight font-serif">
            <span className="italic">Artistry. 1,000+ Weddings</span> Cherished.
          </h2>
        </div>

        {/* Narrative Paragraph */}
        <p className="text-gray-700 text-[14px] sm:text-[16px] md:text-[17px] leading-[1.8] max-w-[720px] mx-auto tracking-wide font-normal font-serif">
          For twelve years, Florida&rsquo;s most storied celebrations have entrusted us
          with their most treasured moments; rendered with timeless artistry and
          an unwavering devotion to every fleeting detail.
        </p>

        {/* Cursive Signature Block */}
        <div className="flex justify-end max-w-[720px] mx-auto mt-6 pr-4 sm:pr-8">
          <p className="font-script text-3xl sm:text-4xl text-gray-800 tracking-wide select-none">
            - Team Something <span className="text-[#5A8FCE]">Blue</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
