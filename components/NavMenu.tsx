"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

import { createClient } from "@/utils/supabase/client";

export default function NavMenu() {
  const supabase = createClient();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        {/* Left: Logo & Name */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/light-icon.svg"
            alt="Osprey Chat Logo"
            width={32}
            height={32}
            className="cursor-pointer"
            priority
          />
          <span className="text-lg font-semibold text-gray-900">Osprey Chat</span>
        </Link>

        {/* Mobile Menu Button (Hamburger Icon) */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-4">
              
              {/* Courses Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium transition-colors hover:text-gray-700">
                  Courses
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-2">
                  <NavigationMenuLink
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    View Courses
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Join a Course Chatroom
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>

          {/* Logout Button (Desktop) */}
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="flex flex-col items-center space-y-4 border-t border-gray-200 p-4 md:hidden">
          <Link href="/courses" className="text-base font-medium text-gray-700 transition-colors hover:text-gray-900">
            Courses
          </Link>
          {/* Logout Button (Mobile) */}
          <button
            onClick={handleLogout}
            className="w-full rounded border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}