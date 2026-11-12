import React from 'react';

interface NavbarProps {
  currentSlideIndex: number;
  cartCount: number;
  onNavClick: (index: number) => void;
  onOpenCart: () => void;
}

const NAV_ITEMS = [
  { label: 'Overview', slideIndex: 0 },
  { label: 'Origin', slideIndex: 1 },
  { label: 'Analysis', slideIndex: 2 },
  { label: 'Vessel', slideIndex: 3 },
  { label: 'Allocations', slideIndex: 4 }
];

export const Navbar: React.FC<NavbarProps> = ({
  currentSlideIndex,
  cartCount,
  onNavClick,
  onOpenCart
}) => {
  return (
    <header className="navbar">
      <div className="nav-container">
        <a
          href="#hero"
          className="nav-brand"
          onClick={(e) => {
            e.preventDefault();
            onNavClick(0);
          }}
          aria-label="Glacier Home"
        >
          <span className="brand-title">GLACIER</span>
        </a>

        <nav className="nav-links" aria-label="Section Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = currentSlideIndex === item.slideIndex;
            return (
              <button
                key={item.label}
                type="button"
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => onNavClick(item.slideIndex)}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="cart-link"
            onClick={onOpenCart}
            aria-label={`Open Shopping Bag, ${cartCount} items`}
          >
            <span>Bag</span>
            <span className="cart-counter">[{cartCount}]</span>
          </button>
        </div>
      </div>
    </header>
  );
};

