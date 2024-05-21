"use client"

import { logout } from "@/store/slice/authSlice";
import { logoutInterest } from "@/store/slice/interestSlice";
// import  storeObj  from "@/store/store";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

interface MenuItemProps {
    label: string;
    to: string;
}

// const {persistor} = storeObj;

const MenuItem = ({ label, to }: MenuItemProps) => {

    const router = useRouter()
    const dispatch = useDispatch()

    const handleLogout = async () => {
        deleteCookie('token')
        deleteCookie('is_paid')
        deleteCookie('confirmed_deal')
        await dispatch(logoutInterest())
        dispatch(logout())
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
            <div className="px-4 py-3 hover:bg-neutral-100 transition font-semibold flex flex-col cursor-pointer">
                {label}
            </div>
        </Link>
    );
}

export default MenuItem;
