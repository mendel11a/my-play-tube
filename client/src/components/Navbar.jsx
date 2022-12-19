import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { Link, useNavigate } from "react-router-dom";
import UploadVideo from "./UploadVideo";
import UploadPicture from "./UploadPicture";


const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 4rem;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0rem 1.3rem;
  position: relative;
`;

const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0rem;
  right: 0rem;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: ${({ theme }) => theme.text};
  `;

const Input = styled.input`
  color: ${({ theme }) => theme.text};
  border: none;
  background-color: transparent;
  outline: none;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 0.3rem 0.9rem;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 0.19rem;
  font-weight: 500;
  cursor: pointer;
  gap: 0.3rem;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  gap: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};

`
const Counter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.2rem;
  height:0.2rem;
  background-color: red;
  border-radius: 50%;
  padding: 0.3rem;
  font-size: 0.7rem;
  position: absolute;
  top: 0rem;
  right: 6.5rem;
  color: ${({ theme }) => theme.text};
`

const Avatar = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #999;
  cursor:pointer;
`
const Notifications = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 3rem;
  width: 20rem;
  right: -1.3rem;
  background-color: #282828;
  color: ${({ theme }) => theme.text};
  font-weight: 300;
`

const Notification = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.3rem 0rem;  
  font-size: 0.9rem;
  padding: 0.6rem;
  cursor:pointer;
`

const NotificationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.2rem 1.2rem;
  width: 80%;
  padding: 0.3rem 0.9rem;
  top: 0.6rem;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 0.19rem;
  font-weight: 500;
  cursor: pointer;
  gap: 0.3rem;
`;


const Navbar = ({ socket }) => {
  const navigate = useNavigate()
  const { currentUser } = useSelector(state => state.user)
  const [openVideo, setOpenVideo] = useState(false)
  const [openPicture, setOpenPicture] = useState(false)
  const [openNotification, setOpenNotification] = useState(false)
  const [q, setQ] = useState("")
  const [notifications, setNotifications] = useState([])


  useEffect(() => {
    socket?.on("getNotification", data => {
      setNotifications((prev) => [...prev, data])
    })
  }, [socket])

  const handleRead = () => {
    setNotifications([])
    setOpenNotification(false)
  }


  return (
    <>
      <Container>
        <Wrapper>
          <Search>
            <Input placeholder="Search" onChange={e => setQ(e.target.value)} />
            <SearchOutlinedIcon cursor="pointer" onClick={() => navigate(`/search?q=${q}`)} />
          </Search>
          {currentUser ? (
            <User>
              <VideoCallOutlinedIcon cursor="pointer" onClick={() => setOpenVideo(true)} />
              <NotificationsNoneOutlinedIcon cursor="pointer" onClick={() => setOpenNotification(!openNotification)} />
              {notifications.length > 0 && <Counter>{notifications.length}</Counter>}
              <Avatar src={currentUser.img} onMouseOver={e => (e.currentTarget.src = "https://t4.ftcdn.net/jpg/04/81/13/43/360_F_481134373_0W4kg2yKeBRHNEklk4F9UXtGHdub3tYk.jpg")} onMouseOut={e => (e.currentTarget.src = currentUser.img)} onClick={() => setOpenPicture(true)} />
              {currentUser.name}
              {openNotification &&
                <Notifications>
                  {notifications?.map(notification =>
                  (<Notification key={notification.senderName} onClick={() => { navigate(`/video/${notification.videoId}`); setOpenNotification(false); setNotifications([]) }}>
                    <Avatar src={notification.senderImage} />
                    Recommended: {notification.senderName} posted a new Video - {notification.videoTitle}
                    <Avatar src={notification.videImgUrl} />
                  </Notification>))
                  }
                  {notifications.length > 0 && <NotificationButton onClick={handleRead}>Mark As Read</NotificationButton>}
                </Notifications>}
            </User>
          ) : <Link to="signin" style={{ textDecoration: "none" }}>
            <Button>
              <AccountCircleOutlinedIcon />
              SIGN IN
            </Button>
          </Link>}
        </Wrapper>
      </Container>
      {openVideo && <UploadVideo setOpen={setOpenVideo} socket={socket} />}
      {openPicture && <UploadPicture setOpen={setOpenPicture} />}
    </>
  );
};

export default Navbar;
