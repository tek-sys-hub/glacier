import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  onClose,
  onUpdateQuantity,
  onCheckout
}) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <aside className={`cart-drawer ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
      <div className="cart-backdrop" onClick={onClose} />
      <div className="cart-panel">
        <div className="cart-header">
          <h3 className="cart-heading">Your Selection</h3>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close Shopping Bag"
          >
            ×
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-text">Your bag is currently empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-card">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-card-img"
                  />
                )}
                <div className="cart-card-info">
                  <div className="cart-card-name">{item.name}</div>
                  <div className="cart-card-price">${item.price} each</div>
                </div>
                <div className="cart-qty-ctrl">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    aria-label={`Decrease ${item.name}`}
                  >
                    −
                  </button>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      width: '18px',
                      textAlign: 'center'
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    aria-label={`Increase ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total-row">
            <span>Subtotal</span>
            <span className="price-strong">${subtotal}</span>
          </div>
          <p className="shipping-note">
            Complimentary temperature-controlled courier delivery.
          </p>
          <button
            type="button"
            className="checkout-btn"
            onClick={onCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </aside>
  );
};

