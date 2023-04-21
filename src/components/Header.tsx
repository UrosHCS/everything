import LoginOrProfile from './LoginOrProfile';
import { NavItem } from './NavItem';
import './header.css';

export function Header() {
  return (
    <>
      <header className="sticky inset-x-0 top-0">
        <nav className="flex justify-between bg-slate-800 p-2">
          <div className="burger relative lg:static">
            <button className="btn-ghost btn-circle btn lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
            <ul className="nav-items invisible absolute mt-3 flex flex-col rounded bg-slate-800 p-1 shadow lg:visible lg:static lg:mt-0 lg:flex-row lg:p-0">
              <NavItem href="/">EVERYTHING</NavItem>
              <NavItem href="/about">About</NavItem>
              <NavItem href="/contact">Contact</NavItem>
            </ul>
          </div>
          <LoginOrProfile />
        </nav>
      </header>
    </>
  );
}
