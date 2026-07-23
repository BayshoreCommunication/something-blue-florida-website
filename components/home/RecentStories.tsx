"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "components/layout/Container";
import storiesData from "data/stories.json";

type Story = {
  id: number;
  coupleName: string;
  image: string;
  description: string;
  slug: string;
};

export default function RecentStories() {
  const stories = storiesData as Story[];

  return (
    <section className="bg-[#FAF8F5] py-20 sm:py-28 border-b border-gray-150/50 relative z-20 select-none">
      <Container className="w-full max-w-[1440px] px-4 sm:px-16 lg:px-8">
        
        {/* Responsive Grid Structure mapping to reference image layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Short Image (0) then Tall Image (4) */}
          <div className="flex flex-col gap-12 sm:gap-16">
            <StoryCard story={stories[0]} isTall={false} />
            <StoryCard story={stories[4]} isTall={true} />
          </div>

          {/* Column 2: Tall Image (1) then Short Image (5) */}
          <div className="flex flex-col gap-12 sm:gap-16">
            <StoryCard story={stories[1]} isTall={true} />
            <StoryCard story={stories[5]} isTall={false} />
          </div>

          {/* Column 3: Short Image (2) then Tall Image (6) */}
          <div className="flex flex-col gap-12 sm:gap-16">
            <StoryCard story={stories[2]} isTall={false} />
            <StoryCard story={stories[6]} isTall={true} />
          </div>

          {/* Column 4: Tall Image (3) then Short Image (7) */}
          <div className="flex flex-col gap-12 sm:gap-16">
            <StoryCard story={stories[3]} isTall={true} />
            <StoryCard story={stories[7]} isTall={false} />
          </div>

        </div>
      </Container>
    </section>
  );
}

function StoryCard({ story, isTall }: { story: Story; isTall: boolean }) {
  return (
    <div className="flex flex-col text-center">
      {/* Image container with hover scaling zoom */}
      <div
        className={`relative overflow-hidden group w-full mb-6 ${
          isTall ? "aspect-[3/4.5]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={story.image}
          alt={`Wedding photography for ${story.coupleName}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-103"
        />
      </div>

      {/* Narrative Metadata */}
      <div className="px-2">
        {/* Serif Heading */}
        <h3 className="text-[20px] font-normal text-gray-900 tracking-wide font-serif mb-0.5">
          {story.coupleName}
        </h3>

        {/* Script watermark typography */}
        <div className="font-script text-[24px] text-[#BF9F72]/50 tracking-wider mb-3 leading-none select-none">
          Wedding Photography
        </div>

        {/* Description */}
        <p className="text-gray-500 text-[13px] leading-[1.65] max-w-[270px] mx-auto mb-4 tracking-wide font-serif font-normal">
          {story.description}
        </p>

        {/* View Details Link */}
        <Link
          href={story.slug}
          className="inline-block text-[11px] font-medium tracking-[0.25em] text-[#0b0c10] hover:text-[#BF9F72] transition-colors uppercase border-b border-gray-200 hover:border-[#BF9F72] pb-0.5"
        >
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
}
