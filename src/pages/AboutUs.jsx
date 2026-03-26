import { useEffect } from 'react';

export default function AboutUs() {
  useEffect(() => {
    document.title = 'About Chennai Scraps | Sustainable E-Waste Management in Chennai';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-blue-700 mb-6 leading-tight">
          About Chennai Scraps: Turning Old Electronics into a Greener Future
        </h1>

        <p className="text-slate-700 text-lg leading-8 mb-8">
          Where do old electronics go after replacement? At Chennai Scraps, they do not sit in storage
          rooms or end up in unmanaged waste streams. We collect them responsibly, channel them through
          the right recycling ecosystem, and create value for both households and the environment.
          Our mission is simple: make safe e-waste disposal in Chennai convenient, rewarding, and
          climate-conscious.
        </p>

        <div className="bg-white rounded-xl border border-blue-100 shadow-md overflow-hidden mb-10">
          <img
            src="/about-us.png"
            alt="Chennai Scraps e-waste impact and service highlights"
            className="w-full h-auto object-cover"
          />
        </div>

        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm mb-8">
          <h2 className="text-3xl font-semibold text-slate-900 mb-4">Who We Are</h2>
          <p className="text-slate-700 leading-8 mb-4">
            Chennai Scraps is a city-focused e-waste collection and service platform built for modern
            homes, apartments, and businesses that upgrade electronics frequently. From air conditioners,
            refrigerators, and washing machines to consumer electronics and mixed scrap, we provide
            streamlined pickup coordination and responsible recycling pathways.
          </p>
          <p className="text-slate-700 leading-8">
            We are building Chennai's trusted bridge between everyday consumers and circular economy
            outcomes. Every device processed through our network helps reduce landfill pressure,
            supports resource recovery, and encourages cleaner material cycles.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">The Impact You Make</h3>
            <p className="text-slate-700 leading-8">
              Recycling one major appliance can significantly reduce carbon footprint when compared to
              improper disposal. Responsible handling of cooling appliances, electronics, and metal scrap
              reduces greenhouse gas leakage, supports material reuse, and contributes to cleaner urban
              living in Chennai.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">Why It Matters for Chennai</h3>
            <p className="text-slate-700 leading-8">
              Rapid electronics adoption increases city-level e-waste volume every year. A trusted,
              doorstep-friendly collection model helps families and businesses avoid unsafe disposal.
              Chennai Scraps promotes recycling awareness while making eco-responsible decisions practical.
            </p>
          </div>
        </section>

        <section className="bg-blue-700 text-white rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-semibold mb-4">Let Your Old Electronics Leave a Greener Footprint</h2>
          <p className="leading-8 text-blue-50">
            Building a better planet starts with small and consistent actions. Selling and recycling old
            electronics the right way can make a measurable impact over time. Chennai Scraps helps you do
            exactly that through verified pickup flow, transparent communication, and responsible processing.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-3xl font-semibold text-slate-900 mb-4">Join the Change with Chennai Scraps</h2>
          <p className="text-slate-700 leading-8 mb-4">
            We believe sustainability should be simple, local, and rewarding. If you have old electronics,
            appliances, or scrap material, choose a smarter disposal path that supports circular growth.
          </p>
          <p className="text-slate-700 leading-8 font-medium">
            Do not just sell it. Recycle it responsibly with Chennai Scraps.
          </p>
        </section>
      </div>
    </div>
  );
}
