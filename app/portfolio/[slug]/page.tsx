import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "components/layout/Container";
import storiesData from "data/stories.json";

type Story = {
  id: number;
  coupleName: string;
  image: string;
  description: string;
  slug: string;
};

// Generate static params for Next.js build optimization
export async function generateStaticParams() {
  return storiesData.map((story) => {
    const slug = story.slug.split("/").pop() || "";
    return { slug };
  });
}

// Generate distinct wedding details based on story ID
function getWeddingDetails(id: number) {
  const details = [
    { venue: "Bella Collina, Orlando", florals: "Fleurs de Lyon", style: "Classic Elegance" },
    { venue: "Sunset Key Cottages, Key West", florals: "Isle Bloom", style: "Coastal Romantic" },
    { venue: "Vizcaya Museum & Gardens, Miami", florals: "Royal Florals", style: "Opulent European" },
    { venue: "Lush Garden Estate, Gainesville", florals: "Wildflower Co.", style: "Rustic Garden" },
    { venue: "The Ringling Museum, Sarasota", florals: "Fine Petals", style: "Historic Mansion" },
    { venue: "Henderson Park Inn, Destin", florals: "Sand & Seed", style: "Beachfront Sunset" },
    { venue: "Keeler Property, Jacksonville", florals: "Ivy & Lace", style: "Rustic chic Vineyard" },
    { venue: "The Vault, Downtown Tampa", florals: "Urban Foliage", style: "Urban Luxury Loft" },
  ];
  return details[(id - 1) % details.length];
}

// Select 4 unique showcase photos from the portfolio folder
function getGalleryImages(id: number) {
  const base = ((id - 1) * 2) % 15 + 1;
  return [
    `/images/portfolio/${base}.png`,
    `/images/portfolio/${base + 1}.png`,
    `/images/portfolio/${base + 2}.png`,
    `/images/portfolio/${base + 3}.png`,
  ];
}

// Map any portfolio image path to its corresponding story details page slug
function getStoryForImage(imgSrc: string): Story | undefined {
  const match = imgSrc.match(/\/images\/portfolio\/(\d+)\.png$/);
  if (match) {
    const num = parseInt(match[1], 10);
    const storyId = ((num - 1) % 8) + 1;
    return (storiesData as Story[]).find((s) => s.id === storyId);
  }
  return undefined;
}

function getStorySlugForImage(imgSrc: string): string {
  const story = getStoryForImage(imgSrc);
  return story ? story.slug : "/";
}

type Props = {
  params: {
    slug: string;
  };
};

export default function StoryDetailPage({ params }: Props) {
  const story = (storiesData as Story[]).find(
    (s) => s.slug === `/portfolio/${params.slug}`
  );

  if (!story) {
    notFound();
  }

  const weddingDetails = getWeddingDetails(story.id);
  const galleryImages = getGalleryImages(story.id);

  return (
    <main className="bg-[#FAF8F5] min-h-screen pb-20 select-none">
      {/* 1. IMMERSIVE HERO HEADER */}
      <section className="relative w-full h-[65vh] md:h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full select-none z-0">
          <Image
            src={story.image}
            alt={`${story.coupleName} Wedding`}
            fill
            priority
            quality={95}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#0b0c10]/45 z-10" />
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl pt-20">
          <span className="block text-[12px] sm:text-[13px] font-medium tracking-[0.3em] text-[#BF9F72] uppercase mb-4">
            Wedding Story
          </span>
          <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-normal tracking-[0.03em] leading-tight font-serif mb-6 drop-shadow-md">
            {story.coupleName}
          </h1>
          <div className="h-0.5 w-16 bg-[#BF9F72] mx-auto" />
        </div>
      </section>

      {/* 2. THE STORY & DETAILS SECTION */}
      <section className="py-16 sm:py-24">
        <Container className="max-w-[1200px] px-4 sm:px-16 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Story Description */}
            <div className="lg:col-span-7">
              <span className="text-[12px] font-medium tracking-[0.25em] text-[#BF9F72] uppercase block mb-3">
                The Narrative
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 tracking-wide font-serif mb-6">
                Capturing the Heart of {story.coupleName}&rsquo;s Day
              </h2>
              <p className="text-gray-600 text-[15px] sm:text-[16px] leading-[1.8] tracking-wide font-serif mb-6 font-normal">
                {story.description} Every detail of this wedding was carefully chosen to reflect
                their journey together. From the morning preparations to the starlit dance floor,
                it was a day filled with laughter, tears, and unforgettable celebrations.
              </p>
              <p className="text-gray-600 text-[15px] sm:text-[16px] leading-[1.8] tracking-wide font-serif font-normal">
                Our approach was to capture the organic, fleeting emotions—the quiet glances,
                the shared laughs, and the grand festive highlights. We were honored to preserve these
                cherished moments that will be treasured for generations to come.
              </p>
            </div>

            {/* Right Column: Wedding Details Card */}
            <div className="lg:col-span-5 bg-white border border-gray-150/60 p-8 rounded-2xl shadow-sm">
              <h3 className="text-[18px] font-normal text-gray-900 tracking-wider font-serif mb-6 border-b border-gray-100 pb-4 uppercase">
                The Details
              </h3>
              
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-baseline border-b border-gray-50 pb-3">
                  <span className="text-[11px] tracking-[0.15em] text-gray-400 uppercase font-semibold">
                    Venue
                  </span>
                  <span className="text-sm font-medium text-gray-800 text-right font-serif">
                    {weddingDetails.venue}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-b border-gray-50 pb-3">
                  <span className="text-[11px] tracking-[0.15em] text-gray-400 uppercase font-semibold">
                    Style
                  </span>
                  <span className="text-sm font-medium text-gray-800 text-right font-serif">
                    {weddingDetails.style}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-b border-gray-50 pb-3">
                  <span className="text-[11px] tracking-[0.15em] text-gray-400 uppercase font-semibold">
                    Florals
                  </span>
                  <span className="text-sm font-medium text-gray-800 text-right font-serif">
                    {weddingDetails.florals}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pb-1">
                  <span className="text-[11px] tracking-[0.15em] text-gray-400 uppercase font-semibold">
                    Photography
                  </span>
                  <span className="text-sm font-semibold text-[#BF9F72] text-right font-serif">
                    Something Blue
                  </span>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* 3. SHOWCASE GALLERY */}
      <section className="py-10 border-t border-gray-100 bg-white">
        <Container className="max-w-[1200px] px-4 sm:px-16 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[12px] font-medium tracking-[0.25em] text-[#BF9F72] uppercase block mb-2">
              Featured Moments
            </span>
            <h3 className="text-2xl sm:text-3xl font-normal text-gray-900 tracking-wide font-serif">
              Visual Highlights
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {galleryImages.map((imgSrc, imgIndex) => {
              const targetSlug = getStorySlugForImage(imgSrc);
              const targetStory = getStoryForImage(imgSrc);
              return (
                <div key={imgIndex} className="flex flex-col text-center">
                  <Link
                    href={targetSlug}
                    className="relative aspect-[3/4] overflow-hidden group bg-gray-50 border border-gray-100 block cursor-pointer mb-4"
                  >
                    <Image
                      src={imgSrc}
                      alt={targetStory ? `Wedding of ${targetStory.coupleName}` : "Highlight moment"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />
                  </Link>
                  {targetStory && (
                    <div className="px-2">
                      <h4 className="text-[17px] font-normal text-gray-900 tracking-wide font-serif mb-1">
                        {targetStory.coupleName}
                      </h4>
                      <p className="text-gray-500 text-[12px] leading-[1.65] max-w-[240px] mx-auto mb-3 tracking-wide font-serif font-normal">
                        {targetStory.description}
                      </p>
                      <Link
                        href={targetSlug}
                        className="inline-block text-[10px] font-medium tracking-[0.25em] text-[#0b0c10] hover:text-[#BF9F72] transition-colors uppercase border-b border-gray-200 hover:border-[#BF9F72] pb-0.5"
                      >
                        View Details &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. FOOTER CALL-TO-ACTION */}
      <section className="mt-20 text-center">
        <Container className="max-w-2xl mx-auto px-6">
          <h4 className="text-xl sm:text-2xl font-normal text-gray-900 tracking-wide font-serif mb-4">
            Inspired by their story?
          </h4>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto font-serif">
            Let&rsquo;s connect to preserve your wedding story with timeless, genuine artistry.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="border border-[#BF9F72] bg-[#BF9F72] text-[#FAF8F5] hover:bg-[#FAF8F5] hover:text-[#0b0c10] transition-colors duration-300 px-8 py-3.5 text-[11px] font-medium tracking-[0.2em] uppercase w-full sm:w-auto text-center"
            >
              Inquire Today
            </Link>
            <Link
              href="/"
              className="border border-gray-300 text-gray-600 hover:border-gray-800 hover:text-gray-900 transition-colors duration-300 px-8 py-3.5 text-[11px] font-medium tracking-[0.2em] uppercase w-full sm:w-auto text-center font-serif"
            >
              Back to Home
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
