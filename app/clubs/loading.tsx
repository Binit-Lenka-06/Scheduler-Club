export default function Loading() {
    return(
        <div className="flex flex-row gap-x-2 animate-pulse h-[700px] w-full">
            <div className="w-[600px] flex flex-col gap-y-4">
                <div className="h-full w-full bg-[#10151c] rounded py-4"></div>
                <div className="h-full w-full bg-[#10151c] rounded py-4"></div>
            </div>
            <div className="h-full w-full bg-[#10151c] rounded"></div>
            <div className="h-full w-[600px] bg-[#10151c] rounded"></div>
        </div>
    )
}