interface DataType {
	id: number;
	title: string;
	link: string;
	has_dropdown?: boolean;
	sub_menus?: {
		link: string;
		title: string;
	}[];
}
// menu data
const menu_data: DataType[] = [
	{
		id: 1,
		title: "Home",
		link: "#",
		has_dropdown: true,
		sub_menus: [
			{ link: "/user", title: "User Dashboard" },
			{ link: "/home-2", title: "Home Two" },
		],
	}, 
	{
		id: 2,
		title: "Skills",
		link: "#",
		has_dropdown: true,
		sub_menus: [
			{ link: "/skills", title: "Skills List" },
			{ link: "/user/bookings", title: "Bookings" },
			{ link: "/my-skills", title: "My Skills" },
			{ link: "/course-details", title: "Course Details" },
		],
	},

	{
		id: 3,
		title: "Pages",
		link: "#",
		has_dropdown: true,
		sub_menus: [
			{ link: "/grid-blog", title: "Grid Blog" },
			{ link: "/standard-blog", title: "Standard Blog" },
			{ link: "/blog-details", title: "Blog Details" },
			{ link: "/cart", title: "Cart" },
			{ link: "/checkout", title: "Checkout" },
			{ link: "/login", title: "Login" },
			{ link: "/register", title: "Register" },
			{ link: "/about", title: "About" },
			{ link: "/instructors", title: "Instructors" },
			{ link: "/erorr", title: "404 || Error" },
		],
	},
	{
		id: 4,
		title: "Blog",
		link: "#",
		has_dropdown: true,
		sub_menus: [
			{ link: "/grid-blog", title: "Grid Blog" },
			{ link: "/standard-blog", title: "Standard Blog" },
			{ link: "/blog-details", title: "Blog Details" },
		],
	},
	{
		id: 5,
		title: "Contact",
		link: "/contact",
		has_dropdown: false,
	},
];
export default menu_data;
