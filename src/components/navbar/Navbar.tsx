"use client"

import { useEffect } from "react";
import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { useSelector } from "react-redux";


interface NavbarProps { }

const Navbar: React.FC<NavbarProps> = () => {

    const userState = useSelector((state: any) => state.user.userProfile)

    useEffect(() => {

    }, [userState?.confirm_deal, userState?.is_verified, userState?.is_host, userState?.is_paid])

    return (
        <div className="w-full bg-white shadow-sm sticky top-0 z-50">
            <div className="py-4 border-b-[1px]">
                <Container>
                    <div className="flex flex-row items-center justify-between">
                        <Logo />
                        <div className="sm:block hidden"><Search /></div>
                        <UserMenu />
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default Navbar;
