"use client";

import Image from "next/image";
import imagesData from "data/portfolio.json";

export default function PortfolioGrid() {
  const rows: string[][] = [];

  for (let i = 0; i < imagesData.length; i += 5) {
    if (i + 5 <= imagesData.length) {
      rows.push(imagesData.slice(i, i + 5));
    }
  }

  return (
    <section className="bg-[#0b0c10] py-1 border-y border-black select-none">
      <div className="flex flex-col gap-1">
        {rows.map((rowImages, rowIndex) => {
          const isEvenRow = rowIndex % 2 === 0;

          return (
            <div
              key={rowIndex}
              className="grid grid-cols-1 md:grid-cols-12 gap-1 w-full"
            >
              {isEvenRow ? (
                <>
                  {/* Large Left */}
                  <div className="col-span-1 md:col-span-6">
                    <div className="relative  overflow-hidden group">
                      <Image
                        src={rowImages[0]}
                        alt={`Portfolio image ${rowIndex * 5 + 1}`}
                        width={2000}
                        height={1500}
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Middle Column */}
                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-rows-2 gap-1 ">
                      {[rowImages[1], rowImages[2]].map((img, i) => (
                        <div
                          key={i}
                          className="relative overflow-hidden group "
                        >
                          <Image
                            src={img}
                            alt={`Portfolio image ${rowIndex * 5 + i + 2}`}
                            width={2000}
                            height={1500}
                            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-rows-2 gap-1 ">
                      {[rowImages[3], rowImages[4]].map((img, i) => (
                        <div
                          key={i}
                          className="relative overflow-hidden group "
                        >
                          <Image
                            src={img}
                            alt={`Portfolio image ${rowIndex * 5 + i + 4}`}
                            width={2000}
                            height={1500}
                            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Left Column */}
                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-rows-2 gap-1 ">
                      {[rowImages[0], rowImages[1]].map((img, i) => (
                        <div
                          key={i}
                          className="relative overflow-hidden group "
                        >
                          <Image
                            src={img}
                            alt={`Portfolio image ${rowIndex * 5 + i + 1}`}
                            width={2000}
                            height={1500}
                            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Middle Column */}
                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-rows-2 gap-1 ">
                      {[rowImages[2], rowImages[3]].map((img, i) => (
                        <div
                          key={i}
                          className="relative overflow-hidden group "
                        >
                          <Image
                            src={img}
                            alt={`Portfolio image ${rowIndex * 5 + i + 3}`}
                            width={2000}
                            height={1500}
                            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Large Right */}
                  <div className="col-span-1 md:col-span-6">
                    <div className="relative  overflow-hidden group">
                      <Image
                        src={rowImages[4]}
                        alt={`Portfolio image ${rowIndex * 5 + 5}`}
                        width={2000}
                        height={1500}
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
