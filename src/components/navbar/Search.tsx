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
                <Link href={"/contact"} className={`hidden text-[#503C3C] hover:text-[#3E3232] sm:block text-sm font-semibold px-6 ${ token && "border-l-[1px]"} flex-1 text-center`}>Contact Us</Link>
            </div>
        </div>
    );
}

export default Search;
