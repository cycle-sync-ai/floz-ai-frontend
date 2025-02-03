
const ListActions = () => {

    return (
        <div className="flex justify-start items-center gap-3">
            <button className="flex items-center text-white bg-[#349989] items-center rounded-md justify-center p-2 gap-1">
                <img src="/import-icon.png" alt="Export" className="w-6 h-6"/>
                Import
            </button>

            <button className="flex items-center text-white bg-[#349989] items-center rounded-md justify-center p-2 gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                New Contact
            </button>
        </div>
    )
}

export default ListActions;