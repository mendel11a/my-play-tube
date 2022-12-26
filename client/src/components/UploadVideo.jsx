import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../firebase"
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #00000097;
    z-index: 9;
`
const Wrapper = styled.div`
    height: 38rem;
    width: 38rem;
    background-color: ${({ theme }) => theme.bgLighter};
    color: ${({ theme }) => theme.text};
    padding: 1.3rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    position: relative;
    border-radius: 0.3rem;
`
const Close = styled.div`
    position: absolute;
    right: 0.6rem;
    top: 0.6rem;
    cursor: pointer;
`
const Title = styled.h1`
    text-align: center;
`
const Input = styled.input`
    border: 1px solid ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.text};
    border-radius: 0.19rem;
    padding: 0.6rem;
    background-color: transparent;
    outline: none;
`
const Desc = styled.textarea`
    border: 1px solid ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.text};
    border-radius: 0.19rem;
    padding: 0.6rem;
    background-color: transparent;
    outline: none;
`
const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const Label = styled.label`
    font-size: 0.9rem;
`

const UploadVideo = ({ setOpen, socket }) => {
    const navigate= useNavigate()
    const { currentUser } = useSelector(state => state.user)
    const [img, setImg] = useState(undefined)
    const [video, setVideo] = useState(undefined)
    const [imgPerc, setImgPerc] = useState(0)
    const [videoPerc, setVideoPerc] = useState(0)
    const [inputs, setInputs] = useState({})
    const [tags, setTags] = useState([])

    const handleChange = e => {
        setInputs(prev => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    const handleTags = (e) => {
        setTags(e.target.value.split(","))
    }

    const uploadFile = (file, urlType) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                urlType === "imgUrl" ? setImgPerc(Math.round(progress)) : setVideoPerc(Math.round(progress))
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            },
            (error) => { },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setInputs(prev => {
                        return { ...prev, [urlType]: downloadURL }
                    })
                });
            }
        )
    }

    useEffect(() => {
        video && uploadFile(video, "videoUrl")
    }, [video])

    useEffect(() => {
        img && uploadFile(img, "imgUrl")
    }, [img])

    const handleUpload = async (e) => {
        e.preventDefault();
        const res = await axios.post("/videos",
            {...inputs, tags}
        )
        const subscribers = await axios.get("/videos/fans") // find all those users that follow me to update them that ive done an action
        const subscribersName=[]
        subscribers.data.forEach((sub)=>subscribersName.push(sub.name))
        socket.emit("sendNotification",{
            senderName: currentUser.name,
            senderImage: currentUser.img,
            videoId:res.data._id,
            videoTitle: inputs.title,
            videoUrl: inputs.videoUrl,
            videImgUrl: inputs.imgUrl,
            receiverName: subscribersName,
        })
        await axios.post("/notifications",{
            userId:currentUser._id,
            videoId:res.data._id
        }) 
        setOpen(false)
        res.status===200 && navigate(`/video/${res.data._id}`)
    }

    return (
        <Container>
            <Wrapper>
                <Close onClick={() => setOpen(false)}>X</Close>
                <Title>Upload A New Video</Title>
                <Label>Video:</Label>
                {videoPerc > 0 ? ("Uploading: " + videoPerc + "%") : (<Input type="file" accept='video/*' onChange={e => setVideo(e.target.files[0])} />)}
                <Input type="text" placeholder='Title' name="title" onChange={handleChange} />
                <Desc placeholder='Description' name="description" rows={8} onChange={handleChange} />
                <Input type="text" placeholder='Separate the tags with commas' onChange={handleTags} />
                <Label>Image:</Label>
                {imgPerc > 0 ? ("Uploading: " + imgPerc + "%") : (<Input type="file" accept='image/*' onChange={e => setImg(e.target.files[0])} />)}
                <Button onClick={handleUpload}>Upload</Button>
            </Wrapper>
        </Container>
    )
}

export default UploadVideo