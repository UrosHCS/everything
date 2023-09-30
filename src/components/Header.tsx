import ProfileButtonDropdown from './profile/ProfileButtonDropdown';
import { ModeToggle } from './ui/mode-toggle';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
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
                <NavigationMenuLink className={cls}>EVERYTHING</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/chat" legacyBehavior passHref>
                <NavigationMenuLink className={cls}>Chat</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={cls}>About</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuList>
            <NavigationMenuItem>
              <ModeToggle />
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
