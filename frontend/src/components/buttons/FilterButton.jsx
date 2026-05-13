// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { useState } from "react";
import { Button, Box, Paper, TextField, Divider, ToggleButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

function FilterButton({ onApply }) {

  // State for filter sections
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [selectedTags, setSelectedTags] = useState([]);

  // States for collapsing sections 
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);

  // Available tags, currently hard coded for Assignment 1
  const availableTags = ["trending", "abstract", "landscape", "portrait", "animal", "pixelated"];

  // Toggle functions for each section
  const togglePriceSection = () => setIsPriceOpen(!isPriceOpen);
  const toggleDateSection = () => setIsDateOpen(!isDateOpen);
  const toggleTagsSection = () => setIsTagsOpen(!isTagsOpen);

  // Update price input as user types, but only allow digits.
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    if (!/^\d*$/.test(value)) return;
    setPriceRange({ ...priceRange, [name]: value });
  };

  // Validate the price fields on blur.
  const handlePriceBlur = (e) => {
    const { name, value } = e.target;
    if (name === "max" && priceRange.min !== "" && value !== "") {
      if (parseInt(value, 10) < parseInt(priceRange.min, 10)) {
        setPriceRange((prev) => ({ ...prev, max: "" }));
      }
    }
    if (name === "min" && value !== "" && priceRange.max !== "") {
      if (parseInt(value, 10) > parseInt(priceRange.max, 10)) {
        setPriceRange((prev) => ({ ...prev, max: "" }));
      }
    }
  };

  // Update date input as user types.
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange({ ...dateRange, [name]: value });
  };

  // Validate the date fields on blur.
  const handleDateBlur = (e) => {
    const { name, value } = e.target;
    if (name === "endDate" && dateRange.startDate && value < dateRange.startDate) {
      setDateRange((prev) => ({ ...prev, endDate: "" }));
    }
    if (name === "startDate" && dateRange.endDate && value > dateRange.endDate) {
      setDateRange((prev) => ({ ...prev, endDate: "" }));
    }
  };

  // Toggle tag selection on click
  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Apply handler returns an array with price, date, and tags filters.
  const handleApplyFilters = () => {
    const priceArray = [priceRange.min, priceRange.max];
    const dateArray = [dateRange.startDate, dateRange.endDate];
    const appliedFilters = [priceArray, dateArray, selectedTags];

    if (onApply) onApply(appliedFilters);
    setShowFilters(false);
  };

  // Reset handler to clear all filters
  const handleResetFilters = () => {
    setPriceRange({ min: "", max: "" });
    setDateRange({ startDate: "", endDate: "" });
    setSelectedTags([]);
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "flex-start",
        marginTop: "20px",
        mx: "5%",
      }}
    >
      {/* Interactive Filter Button */}
      <Button
        variant="contained"
        startIcon={showFilters ? <CloseIcon /> : <FilterListIcon />}
        onClick={() => setShowFilters(!showFilters)}
        sx={{
          backgroundColor: showFilters ? "white" : "black",
          color: showFilters ? "black" : "white",
          "&:hover": { backgroundColor: showFilters ? "#ddd" : "#333" },
          textTransform: "none",
          borderRadius: "20px",
          padding: "8px 16px",
          border: "2px solid black",
        }}
      >
        Filter
      </Button>

      {/* Paper container for each filter section */}
      {showFilters && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: 50,
            zIndex: 3,
            minWidth: "320px",
            p: 2,
            backgroundColor: "white",
            borderRadius: "8px",
            width: "350px",
            left: { xs: '50%', md: 0 },
            transform: { xs: 'translateX(-50%)', md: 'none' },
          }}
        >
          {/* Price Filter Section */}
          <Box sx={{ mb: 2 }}>
            <Button
              fullWidth
              onClick={togglePriceSection}
              sx={{
                justifyContent: "space-between",
                color: "#333",
                textTransform: "none",
                fontSize: "0.875rem"
              }}
            >
              Price
              {isPriceOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Button>
            {isPriceOpen && (
              <Box sx={{ pl: 2, mt: 1 }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "space-between" }}>
                  <TextField
                    name="min"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={handlePriceChange}
                    onBlur={handlePriceBlur}
                    size="small"
                    sx={{ width: 110, backgroundColor: "#f5f5f5" }}
                  />
                  <span>to</span>
                  <TextField
                    name="max"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={handlePriceChange}
                    onBlur={handlePriceBlur}
                    size="small"
                    sx={{ width: 110, backgroundColor: "#f5f5f5" }}
                  />
                </Box>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Date Filter Section */}
          <Box sx={{ mb: 2 }}>
            <Button
              fullWidth
              onClick={toggleDateSection}
              sx={{
                justifyContent: "space-between",
                color: "#333",
                textTransform: "none",
                fontSize: "0.875rem"
              }}
            >
              Date
              {isDateOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Button>
            {isDateOpen && (
              <Box sx={{ pl: 2, mt: 1 }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "space-between" }}>
                  <TextField
                    type="date"
                    name="startDate"
                    label="From"
                    value={dateRange.startDate}
                    onChange={handleDateChange}
                    onBlur={handleDateBlur}
                    size="small"
                    sx={{
                      width: 140,
                      "& input": { color: "#7f7f7f", backgroundColor: "#f5f5f5" }
                    }}
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                  <span>-</span>
                  <TextField
                    type="date"
                    name="endDate"
                    label="To"
                    value={dateRange.endDate}
                    onChange={handleDateChange}
                    onBlur={handleDateBlur}
                    size="small"
                    sx={{
                      width: 140,
                      "& input": { fontSize: "1rem", color: "#7f7f7f", backgroundColor: "#f5f5f5" }
                    }}
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Tags Filter Section with toggle buttons */}
          <Box sx={{ mb: 2 }}>
            <Button
              fullWidth
              onClick={toggleTagsSection}
              sx={{
                justifyContent: "space-between",
                color: "#333",
                textTransform: "none",
                fontSize: "0.875rem"
              }}
            >
              Tags
              {isTagsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Button>
            {isTagsOpen && (
              <Box
                sx={{
                  pl: 2,
                  mt: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  rowGap: 1,
                  columnGap: 1,
                  alignContent: 'flex-start',
                }}
              >
                {availableTags.map((tag) => (
                  <ToggleButton
                    key={tag}
                    value={tag}
                    selected={selectedTags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                    sx={{
                      border: "2px solid black",
                      borderRadius: "16px",
                      textTransform: "none",
                      padding: "1px 8px",
                      flexShrink: 0,
                      minWidth: 'auto',
                      backgroundColor: "#f5f5f5",
                      color: "black",
                      "&.Mui-selected": {
                        backgroundColor: "black",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                          color: "black",
                        }
                      },
                      "&:hover": {
                        backgroundColor: "black",
                        color: "white",
                      }
                    }}
                  >
                    {tag}
                  </ToggleButton>
                ))}
              </Box>
            )}
          </Box>

          {/* Final Apply and Reset Buttons for all filters */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleApplyFilters}
            sx={{
              mt: 2,
              borderRadius: "10px",
              fontWeight: "bold",
              borderColor: "orange",
              backgroundColor: "#ec9904",
              color: "white",
              "&:hover": { backgroundColor: "white", borderColor: "orange", color: "orange" }
            }}
          >
            Apply
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleResetFilters}
            sx={{
              mt: 1,
              borderRadius: "10px",
              fontWeight: "bold",
              borderColor: "red",
              backgroundColor: "#ff5555",
              color: "white",
              "&:hover": { backgroundColor: "white", borderColor: "red", color: "red" }
            }}
          >
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default FilterButton;