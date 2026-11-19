// src/data/profileData.js

export const DEFAULT_USER_PROFILE = {
  id: 'me',
  fullName: 'Arjun Mehta',
  email: 'arjun.mehta@campus.edu',
  studentId: 'STU-2023-8841',
  university: 'Apex Institute of Technology & Sciences',
  course: 'B.Tech in Computer Science & Engineering',
  yearOfStudy: '3rd Year (Semester 6)',
  generalLocation: 'Hostel Block B / Central Campus',
  bio: 'Full-stack developer, badminton enthusiast, and book collector. Passionate about open-source projects, weekend hackathons, and finding the best cold coffee spots on campus. Always open to collaborate or swap textbooks!',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  isVerified: true, // Demo verification
  joinedDate: 'August 2023',
  interests: [
    'Web Development',
    'Badminton',
    'Competitive Programming',
    'Sci-Fi Books',
    'Coffee Roasts',
    'Campus Hackathons',
  ],
  stats: {
    totalPosts: 9,
    activeListings: 4,
    completedActivities: 14,
    averageRating: 4.9,
    totalReviews: 18,
  },
};

// LocalStorage helpers to ensure persistence
export const getStoredUserProfile = () => {
  try {
    const data = localStorage.getItem('campusconnect_user_profile');
    return data ? JSON.parse(data) : DEFAULT_USER_PROFILE;
  } catch (e) {
    return DEFAULT_USER_PROFILE;
  }
};

export const saveStoredUserProfile = (updatedProfile) => {
  try {
    localStorage.setItem('campusconnect_user_profile', JSON.stringify(updatedProfile));
  } catch (e) {
    console.error('Failed to save user profile to localStorage', e);
  }
};

// Demo Public Student Profiles for testing /profile/:userId
export const DEMO_STUDENT_PROFILES = {
  'priya-iyer': {
    id: 'priya-iyer',
    fullName: 'Priya Iyer',
    university: 'Apex Institute of Technology & Sciences',
    course: 'B.Tech Electrical & Electronics Engineering',
    yearOfStudy: '4th Year (Semester 8)',
    generalLocation: 'Girls Hostel Block 2 / North Gate',
    bio: 'Robotics lead at IEEE Student Branch. Passionate about embedded systems, classical music, and sustainable campus initiatives. Preparing for campus placements.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    joinedDate: 'July 2022',
    interests: ['Robotics', 'Embedded IoT', 'Classical Music', 'Library Study Groups'],
    stats: {
      totalPosts: 6,
      activeListings: 2,
      completedActivities: 19,
      averageRating: 5.0,
      totalReviews: 15,
    },
  },
  'aditya-verma': {
    id: 'aditya-verma',
    fullName: 'Aditya Verma',
    university: 'Apex Institute of Technology & Sciences',
    course: 'B.Des Industrial & Product Design',
    yearOfStudy: '2nd Year (Semester 4)',
    generalLocation: 'Hostel Block C / Design Studio',
    bio: 'Product designer and cyclist. Looking for companions for morning cycling trails and design critique circles. Frequently renting out study gear and cycles.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    joinedDate: 'September 2024',
    interests: ['Industrial Design', 'Mountain Biking', 'Typography', 'Film Photography'],
    stats: {
      totalPosts: 5,
      activeListings: 3,
      completedActivities: 8,
      averageRating: 4.8,
      totalReviews: 9,
    },
  },
  'rohan-sharma': {
    id: 'rohan-sharma',
    fullName: 'Rohan Sharma',
    university: 'Apex Institute of Technology & Sciences',
    course: 'B.Tech Mechanical Engineering',
    yearOfStudy: '3rd Year (Semester 6)',
    generalLocation: 'Hostel Block 4 / Central Workshop',
    bio: 'Automotive club member and fitness enthusiast. Regularly running errands to the local market and selling verified textbook sets.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    joinedDate: 'August 2023',
    interests: ['Automotive CAD', 'Gym & Nutrition', 'GATE Prep', 'Campus Errands'],
    stats: {
      totalPosts: 12,
      activeListings: 5,
      completedActivities: 22,
      averageRating: 4.9,
      totalReviews: 24,
    },
  },
};

// Combined Cross-Service Listings for "My Listings"
export const USER_MOCK_LISTINGS = [
  {
    id: 'lst-1',
    service: 'Student Marketplace',
    title: 'Thomas Calculus (14th Metric Ed) + Formula Notes',
    category: 'Books & Study Materials',
    date: '2 days ago',
    price: '₹450',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
    link: '/marketplace',
  },
  {
    id: 'lst-2',
    service: 'Campus Errands',
    title: 'Going to City Center Stationers - Can pick up blueprints/drawing sheets',
    category: 'Outside Run',
    date: 'Yesterday, 4:00 PM',
    price: '₹30 tip',
    status: 'In Progress',
    image: null,
    link: '/errands',
  },
  {
    id: 'lst-3',
    service: 'Student Storage',
    title: 'Safe Dry Trunk Space for Semester Break (Hostel B)',
    category: 'Storage Offer',
    date: '3 days ago',
    price: '₹200 / month',
    status: 'Active',
    image: null,
    link: '/storage',
  },
  {
    id: 'lst-4',
    service: 'Rooms & Flatmates',
    title: 'Single Occupancy Room in 3BHK flat near South Gate (Looking for Flatmate)',
    category: 'Flatmate Wanted',
    date: '1 week ago',
    price: '₹5,500 / month',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=300&q=80',
    link: '/rooms',
  },
  {
    id: 'lst-5',
    service: 'Student Marketplace',
    title: 'Sony WH-CH520 Wireless Bluetooth Headphones',
    category: 'Electronics',
    date: '2 weeks ago',
    price: '₹1,800',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
    link: '/marketplace',
  },
];

// Mock Activities for "My Activities" (Find Companions)
export const USER_MOCK_ACTIVITIES = [
  {
    id: 'act-1',
    title: 'Weekend Badminton Doubles Match',
    category: 'Sports & Fitness',
    date: 'Saturday, 6:00 PM',
    location: 'Campus Indoor Sports Complex Court 2',
    role: 'Created by you',
    companionsCount: 3,
    status: 'Upcoming',
  },
  {
    id: 'act-2',
    title: 'Late Night DSA & LeetCode Grind Session',
    category: 'Study & Academics',
    date: 'Friday, 9:00 PM',
    location: 'Central Library 2nd Floor Group Study Pod',
    role: 'Created by you',
    companionsCount: 4,
    status: 'Active',
  },
  {
    id: 'act-3',
    title: 'Street Food Hunt at North Gate Khau Galli',
    category: 'Food & Dining',
    date: 'Last Wednesday',
    location: 'North Campus Gate Chowk',
    role: 'Joined',
    companionsCount: 5,
    status: 'Completed',
  },
  {
    id: 'act-4',
    title: 'Inter-College Hackathon Team (Frontend + Pitch)',
    category: 'Study & Tech',
    date: '2 weeks ago',
    location: 'Innovation Lab Block 3',
    role: 'Joined',
    companionsCount: 4,
    status: 'Completed',
  },
];

// Mock Reviews Received
export const USER_MOCK_REVIEWS = [
  {
    id: 'rev-1',
    reviewerName: 'Karan Mehra',
    reviewerDept: 'Civil Engg, 4th Year',
    reviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '3 days ago',
    service: 'Student Marketplace',
    comment:
      'Arjun was super prompt! Bought the engineering drawing board from him; condition was exactly as described and he even met me right outside the hostel lobby.',
  },
  {
    id: 'rev-2',
    reviewerName: 'Sneha Patel',
    reviewerDept: 'Biotechnology, 3rd Year',
    reviewerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '1 week ago',
    service: 'Campus Errands',
    comment:
      'Super helpful errand run. Picked up emergency lab manuals for our batch from the print center during monsoon rain. Very reliable student!',
  },
  {
    id: 'rev-3',
    reviewerName: 'Aditya Verma',
    reviewerDept: 'Product Design, 2nd Year',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2 weeks ago',
    service: 'Find Companions',
    comment:
      'Great companion for weekend badminton. Punctual, friendly, and kept the match energetic. Looking forward to more games!',
  },
  {
    id: 'rev-4',
    reviewerName: 'Tanvi Nair',
    reviewerDept: 'Architecture, 4th Year',
    reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 4,
    date: '1 month ago',
    service: 'Student Storage',
    comment:
      'Stored two travel suitcases during winter break. Belongings were kept safe and dry in the trunk space. Smooth handoff on return day.',
  },
];