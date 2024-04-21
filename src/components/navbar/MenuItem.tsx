'use client';

import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface MenuItemProps {
    label: string;
    to: string;
}

const MenuItem = ({ label, to }: MenuItemProps) => {

    const router = useRouter()

    const handleLogout = () => {
        deleteCookie('token')
        router.push('/')
    }

    if (label === "Logout"){
        return (
            <Link href="/">
                <div className="block px-4 py-3 hover:bg-neutral-100 transition font-semibold">
                    <button onClick={handleLogout}>
                        {label}
                    </button>
                </div>
            </Link>
        );
    }

    return (
        <Link href={to}>
            <div className="px-4 py-3 hover:bg-neutral-100 transition font-semibold">
                {label}
            </div>
        </Link>
    );
}

export default MenuItem;
