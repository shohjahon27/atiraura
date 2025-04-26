"use client";

import { ClerkLoaded, SignedIn, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";
import useBasketStore from "@/sanity/lib/store";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

function Header() {
  const { user } = useUser();
  const router = useRouter();
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

interface SearchFormData extends FormData {
   get(name: "query"): FormDataEntryValue | null;
}

const handleSearchSubmit = (formData: SearchFormData) => {
   const query = formData.get("query");
   if (typeof query === "string" && query.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(query)}`);
   }
   setIsSearchOpen(false);
};

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-5 py-3 flex items-center justify-between">
          {/* Burger Button (Visible on Mobile) */}
        <button
          className="sm:hidden text-gray-800 focus:outline-none cursor-pointer"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-pink-600 hover:opacity-80 transition">
            atiraura
          </Link>

        {/* Navigation Links (Visible on Desktop, Hidden on Mobile unless Menu is Open) */}
        <nav
          className={`${
            isMenuOpen ? "block" : "hidden"
          } sm:block absolute sm:static top-16 left-0 w-full sm:w-auto bg-white sm:bg-transparent shadow-md sm:shadow-none z-10`}
        >
          <ul
            className={`flex flex-col sm:flex-row sm:space-x-6 px-4 sm:px-0 py-4 sm:py-0 ${
              isMenuOpen ? "space-y-4" : ""
            }`}
          >
            <li>
              <Link
                href="/"
                className="text-gray-800 hover:text-pink-600 transition-colors text-lg sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="text-gray-800 hover:text-pink-600 transition-colors text-lg sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-gray-800 hover:text-pink-600 transition-colors text-lg sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-800 hover:text-pink-600 transition-colors text-lg sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/wishlist"
                className="text-gray-800 hover:text-pink-600 transition-colors text-lg sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                ❤️ Wishlist
              </Link>
            </li>
          </ul>
        </nav>

          {/* Right Section: Search, Basket, Orders, Sign In/User */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button onClick={toggleSearch} className="text-gray-600 hover:text-blue-500 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Basket Icon */}
            <Link href="/basket" className="relative">
              <TrolleyIcon className="w-6 h-6 text-gray-600 hover:text-blue-500 transition" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Orders Icon (Visible only when signed in) */}
            <SignedIn>
              <Link href="/orders">
                <PackageIcon className="w-6 h-6 text-gray-600 hover:text-blue-500 transition" />
              </Link>
            </SignedIn>

            {/* Sign In/User (Moved to the end) */}
            <ClerkLoaded>
              {user ? (
                <div className="flex items-center space-x-2">
                  <UserButton />
                  <div className="hidden sm:block text-xs">
                    <p className="text-gray-400">Xush kelibsiz!</p>
                    <p className="font-bold">{user.fullName}!</p>
                  </div>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </ClerkLoaded>
          </div>
        </div>

        {/* Search Bar (Appears below the header when toggled) */}
        {isSearchOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md z-40">
            <div className="container mx-auto px-4 py-3">
              <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(new FormData(e.target as HTMLFormElement)); }} className="w-full">
                <input
                  type="text"
                  name="query"
                  placeholder="maxsulotni qidiring"
                  className="w-full max-w-4xl mx-auto block bg-gray-100 text-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 transition"
                />
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent content from being hidden under the fixed header */}
      <div className="h-16"></div>

      {/* Banner Section */}
      {/* <section className="bg-gradient-to-r from-red-500 to-black text-white text-center py-6 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold">barcha atirlarga chegirma</h2>
        <p className="text-lg sm:text-xl mt-2">barcha atirlarga sezilarli chegirma ulgurib qoling!</p>
        <p className="mt-4 bg-white text-black inline-block px-6 py-2 rounded-full font-semibold">
          Promo Code: BFRIDAY 25% chegirma
        </p>
      </section> */}
    </>
    
  );
  
}

export default Header;