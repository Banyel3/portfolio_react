function NavBar(){
    return (
      <div className="navbar bg-base-100 shadow-sm w-full justify-between sticky">
  <div className="flex-none ml-30">
    <a className="btn btn-ghost text-xl" href="/home">daisyUI</a>
  </div>
  <div className="flex-none mr-30">
    <ul className="menu menu-horizontal px-1 font-[Montserrat]">
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#certs">Certifications</a></li>
      <li><a href="#events">Events</a></li>
      <li><a href="#contact">Contact</a></li>
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
