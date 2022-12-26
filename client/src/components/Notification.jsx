import React from 'react'
import { useNavigate } from "react-router-dom";
import styled from 'styled-components'


const Container = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.3rem 0rem;  
  font-size: 0.9rem;
  padding: 0.6rem;
  cursor:pointer;
`

const Avatar = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #999;
`
const VideoImg = styled.img`
  width: 6rem;
  height: 4rem;
  border-radius: 10%;
  background-color: #999;
`


const Notification = ({ notification, setOpenNotification }) => {

  const navigate = useNavigate()

  return (
    <Container onClick={() => { navigate(`/video/${notification.videoId}`); setOpenNotification(false)}} >
      <Avatar src={notification.senderImage} />
      Recommended: {notification.senderName} posted a new Video | {notification.videoTitle}
      <VideoImg src={notification.videoImgUrl} />
    </Container>
  )
}

export default Notification