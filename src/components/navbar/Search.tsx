'use client';

import Link from 'next/link';

const Search = () => {
    return (
        <div className="w-full md:w-auto py-2 transition cursor-pointer">
            <div className="flex flex-row items-center justify-between">
                <Link href="/profile">
                    <div className="text-sm text-[#503C3C] font-semibold hover:text-[#3E3232] px-6">Profile</div>
                </Link>
                <div className="hidden text-[#503C3C] hover:text-[#3E3232] sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center">About</div>
                <div className="text-sm pl-6 pr-2 hover:text-[#3E3232] text-[#503C3C] font-semibold flex flex-row items-center gap-3">
                    Search
                </div>
            </div>
        </div>
    );
}

export default Search;
