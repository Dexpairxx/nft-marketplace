// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { useContext } from "react";
import { Box, Button, Typography } from "@mui/material";
import { UserContext } from "../../contexts/UserContext";
import useEthereumConnection from "../../hooks/useEthereumConnection";

import profileImage from "./homeImages/nft_profile.webp";
import backgroundImage from "./homeImages/background.png";
import NFTBackground from "./homeImages/Nft_Background.png";
import buildProfileImage from "./homeImages/buildProfile.webp";
import nft1 from "./homeImages/HeroCard1.webp";
import nft2 from "./homeImages/HeroCard2.webp";
import SocialSection1 from "./homeImages/SocialSection1.webp";
import SocialSection2 from "./homeImages/SocialSection2.png";
import SocialSection3 from "./homeImages/SocialSection3.png";
import TextAnimation from "./TextAnimation.jsx";

// Reusable components
const GradientText = ({ children }) => (
  <span
    style={{
      background: "linear-gradient(90deg, #FDC830, #F37335)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    {children}
  </span>
);

const SectionLayout = ({ reverse = false, children, sx }) => (
  <Box
    sx={{
      display: "flex", flexDirection: { xs: "column", md: reverse ? "row-reverse" : "row" },
      width: "100%", minHeight: "100vh",
      marginBottom: 6, ...sx,
    }}
  >
    {children}
  </Box>
);

const ContentBlock = ({ title, subtitle, buttonText }) => (
  <Box
    sx={{
      flex: 1, p: 3, px: 5,
      display: "flex", flexDirection: "column", justifyContent: "center",
    }}
  >
    <Typography
      variant="h3"
      sx={{
        fontWeight: "bold", fontSize: { xs: "2rem", md: "3.5rem" },
        mb: 2,
      }}
    >
      {title}
    </Typography>
    <Typography
      variant="body1"
      sx={{
        fontSize: { xs: "1rem", md: "1.2rem" },
        mb: 3, mt: 2,
      }}
    >
      {subtitle}
    </Typography>
    <Button
      variant="contained"
      sx={{
        width: "80%", maxWidth: "250px", borderRadius: "30px",
        fontSize: "1rem",
        backgroundColor: "black", color: "white",
        px: 1, py: 1,
        "&:hover": { backgroundColor: "#333" },
      }}
    >
      {buttonText}
    </Button>
  </Box>
);

const ImageBlock = ({ image, gradient, children, sx = {} }) => (
  <Box
    sx={{
      flex: 1,
      p: 4,
      backgroundImage: gradient
        ? `linear-gradient(180deg, rgba(255, 255, 255, 0), ${gradient}), url(${image})`
        : `url(${image})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",

      minHeight: 300,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundBlendMode: gradient ? "overlay" : "normal",
      ...sx,
    }}
  >
    {children}
  </Box>
);

// Main component
function Home() {
  const { setUser } = useContext(UserContext);

  // Check connection
  useEthereumConnection(setUser)

  return (
    <main>

      {/* Hero Section */}
      <SectionLayout>
        <ContentBlock
          title={
            <>
              Own your
              <NFTIcons index={1} />
              <br />
              NFT <NFTIcons index={2} /> <GradientText>identity</GradientText>
            </>
          }
          subtitle="Build your brand with an NFT that is uniquely you"
          buttonText="CREATE A PROFILE"
        />
        <ImageBlock image={NFTBackground} gradient="rgb(255, 60, 100)">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "black", color: "white",
              padding: "6px 26px",
              fontSize: "2rem", fontWeight: 550,
              alignItems: "center",
              minWidth: { xs: "40%", sm: "35%", md: "35%", lg: "55%" },
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            <span style={{ color: "gray" }}>METAMINT</span>
            <span
              style={{
                background: "linear-gradient(90deg, #FDC830, #F37335)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              /
            </span>
            <TextAnimation
              texts={["PLANT", "NEWS", "IDEAS", "ART"]}
              intervalSeconds={2}
            />
          </Button>
        </ImageBlock>
      </SectionLayout>

      {/* Feature Sections */}
      <FeatureSection
        title="What you can do with an"
        highlight="NFT Profile"
        image={backgroundImage}
        contentImage={profileImage}
      />

      <SectionLayout
        sx={{
          minHeight: { sm: "60vh", md: "90vh" },
        }}
      >
        <ContentBlock
          title={
            <>
              <GradientText>Free</GradientText> Trading
            </>
          }
          subtitle="Buy and sell NFTs without any fees through the NFT.com Marketplace"
          buttonText="CREATE PROFILE"
        />
        <ImageBlock image={SocialSection1} />
      </SectionLayout>

      <SectionLayout reverse
        sx={{
          minHeight: { sm: "60vh", md: "90vh" },
        }}
      >
        <ContentBlock
          title={
            <>
              <br />
              <GradientText>Your Identity</GradientText>
            </>
          }
          subtitle="Customize your NFT Profile as an identity that you own and you control"
          buttonText="CREATE PROFILE"
        />
        <ImageBlock image={SocialSection2} />
      </SectionLayout>

      <SectionLayout
        sx={{
          minHeight: { sm: "60vh", md: "90vh" },
        }}
      >
        <ContentBlock
          title={
            <>
              <GradientText>Gain</GradientText> <br />
              Insights
            </>
          }
          subtitle="Stay up to date on latest trends, updates, and alpha in the NFT industry"
          buttonText="CREATE PROFILE"
        />
        <ImageBlock image={SocialSection3} />
      </SectionLayout>

      {/* Build Profile Section */}
      <SectionLayout
        sx={{
          backgroundColor: "orange",
          marginBottom: "0",
          minHeight: { sm: "60vh", md: "100vh" },
        }}
      >
        <ContentBlock
          title="Build your brand with an NFT that is uniquely you"
          buttonText="BUILD PROFILE"
        />
        <ImageBlock
          image={buildProfileImage}
          gradient="rgb(249, 213, 76)"
          sx={{
            backgroundImage: {
              xs: `linear-gradient(180deg, rgba(255, 255, 255, 0), rgb(220, 200, 71)), url(${buildProfileImage})`,
              sm: `linear-gradient(90deg, rgba(255, 255, 255, 0), rgb(220, 200, 71)), url(${buildProfileImage})`,
            },
          }}
        />
      </SectionLayout>
    </main>
  );
}

const NFTIcons = ({ index }) => {
  if (index === 1) {
    return <img src={nft1} alt="NFT Icon" style={iconStyle} />;
  } else if (index === 2) {
    return (
      <img
        src={nft2}
        alt="NFT Icon"
        style={{ ...iconStyle, margin: "0 10px" }}
      />
    );
  }

  return null;
};

const FeatureSection = ({ title, highlight, image, contentImage }) => (
  <Box sx={{ textAlign: "center", my: 8, minHeight: "50vh", }}>
    <Typography
      variant="h3"
      sx={{
        fontWeight: "500", fontSize: { xs: "2rem", md: "3.5rem" },
        mb: 1,
      }}
    >
      {title}
      <br />
      <GradientText>{highlight}</GradientText>
    </Typography>
    <Box
      sx={{
        width: "100%",
        backgroundImage: `url(${image})`, backgroundSize: "cover",
        paddingTop: 2,
      }}
    >
      <img
        src={contentImage}
        alt="NFT Profile"
        style={{ width: "80%", maxWidth: 800, height: "auto" }}
      />
    </Box>
  </Box>
);

// Shared styles
const iconStyle = {
  width: { xs: "10px", sm: "10px", md: "40px", },
  maxWidth: "3.2rem",
  marginLeft: "20px",
  transform: "rotate(35deg)",
  borderRadius: "8px",
  position: "relative",
  top: "0.3em",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
};

export default Home;