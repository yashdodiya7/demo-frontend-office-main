'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "@/store/slice/authSlice";
import { RootState } from "@/types/user";

interface UserMenuProps { }

const UserMenu = () => {
  const token = getCookie("token");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const data = useSelector((state: RootState) => state.user.userProfile);

  const toggleOpen = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

    return (
      <div className="relative">
        <div className="flex flex-row items-center gap-3">
          {token && !data?.confirmed_deal ? (
            data?.is_host ? (
              <div className="md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                <Link href="/updatelisting">Edit a Post</Link>
              </div>
            ) : (
              <div className="md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                <Link href={data?.is_verified ? "/create-listing" : "/verify"}>Make a Post</Link>
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
            <div className="hidden md:flex items-center">
              <Avatar />
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="absolute rounded-xl shadow-md w-[40vw] md:w-[80%] bg-white overflow-hidden right-0 top-12 text-sm">
            <div>
              {!token && <MenuItem to="/auth/phone-no-verify" label="Sign Up" />}
              {!token && <MenuItem to="/auth/login" label="Login" />}
              {token && <MenuItem to="/prefernce" label="User Prefernces" />}
              {token && <div className="block sm:hidden"><MenuItem to="/profile" label="Profile" /></div>}
              {token && !data?.is_host && <MenuItem to="/myinterests" label="My Interests" />}
              {token && data?.is_host && <MenuItem to="/interested-users" label="Interested Users" />}
              {token && data?.confirmed_deal && !data?.is_host && <MenuItem to="/mydeal" label="My Deal" />}
              {token && <MenuItem to="/subscription" label="Subscription" />}
              <div className="block sm:hidden"><MenuItem to="/contact" label="Contact us" /></div>
              {token && <MenuItem to="/" label="Logout" />}
            </div>
          </div>
        )}
      </div>
    );
}

export default UserMenu;