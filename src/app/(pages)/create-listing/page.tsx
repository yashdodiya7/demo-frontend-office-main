import CreateList from '@/components/listing/create-list'
import React from 'react'
import UserLayout from '../UserLayout'

const CreateListPage = () => {
  return (
    <div>
        <UserLayout>
          <CreateList/>
        </UserLayout>
    </div>
  )
}

export default CreateListPage