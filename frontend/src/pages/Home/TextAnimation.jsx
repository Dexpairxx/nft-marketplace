// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { useState, useEffect } from "react";

const TextAnimation = ({ texts, intervalSeconds }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, intervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [texts, intervalSeconds]);

  return <span>{texts[currentIndex]}</span>;
};

export default TextAnimation;