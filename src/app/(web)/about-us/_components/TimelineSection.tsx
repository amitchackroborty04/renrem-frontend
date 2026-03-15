import Image from "next/image";

const timelineData = [
  {
    id: 1,
    year: "2019",
    title: "The Beginning",
    description:
      "In 2019, our journey started with a strong belief that quality healthcare should not depend on location, background, or income. We set out to build a platform that could bridge the gap between patients and reliable medical services, laying the foundation for a more connected and accessible healthcare ecosystem.",
    image: "/about.png",
    imageAlt: "Woman speaking with microphone",
    imageLeft: true,
  },
  {
    id: 2,
    year: "2021",
    title: "Rapid Growth",
    description:
      "By 2021, our vision began turning into real impact. The platform expanded into 15 countries, enabling thousands of patients to easily find trusted hospitals, clinics, and doctors. This period marked a major leap in reach, partnerships, and user trust as more people embraced digital healthcare solutions.",
     image: "/about2.png",
    imageAlt: "Medical team standing together",
    imageLeft: false,
  },
  {
    id: 3,
    year: "2018",
    title: "Recognition",
    description:
      "In 2024, our efforts were acknowledged on a continental stage when we were awarded the Best Digital Health Platform in Africa. This recognition celebrated our commitment to improving healthcare access, strengthening patient experience, and driving innovation across the African healthcare landscape.",
     image: "/about3.png",
    imageAlt: "Award trophy on table",
    imageLeft: true,
  },
];

export default function TimelineSection() {
  return (
    <section className="w-full bg-[#f3f3f3] py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative">

          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {timelineData.map((item) => (
              <div
                key={item.id}
                className="relative rounded-[20px] bg-white p-4 shadow-[0_4px_18px_rgba(0,0,0,0.10)] sm:p-5 md:p-6 lg:p-6"
              >
                <div
                  className={`grid items-center gap-5 lg:grid-cols-12 lg:gap-14 ${
                    item.imageLeft ? "" : ""
                  }`}
                >
                  {item.imageLeft ? (
                    <>
                      {/* Image */}
                      <div className="order-1 lg:col-span-4">
                        <div className="relative h-[220px] w-full overflow-hidden rounded-[14px] sm:h-[260px] md:h-[300px] lg:h-[344px]">
                          <Image
                            src={item.image}
                            alt={item.imageAlt}
                            fill
                            className=" object-cover"
                            quality={100}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="order-2 flex flex-col justify-center lg:col-span-8">
                        <span className="inline-flex w-fit rounded-full border border-[#7DBAED] bg-[#E6F3F4] px-4 py-1 text-[11px] font-medium text-[#2563eb]">
                          {item.year}
                        </span>

                        <h3 className="mt-4 text-[26px] font-semibold leading-tight text-[#253C67] sm:text-[30px] lg:text-[32px]">
                          {item.title}
                        </h3>

                        <p className="mt-4  text-sm leading-6 text-[#929292] sm:text-[16px]">
                          {item.description}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Content */}
                      <div className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-8">
                        <span className="inline-flex w-fit rounded-full border border-[#7DBAED] bg-[#E6F3F4] px-4 py-1 text-[11px] font-medium text-[#2563eb]">
                          {item.year}
                        </span>

                        <h3 className="mt-4 text-[26px] font-semibold leading-tight text-[#253C67] sm:text-[30px] lg:text-[32px]">
                          {item.title}
                        </h3>

                        <p className="mt-4  text-sm leading-6 text-[#929292] sm:text-[16px]">
                          {item.description}
                        </p>
                      </div>

                      {/* Image */}
                      <div className="order-1 lg:order-2 lg:col-span-4">
                        <div className="relative h-[220px] w-full overflow-hidden rounded-[14px] sm:h-[260px] md:h-[300px] lg:h-[344px]">
                          <Image
                            src={item.image}
                            alt={item.imageAlt}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
