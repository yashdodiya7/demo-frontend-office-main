'use client';

import { useCallback, useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "@/store/slice/authSlice";

interface UserMenuProps { }

const UserMenu = () => {
    const token = getCookie('token');
    const [isHost, setIsHost] = useState(false);
    const [isVerify, setIsVerify] = useState(false)

    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchIsHost = async () => {
            const data = await dispatch(getUserProfile(token))
            setIsVerify(prev => data.payload?.is_verified)
            setIsHost(prev => data.payload?.is_host)
        }
        fetchIsHost()
    }, [])
    

    const toggleOpen = useCallback(() => {
        setIsOpen(prevState => !prevState);
    }, []);

    return (
      <div className="relative">
        <div className="flex flex-row items-center gap-3">
          {token ? (
            isHost ? (
              <div className="md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                <Link href="/updatelisting">Edit a Post</Link>
              </div>
            ) : (
              <div className="md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                <Link href={isVerify ? "/createlist" : "/verify"}>Make a Post</Link>
              </div>
            )
          ) : (
            <div className="w-24 hidden md:block text-sm font-semibold py-3 px-4 rounded-full"></div>
          )}

          <div
            onClick={toggleOpen}
            className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
          >
            <AiOutlineMenu />
            <div className="hidden md:block">
              <Avatar src="/images/placeholder.jpg" />
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
            <div className="flex flex-col cursor-pointer">
              {!token && <MenuItem to="/auth/phone-no" label="Sign Up" />}
              {!token && <MenuItem to="/auth/login" label="Login" />}
              {token && <MenuItem to="/prefernce" label="User Prefernces" />}
              {token && <MenuItem to="/" label="Logout" />}
            </div>
          </div>
        )}
      </div>
    );
}

export default UserMenu;