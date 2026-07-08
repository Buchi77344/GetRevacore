import { useLocation } from 'react-router-dom'
// import { useAuth } from '../../hooks/useAuth'
import '../styles/Navbar.css'

const Navbar = () => {
  // const { user, signOut } = useAuth()
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-title">
          <h2>Feszora</h2>
        </div>
        <div className="navbar-center">
          <span>Current Path: {location.pathname}</span>
        </div>
        <div className="navbar-right">
          {/* {user ? (
            <>
              <span className="user-email">{(user as { email?: string }).email}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="login-link">
              Login
            </Link>
          )} */}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
