import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { clearCart, getCartItems, removeCartItem, updateCartItemQuantity } from '../utils/cart';

const initialAddress = {
  name: '',
  address_line1: '',
  address_line2: '',
  pincode: '',
  city: 'Chennai',
  state: 'Tamil Nadu',
};

export default function Cart() {
  const [items, setItems] = useState(getCartItems());
  const [address, setAddress] = useState(initialAddress);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('MORNING');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isLoggedIn = !!localStorage.getItem('access_token');

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.line_total || 0), 0);
  }, [items]);

  const ensureLogin = () => {
    if (isLoggedIn) return true;
    setError('Please login to continue checkout.');
    window.dispatchEvent(new CustomEvent('open-login-modal'));
    return false;
  };

  const handleQuantity = (id, qty) => {
    if (!ensureLogin()) return;
    setItems(updateCartItemQuantity(id, qty));
  };

  const handleRemove = (id) => {
    if (!ensureLogin()) return;
    setItems(removeCartItem(id));
  };

  const placeOrder = async () => {
    if (!ensureLogin()) return;

    setError('');
    setSuccess('');

    if (!items.length) {
      setError('Your cart is empty.');
      return;
    }

    if (!address.name || !address.address_line1 || !address.pincode || !pickupDate) {
      setError('Please fill address details and pickup date.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        items: items.map((item) => ({
          category_id: item.category_id,
          quantity: Number(item.quantity || 1),
          field_values: item.field_values || {},
        })),
        address: {
          ...address,
          pincode: String(address.pincode).replace(/\D/g, '').slice(0, 6),
        },
        pickup_date: pickupDate,
        pickup_time_slot: pickupTimeSlot,
      };

      const order = await ordersAPI.createOrder(payload);
      clearCart();
      setItems([]);
      setSuccess(`Order placed successfully. Order code: ${order.order_code}`);
    } catch (err) {
      setError(err.message || 'Could not place order right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Cart & Checkout</h1>

        {!isLoggedIn && (
          <div className="mb-6 bg-amber-50 border border-amber-300 text-amber-800 px-4 py-3 rounded-lg">
            Please login to add items and place an order.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Items</h2>

            {items.length === 0 ? (
              <div className="text-slate-600">
                Cart is empty. <Link to="/sell-used-appliances" className="text-blue-700 underline">Browse categories</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <article key={item.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{item.category_name_snapshot}</h3>
                        <p className="text-slate-600">Rs {item.category_price_snapshot} each</p>
                      </div>
                      <button type="button" onClick={() => handleRemove(item.id)} className="text-red-600 font-semibold hover:underline">
                        Remove
                      </button>
                    </div>

                    {Object.entries(item.field_values || {}).length > 0 && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                        {Object.entries(item.field_values).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-semibold">{item.field_labels?.[key] || key}:</span> {String(value)}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label htmlFor={`qty-${item.id}`} className="text-sm font-semibold text-slate-700">Qty</label>
                        <input
                          id={`qty-${item.id}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantity(item.id, e.target.value)}
                          className="w-20 border border-slate-300 rounded px-2 py-1"
                        />
                      </div>
                      <p className="text-lg font-bold text-blue-700">Rs {item.line_total}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-xl border border-slate-200 p-5 h-fit">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Checkout</h2>

            <div className="space-y-3">
              <input
                value={address.name}
                onChange={(e) => setAddress((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Full Name"
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
              <input
                value={address.address_line1}
                onChange={(e) => setAddress((prev) => ({ ...prev, address_line1: e.target.value }))}
                placeholder="Address line 1"
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
              <input
                value={address.address_line2}
                onChange={(e) => setAddress((prev) => ({ ...prev, address_line2: e.target.value }))}
                placeholder="Address line 2 (optional)"
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
              <input
                value={address.pincode}
                onChange={(e) => setAddress((prev) => ({ ...prev, pincode: e.target.value }))}
                placeholder="Pincode"
                maxLength={6}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />

              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />

              <select
                value={pickupTimeSlot}
                onChange={(e) => setPickupTimeSlot(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              >
                <option value="MORNING">6 AM - 12 PM</option>
                <option value="AFTERNOON">12 PM - 5 PM</option>
                <option value="EVENING">5 PM - 9 PM</option>
              </select>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between font-semibold text-slate-700">
                <span>Subtotal</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={loading || items.length === 0}
              onClick={placeOrder}
              className="w-full mt-5 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Placing order...' : 'Place Order'}
            </button>

            {error && <p className="mt-3 text-red-600 font-semibold">{error}</p>}
            {success && <p className="mt-3 text-blue-700 font-semibold">{success}</p>}
          </section>
        </div>
      </div>
    </div>
  );
}
