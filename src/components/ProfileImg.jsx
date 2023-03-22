import React from 'react'

const ProfileImg = ({user}) => {
  return (
    <img
    src={
      user.profilePic ||
      `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user?.name}`
    }
    alt={user.name}
  />
  )
}

export default ProfileImg