import { NavItem } from './NavItem';

export function Header() {
  return (
    <>
      <header className="fixed inset-x-0 top-0">
        <nav className="flex justify-stretch p-2 bg-slate-800">
          <label tabIndex={0} className="burger btn btn-ghost btn-circle lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </label>
          <div className="nav-items">
            <div className="flex gap-1 w-full overflow-x-auto">
              <NavItem href="/">EVERYTHING</NavItem>
              <NavItem href="/about">About</NavItem>
              <NavItem href="/contact">Contact</NavItem>
            </div>
          </div>
          <div className="">
            <NavItem href="/login">Login</NavItem>
          </div>
        </nav>
      </header>
      <div className="mt-16"></div>
    </>
  );
}
