export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-dark-bg circuit-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-dark-card border border-gray-800 rounded-lg p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 tricolor-bar"></div>
          <h2 className="text-3xl font-display font-bold text-white mb-6 text-center">About Das InfoSec</h2>
          <p className="text-muted-text mb-6 text-center">
            At Das InfoSec, we're on a mission to build a more cyber-secure Digital India. The Das InfoSec Toolkit (DIT) is a free, easy-to-use security toolkit built to help everyday users understand, protect, and take control of their digital lives. Thoughtfully crafted by Sovan Das. DIT is here to make cybersecurity simple and accessible for everyone.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-dark-bg p-6 rounded-lg border border-gray-800 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-saffron mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-lg font-display font-medium text-white mb-2">Security First</h3>
              <p className="text-sm text-muted-text">All tools operate client-side whenever possible to protect your privacy.</p>
            </div>
            <div className="bg-dark-bg p-6 rounded-lg border border-gray-800 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-display font-medium text-white mb-2">Accessible</h3>
              <p className="text-sm text-muted-text">Designed to be user-friendly for everyone, regardless of technical knowledge.</p>
            </div>
            <div className="bg-dark-bg p-6 rounded-lg border border-gray-800 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indian-green mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-lg font-display font-medium text-white mb-2">Made in India</h3>
              <p className="text-sm text-muted-text">Proudly developed to strengthen cybersecurity awareness and skills across India.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
