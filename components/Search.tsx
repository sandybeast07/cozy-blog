interface SearchProps{
    handleSearch: (value: any) => void
}

export default function Search({handleSearch} : SearchProps){
    return(
        <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8916c] text-base pointer-events-none">🔍</span>
                    <input
                      type="text"
                      onChange={e => handleSearch(e.target.value)}
                      placeholder="Search your entries…"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#f5ead6] border border-[#e8ddd0] text-[#2e2316] font-sans text-sm placeholder-[#c9b89e] focus:border-[#c9694a] focus:ring-2 focus:ring-[#c9694a]/20 transition-all"
                    />
    
                  </div>
    )
}