import React from 'react'
import headLogo from '../../images/qd-logo.PNG'
import '../Header/header.css'

const Header = ({onSearch}) => {
  const handleSearch = (e) => {
    onSearch(e.target.value)
  }
  return(
    <div className="header-container">
      <img 
        className="head-logo"
        src={headLogo} 
        alt="Quote dictionary head logo"
      />
      <input
        className="search-input"
        type="text"
        placeholder="Search clients"
        onChange={handleSearch}
      />
    </div>
  )
}
export default Header