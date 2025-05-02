import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  return (
    <header className="bg-dark-bg border-b border-gray-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-saffron font-display font-bold text-xl">DIT</span>
          <div className="h-5 w-0.5 bg-gray-700"></div>
          <span className="text-light-text text-sm font-medium">Das InfoSec Toolkit</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#tools" className="text-light-text hover:text-cyber-blue text-sm transition-colors">Tools</a>
          <a href="#about" className="text-light-text hover:text-cyber-blue text-sm transition-colors">About</a>
          <a href="#contact" className="text-light-text hover:text-cyber-blue text-sm transition-colors">Contact</a>
        </nav>
        
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden text-gray-400 hover:text-white">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-dark-bg border-l border-gray-800 w-[250px] p-0">
            <div className="flex flex-col p-4 gap-4">
              <div className="flex items-center space-x-2 border-b border-gray-800 pb-4 mb-2">
                <span className="text-saffron font-display font-bold text-xl">DIT</span>
                <div className="h-5 w-0.5 bg-gray-700"></div>
                <span className="text-light-text text-sm font-medium">Das InfoSec Toolkit</span>
              </div>
              <a href="#tools" className="text-light-text hover:text-cyber-blue transition-colors py-2">
                Tools
              </a>
              <a href="#about" className="text-light-text hover:text-cyber-blue transition-colors py-2">
                About
              </a>
              <a href="#contact" className="text-light-text hover:text-cyber-blue transition-colors py-2">
                Contact
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
