// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BuyingModal from "./BuyingModal";
import ListingModal from "./ListingModal";
import SellingModal from "./SellingModal";
import MintNftModal from "./MintNftModal";
import DetailModal from "./DetailModal";

function MainModal({ nft, onClose, type }) {
  if (!nft && type !== "minting") return null;
  
  // Style for main modal, detailed will be displayed depend on type of modal
  return (
    <Modal open={!!nft} onClose={onClose} disableScrollLock>
      <Box sx={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "white", p: 3,
        borderRadius: 3, maxWidth: 900, width: "95%",
        maxHeight: "90vh",
        overflowY: "auto",
        display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2,
        boxShadow: 24,
      }}>

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: { xs: -6, sm: 8 },
            right: { xs: -6, sm: 8 },
          }}
        >
          <CloseIcon color="error" />
        </IconButton>

        {type === "buying" && <BuyingModal nft={nft} onClose={onClose} />}
        {type === "selling" && <SellingModal nft={nft} onClose={onClose} />}
        {type === "listing" && <ListingModal nft={nft} onClose={onClose} />}
        {type === "detail" && <DetailModal nft={nft} onClose={onClose} />}
        {type === "minting" && <MintNftModal onClose={onClose} />}
      </Box>
    </Modal>
  );
}

export default MainModal;