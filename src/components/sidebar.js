import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSchool, faTags, faUsers, faUserGraduate, faBullhorn, faImages, faAd, faCog } from '@fortawesome/free-solid-svg-icons';
import profileImage from './assets/images/profile.png';
import './dashboard.css';

const Sidebar = ({ sidebarOpen, toggleSidebar, onSignOut, onChangePassword }) => {
    const [activeItem, setActiveItem] = useState('academies');
    const sectionRefs = useRef({});
    const [adminId, setAdminId] = useState('');
    const [adminRole, setAdminRole] = useState('');
    const [Name, setName] = useState('');
    const [user, setUser] = useState({
        academyImg: null, // Store the file object
        logo: null,       // Store the file object
    });
    useEffect(() => {
        // Retrieve adminId and adminRole from sessionStorage
        const storedId = sessionStorage.getItem('adminId');
        const storedRole = sessionStorage.getItem('adminRole');
        const storedName = sessionStorage.getItem('Name');


        if (storedId && storedRole) {
            setAdminId(storedId);
            setName(storedName);
            setAdminRole(storedRole.charAt(0).toUpperCase() + storedRole.slice(1).toLowerCase());
        }
    }, []);
    useEffect(() => {
        const fetchUserDetails = async () => {
            const userId = sessionStorage.getItem('userid');
            try {
                const response = await fetch(`http://localhost:5001/api/users/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user details.');
                }
                const userData = await response.json();

                // Update user state with the fetched data including the logo
                setUser({
                    ...userData,
                    logo: userData.logo, // Assuming userData.logo is base64 encoded
                });

                // Show the form if the verification status is 'accepted'
                if (userData.verificationStatus === 'accepted') {
                    // Add logic if needed
                }
            } catch (err) {
                console.log(err.message);
            }
        };

        fetchUserDetails();
    }, []);

    useEffect(() => {
        const sections = ['academies', 'courses', 'parents', 'students', 'add-banners', 'event-posters', 'advertisements', 'course-categories', 'settings'];

        sections.forEach(section => {
            sectionRefs.current[section] = document.getElementById(section);
        });

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveItem(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => {
            const ref = sectionRefs.current[section];
            if (ref) observer.observe(ref);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    const icons = {
        courses: faBook,
        academies: faSchool,
        'course-categories': faTags,
        parents: faUsers,
        students: faUserGraduate,
        'add-banners': faBullhorn,
        'event-posters': faImages,
        settings: faCog,
        advertisements: faAd, // or faBullseye or faMegaphone

    };

    const handleItemClick = (item) => {
        setActiveItem(item);
        const section = document.getElementById(item);

        if (section) {
            window.scrollTo({
                top: section.offsetTop,
                behavior: 'smooth',
            });
        }

        if (window.innerWidth <= 768) {
            toggleSidebar(); // Close sidebar on smaller screens
        }
    };

    const allowedSectionsByRole = {
        admin: ['academies', 'courses', 'parents', 'students', 'add-banners', 'event-posters', 'advertisements', 'course-categories', 'settings'],
        provider: ['academies', 'courses', 'settings'],
    };
    const allowedSections = allowedSectionsByRole[adminRole.toLowerCase()] || [];

    return (
        <div className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
            <div className="profile-section">
                {user.logo ? (<img src={`data:image/jpeg;base64,${user.logo}`} alt={`${user.username}'s logo`} className="use-logo" />) : (<img src={profileImage} alt="Profile" />)}
                <div className="profile-info">
                    <h4 style={{ margin: '0' }}>{Name}</h4>
                    <p>{adminRole}</p>
                </div>
            </div>
            {/* <h1 className="sidebar-heading">Dashboard</h1> */}
            <nav>
                <ul>
                    {allowedSections.map(section => (
                        <li key={section} className={activeItem === section ? 'active' : ''} onClick={() => handleItemClick(section)}>
                            <a href={`#${section}`}>
                                <FontAwesomeIcon icon={icons[section]} className="icon" />
                                {section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}
                            </a>
                        </li>
                    ))}

                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
