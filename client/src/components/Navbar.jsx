import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">CareerQuest</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/assessment">Assessment</Link></li>
          <li><Link to="/careers">Careers</Link></li>
          <li><Link to="/roadmaps">Roadmaps</Link></li>
          <li><Link to="/colleges">Colleges</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
