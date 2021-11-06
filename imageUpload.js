import React, { useState } from 'react';
import CustomInput from "./Input.component/Input.jsx"

const [fileData, setFileData] = useState();
const [images, setFile] = useState();

const handleFileChange = ({ target }) => {
    setFileData(target.files[0]);
    setFile(target.value);
};

const ImageUpload = () => {
    return (
        <form>
            <CustomInput
                type= "file"
                value= {images}
                name= "file"
                accept= "image/*"
                onChange= {handleFileChange}
                placeholder= "upload image"
                isRequired= {true}
                />
        </form>
    )
}

export default ImageUpload;