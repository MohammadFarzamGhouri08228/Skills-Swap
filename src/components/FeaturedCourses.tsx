import Link from 'next/link';

const courses = [
  {
    id: 1,
    title: 'Web Development Bootcamp',
    category: 'Programming',
    price: 'Paid',
    instructor: 'Jane Smith',
    image: '/images/course1.jpg',
    rating: 4.8,
    students: 1250,
    slug: 'web-development-bootcamp'
  },
  {
    id: 2,
    title: 'Digital Marketing Essentials',
    category: 'Marketing',
    price: 'Free',
    instructor: 'John Doe',
    image: '/images/course2.jpg',
    rating: 4.5,
    students: 980,
    slug: 'digital-marketing-essentials'
  },
  {
    id: 3,
    title: 'Graphic Design Fundamentals',
    category: 'Design',
    price: 'Paid',
    instructor: 'Alice Johnson',
    image: '/images/course3.jpg',
    rating: 4.7,
    students: 850,
    slug: 'graphic-design-fundamentals'
  },
  {
    id: 4,
    title: 'Photography Masterclass',
    category: 'Photography',
    price: 'Paid',
    instructor: 'Michael Brown',
    image: '/images/course4.jpg',
    rating: 4.9,
    students: 1100,
    slug: 'photography-masterclass'
  }
];

export default function FeaturedCourses() {
  return (
    <div className="sc_section">
      <div className="content_wrap">
        <div className="sc_section_header">
          <h2 className="sc_section_title">Featured Courses</h2>
          <h6 className="sc_section_subtitle">Start learning today</h6>
        </div>
        <div className="sc_courses_content">
          <div className="columns_wrap">
            {courses.map((course) => (
              <div key={course.id} className="column-1_4">
                <div className="sc_course">
                  <div className="sc_course_image">
                    <Link href={`/courses/${course.slug}`}>
                      <img src={course.image} alt={course.title} />
                      <div className="sc_course_image_hover"></div>
                    </Link>
                  </div>
                  <div className="sc_course_title">
                    <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                  </div>
                  <div className="sc_course_meta">
                    <div className="sc_course_category">
                      <Link href={`/courses/category/${course.category.toLowerCase()}`}>{course.category}</Link>
                    </div>
                    <div className="sc_course_price">{course.price}</div>
                  </div>
                  <div className="sc_course_info">
                    <div className="sc_course_teacher">
                      <span>by </span>
                      <Link href={`/teachers/${course.instructor.toLowerCase().replace(' ', '-')}`}>{course.instructor}</Link>
                    </div>
                    <div className="sc_course_rating">
                      <span className="rating">{course.rating}</span>
                      <span className="star_rating">★★★★★</span>
                    </div>
                    <div className="sc_course_students">
                      <span>{course.students} students</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="sc_section_button sc_item_button">
          <a href="/courses" className="sc_button sc_button_square sc_button_style_filled sc_button_size_medium">
            View All Courses
          </a>
        </div>
      </div>
    </div>
  );
} 