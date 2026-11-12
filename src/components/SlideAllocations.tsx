import React, { useState } from 'react';
import { ALLOCATION_PRODUCTS } from '../data/glacierData';
import { AllocationProduct } from '../types';

interface SlideAllocationsProps {
  opacity: number;
  isActive: boolean;
  onReserve: (product: AllocationProduct) => void;
}

export const SlideAllocations: React.FC<SlideAllocationsProps> = ({
  opacity,
  isActive,
  onReserve
}) => {
  const [justReservedId, setJustReservedId] = useState<string | null>(null);

  const handleReserve = (product: AllocationProduct) => {
    onReserve(product);
    setJustReservedId(product.id);
    setTimeout(() => {
      setJustReservedId((curr) => (curr === product.id ? null : curr));
    }, 1400);
  };

  return (
    <div
      id="slide-4"
      className={`content-slide ${isActive ? 'active' : ''}`}
      style={{
        opacity,
        pointerEvents: opacity > 0.4 ? 'auto' : 'none'
      }}
    >
      <div className="slide-inner">
        <div className="slide-meta-row">
          <span className="slide-tag">04 / Cellar Allocations</span>
          <span className="editorial-meta">Limited Release</span>
        </div>
        <h2 className="slide-title">Select Allocation</h2>
        <p className="slide-text">
          Best served chilled at −1°C over clear glacial ice. Select your allocation for insulated courier dispatch:
        </p>

        <div className="tabulate-wrap">
          <table className="tabulate-table order-table">
            <thead>
              <tr>
                <th style={{ width: '36%' }}>Expression</th>
                <th style={{ width: '28%' }}>Format Spec</th>
                <th style={{ width: '16%' }}>Allocation</th>
                <th style={{ width: '20%', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {ALLOCATION_PRODUCTS.map((prod) => {
                const isReserved = justReservedId === prod.id;
                return (
                  <tr key={prod.id}>
                    <td>
                      <div className="cell-primary">{prod.name}</div>
                      <div className="cell-sub">{prod.sub}</div>
                    </td>
                    <td>
                      <span className="spec-note">{prod.format}</span>
                    </td>
                    <td>
                      <strong className="price-strong">${prod.price}</strong>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="reserve-btn"
                        style={
                          isReserved
                            ? { background: '#090e17', color: '#ffffff' }
                            : undefined
                        }
                        onClick={() => handleReserve(prod)}
                      >
                        {isReserved ? 'Reserved ✓' : 'Reserve'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

