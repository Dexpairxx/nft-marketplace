import axios from "axios";

const API_BASE_URL = "";

export const fetchDataFromIPFS = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching data from IPFS:", error);
    return null;
  }
};

export const fetchNFTsByTab = async (account, tabIndex) => {
  try {
    let endpoint = "";

    switch (tabIndex) {
      case 0:
        endpoint = `/api/nft/address/${account}/listing/0`;
        break;
      case 1:
        endpoint = `/api/nft/address/${account}/listing/1`;
        break;
      default:
        return [];
    }

    const response = await axios.get(`${API_BASE_URL}${endpoint}`);

    const nfts = await Promise.all(
      response.data.nfts.map(async (nft) => {
        const metadata = await fetchDataFromIPFS(nft['metadata_url']);
        return { id: nft['id'], token_id: nft['token_id'], metadata };
      })
    );

    return nfts;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
};

// Fetch a single NFT by ID
export const fetchNFTById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/nft/${id}`);
    const nft = response.data;

    const metadata = await fetchDataFromIPFS(nft.metadata_url);
    return {
      ...nft,
      metadata
    };
  } catch (error) {
    console.error("Error fetching NFT by ID:", error);
    return null;
  }
};

// Fetch Listed NFTs
export const fetchListingNFTs = async (account) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/nft/address/${account}/buying`);
        console.log("Fetched raw listing NFTs:", response.data);

        const nfts = await Promise.all(
            response.data.map(async (nft) => {
                const metadata = await fetchDataFromIPFS(nft.metadata_url);
                return {
                    ...nft,
                    metadata
                };
            })
        );

        // console.log("Enriched listing NFTs:", nfts);
        return nfts;
    } catch (error) {
        console.error("Error fetching listed NFTs:", error);
        return [];
    }
};