export const NutritionCard = () => {
    return (
         <div className='relative w-full max-w-[320px] aspect-[4/5] perspective-1000'>
             <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl transform rotate-6 scale-95 border border-white/10" />
             <div className="relative bg-white rounded-3xl p-6 shadow-2xl h-full flex flex-col justify-between transform transition-transform hover:-translate-y-2 duration-500">
                <div className="flex justify-between items-start">
                   <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">🥗</div>
                   <span className="text-xs font-mono text-gray-400">GZ-99</span>
                </div>
                
                <div className='space-y-1'>
                    <div className="text-3xl font-bold text-gray-900">1,204 <span className='text-sm font-normal text-gray-500'>kcal</span></div>
                    <div className="text-sm text-green-600 font-medium">+12% vs yesterday</div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-700">🥑</div>
                         <div>
                            <div className="text-sm font-bold text-gray-900">Lunch</div>
                            <div className="text-xs text-gray-500">Avocado Salad</div>
                         </div>
                         <div className="ml-auto text-sm font-bold text-gray-900">450</div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-400">Daily Goal</div>
                    <div className="text-xs font-bold text-[#053d2e]">View Report</div>
                </div>
             </div>
          </div>
    )
}