'use client';

import { getCookie } from 'cookies-next';
import Link from 'next/link';
import { useEffect } from 'react';

const Search = () => {
    const token: string = getCookie('token') || "";
    
    return (
        <div className="w-full md:w-auto py-2 transition cursor-pointer">
            <div className="flex flex-row items-center justify-between">
                {token && <Link href="/profile">
                    <div className="text-sm text-[#503C3C] font-semibold hover:text-[#3E3232] px-6">Profile</div>
                </Link>}
                <div className={`hidden text-[#503C3C] hover:text-[#3E3232] sm:block text-sm font-semibold px-6 ${ token && "border-l-[1px]"} flex-1 text-center`}>About</div>
                <div className="text-sm pl-6 pr-2 hover:text-[#3E3232] border-l-[1px] text-[#503C3C] font-semibold flex flex-row items-center gap-3">
                    How to Use ?
                </div>
            </div>
        </div>
    );
}

export default Search;
