"use client";

import Image from "next/image";
import imagesData from "data/portfolio.json";

export default function PortfolioGrid() {
  // Safe parsing in case of varying lengths: group into chunks of 5
  const rows = [];
  for (let i = 0; i < imagesData.length; i += 5) {
    if (i + 5 <= imagesData.length) {
      rows.push(imagesData.slice(i, i + 5));
    }
  }

  return (
    <section className="bg-[#0b0c10] py-1 border-t border-b border-black select-none">
      <div className="w-full flex flex-col gap-1">
        {rows.map((rowImages, rowIndex) => {
          const isEvenRow = rowIndex % 2 === 0;

          if (isEvenRow) {
            // Pattern A: 1 Left Large (Col 1), 2 Middle Stacked (Col 2), 2 Right Stacked (Col 3)
            return (
              <div
                key={rowIndex}
                className="grid grid-cols-1 md:grid-cols-12 gap-1 w-full"
              >
                {/* Left Large (6/12 width) */}
                <div className="col-span-1 md:col-span-6 h-[380px] md:h-[580px] relative overflow-hidden group">
                  <Image
                    src={rowImages[0]}
                    alt={`Portfolio wedding image ${rowIndex * 5 + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-103"
                  />
                </div>

                {/* Middle Stacked (3/12 width) */}
                <div className="col-span-1 md:col-span-3 flex flex-col gap-1 h-[380px] md:h-[580px]">
                  <div className="flex-1 relative overflow-hidden group">
                    <Image
                      src={rowImages[1]}
                      alt={`Portfolio wedding image ${rowIndex * 5 + 2}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-103"
                    />
                  </div>
                  <div className="flex-1 relative overflow-hidden group">
                    <Image
                      src={rowImages[2]}
                      alt={`Portfolio wedding image ${rowIndex * 5 + 3}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-103"
                    />
                  </div>
                </div>

                {/* Right Stacked (3/12 width) */}
                <div className="col-span-1 md:col-span-3 flex flex-col gap-1 h-[380px] md:h-[580px]">
                  <div className="flex-1 relative overflow-hidden group">
                    <Image
                      src={rowImages[3]}
                      alt={`Portfolio wedding image ${rowIndex * 5 + 4}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-103"
                    />
                  </div>
                  <div className="flex-1 relative overflow-hidden group">
                    <Image
                      src={rowImages[4]}
                      alt={`Portfolio wedding image ${rowIndex * 5 + 5}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-103"
                    />
                  </div>
                </div>
              </div>
            );
          } else {
            // Pattern B: 2 Left Stacked (Col 1), 2 Middle Stacked (Col 2), 1 Right Large (Col 3)
            return (
              <div
                key={rowIndex}
                className="grid grid-cols-1 md:grid-cols-12 gap-1 w-full"
              >
                {/* Left Stacked (3/12 width) */}
                <div className="col-span-1 md:col-span-3 flex flex-col gap-1 h-[380px] md:h-[580px]">
                  <div className="flex-1 relative overflow-hidden group">
                    <Image
                      src={rowImages[0]}
                      alt={`Portfolio wedding image ${rowIndex * 5 + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-103"
                    />
                  </div>
                  <div className="flex-1 relative overflow-hidden group">
                    <Image
                      src={rowImages[1]}
                      alt={`Portfolio wedding image ${rowIndex * 5 + 2}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-103"
                    />
                  </div>
                </div>

                {/* Middle Stacked (3/12 width) */}
                <div className="col-span-1 md:col-span-3 flex flex-col gap-1 h-[380px] md:h-[580px]">
                  <div className="flex-1 relative overflow-hidden group">
                    <Image
                      src={rowImages[2]}
                      alt={`Portfolio wedding image ${rowIndex * 5 + 3}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-103"
                    />
                  </div>
                  <div className="flex-1 relative overflow-hidden group">
                    <Image
                      src={rowImages[3]}
                      alt={`Portfolio wedding image ${rowIndex * 5 + 4}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-103"
                    />
                  </div>
                </div>

                {/* Right Large (6/12 width) */}
                <div className="col-span-1 md:col-span-6 h-[380px] md:h-[580px] relative overflow-hidden group">
                  <Image
                    src={rowImages[4]}
                    alt={`Portfolio wedding image ${rowIndex * 5 + 5}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-103"
                  />
                </div>
              </div>
            );
          }
        })}
      </div>
    </section>
  );
}
