import React from 'react';
import { MatrixRow } from '../types';

interface SlideTableProps {
  id: string;
  opacity: number;
  isActive: boolean;
  tag?: string;
  meta?: string;
  title: string;
  text: string;
  colHeaders: [string, string, string];
  rows: MatrixRow[];
}

export const SlideTable: React.FC<SlideTableProps> = ({
  id,
  opacity,
  isActive,
  tag,
  meta,
  title,
  text,
  colHeaders,
  rows
}) => {
  return (
    <div
      id={id}
      className={`content-slide ${isActive ? 'active' : ''}`}
      style={{
        opacity,
        pointerEvents: opacity > 0.4 ? 'auto' : 'none'
      }}
    >
      <div className="slide-inner">
        {(tag || meta) && (
          <div className="slide-meta-row">
            {tag && <span className="slide-tag">{tag}</span>}
            {meta && <span className="editorial-meta">{meta}</span>}
          </div>
        )}
        <h2 className="slide-title">{title}</h2>
        <p className="slide-text">{text}</p>

        <div className="tabulate-wrap">
          <table className="tabulate-table">
            <thead>
              <tr>
                <th style={{ width: '36%' }}>{colHeaders[0]}</th>
                <th style={{ width: '28%' }}>{colHeaders[1]}</th>
                <th style={{ width: '36%' }}>{colHeaders[2]}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="cell-primary">{row.primary}</div>
                    <div className="cell-sub">{row.sub}</div>
                  </td>
                  <td>
                    <span className={`data-val ${row.color || ''}`}>
                      {row.assay}
                    </span>
                  </td>
                  <td>{row.mechanism}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
