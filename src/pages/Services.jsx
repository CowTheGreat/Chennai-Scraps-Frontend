import { useState } from 'react';
import { serviceAPI } from '../services/api';

export default function Services() {
  const [form, setForm] = useState({
    full_name: '',
    address: '',
    phone_number: '',
    service_name: 'CCTV_INSTALLATION',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      await serviceAPI.bookCall({
        ...form,
        phone_number: form.phone_number.replace(/\D/g, '').slice(0, 10),
      });
      setSuccess('Thank you! Our Chennai team will call you shortly.');
      setForm({
        full_name: '',
        address: '',
        phone_number: '',
        service_name: 'CCTV_INSTALLATION',
        notes: '',
      });
    } catch (err) {
      setError(err.message || 'Unable to submit right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-white">
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-8">
        <h1 className="text-5xl font-bold text-slate-900 leading-tight">
          Chennai Scrap & Utility Services: Metal Roofing, Bulk Scrap Pickup, and CCTV Installation
        </h1>
        <p className="mt-6 text-lg text-slate-700 leading-8">
          Looking for trusted field services in Chennai with transparent pricing, experienced teams,
          and reliable support? Chennai-Scraps provides three high-demand services for homes,
          apartments, shops, warehouses, schools, and commercial facilities across the city:
          metal roofing solutions, bulk scrap pickup operations, and CCTV camera installation.
          Our service engineers and field coordinators focus on clean execution, prompt updates,
          and safety-first work standards.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <article className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Metal Roofing</h2>
          <p className="mt-3 text-slate-700 leading-7">
            We handle end-to-end metal roofing requirements in Chennai, including site assessment,
            material planning, structural checks, sheet installation, rainwater flow optimization,
            and finishing. We support both fresh roofing work and replacement of damaged roofs.
          </p>
        </article>
        <article className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Bulk Pickup of Scraps</h2>
          <p className="mt-3 text-slate-700 leading-7">
            Our bulk scrap pickup service is tailored for households, offices, factories,
            institutions, and construction sites. We organize scheduled pickups for large volumes
            of recyclable and reusable material and coordinate safe loading at your location.
          </p>
        </article>
        <article className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">CCTV Camera Installation</h2>
          <p className="mt-3 text-slate-700 leading-7">
            From planning camera positions to final installation, DVR/NVR setup, cable routing,
            mobile view configuration, and handover, we provide CCTV installation services across
            Chennai for residential and commercial security requirements.
          </p>
        </article>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-4">
        <h2 className="text-3xl font-bold text-slate-900">Why Chennai Customers Choose Us</h2>
        <div className="mt-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-slate-700 leading-8">
          Chennai-Scraps combines local on-ground knowledge with process-driven service delivery.
          We understand neighborhood access constraints, apartment society timing windows,
          weather-related planning, and execution realities in different zones of Chennai.
          Our teams prioritize punctuality, communication, and practical outcomes instead of
          one-size-fits-all recommendations. Whether you need urgent CCTV coverage, durable
          roofing, or a one-time bulk scrap clearance, we can schedule a callback and guide you
          on the right next steps.
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-md">
          <h2 className="text-3xl font-bold text-slate-900">Book a Call</h2>
          <p className="mt-2 text-slate-600">
            Share your details and our team will call you to confirm scope, timeline, and availability.
          </p>

          {success && (
            <div className="mt-4 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-lg px-4 py-3">
              {success}
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Name *</label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={onChange}
                required
                className="mt-1 w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone Number *</label>
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={onChange}
                required
                maxLength={10}
                placeholder="9876543210"
                className="mt-1 w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Address *</label>
              <textarea
                name="address"
                value={form.address}
                onChange={onChange}
                required
                rows={3}
                className="mt-1 w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Service *</label>
              <select
                name="service_name"
                value={form.service_name}
                onChange={onChange}
                className="mt-1 w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="CCTV_INSTALLATION">CCTV Camera Installation</option>
                <option value="METAL_ROOFING">Metal Roofing</option>
                <option value="BULK_SCRAP_PICKUP">Bulk Pickup of Scraps</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Additional Notes</label>
              <input
                name="notes"
                value={form.notes}
                onChange={onChange}
                placeholder="Preferred time, landmark, quantity details"
                className="mt-1 w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-800 disabled:bg-emerald-400"
              >
                {loading ? 'Submitting...' : 'Book a Call'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
