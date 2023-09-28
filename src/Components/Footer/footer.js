import React from 'react'
import './footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return(
    <footer>
      <p>&copy; {currentYear} VND LLC</p>
    </footer>
  )
}

export default Footer