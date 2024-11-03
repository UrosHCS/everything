import ProfileButtonDropdown from './profile/ProfileButtonDropdown';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { ThemeSelector } from './ui/theme-selector';
import Link from 'next/link';

export function Header() {
  const cls = navigationMenuTriggerStyle();

  return (
    <>
      <header className="border-b p-1">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={cls}>CHAT</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuList>
            <NavigationMenuItem>
              <ThemeSelector />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <ProfileButtonDropdown />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>
    </>
  );
}
