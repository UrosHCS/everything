import { NavItem } from './NavItem';
import Link from 'next/link';

export function Header() {
  return (
    <>
      <header className="sticky inset-x-0 top-0">
        <nav className="flex justify-between p-2 bg-slate-800">
          <div className="burger relative lg:static">
            <button className="btn btn-ghost btn-circle lg:hidden">
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
            <ul className="nav-items mt-3 lg:mt-0 p-1 lg:p-0 shadow bg-slate-800 rounded invisible absolute lg:visible lg:static flex flex-col lg:flex-row">
              <NavItem href="/">EVERYTHING</NavItem>
              <NavItem href="/about">About</NavItem>
              <NavItem href="/contact">Contact</NavItem>
            </ul>
          </div>
          <div className="">
            <Link href="/login" className="btn btn-ghost normal-case text-xl">
              Login
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
