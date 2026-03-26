import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI, userAPI } from '../services/api';

const tabs = ['Pickups', 'Account', 'Referrals'];

const emptyAddress = {
  id: null,
  name: '',
  address_line1: '',
  address_line2: '',
  pincode: '',
  city: 'CHENNAI',
  state: 'Tamil Nadu',
  is_default: false,
};

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Pickups');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchOrderCode, setSearchOrderCode] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [savingAddress, setSavingAddress] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: '', email: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [me, myOrders, myAddresses] = await Promise.all([
          userAPI.getMe(),
          ordersAPI.getOrders(),
          userAPI.getAddresses(),
        ]);
        setUser(me);
        setOrders(myOrders);
        setAddresses(myAddresses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const displayName = useMemo(() => {
    if (user?.full_name) return user.full_name;
    const defaultAddress = addresses.find((a) => a.is_default) || addresses[0];
    if (defaultAddress?.name) return defaultAddress.name;
    return `User ${user?.phone_number || ''}`.trim();
  }, [addresses, user]);

  useEffect(() => {
    if (displayName) {
      localStorage.setItem('profile_display_name', displayName);
    }
  }, [displayName]);

  const referralCode = useMemo(() => {
    if (user?.referral_code) {
      return user.referral_code;
    }
    const phone = user?.phone_number || localStorage.getItem('phone') || '0000000000';
    return `CHN${String(phone).slice(-6)}`;
  }, [user]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const byCode = searchOrderCode
        ? order.order_code?.toLowerCase().includes(searchOrderCode.toLowerCase())
        : true;
      const byDate = searchDate
        ? (order.created_at || '').slice(0, 10) === searchDate
        : true;
      return byCode && byDate;
    });
  }, [orders, searchOrderCode, searchDate]);

  const openAddAddress = () => {
    setAddressForm({ ...emptyAddress, name: displayName || '' });
    setShowAddressModal(true);
  };

  const openEditAddress = (address) => {
    setAddressForm({ ...emptyAddress, ...address });
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setAddressForm(emptyAddress);
  };

  const openProfileModal = () => {
    setProfileForm({
      full_name: user?.full_name || '',
      email: user?.email || '',
    });
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  const handleAddressField = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      setSavingAddress(true);
      const payload = {
        name: addressForm.name,
        address_line1: addressForm.address_line1,
        address_line2: addressForm.address_line2,
        pincode: String(addressForm.pincode).replace(/\D/g, '').slice(0, 6),
        city: 'Chennai',
        state: 'Tamil Nadu',
        is_default: !!addressForm.is_default,
      };

      if (addressForm.id) {
        await userAPI.updateAddress(addressForm.id, payload);
      } else {
        await userAPI.createAddress(payload);
      }

      const refreshed = await userAPI.getAddresses();
      setAddresses(refreshed);

      if (payload.is_default) {
        const chosen = refreshed.find(
          (a) =>
            a.pincode === payload.pincode &&
            a.address_line1 === payload.address_line1 &&
            a.name === payload.name
        );
        if (chosen?.id) {
          await userAPI.setDefaultAddress(chosen.id);
          setAddresses(await userAPI.getAddresses());
        }
      }

      closeAddressModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingAddress(false);
    }
  };

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      alert('Referral code copied!');
    } catch {
      alert(`Your referral code: ${referralCode}`);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const updated = await userAPI.updateProfile({
        full_name: profileForm.full_name,
        email: profileForm.email,
      });
      setUser(updated);
      localStorage.setItem('profile_display_name', updated.full_name || '');
      closeProfileModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This will remove your addresses and pickup records permanently.'
    );
    if (!confirmed) return;

    try {
      setDeletingAccount(true);
      await userAPI.deleteAccount();

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('phone');
      localStorage.removeItem('profile_display_name');

      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.message);
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-semibold text-gray-900 mb-6">Hi {displayName}</h1>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="inline-flex bg-green-100 rounded-xl p-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-2 rounded-lg text-2xl font-semibold transition ${
                activeTab === tab ? 'bg-green-700 text-white' : 'text-gray-800 hover:bg-green-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Pickups' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 min-h-[360px] flex items-center justify-center">
              {filteredOrders.length === 0 ? (
                <div className="text-center text-gray-600">
                  <div className="text-5xl mb-4">📦</div>
                  <p className="text-4xl">No record found!!</p>
                </div>
              ) : (
                <div className="w-full p-6 space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">{order.order_code}</p>
                        <p className="text-sm text-gray-600">{String(order.created_at).slice(0, 10)}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 h-fit">
              <input
                value={searchOrderCode}
                onChange={(e) => setSearchOrderCode(e.target.value)}
                placeholder="Search by Order No"
                className="w-full border rounded-md px-3 py-2 mb-3"
              />
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full border rounded-md px-3 py-2 mb-3"
              />
              <button className="w-full bg-gray-300 rounded-md py-2 text-green-700 font-semibold">Search</button>
            </div>
          </div>
        )}

        {activeTab === 'Account' && (
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 flex items-center justify-between gap-6">
              <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-md bg-green-700 text-white text-5xl font-semibold flex items-center justify-center">
                {(displayName || 'U').slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h2 className="text-4xl font-semibold capitalize">{displayName}</h2>
                <p className="text-gray-700 mt-1">+91-{user?.phone_number}</p>
                <p className="text-gray-700">{user?.email || 'No email added yet'}</p>
              </div>
              </div>

              <button
                onClick={openProfileModal}
                className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700"
              >
                Edit
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-4xl font-semibold">Saved Addresses</h3>
              <button
                onClick={openAddAddress}
                className="bg-green-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-800"
              >
                + Add new address
              </button>
            </div>

            <div className="space-y-4">
              {addresses.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-gray-600">No saved address yet.</div>
              )}

              {addresses.map((address) => (
                <div key={address.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <p className="text-3xl font-semibold mb-2">{address.name}</p>
                    <p className="text-gray-700">{address.address_line1}</p>
                    <p className="text-gray-700">{address.address_line2}</p>
                    <p className="text-gray-700 mt-3 uppercase">{address.city} ({address.pincode})</p>
                    <p className="text-gray-700">{address.state}</p>
                    <p className="text-gray-700">Mobile: +91-{user?.phone_number}</p>
                    {address.is_default && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="border-t bg-gray-50 px-6 py-3 flex justify-center gap-8">
                    <button
                      onClick={() => openEditAddress(address)}
                      className="text-green-700 font-semibold hover:underline"
                    >
                      Edit Address
                    </button>
                    {!address.is_default && (
                      <button
                        onClick={async () => {
                          await userAPI.setDefaultAddress(address.id);
                          setAddresses(await userAPI.getAddresses());
                        }}
                        className="text-blue-700 font-semibold hover:underline"
                      >
                        Set as default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-4 flex justify-center">
              <button
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="bg-red-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600 disabled:bg-red-300"
              >
                {deletingAccount ? 'Deleting...' : 'Delete My Account'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Referrals' && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-3xl">
            <h2 className="text-4xl font-semibold mb-4">Referral System</h2>
            <p className="text-gray-700 mb-6">Invite your friends and earn cashback when they complete their first pickup.</p>

            <div className="border rounded-lg p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Your referral code</p>
                <p className="text-3xl font-bold tracking-widest">{referralCode}</p>
              </div>
              <button
                onClick={copyReferralCode}
                className="bg-green-700 text-white px-5 py-2 rounded-md font-semibold hover:bg-green-800"
              >
                Copy Code
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Total Referrals</p>
                <p className="text-4xl font-bold text-green-700">-</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Referral Points</p>
                <p className="text-4xl font-bold text-green-700">{user?.referral_points || 0}</p>
              </div>
            </div>

            <div className="mt-4 text-gray-700">
              Referred By: {user?.who_referred ? `User #${user.who_referred}` : 'Not referred'}
            </div>
          </div>
        )}
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveAddress}
            className="bg-white rounded-xl w-full max-w-3xl p-8 relative"
          >
            <button
              type="button"
              onClick={closeAddressModal}
              className="absolute right-6 top-5 text-4xl text-gray-600 hover:text-black"
            >
              ×
            </button>

            <h3 className="text-5xl font-semibold mb-6">{addressForm.id ? 'Update Address' : 'Add Address'}</h3>

            <button
              type="button"
              className="border-2 border-green-700 rounded-lg px-5 py-2 text-green-700 font-semibold mb-5"
            >
              📍 Detect My Location
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-4xl font-medium">Name*</label>
                <input
                  name="name"
                  value={addressForm.name}
                  onChange={handleAddressField}
                  required
                  className="w-full border rounded-lg px-4 py-3 mt-2"
                />
              </div>
              <div>
                <label className="text-4xl font-medium">Pincode*</label>
                <input
                  name="pincode"
                  value={addressForm.pincode}
                  onChange={handleAddressField}
                  required
                  maxLength={6}
                  className="w-full border rounded-lg px-4 py-3 mt-2"
                />
              </div>
              <div>
                <label className="text-4xl font-medium">Address 1*</label>
                <input
                  name="address_line1"
                  value={addressForm.address_line1}
                  onChange={handleAddressField}
                  required
                  className="w-full border rounded-lg px-4 py-3 mt-2"
                />
              </div>
              <div>
                <label className="text-4xl font-medium">Address 2*</label>
                <input
                  name="address_line2"
                  value={addressForm.address_line2}
                  onChange={handleAddressField}
                  required
                  className="w-full border rounded-lg px-4 py-3 mt-2"
                />
              </div>
              <div>
                <label className="text-4xl font-medium">State*</label>
                <input
                  name="state"
                  value="Tamil Nadu"
                  disabled
                  className="w-full border rounded-lg px-4 py-3 mt-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="text-4xl font-medium">City*</label>
                <input
                  name="city"
                  value="CHENNAI"
                  disabled
                  className="w-full border rounded-lg px-4 py-3 mt-2 bg-gray-100"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 my-5 text-gray-700">
              <input
                type="checkbox"
                name="is_default"
                checked={addressForm.is_default}
                onChange={handleAddressField}
              />
              Set as default address
            </label>

            <button
              type="submit"
              disabled={savingAddress}
              className="w-full bg-green-700 text-white py-4 rounded-lg text-2xl font-semibold hover:bg-green-800 disabled:bg-green-400"
            >
              {savingAddress ? 'Saving...' : addressForm.id ? 'Update Address' : 'Add Address'}
            </button>
          </form>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleProfileSave}
            className="bg-white rounded-xl w-full max-w-xl p-8 relative"
          >
            <button
              type="button"
              onClick={closeProfileModal}
              className="absolute right-6 top-5 text-4xl text-gray-600 hover:text-black"
            >
              ×
            </button>

            <h3 className="text-4xl font-semibold mb-6">Edit Profile</h3>

            <div className="space-y-4">
              <div>
                <label className="text-lg font-medium">Full Name</label>
                <input
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, full_name: e.target.value }))}
                  className="w-full border rounded-lg px-4 py-3 mt-2"
                  required
                />
              </div>

              <div>
                <label className="text-lg font-medium">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full border rounded-lg px-4 py-3 mt-2"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg text-xl font-semibold hover:bg-blue-700 disabled:bg-blue-300"
            >
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
