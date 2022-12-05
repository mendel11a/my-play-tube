import React, { useEffect, useState } from 'react'
import {useSelector}  from 'react-redux'
import styled from 'styled-components'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../firebase"
import axios from "axios"
import { useNavigate } from 'react-router-dom';


const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #00000097;
    display: flex;
    align-items: center;
    justify-content: center;
`
const Wrapper = styled.div`
    height: 10rem;
    width: 20rem;
    background-color: ${({ theme }) => theme.bgLighter};
    color: ${({ theme }) => theme.text};
    padding: 1.3rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    position: relative;
`
const Close = styled.div`
    position: absolute;
    right: 0.6rem;
    top: 0.6rem;
    cursor: pointer;
`
const Input = styled.input`
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

const UploadVideo = ({ setOpen }) => {
    const { currentUser } = useSelector(state => state.user)
    const navigate= useNavigate()
    const [img, setImg] = useState(undefined)
    const [imgPerc, setImgPerc] = useState(0)
    const [inputs, setInputs] = useState({})


    const uploadFile = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImgPerc(Math.round(progress))
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
                        return { ...prev, img: downloadURL }
                    })
                });
            }
        )
    }

    useEffect(() => {
        img && uploadFile(img)
    }, [img])

    const handleUpload = async (e) => {
        e.preventDefault();
        const res = await axios.put(`/users/${currentUser._id}`,
            {...inputs}
        )
        setOpen(false)
        res.status===200 && navigate(`/`)
    }

    return (
        <Container>
            <Wrapper>
                <Close onClick={() => setOpen(false)}>X</Close>
                <Label>Upload Profile Picture:</Label>
                {imgPerc > 0 ? ("Uploading: " + imgPerc + "%") : (<Input type="file" accept='image/*' onChange={e => setImg(e.target.files[0])} />)}
                <Button onClick={handleUpload}>Upload</Button>
            </Wrapper>
        </Container>
    )
}

export default UploadVideo