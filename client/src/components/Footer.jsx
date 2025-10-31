import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="site-footer">
      <p>&copy; 2025 SmartChef. All rights reserved.</p>
      <p className="footer-links">
        <Link to="/about">About</Link> •
        <Link to="/planner">Meal Planner</Link> •
        <a href="#">Privacy Policy</a> •
        <a href="#">Terms of Service</a>
      </p>
      <div className="social-links">
        <a href="#"><i className="fab fa-facebook"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
        <a href="#"><i className="fab fa-pinterest"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
      </div>
    </footer>
  )
}

export default Footer

