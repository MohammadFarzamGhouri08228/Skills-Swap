import React from "react";
import MarqueeOne from "@/common/MarqueeOne";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterOne from "@/layouts/footers/FooterOne";

const HomeOne = () => {
	return (
		<> 
			<HeaderOne />
			<main className="main-wrapper">
				<div className="container">
					<h1>Welcome to SkillSwap</h1>
					<p>A platform for sharing and learning skills</p>
				</div>
			</main>
			<MarqueeOne />
			<FooterOne />      
		</>
	);
};

export default HomeOne; 