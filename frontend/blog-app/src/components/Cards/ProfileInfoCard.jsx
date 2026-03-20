import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom'

const ProfileInfoCard = () => {
    const { user, clearUser } = useContext(UserContext)
    const navigate = useNavigate()

    const handleLogOut = () => {
        localStorage.clear()
        clearUser()
        navigate("/")
    }
  return (
    user && (
      <div className='flex items-center'>
        <div className='w-11 h-11 rounded-full mr-3 overflow-hidden bg-gray-300 flex-shrink-0'>
          <img src={user.profileImageUrl} alt="" className='w-full h-full object-cover object-center' />
        </div>

        <div>
          <div className='text-[15px] text-black font-bold leading-3'>
            {user.name || ""}
          </div>

          <button className='text-sky-600 text-sm font-semibold cursor-pointer hover:underline' onClick={handleLogOut}>Logout</button>
        </div>
      </div>
    )
  )
}

export default ProfileInfoCard
