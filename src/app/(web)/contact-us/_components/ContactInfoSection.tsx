import { Mail, Phone, MapPin } from "lucide-react";

const contactInfo = [
  {
    id: 1,
    icon: Mail,
    title: "Email",
    line1: "modernmedcenters@gmail.com",
    line2: "We reply within 24 hours",
  },
  {
    id: 2,
    icon: Phone,
    title: "Support Line",
    line1: "305 - 760 - 9339",
    line2: "Mon–Fri, 10am–6pm EST",
  },
  {
    id: 3,
    icon: MapPin,
    title: "Head Office",
    // line1: "850 NW 42nd Ave Ste #204",
    // line2: "Miami, FL 33126",
    line2:"Miami, Florida"
  },
];

export default function ContactInfoSection() {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Map */}
          <div className="order-2 lg:order-1 h-[501px]">
           <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8315.279101898097!2d-80.26320309174159!3d25.78010846123859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b768b75aaaab%3A0x52dd4ce8a6a9d5c3!2s850%20NW%2042nd%20Ave%20Suite%20204%2C%20Miami%2C%20FL%2033126%2C%20USA!5e0!3m2!1sen!2sbd!4v1773202987794!5m2!1sen!2sbd" className="w-full h-full" ></iframe>
            
          </div>

          {/* Contact Card */}
          <div className="order-1 lg:order-2">
            <div className="rounded-[12px] bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:p-8 md:p-10 lg:p-10 xl:p-12">
              <h2 className="text-[30px] font-semibold leading-tight text-[#24457a] sm:text-[36px] lg:text-[42px]">
                Contact <span className="text-[#1496b8]">Information</span>
              </h2>

              <p className="mt-4 max-w-[480px] text-sm leading-7 text-[#6f6f6f] sm:text-[15px]">
                Find all the ways to reach us, including email, phone, and our
                office address, so you can get the support and answers you need
                quickly and easily.
              </p>

              <div className="mt-8 space-y-6 sm:mt-10">
                {contactInfo.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.id} className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e8f4f3]">
                        <Icon className="h-5 w-5 text-[#1496b8]" strokeWidth={2} />
                      </div>

                      <div>
                        <h3 className="text-[16px] font-semibold text-[#3a3a3a] sm:text-[17px]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-[#777] sm:text-[15px]">
                          {item.line1}
                        </p>
                        <p className="mt-1 text-sm text-[#8d8d8d] sm:text-[14px]">
                          {item.line2}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}