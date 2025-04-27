'use client';

import { ClerkLoaded, SignedIn, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";
import useBasketStore from "@/sanity/lib/store";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/app/(store)/wishlistStore";

function Header() {
  const { user } = useUser();
  const router = useRouter();
  const { items: wishlist } = useWishlistStore();
  const basketItems = useBasketStore((state) => state.items);
  const [wishlistCount, setWishlistCount] = useState(0); // Initialize to 0 for SSR
  const [basketCount, setBasketCount] = useState(0); // Initialize to 0 for SSR
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Update counts on the client side after hydration
  useEffect(() => {
    // Update wishlist count
    setWishlistCount(wishlist.length);
    // Update basket count
    const totalBasketItems = basketItems.reduce((total, item) => total + item.quantity, 0);
    setBasketCount(totalBasketItems);
  }, [wishlist, basketItems]); // Re-run when wishlist or basketItems change

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
            </ul>
          </nav>

          {/* Right Section: Search, Wishlist, Basket, Orders, Sign In/User */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button onClick={toggleSearch} className="text-gray-600 hover:text-blue-500 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist Icon with Count */}
            <Link href="/wishlist" className="relative">
              <Heart className="w-6 h-6 text-gray-600 hover:text-blue-500 transition" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Basket Icon with Count */}
            <Link href="/basket" className="relative">
              <TrolleyIcon className="w-6 h-6 text-gray-600 hover:text-blue-500 transition" />
              {basketCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {basketCount}
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
    </>
  );
}

export default Header;