'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  // 現在のパス（URL）を取得
  const pathname = usePathname();
  
  // リンクがアクティブかどうかを判定する関数
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex gap-6 text-white">
        <Link 
          href="/"
          className={`${isActive('/') ? 'font-bold underline' : ''} hover:underline`}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={`${isActive('/about') ? 'font-bold underline' : ''} hover:underline`}
        >
          About
        </Link>
        <Link
          href="/contact"
          className={`${isActive('/contact') ? 'font-bold underline' : ''} hover:underline`}
        >
          Contact
        </Link>
        <Link
          href="/blog"
          className={`${isActive('/blog') ? 'font-bold underline' : ''} hover:underline`}
        >
          Blog
        </Link>
      </div>
    </nav>
  );
}
