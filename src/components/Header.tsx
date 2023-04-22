import { NavItem } from './NavItem';
import LoginOrProfile from './profile/LoginOrProfile';

export function Header() {
  return (
    <>
      <header className="sticky inset-x-0 top-0">
        <nav className="flex items-center justify-between bg-slate-800 p-2">
          <div className="drop relative lg:static">
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
            <ul className="drop-items invisible absolute mt-3 flex flex-col gap-2 rounded bg-slate-800 p-1 shadow lg:visible lg:static lg:mt-0 lg:flex-row lg:p-0">
              <li>
                <NavItem href="/">EVERYTHING</NavItem>
              </li>
              <li>
                <NavItem href="/about">About</NavItem>
              </li>
              <li>
                <NavItem href="/contact">Contact</NavItem>
              </li>
            </ul>
          </div>
          <LoginOrProfile />
        </nav>
      </header>
    </>
  );
}
