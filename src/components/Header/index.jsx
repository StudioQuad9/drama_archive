export default function Header() {
  return (
    <div className="header">
        <div className="navigation inner flex">
          <div>
            <h1><img src="pict/logo.svg" alt="" height="35" /></h1>
          </div>

          <button className="menu-button">
            <span className="material-symbols-outlined">menu</span>
          </button>

          <nav className="menu">
            <ul className="flex">
              <li><a href="#featured">Featured</a></li>
              <li><a href="#dramas">Dramas</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </nav>

          <nav className="pc-menu">
            <ul className="flex">
              <li><a href="#featured">Featured</a></li>
              <li><a href="#dramas">Dramas</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </nav>

        </div>
    </div>
  );  
}