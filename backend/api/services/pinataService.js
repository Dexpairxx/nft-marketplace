const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

// Function to upload file to Pinata
const uploadFile = async (file) => {
    const formData = new FormData();
    const pinataMetadata = JSON.stringify({ name: file.originalname });
    const pinataOptions = JSON.stringify({ cidVersion: 0 });

    formData.append("file", file.buffer, { filename: file.originalname });
    formData.append("pinataMetadata", pinataMetadata);
    formData.append("pinataOptions", pinataOptions);

    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
                "pinata_api_key": process.env.PINATA_API_KEY,
                "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY,
            },
        })

        return {
          "IpfsHash" : res.data.IpfsHash,
          "PinataUrl": `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
        };
    } catch (error) {
        console.error("Error uploading file to Pinata:", error.response.data || error.message);
        throw new Error("Failed to upload file to Pinata");
    }
};

const uploadMetaData = async (metadata, file) => {
    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
            headers: {
                "Content-Type": "application/json",
                "pinata_api_key": process.env.PINATA_API_KEY,
                "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY,
            },
            params: {pinataMetadata: JSON.stringify({name:file})}
        })

        return {
          "IpfsHash" : res.data.IpfsHash,
          "PinataUrl": `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
        };
    } catch (error) {
        console.error("Error uploading metadata to Pinata:", error.response.data || error.message);
        throw new Error("Failed to upload metadata to Pinata");
    }
}

module.exports = { uploadFile, uploadMetaData };