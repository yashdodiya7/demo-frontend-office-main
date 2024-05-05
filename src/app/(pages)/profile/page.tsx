import ProfileComponent from '@/components/profile/profile-page'
import React from 'react'
import UserLayout from '../UserLayout'

const ProfilePage = () => {
    return (
        <div>
            <UserLayout>
                <ProfileComponent />
            </UserLayout>
        </div>
    )
}

export default ProfilePage