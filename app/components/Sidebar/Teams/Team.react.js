import React from 'react'

export default ({ image, unreads, pings, id, onClick }) => { // eslint-disable-line react/prop-types
  const onClickHandler = () => onClick(id)
  return (
    <div onClick={onClickHandler} className='team' style={{backgroundImage: `url(${image})`}}>
      {
        unreads ? <div className='new_message' /> : null
      }
      {
        pings ? <div className='unread_counter'>{pings}</div> : null
      }
    </div>
  )
}
