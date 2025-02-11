import React, { useState } from 'react'

function FilterBy() {
  const [showCount, setShowCount] = useState('9');
  const [sortBy, setSortBy] = useState('menu_order');

  return (
    <div className="toolbox d-flex align-items-center mb-3 gap-2 border p-3">
      <div className="d-flex flex-wrap flex-grow-1 gap-1">
        <div className="d-flex align-items-center flex-nowrap">
          <p className="mb-0 font-13 text-nowrap">Show:</p>
          <select 
            className="form-select ms-3 rounded-0"
            value={showCount}
            onChange={(e) => setShowCount(e.target.value)}
          >
            <option value="9">9</option>
            <option value="12">12</option>
            <option value="16">16</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
      <div className="d-flex flex-wrap">
        <div className="d-flex align-items-center flex-nowrap">
          <p className="mb-0 font-13 text-nowrap">Sort By:</p>
          <select 
            className="form-select ms-3 rounded-0"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="menu_order">Sort by New</option>
            <option value="popularity">Sort by popularity</option>
            <option value="price">Sort by price: low to high</option>
            <option value="price-desc">Sort by price: high to low</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default FilterBy