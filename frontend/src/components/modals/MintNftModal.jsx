import { useState, useEffect } from "react";
import { Modal, Box, Button, Typography, TextField, MenuItem, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchTags } from "../../services/tagService";
import axios from "axios";
import { getContract } from "../../utils/getContract";

const MintNftModal = ({ open, onClose }) => {
  const initialNftData = {
    name: "",
    description: "",
    file: null,
    tags: [],
  };

  const [nftData, setNftData] = useState(initialNftData);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [tagsList, setTagsList] = useState([]);

  useEffect(() => {
    if (open) {
      const getTags = async () => {
        try {
          const tags = await fetchTags();
          setTagsList(tags || []);
        } catch (error) {
          console.error("Error fetching tags in component:", error);
        }
      };
      getTags();
    } else {
      setNftData(initialNftData);
      setResult(null);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNftData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNftData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleTagChange = (e) => {
    setNftData((prev) => ({ ...prev, tags: e.target.value }));
  };

  const mintNFT = async (contractAddress, contractABI, metadataURI) => {
    try {
      const contract = await getContract(contractAddress, contractABI);
      const tx = await contract.mintNFT(metadataURI);
      await tx.wait();
      console.log("NFT Minted:", tx);
      setTimeout(function() {
        window.location.reload()
      }, 3000)
      return { success: true, message: "Successfully Minted New NFT" };
    } catch (error) {
      console.error("Minting error:", error);
  
      // Extract the error reason, if available
      let errorMessage = "An error occurred while minting the NFT.";
      if (error?.reason) {
        errorMessage = error.reason;
      } else if (error?.message) {
        errorMessage = error.message;
      }
  
      return { success: false, message: errorMessage };
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
  
    const formData = new FormData();
    formData.append("name", nftData.name);
    formData.append("description", nftData.description);
    formData.append("tags", JSON.stringify(nftData.tags));
    formData.append("mintDate", new Date().toISOString().split("T")[0]);
    if (nftData.file) {
      formData.append("file", nftData.file);
    }
  
    try {
      const res = await axios.post(`${""}/api/nft/mint`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("Response from server:", res.data);
  
      const { contractAddress, contractABI, uploadMetaDataResult } = res.data;
      const mintResult = await mintNFT(contractAddress, contractABI, uploadMetaDataResult.PinataUrl);
  
      // Set result based on the mintNFT function result
      setResult(mintResult);
    } catch (error) {
      console.error("Error during minting:", error);
  
      // Handle API errors more gracefully
      let errorMessage = "An error occurred while minting the NFT.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
  
      setResult({ success: false, message: errorMessage });
    }
  
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, backgroundColor: "white", margin: "15% auto", width: { xs: 360, sm: 450 }, borderRadius: 2, position: "relative" }}>
        <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>

        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CircularProgress sx={{ my: 3 }} />
            <Typography>Minting your NFT...</Typography>
          </Box>
        ) : result ? (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", my: 2 }}>
              {result.success ? "Success!" : "Error"}
            </Typography>
            <Typography>{result.message}</Typography>
            <Button variant="contained" onClick={onClose} sx={{ mt: 3, backgroundColor: "black", color: "white" }}>
              Close
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="h4" align="center" sx={{ fontWeight: "bold", marginBottom: 1 }}>
              Mint Your NFT
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="NFT Name" name="name" value={nftData.name} onChange={handleChange} sx={{ mt: 2 }} required />
              <TextField fullWidth label="Description" name="description" value={nftData.description} onChange={handleChange} sx={{ mt: 2 }} multiline rows={3} required />
              <TextField fullWidth select label="Tags" name="tags" value={nftData.tags} onChange={handleTagChange} sx={{ mt: 2 }} SelectProps={{ multiple: true }}>
                {tagsList.map((tag) => (
                  <MenuItem key={tag.id} value={tag.name}>{tag.name}</MenuItem>
                ))}
              </TextField>
              <Button variant="contained" component="label" sx={{ mt: 2, display: "block", mx: "auto", backgroundColor: "black", color: "white" }} disabled={loading}>
                Upload NFT File
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              <Button type="submit" variant="contained" sx={{ mt: 3, display: "block", mx: "auto", fontWeight: "bold", fontSize: "0.8rem" }} disabled={loading}>Mint NFT</Button>
            </form>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default MintNftModal;