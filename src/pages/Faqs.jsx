import { useMemo, useState, useEffect } from 'react';

const FAQS = [
  {
    q: 'How do I sell my old appliances on Chennai Scraps?',
    a: 'Selling your old appliances is simple with Chennai Scraps. Select the appliance you want to sell and schedule a free doorstep pick-up. Our logistics partner will come to your location, pick up the product, and process payment quickly through secure online transfer. It is one of the easiest ways to sell used or old appliances such as ACs, refrigerators, washing machines, and more in Chennai.',
  },
  {
    q: 'What types of appliances does Chennai Scraps accept?',
    a: 'We buy a wide range of home appliances, including fridges, washing machines, air conditioners, microwaves, fans, geysers, and other large appliances. If you want to sell old electronics or used household items you no longer use, Chennai Scraps can help.',
  },
  {
    q: 'Is there any fee for the doorstep pick-up service?',
    a: 'No. As part of our introductory offer, doorstep pick-up is completely free. You will not be charged for scheduling a pickup, and once your used appliance is collected, payment is processed through our secure flow.',
  },
  {
    q: 'Can I sell non-working appliances to Chennai Scraps?',
    a: 'Yes. We accept both working and non-working appliances, including damaged large home appliances, as long as major parts and accessories are provided where applicable.',
  },
  {
    q: 'Will I receive a confirmation for my appliance pick-up?',
    a: 'Yes, you will receive a confirmation via SMS, WhatsApp, or email after booking. Our customer support team may also call you to confirm schedule and pickup details.',
  },
  {
    q: 'How does the payment process work?',
    a: 'We process payment through an authorized and secure online mode once pickup is completed. We prioritize safe digital transactions for traceability and user protection.',
  },
  {
    q: 'How should I prepare my appliance for pick-up?',
    a: 'Please disconnect the appliance from power or water lines and uninstall if required (especially ACs, geysers, fans, etc.). Keep it reasonably clean and include available accessories.',
  },
  {
    q: 'Can I reschedule or cancel a pick-up?',
    a: 'Yes. You can reschedule or cancel before final confirmation. After confirmation, please contact customer support so we can update your pickup slot.',
  },
  {
    q: 'Where does Chennai Scraps provide its services?',
    a: 'Chennai Scraps is Chennai-first and currently operates across key Chennai serviceable zones. We are expanding coverage progressively. For latest serviceable locations, please enter your pincode during booking.',
  },
  {
    q: 'What happens to the appliances after pick-up?',
    a: 'After pickup, appliances move through inspection and responsible recycling channels. Materials are processed with environmental compliance in mind, helping reduce landfill burden and carbon impact.',
  },
  {
    q: 'Will the price change after I schedule pick-up?',
    a: 'The offer is finalized during order confirmation for that booking context. Once pickup is confirmed, the agreed value is intended to remain stable unless there is a major mismatch against declared item details.',
  },
];

export default function Faqs() {
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.title = 'Chennai Scraps FAQs | Sell Old Appliances with Doorstep Pickup';
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((item) => {
      const hay = `${item.q} ${item.a}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-blue-700 mb-4">Frequently Asked Questions</h1>
        <p className="text-slate-700 text-lg leading-8 mb-8">
          Find answers about selling old appliances, doorstep pickup, pricing, payment,
          and responsible e-waste recycling with Chennai Scraps.
        </p>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-8">
          <div className="flex items-center gap-3">
            <div className="text-slate-500" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by question or keyword (e.g. pickup, payment, non-working)"
              className="w-full px-2 py-2 text-base focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredFaqs.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600">
              No FAQ matched your search. Try a different keyword.
            </div>
          )}

          {filteredFaqs.map((item, index) => (
            <details key={index} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm group">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-900">{item.q}</h2>
                <span className="text-blue-700 font-bold text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-slate-700 leading-8">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
