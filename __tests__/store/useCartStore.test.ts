import { useCartStore } from '../../src/store/useCartStore';

describe('useCartStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useCartStore.setState({
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      discount: 0,
      total: 0,
    });
  });

  it('starts with an empty cart', () => {
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.total).toBe(0);
  });

  it('adds an item to the cart', () => {
    const { addToCart } = useCartStore.getState();
    
    addToCart({
      productId: 'p-1',
      size: 10,
      quantity: 1,
      price: 100,
    });

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].productId).toBe('p-1');
    expect(state.items[0].quantity).toBe(1);
    expect(state.subtotal).toBe(100);
    expect(state.deliveryFee).toBe(15);
    expect(state.total).toBe(115);
  });

  it('increases quantity if same product and size are added again', () => {
    const { addToCart } = useCartStore.getState();
    
    addToCart({ productId: 'p-1', size: 10, quantity: 1, price: 100 });
    addToCart({ productId: 'p-1', size: 10, quantity: 2, price: 100 });

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
    expect(state.subtotal).toBe(300);
    expect(state.total).toBe(315);
  });

  it('adds a separate item if size is different', () => {
    const { addToCart } = useCartStore.getState();
    
    addToCart({ productId: 'p-1', size: 10, quantity: 1, price: 100 });
    addToCart({ productId: 'p-1', size: 11, quantity: 1, price: 100 });

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(2);
    expect(state.subtotal).toBe(200);
    expect(state.total).toBe(215);
  });

  it('removes an item from the cart', () => {
    const { addToCart, removeFromCart } = useCartStore.getState();
    
    addToCart({ productId: 'p-1', size: 10, quantity: 1, price: 100 });
    removeFromCart('p-1', 10);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.total).toBe(0);
    expect(state.deliveryFee).toBe(0);
  });

  it('increases and decreases quantity', () => {
    const { addToCart, increaseQuantity, decreaseQuantity } = useCartStore.getState();
    
    addToCart({ productId: 'p-1', size: 10, quantity: 1, price: 100 });
    
    increaseQuantity('p-1', 10);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
    expect(useCartStore.getState().subtotal).toBe(200);

    decreaseQuantity('p-1', 10);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
    expect(useCartStore.getState().subtotal).toBe(100);

    // Should not decrease below 1
    decreaseQuantity('p-1', 10);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it('clears the cart', () => {
    const { addToCart, clearCart } = useCartStore.getState();
    
    addToCart({ productId: 'p-1', size: 10, quantity: 1, price: 100 });
    addToCart({ productId: 'p-2', size: 9, quantity: 1, price: 200 });
    
    clearCart();

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.total).toBe(0);
  });
});
