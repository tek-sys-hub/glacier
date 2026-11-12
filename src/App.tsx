import React, { useState, useEffect } from 'react';
import { useScrollNavigation } from './hooks/useScrollNavigation';
import { useFramePreloader } from './hooks/useFramePreloader';
import { WaterDropPreloader } from './components/WaterDropPreloader';
import { BottleCanvas } from './components/BottleCanvas';
import { CircularDome } from './components/CircularDome';
import { Navbar } from './components/Navbar';
import { ContentStage } from './components/ContentStage';
import { CartDrawer } from './components/CartDrawer';
import { CartItem, AllocationProduct } from './types';
import './styles/glacier.css';

export const App: React.FC = () => {
  const {
    currentSlideIndex,
    virtualProgress,
    goToSlide
  } = useScrollNavigation();
  const { frames, isLoaded, loadedCount, totalKeyframes } = useFramePreloader();

  const [isPreloaderActive, setIsPreloaderActive] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Close cart on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen]);

  const handleReserve = (product: AllocationProduct) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          format: product.format,
          price: product.price,
          quantity: 1,
          image: product.image
        }
      ];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your bag is currently empty. Please select an allocation first.');
      return;
    }
    alert(
      'Thank you for reserving GLACIER. Your private concierge will confirm delivery coordinates.'
    );
    setCart([]);
    setIsCartOpen(false);
  };

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Bespoke Water Droplet Preloader */}
      {isPreloaderActive && (
        <WaterDropPreloader
          isLoaded={isLoaded}
          loadedCount={loadedCount}
          totalKeyframes={totalKeyframes}
          onComplete={() => setIsPreloaderActive(false)}
        />
      )}

      {/* Fixed Viewport Stage: Right-pinned bottle & refined circular fog dome */}
      <div className="fixed-stage-wrap">
        <BottleCanvas
          virtualProgress={virtualProgress}
          frames={frames}
          isLoaded={isLoaded}
        />
        <CircularDome />
      </div>

      {/* 100% Transparent Luxury Editorial Navbar */}
      <Navbar
        currentSlideIndex={currentSlideIndex}
        cartCount={totalItemCount}
        onNavClick={goToSlide}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Discrete Slide Content Stage with zero trampoline / zero spring bounce */}
      <ContentStage
        virtualProgress={virtualProgress}
        onReserve={handleReserve}
      />

      {/* Shopping Bag Slide-out Panel */}
      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />
    </>
  );
};

export default App;

