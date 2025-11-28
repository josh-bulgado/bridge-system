const About = () => {
  return (
    <section 
      id="about" 
      className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-b from-white via-blue-50/30 to-green-50/30 dark:from-muted/30 dark:via-muted/20 dark:to-muted/10 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-20 w-48 sm:w-64 h-48 sm:h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-20 w-56 sm:w-80 h-56 sm:h-80 bg-green-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <p className="text-primary font-bold text-xs sm:text-sm uppercase tracking-wider mb-2 inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full">
            About BRIDGE
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 sm:mt-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent px-4">
            Discover Our Platform
          </h2>
        </div>
        
        <div className="group relative bg-white dark:bg-card rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 border-2 border-blue-100 dark:border-border transition-all duration-500 hover:scale-[1.02] animate-fade-in-up overflow-hidden" style={{animationDelay: '0.2s'}}>
          <div className="absolute -top-6 -right-6 w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
          <div className="absolute -bottom-6 -left-6 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-tr from-blue-400 to-cyan-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
          
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 dark:text-muted-foreground text-center max-w-4xl mx-auto relative">
            The BRIDGE System, also known as the <span className="font-bold text-primary bg-primary/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded inline-block">Barangay Request Information and
            Document Gateway for E-Services</span>, is a digital platform that simplifies
            transactions between the barangay government and citizens. With a vision
            to build a connected nation, the platform integrates the most
            sought-after barangay document services into one online system that will
            minimize economic cost for the citizens.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
