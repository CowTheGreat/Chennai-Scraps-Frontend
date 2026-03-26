const CART_KEY_PREFIX = 'cs_cart_v1_';

const safeParse = (value) => {
  try {
    return JSON.parse(value || '[]');
  } catch {
    return [];
  }
};

const getUserCartKey = () => {
  const phone = localStorage.getItem('phone') || 'guest';
  return `${CART_KEY_PREFIX}${phone}`;
};

export const getCartItems = () => {
  const key = getUserCartKey();
  return safeParse(localStorage.getItem(key));
};

export const setCartItems = (items) => {
  const key = getUserCartKey();
  localStorage.setItem(key, JSON.stringify(items));
};

const signatureFor = (item) => {
  const pairs = Object.entries(item.field_values || {}).sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify({ category_id: item.category_id, field_values: pairs });
};

export const addCartItem = (item) => {
  const items = getCartItems();
  const incomingSig = signatureFor(item);
  const existingIndex = items.findIndex((entry) => signatureFor(entry) === incomingSig);

  if (existingIndex >= 0) {
    const next = [...items];
    const currentQty = Number(next[existingIndex].quantity || 1);
    const addQty = Number(item.quantity || 1);
    next[existingIndex] = {
      ...next[existingIndex],
      quantity: currentQty + addQty,
      line_total: (currentQty + addQty) * Number(next[existingIndex].category_price_snapshot || 0),
    };
    setCartItems(next);
    return next;
  }

  const price = Number(item.category_price_snapshot || 0);
  const quantity = Number(item.quantity || 1);
  const created = {
    ...item,
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    quantity,
    line_total: price * quantity,
    added_at: new Date().toISOString(),
  };
  const next = [...items, created];
  setCartItems(next);
  return next;
};

export const updateCartItemQuantity = (id, quantity) => {
  const qty = Math.max(1, Number(quantity || 1));
  const items = getCartItems().map((item) => {
    if (item.id !== id) return item;
    const price = Number(item.category_price_snapshot || 0);
    return {
      ...item,
      quantity: qty,
      line_total: price * qty,
    };
  });
  setCartItems(items);
  return items;
};

export const removeCartItem = (id) => {
  const items = getCartItems().filter((item) => item.id !== id);
  setCartItems(items);
  return items;
};

export const clearCart = () => {
  setCartItems([]);
};
