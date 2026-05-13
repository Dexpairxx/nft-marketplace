import { useState, useEffect, useContext, cloneElement } from "react";
import { UserContext } from "../../contexts/UserContext";
import useEthereumConnection from "../../hooks/useEthereumConnection";
import LoadMoreButton from "../../components/buttons/LoadMoreButton";
import GridGallery from "../../components/gallery/GridGallery";
import SearchField from "./SearchField";
import MainModal from "../../components/modals/MainModal";
import { Typography } from "@mui/material";
import FilterButton from "../../components/buttons/FilterButton";
import { fetchListingNFTs } from "../../services/nftService";

function Market() {
  const { user, setUser } = useContext(UserContext);

  const [nfts, setNfts] = useState([]);
  const [nftIndex, setNftIndex] = useState(30);
  const [filteredNfts, setFilteredNfts] = useState([]);
  const [selectedNft, setSelectedNft] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minDate: "",
    maxDate: "",
    categories: [],
  });

  // Check connection
  useEthereumConnection(setUser);

  useEffect(() => {
    if (user) {
      const getListedNFTs = async () => {
        try {
          const listedNFTs = await fetchListingNFTs(user.account);
          setNfts(listedNFTs || []);
        } catch (error) {
          console.error("Error in fetching listed NFTs:", error);
        }
      };
      
      getListedNFTs();

    }
  }, [user]);
  
  // Filter NFTs
  useEffect(() => {
    console.log("NFTs:", nfts);
    if (user) {
      const filtered = nfts.filter((nft) => {
        const nameMatch = nft.metadata?.name?.toLowerCase().includes(searchValue.toLowerCase());
        const minPriceMatch = filters.minPrice === "" || parseFloat(nft.base_price) >= parseFloat(filters.minPrice);
        const maxPriceMatch = filters.maxPrice === "" || parseFloat(nft.base_price) <= parseFloat(filters.maxPrice);
  
        const mintDate = nft.metadata?.mintDate;
        const minDateMatch = filters.minDate === "" || (mintDate !== "Unknown" && new Date(mintDate) >= new Date(filters.minDate));
        const maxDateMatch = filters.maxDate === "" || (mintDate !== "Unknown" && new Date(mintDate) <= new Date(filters.maxDate));
  
        const tags = nft.metadata?.tags || [];
        const categoriesMatch = filters.categories.length === 0 || filters.categories.some((category) => tags.includes(category));
  
        return nameMatch && minPriceMatch && maxPriceMatch && minDateMatch && maxDateMatch && categoriesMatch;
      });
  
      setFilteredNfts(filtered.slice(0, nftIndex));
    } else {
      setFilteredNfts([]);
    }
  }, [nfts, user, filters, nftIndex, searchValue]);

  const onSearch = (value) => {
    console.log("Search value:", value);
    setSearchValue(value);
    if (value === "") setNftIndex(10);
  };

  const onClickNft = (nft) => setSelectedNft(nft);
  const onClose = () => setSelectedNft(null);
  const onLoadMore = () => {
    setNftIndex((prev) => prev + 5);
  };

  const onApplyFilters = (filterSpecs) => {
    setFilters({
      minPrice: filterSpecs[0][0],
      maxPrice: filterSpecs[0][1],
      minDate: filterSpecs[1][0],
      maxDate: filterSpecs[1][1],
      categories: filterSpecs[2],
    });
  };

  return (
    <div style={{ marginTop: "130px" }}>
      {!user ? (
        <Typography variant="h6" color="gray" align="center">
          Please connect to your wallet
        </Typography>
      ) : (
        <>
          <SearchField onSearch={onSearch} />
          <FilterButton onApply={onApplyFilters} />
          {filteredNfts.length > 0 ? (
            <>
              <GridGallery nfts={filteredNfts} onClick={onClickNft} />
              {filteredNfts.length < nfts.length && (
                <LoadMoreButton onLoadMore={onLoadMore} />
              )}
            </>
          ) : (
            <Typography variant="h6" color="gray" align="center" sx={{ mt: 3 }}>
              No NFT available for you to purchase!
            </Typography>
          )}
          {selectedNft && (
            <MainModal nft={selectedNft} onClose={onClose} type="buying" />
          )}
        </>
      )}
    </div>
  );
}

export default Market;