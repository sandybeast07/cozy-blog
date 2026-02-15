interface EntryBtnProps{
   handleNew : () => void;
}

export default function EntryBtn({ handleNew }: EntryBtnProps){
    
    return(
        <button
            onClick={handleNew}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#c9694a] text-[#fdf6ec] rounded-xl font-sans font-medium text-sm hover:bg-[#b04d30] transition-colors shadow-md"
          >
            <span className="text-lg leading-none">＋</span>
            New entry
          </button>
    )
}