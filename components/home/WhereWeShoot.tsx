import Container from "components/layout/Container";

export default function WhereWeShoot() {
  return (
    <section
      id="where-we-shoot"
      className="bg-[#FAF8F5] py-16 sm:py-20 lg:py-24 border-b border-gray-100 relative z-20"
    >
      <Container className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
        <div className="mb-8">
          <span className="block text-[13px] sm:text-[16px] font-medium tracking-[0.25em] text-[#BF9F72] uppercase mb-4">
            Where We Shoot
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-4.5xl font-normal text-[#0b0c10] tracking-wide leading-tight font-serif">
            Serving Tampa Bay and{" "}
            <span className="italic">All of Florida</span>
          </h2>
        </div>

        <p className="text-gray-700 text-[14px] sm:text-[16px] md:text-[17px] leading-[1.8] max-w-[760px] mx-auto tracking-wide font-normal font-serif">
          We&rsquo;re based in the Tampa Bay area and photograph weddings in
          Tampa, St. Petersburg, Clearwater, Sarasota, Bradenton and the Gulf
          Coast beaches. We also travel across Florida to Orlando, Naples, Fort
          Myers, the Panhandle and beyond. Whether you&rsquo;re planning a
          barefoot ceremony on the sand, a ballroom reception downtown or a
          garden wedding at a historic estate, we know how to work with
          Florida&rsquo;s light, heat and sunsets.
        </p>
      </Container>
    </section>
  );
}
