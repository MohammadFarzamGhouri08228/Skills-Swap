"use client"
import UseSticky from "@/hooks/UseSticky";
import React, { useState, useEffect } from "react";
 

const ScrollToTop = () => {
  const { sticky }: { sticky: boolean } = UseSticky();

  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, []);

   
  const styles = {
    position: "fixed" as const,
    bottom: "15px",
    right: "15px",
    opacity: sticky ? 1 : 0,
    cursor: "pointer"
  };

  return (
    <> 

      <div id="topcontrol" className="topcontrol" onClick={scrollTop} style={styles}>
        <i className="fa-solid fa-arrow-up scrolltop"></i>
        </div>

    </>
  );
};

export default ScrollToTop;
