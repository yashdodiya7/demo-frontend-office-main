import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export function Footer() {
    return (
        <footer className="w-full">
            <hr />
            <section className="relative overflow-hidden bg-white py-4">
                <div className="container relative z-10 mx-auto px-4 flex justify-center items-center">
                    <div className="-m-8 flex flex-wrap items-center justify-between">
                        <div className="w-auto p-8">
                            <div>
                                <p className='text-md font-light'>&#169; 2024 Mates.in All Rights Reserved</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </footer>
    )
}