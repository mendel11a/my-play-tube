import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import { Link, useNavigate } from "react-router-dom";
import UploadVideo from "./UploadVideo";
import UploadPicture from "./UploadPicture";


const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;

const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
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
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};

`

const Avatar = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #999;
  cursor:pointer;

`


const Navbar = () => {
  const navigate = useNavigate()
  const { currentUser } = useSelector(state => state.user)
  const [openVideo, setOpenVideo] = useState(false)
  const [openPicture, setOpenPicture] = useState(false)
  const [q, setQ] = useState("")


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
              <Avatar src={currentUser.img} onMouseOver={e => (e.currentTarget.src = "https://t4.ftcdn.net/jpg/04/81/13/43/360_F_481134373_0W4kg2yKeBRHNEklk4F9UXtGHdub3tYk.jpg")} onMouseOut={e => (e.currentTarget.src = currentUser.img)} onClick={() => setOpenPicture(true)} />
              {currentUser.name}
            </User>
          ) : <Link to="signin" style={{ textDecoration: "none" }}>
            <Button>
              <AccountCircleOutlinedIcon />
              SIGN IN
            </Button>
          </Link>}
        </Wrapper>
      </Container>
      {openVideo && <UploadVideo setOpen={setOpenVideo} />}
      {openPicture && <UploadPicture setOpen={setOpenPicture} />}
    </>
  );
};

export default Navbar;
