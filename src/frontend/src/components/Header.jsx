function Header() {
  return (
    <nav className="top-nav">
      <div className="brand-lockup">
        <div className="logo-mark">SS</div>
        <div>
          <strong>SignalScope</strong>
          <span>Market News + Forecast Dashboard</span>
        </div>
      </div>
      <div className="nav-links">
        <a href="#forecast">Forecast</a>
        <a href="#news">News</a>
        <a href="#methodology">Methodology</a>
      </div>
    </nav>
  );
}

export default Header;
