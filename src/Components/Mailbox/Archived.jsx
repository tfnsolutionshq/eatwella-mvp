
function Archived() {
  
  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg md:text-xl font-bold">Archived</h1>
          <span className="text-xs md:text-sm text-gray-500 border rounded-md p-1">0 memos</span>
        </div>
        <label className="flex items-center text-sm font-medium text-black cursor-not-allowed opacity-50">
          <input
            type="checkbox"
            checked={false}
            onChange={() => {}}
            className="mr-2"
            disabled
          />
          Select all
        </label>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No memos found</h3>
          <p className="text-sm text-gray-500">No memos in your archived</p>
        </div>
      </div>
    </div>
  )
}

export default Archived