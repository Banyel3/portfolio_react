import { Link } from "react-scroll";

function NavBar() {
  const user = localStorage.getItem("username");
  return (
    <div className="navbar bg-base-100 shadow-sm w-full justify-between fixed top-0 z-10">
      <div className="flex-none ml-30">
        <a className="btn btn-ghost text-xl" href="#">
          daisyUI | Hello {user}
        </a>
      </div>
      <div className="flex-none mr-30">
        <ul className="menu menu-horizontal px-1 font-[Montserrat]">
          <li>
            <Link to="Home" smooth={true} spy={true} offset={-50}>
              Home
            </Link>
          </li>
          <li>
            <Link to="About" smooth={true} spy={true} offset={-50}>
              About
            </Link>
          </li>
          <li>
            <Link to="Certs" smooth={true} spy={true} offset={-50}>
              Certifications
            </Link>
          </li>
          <li>
            <Link to="Events" smooth={true} spy={true} offset={-50}>
              Events
            </Link>
          </li>
          <li>
            <Link to="Contact" smooth={true} spy={true} offset={-50}>
              Contact
            </Link>
          </li>
          {/* <li>
        <details>
          <summary>Parent</summary>
          <ul className="bg-base-100 rounded-t-none p-2">
            <li><a>Link 1</a></li>
            <li><a>Link 2</a></li>
          </ul>
        </details>
      </li> */}
        </ul>
      </div>
    </div>
  );
}

export default NavBar;
