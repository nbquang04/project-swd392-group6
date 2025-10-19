
import React from 'react';

export default function Pagination({ page=0, totalPages=1, onPageChange }){
  const prev = () => onPageChange(Math.max(0, page-1));
  const next = () => onPageChange(Math.min(totalPages-1, page+1));
  return (
    <div className="d-flex align-items-center gap-2 my-3">
      <button onClick={prev} disabled={page<=0} className="btn btn-outline-secondary btn-sm">Trang trước</button>
      <span>Trang {page+1} / {totalPages}</span>
      <button onClick={next} disabled={page>=totalPages-1} className="btn btn-outline-secondary btn-sm">Trang sau</button>
    </div>
  );
}
