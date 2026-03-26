import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { catalogAPI } from '../services/api';
import { addCartItem } from '../utils/cart';

const defaultValueByType = (field) => {
  if (field.field_type === 'boolean') return false;
  if (field.field_type === 'number') return '';
  if (field.field_type === 'dropdown') return field.options?.[0] || '';
  return '';
};

export default function SellCategory() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [fieldValues, setFieldValues] = useState({});
  const [loginNotice, setLoginNotice] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const categories = await catalogAPI.getCategories();
        const match = categories.find((item) => item.slug === slug);
        if (!match) {
          setError('Category not found.');
          return;
        }
        const detail = await catalogAPI.getCategory(match.id);
        setCategory(detail);

        const initial = {};
        for (const field of detail.field_definitions || []) {
          initial[field.field_key] = defaultValueByType(field);
        }
        setFieldValues(initial);
      } catch (err) {
        setError(err.message || 'Unable to load this category right now.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  const isLoggedIn = !!localStorage.getItem('access_token');
  const image = category?.display_image || category?.image_url || category?.image;

  const computedTotal = useMemo(() => {
    if (!category) return 0;
    return Number(category.base_price || 0) * Number(quantity || 1);
  }, [category, quantity]);

  const openLoginPrompt = () => {
    setLoginNotice('Please login to continue filling details and add this item to your cart.');
    window.dispatchEvent(new CustomEvent('open-login-modal'));
  };

  const handleFieldChange = (field, rawValue) => {
    if (!isLoggedIn) {
      openLoginPrompt();
      return;
    }

    setLoginNotice('');
    const value = field.field_type === 'boolean' ? !!rawValue : rawValue;
    setFieldValues((prev) => ({ ...prev, [field.field_key]: value }));
  };

  const validateRequired = () => {
    const defs = category?.field_definitions || [];
    for (const field of defs) {
      if (!field.is_required) continue;
      const value = fieldValues[field.field_key];
      if (field.field_type === 'boolean') {
        if (typeof value !== 'boolean') return field.field_label;
      } else if (value === '' || value === null || typeof value === 'undefined') {
        return field.field_label;
      }
    }
    return null;
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      openLoginPrompt();
      return;
    }

    const missing = validateRequired();
    if (missing) {
      setFeedback(`Please fill required field: ${missing}`);
      return;
    }

    addCartItem({
      category_id: category.id,
      category_name_snapshot: category.name,
      category_price_snapshot: Number(category.base_price || 0),
      quantity: Number(quantity || 1),
      field_values: fieldValues,
      field_labels: (category.field_definitions || []).reduce((acc, f) => {
        acc[f.field_key] = f.field_label;
        return acc;
      }, {}),
    });

    setFeedback('Added to cart successfully.');
    setTimeout(() => navigate('/cart'), 500);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading category...</div>;
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error || 'Category not found.'}</p>
        <Link to="/sell-used-appliances" className="text-blue-700 underline">Back to all categories</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-4">
          <Link to="/sell-used-appliances" className="text-blue-700 font-semibold hover:underline">Back to all categories</Link>
        </div>

        {loginNotice && (
          <div className="mb-4 bg-amber-50 border border-amber-300 text-amber-800 px-4 py-3 rounded-lg">
            {loginNotice}
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-slate-100 rounded-xl overflow-hidden h-48 md:h-56 flex items-center justify-center">
              {image ? (
                <img src={image} alt={category.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-500">No image</span>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <h1 className="text-4xl font-bold text-slate-900 border-b border-slate-200 pb-2">{category.name}</h1>

            <div className="mt-4 space-y-4">
              {(category.field_definitions || []).map((field) => {
                const value = fieldValues[field.field_key];

                if (field.field_type === 'dropdown') {
                  return (
                    <div key={field.field_key}>
                      <label className="block text-sm font-semibold text-slate-800 mb-1">
                        {field.field_label}{field.is_required ? '*' : ''}
                      </label>
                      <select
                        value={value}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                      >
                        {Array.isArray(field.options) && field.options.length > 0 ? (
                          field.options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))
                        ) : (
                          <option value="">No options available</option>
                        )}
                      </select>
                    </div>
                  );
                }

                if (field.field_type === 'boolean') {
                  return (
                    <div key={field.field_key}>
                      <label className="block text-sm font-semibold text-slate-800 mb-1">
                        {field.field_label}{field.is_required ? '*' : ''}
                      </label>
                      <select
                        value={value ? 'yes' : 'no'}
                        onChange={(e) => handleFieldChange(field, e.target.value === 'yes')}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                  );
                }

                return (
                  <div key={field.field_key}>
                    <label className="block text-sm font-semibold text-slate-800 mb-1">
                      {field.field_label}{field.is_required ? '*' : ''}
                    </label>
                    <input
                      type={field.field_type === 'number' ? 'number' : 'text'}
                      value={value}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    />
                  </div>
                );
              })}

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
            <div>
              <p className="text-xl text-slate-700">Up to <span className="text-4xl font-bold text-slate-900">Rs {computedTotal}</span></p>
              <p className="text-sm text-slate-500 mt-2">Final amount may vary after pickup verification.</p>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full mt-8 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {feedback && (
          <div className="mt-4 text-center font-semibold text-blue-700">{feedback}</div>
        )}
      </div>
    </div>
  );
}
