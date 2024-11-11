export function getItemFromLocalStorage(item: string, type: any) {
  let storedItem = localStorage.getItem(item);
  if (storedItem) {
    return JSON.parse(storedItem);
  }
  return type;
}

export function computeTotalFromCart() {
  const cart = getItemFromLocalStorage('cart', {});
  if (cart) {
    let total = 0.0;
    Object.entries(cart).forEach(([key, cartItem]: any) => {
      total += cartItem.price * cartItem.quantity;
    });
    return total;
  }
  return 0.0;
}

export function setItemToLocalStorage(itemName: string, item: any) {
  localStorage.setItem(itemName, JSON.stringify(item));
}

export function removeItemFromLocalStorage(itemName: string) {
  localStorage.removeItem(itemName);
}
