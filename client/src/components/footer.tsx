export default function Footer() {
  return (
    <footer className="bg-dark-bg border-t border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-saffron font-display font-bold text-xl mr-2">DIT</span>
            <div className="h-5 w-0.5 bg-gray-700 mr-2"></div>
            <span className="text-light-text text-sm">Das InfoSec Toolkit</span>
          </div>
          <div className="text-sm text-muted-text">
            © 2025 Das InfoSec. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
