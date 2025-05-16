import { Menu, Search, ShoppingCart } from 'lucide-react';

const Header = () => (
  <header className="flex justify-between items-center px-4 py-3 bg-white shadow">
    <Menu className="w-6 h-6" />
    <img src="/logo.svg" alt="Custom Love" className="h-8" />
    <div className="flex gap-4">
      <Search className="w-6 h-6" />
      <ShoppingCart className="w-6 h-6" />
    </div>
  </header>
);
