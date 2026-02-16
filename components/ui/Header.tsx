function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Header(){
    return(
        <header className="relative overflow-hidden bg-[#2e2316] text-[#fdf6ec]">
                <div className="bg-orange-600 w-[50px] text-center h-[30px] rounded relative top-4 left-7 text-lg">Beta</div>
                {/* Decorative circles */}
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#c9694a]/20 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#d4924a]/15 blur-2xl pointer-events-none" />
                <div className="absolute top-8 left-1/2 w-32 h-32 rounded-full bg-[#7a8c6e]/10 blur-2xl pointer-events-none" />
        
                <div className="relative max-w-3xl mx-auto px-6 py-14 text-center">
                  <p className="font-sans text-sm font-medium text-[#c9b89e] uppercase tracking-widest mb-3 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '100ms' }}>
                    {greeting()} ✦
                  </p>
                  <h1 className="font-display text-5xl font-bold text-[#fdf6ec] mb-4 animate-fade-up opacity-0 leading-tight" style={{ animationFillMode: 'forwards', animationDelay: '200ms' }}>
                    My Cozy Journal
                  </h1>
                  <p className="font-body italic text-[#c9b89e] text-lg animate-fade-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '300ms' }}>
                    A warm place for your thoughts, feelings, and quiet reflections.
                  </p>
                </div>
              </header>
    )
}