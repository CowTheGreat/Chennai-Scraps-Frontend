import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { catalogAPI } from '../services/api';

const inferCategoryType = (category = {}) => {
  if (category.category_type) {
    return category.category_type;
  }

  const name = String(category.name || '').toLowerCase();
  if (['air conditioner', 'refrigerator', 'washing machine', 'dishwasher'].some((item) => name.includes(item))) {
    return 'LARGE';
  }
  if (['geyser', 'heater', 'microwave', 'vacuum', 'mixer', 'grinder', 'water purifier', 'induction'].some((item) => name.includes(item))) {
    return 'SMALL';
  }
  return 'TECH';
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await catalogAPI.getCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  }

  const getCardImage = (category) => category.display_image || category.image_url || category.image || null;
  const activeCategories = categories.filter((category) => category.is_active);

  const groupedCategories = {
    LARGE: activeCategories.filter((category) => inferCategoryType(category) === 'LARGE').slice(0, 3),
    SMALL: activeCategories.filter((category) => inferCategoryType(category) === 'SMALL').slice(0, 3),
    TECH: activeCategories.filter((category) => inferCategoryType(category) === 'TECH').slice(0, 3),
  };

  const renderCategorySection = (title, categoryList) => (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">{title}</h2>
      {categoryList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center text-gray-600 font-semibold">
          No categories available in this section yet. Add categories from admin to display here.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryList.map((category) => (
            <article
              key={category.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-lg transition-shadow"
            >
              <div className="rounded-xl overflow-hidden bg-gray-100 mb-4 h-44">
                {getCardImage(category) ? (
                  <img src={getCardImage(category)} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">No image</div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Sell {category.name}</h3>
              <p className="text-gray-600 font-semibold mb-4 min-h-[48px]">{category.description || 'Get the best resale value with doorstep pickup.'}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-700">Old Up To: ₹{category.base_price}</span>
                <Link to="/sell-now" className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700">
                  Sell Now
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCategorySection('Sell Large Appliances', groupedCategories.LARGE)}
      {renderCategorySection('Sell Small Appliances', groupedCategories.SMALL)}
      {renderCategorySection('Sell Electronics and Gadgets', groupedCategories.TECH)}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">Sell Used Electronics in 3 Simple Steps</h2>
        <p className="text-center text-gray-700 font-semibold mt-2 mb-6">India's largest online platform for selling used electronics</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-100 rounded-2xl p-6 text-center border border-green-200">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-2xl font-bold mb-2">Get the Best Offer</h3>
            <p className="font-semibold text-gray-700">Find out your product value in just a few clicks.</p>
          </div>
          <div className="bg-green-100 rounded-2xl p-6 text-center border border-green-200">
            <div className="text-3xl mb-3">🚚</div>
            <h3 className="text-2xl font-bold mb-2">Doorstep Pickup</h3>
            <p className="font-semibold text-gray-700">Schedule now and we will pick up your product within 24-48 hours.</p>
          </div>
          <div className="bg-green-100 rounded-2xl p-6 text-center border border-green-200">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-2xl font-bold mb-2">Instant Payment</h3>
            <p className="font-semibold text-gray-700">Receive your payment online immediately.</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900">Why Choose Chennai Scraps?</h2>
          <p className="text-center text-gray-700 font-semibold mt-2 mb-8">Eco-friendly recycling by a trusted e-waste pickup network</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl bg-green-50 border border-green-100 p-8">
              <h3 className="text-2xl font-bold mb-4">Fast, Transparent, Reliable</h3>
              <ul className="space-y-3 text-gray-800 font-semibold">
                <li>Transparent pricing with no hidden charges.</li>
                <li>As easy as grocery shopping, fully online flow.</li>
                <li>Fast pickup within 24-48 hours in serviceable zones.</li>
                <li>Secure transactions with reliable digital payouts.</li>
                <li>Trusted across Chennai for responsible e-waste handling.</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-green-900 text-white p-8">
              <h3 className="text-2xl font-bold mb-4">Our Journey So Far</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-3xl font-bold">18+</p>
                  <p className="font-semibold">Years of Experience</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">25+</p>
                  <p className="font-semibold">Cities</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">75+</p>
                  <p className="font-semibold">Warehouses</p>
                </div>
              </div>
              <p className="mt-6 text-lg font-bold">Trusted by over 1,50,000 customers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-green-900 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-3">Bulk Pickup Made Easy</h2>
            <p className="text-lg font-semibold mb-4">
              Partner with Chennai Scraps for efficient bulk appliance pickups that simplify responsible recycling.
            </p>
            <p className="font-bold mb-5">Housing Societies | Institutions | Offices</p>
            <button className="px-6 py-3 border-2 border-white rounded-lg font-bold hover:bg-white hover:text-green-900 transition-colors">
              Bulk Pickup Request
            </button>
          </div>
          <div className="bg-white/10 border border-white/30 rounded-2xl p-8 text-center text-lg font-bold">
            bulkpickup
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">FAQs</h2>
        <div className="space-y-3">
          {[
            'How do I sell my old appliances on Chennai Scraps?',
            'What types of appliances does Chennai Scraps accept?',
            'Can I sell non-working appliances to Chennai Scraps?',
            'What if my brand or category is not listed in options?',
            'Is there any fee for doorstep pickup service?',
          ].map((question) => (
            <details key={question} className="bg-white border border-gray-300 rounded-lg px-4 py-3">
              <summary className="cursor-pointer text-lg font-bold text-gray-900">{question}</summary>
              <p className="mt-3 text-gray-700 font-semibold">
                Please raise a request and our team will verify details and guide you on pricing and pickup eligibility.
              </p>
            </details>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/faqs" className="inline-block bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700">
            View All
          </Link>
        </div>
      </section>

      <section className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Stay Updated With Chennai Scraps</h2>
          <p className="text-lg font-semibold text-gray-700 mb-2">
            Sign up for free to receive updates, tips, and latest offers via WhatsApp.
          </p>
          <p className="text-gray-600 font-semibold mb-6">Rest assured, we will not spam you with messages.</p>
          <div className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="tel"
              placeholder="Enter your number"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 font-semibold"
            />
            <button className="bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
