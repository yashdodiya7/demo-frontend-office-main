'use client'
import React from 'react'
import UserLayout from './(pages)/UserLayout'
import HomePage from '@/components/main/home'

function page() {
    return (
        <UserLayout>
            <HomePage />
        </UserLayout>
    )
}

export default page