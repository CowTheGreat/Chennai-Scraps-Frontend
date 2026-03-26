import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { catalogAPI } from '../services/api';

export default function SellUsedAppliances() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await catalogAPI.getCategories();
        setCategories(data.filter((item) => item.is_active));
      } catch (err) {
        setError(err.message || 'Could not load categories right now.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const grouped = useMemo(() => {
    return {
      LARGE: categories.filter((c) => c.category_type === 'LARGE'),
      SMALL: categories.filter((c) => c.category_type === 'SMALL'),
      TECH: categories.filter((c) => c.category_type === 'TECH'),
    };
  }, [categories]);

  const renderGroup = (title, list) => (
    <section className="mt-8">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{title}</h2>
      {list.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600">No items in this section yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((category) => {
            const image = category.display_image || category.image_url || category.image;
            return (
              <article key={category.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow">
                <div className="h-44 rounded-xl overflow-hidden bg-slate-100 mb-4">
                  {image ? (
                    <img src={image} alt={category.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-semibold">No image</div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{category.name}</h3>
                <p className="text-slate-600 mt-2 min-h-[48px]">{category.description || 'Get the best value with doorstep pickup.'}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-blue-700 font-bold text-xl">Up to Rs {category.base_price}</span>
                  <Link
                    to={`/sell-used-appliances/${category.slug}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Sell This
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading categories...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Sell Used Appliances</h1>
        <p className="text-slate-700 mt-3 text-lg">Choose your appliance category to start a quick valuation and add it to cart.</p>

        {renderGroup('Large Appliances', grouped.LARGE)}
        {renderGroup('Small Appliances', grouped.SMALL)}
        {renderGroup('Electronics and Gadgets', grouped.TECH)}
      </div>
    </div>
  );
}
