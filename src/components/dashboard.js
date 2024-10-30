import React, { useState, useRef, useEffect } from 'react';
import { faEnvelope, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Sidebar from './sidebar'; // Ensure correct path
import './dashboard.css'; // Ensure correct path
import AddCourseForm from './AddCourseForm';
import EditCourseForm from './EditCourseForm';
import AddAcademyForm from './AddAcademyForm';
import ManageCourses from './ManageCourses';
import AddParentForm from './AddParentForm';
import AddStudentForm from './AddStudentForm';
import AddBannerForm from './AddBannerForm';
import EditBannerForm from './EditBannerForm';
import AddPosterForm from './AddPosterForm';
import EditPosterForm from './EditPosterForm';
import AddCourseCategoryForm from './AddCourseCategory';
import EditCourseCategoryForm from './EditCourseCategoryForm';
import EditParentForm from './EditParentForm';
import EditStudentForm from './EditStudentForm';
import ManageAcademy from './ManageAcademy';
import RequestsPopup from './RequestsPopup';
import AddAdvertisement from './AddAdvertisement1';
import AddAdvertisement2 from './AddAdvertisement2';
import EditAdvertisementForm from './EditAdvertisement';
import PromoteCourse from './PromoteCourse';
import { Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import ChangePasswordForm from './ChangePasswordForm';
import Logo from './assets/images/logo2.png';
import ViewAcademy from './ViewAcademy';
import ViewCourses from './ViewCourses';
import RequestDetails from './RequestDetails';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState(''); // 'poster' or 'student'
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false); // New state
    const [adminId, setAdminId] = useState('');
    const [adminRole, setAdminRole] = useState('');
    const [pendingCount, setPendingCount] = useState(0); // State to store pending requests count
    const [Name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Manage loading state


    useEffect(() => {
        // Retrieve adminId and adminRole from sessionStorage
        const storedId = sessionStorage.getItem('adminId');
        const storedRole = sessionStorage.getItem('adminRole');
        const storedName = sessionStorage.getItem('Name');
        const storedEmail = sessionStorage.getItem('email');
        const storedUser = sessionStorage.getItem('userid');


        if (storedId && storedRole) {
            setAdminId(storedId);
            setAdminRole(storedRole);
            setName(storedName);
            setEmail(storedEmail);
            setUser(storedUser);


        }
    }, []);
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const handleSignOut = () => {
        // Clear sessionStorage values for adminId, adminRole, and Name
        sessionStorage.removeItem('adminId');
        sessionStorage.removeItem('adminRole');
        sessionStorage.removeItem('Name');
        sessionStorage.removeItem('email');


        // Redirect to the homepage
        window.location.replace('/');
    };
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/users/pending');
                setPendingCount(response.data.length);  // Set pending count based on API response
            } catch (error) {
                console.error(`Error fetching pending users:`, error);  // Handle errors
            }
        };

        fetchUsers();  // Call fetchUsers when component mounts
    }, [setPendingCount]);  // Dependency array (no need to put `setPendingCount` in the array unless it comes from props)

    const handleChangePassword = () => {
        setShowChangePasswordForm(true);
    };

    const handleCloseChangePasswordForm = () => {
        setShowChangePasswordForm(false);
    };
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleConfirmDelete = async () => {
        setIsLoading(true);
        if (itemToDelete) {
            try {
                if (deleteType === 'poster') {
                    await axios.delete(`http://localhost:5001/api/posters/${itemToDelete._id}`);
                } else if (deleteType === 'student') {
                    await axios.delete(`http://localhost:5001/api/student/delete/${itemToDelete._id}`);
                }
                setItemToDelete(null);
                setDeleteType('');
                setShowPopup(false);
                setIsLoading(false);
                alert('Succesfully deleted!');
                window.location.reload();
            } catch (error) {
                console.error('Error deleting item:', error);
                setIsLoading(false);
            }
        }
    };

    const handleDeletePoster = (poster) => {
        setItemToDelete(poster);
        setDeleteType('poster');
        togglePopup();
    };

    const handleDeleteStudent = (student) => {
        setItemToDelete(student);
        setDeleteType('student');
        togglePopup();
    };
    const [showRequests, setShowRequests] = useState(false); // Track requests list visibility
    const requestsRef = useRef(null); // Create a reference for the requests list
    const popupRef = useRef(null); // Reference for the popup window

    const toggleRequests = () => {
        setShowRequests(!showRequests); // Toggle requests list visibility
    };

    const closeRequests = () => {
        setShowRequests(false); // Close the requests list
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (requestsRef.current && !requestsRef.current.contains(event.target)) {
                setShowRequests(false); // Close if click is outside of requests container
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [requestsRef]);
    if (!adminRole) {
        return <div className="no-access">You do not have access to the dashboard.</div>;
    }
    return (
        <div className="dashboard-body">
            <div className="hamburger-menu" onClick={toggleSidebar}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className='header-dash'>
                <img className='dash-logo' src={Logo}></img>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                    <h1>Activity Manager</h1>
                    {adminRole === 'admin' && (
                        <>
                            <div className='request-div' style={{ alignSelf: 'flex-end', display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '10%', fontSize: 'x-large', fontWeight: 'bold', color: 'black', cursor: 'pointer' }} onClick={toggleRequests}>
                                <FontAwesomeIcon style={{ marginRight: '5px' }} icon={faEnvelope} /> Requests
                                {pendingCount > 0 && (
                                    <span className="request-count">{pendingCount}</span>
                                )}
                            </div>
                        </>
                    )}
                    {showRequests && (
                        <RequestDetails show={showRequests} closeRequests={closeRequests} />
                    )}
                </div>

            </div>
            <div className={`dashboard-card ${sidebarOpen ? 'expanded' : ''}`}>

                <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`dashboard-content ${sidebarOpen ? 'expanded' : ''}`}>
                    {adminRole === 'admin' && (
                        <>
                            <section id="academies" className="db-section">
                                <ViewAcademy />
                                {/* <AddAcademyForm /> */}
                                {/* <EditAcademyForm /> */}
                            </section>
                            <section id="courses" className="db-section">
                                <ViewCourses />
                                {/* <AddCourseForm /> */}
                                <PromoteCourse />
                                {/* <EditCourseForm /> */}
                            </section>

                            <section id="parents" className="db-section">
                                <AddParentForm />
                                <EditParentForm />
                            </section>
                            <section id="students" className="db-section">
                                <AddStudentForm />
                                <EditStudentForm onDelete={handleDeleteStudent} />
                            </section>
                            <section id="add-banners" className="db-section">
                                <EditBannerForm />
                                <AddBannerForm />
                            </section>
                            <section id="event-posters" className="db-section">
                                <EditPosterForm onDelete={handleDeletePoster} />
                                <AddPosterForm />
                            </section>
                            <section id="advertisements" className="db-section">
                                <EditAdvertisementForm />
                                <AddAdvertisement />
                                <AddAdvertisement2 />
                            </section>
                            <section id="course-categories" className="db-section">
                                <EditCourseCategoryForm />
                                <AddCourseCategoryForm />
                            </section>
                            <section id="settings" className="db-section">
                                <div className="settings-content">
                                    <button className="sidebar-heading-button" onClick={handleChangePassword}>
                                        <FontAwesomeIcon icon={faRedoAlt} className="icon" />

                                        Change Password
                                    </button>
                                    <Divider style={{ margin: '10px 0' }} />
                                    <button className="sidebar-heading-button" onClick={handleSignOut}>
                                        <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                                        Sign Out
                                    </button>
                                </div>
                            </section>
                        </>
                    )}
                    {adminRole === 'provider' && (
                        <>
                            <section id="academies" className="db-section">
                                <ManageAcademy />
                            </section>
                            <section id="courses" className="db-section">
                                <ManageCourses />
                            </section>

                            <section id="settings" className="db-section">
                                <div className="settings-content">
                                    <button className="sidebar-heading-button" onClick={handleChangePassword}>
                                        <FontAwesomeIcon icon={faRedoAlt} className="icon" />
                                        Change Password
                                    </button>
                                    <Divider style={{ margin: '10px 0' }} />
                                    <button className="sidebar-heading-button" onClick={handleSignOut}>
                                        <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                                        Sign Out
                                    </button>
                                </div>
                            </section>
                        </>
                    )}
                    {showChangePasswordForm && (
                        <div className="change-password-overlay">
                            <div className="change-password-container">
                                <button className="close-button" onClick={handleCloseChangePasswordForm}>
                                    &times;
                                </button>
                                <ChangePasswordForm adminId={adminId} />
                            </div>
                        </div>
                    )}
                </div>

                {showPopup && (
                    <>
                        <div className="confirm-popup-overlay" onClick={togglePopup}></div>
                        <div className="confirm-popup">
                            <p>Are you sure you want to delete this {deleteType === 'poster' ? 'poster' : 'student'}?</p>
                            <button onClick={handleConfirmDelete}>Confirm Delete</button>
                            <button onClick={togglePopup}>Cancel</button>
                        </div>
                    </>
                )}
                {showSuccessMessage && (
                    <div className="pop-success-message">
                        {deleteType === 'poster' ? 'Poster deleted successfully.' : 'Student deleted successfully.'}
                    </div>
                )}
                {isLoading && (
                    <div style={{ display: 'flex', flexDirection: 'column' }} className="confirmation-overlay">
                        <p style={{ zIndex: '1000', color: 'white' }}>Please wait till process is completed</p>
                        <div className="su-loader"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
