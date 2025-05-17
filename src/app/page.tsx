import HomeOne from "@/components/homes/home"; 
import Wrapper from "@/layouts/Wrapper";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "SkillSwap - Online Course & Education Platform",
	description: "A platform for sharing and learning skills",
	keywords: "Skill sharing, online learning, education platform",
};

const index = () => {
	return (
		<Wrapper>
			<HomeOne />    
		</Wrapper>
	);
};

export default index;
