import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    } from "@/components/ui/navigation-menu"

    export default function NavMenu() {
        return (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Placeholder</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="/#">Placeholder Link</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
      
              <NavigationMenuItem>
                <NavigationMenuTrigger>FAQ</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="/#">FAQ Link</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        );
      }