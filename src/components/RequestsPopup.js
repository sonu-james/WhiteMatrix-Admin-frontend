import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ConfirmationPopup from './ConfirmationPopup'; // Import the confirmation popup
import RejectionReasonPopup from './RejectionReasonPopup';
import './requestsPopup.css'; // Create a new CSS file for popup-specific styles

const RequestsPopup = ({ show, closeRequests }) => {
    const popupRef = useRef(null);
    const [pendingUsers, setPendingUsers] = useState([]); // State to store pending users
    const [acceptedUsers, setAcceptedUsers] = useState([]); // State to store accepted users
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedUser, setSelectedUser] = useState(null); // State to store selected user
    const [activeTab, setActiveTab] = useState('pending'); // State for tab management ('pending' or 'accepted')
    const [showConfirmation, setShowConfirmation] = useState(false); // State to manage confirmation popup
    const [showRejectionPopup, setShowRejectionPopup] = useState(false); // State to manage rejection reason popup
    const [isLoading, setIsLoading] = useState(false); // Manage loading state

    // Fetch users from the backend when the popup opens or tab changes
    useEffect(() => {
        if (show) {
            const fetchUsers = async () => {
                try {
                    setLoading(true);
                    if (activeTab === 'pending') {
                        const response = await axios.get('http://localhost:5001/api/users/pending');
                        setPendingUsers(response.data); // Set the pending users data
                    } else if (activeTab === 'accepted') {
                        const response = await axios.get('http://localhost:5001/api/users/accepted'); // Adjust the endpoint for accepted users
                        setAcceptedUsers(response.data); // Set the accepted users data
                    }
                } catch (error) {
                    console.error(`Error fetching ${activeTab} users:`, error);
                } finally {
                    setLoading(false); // Stop loading after fetch
                }
            };
            fetchUsers();
        }
    }, [show, activeTab]);

    // Handle click outside the popup to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closeRequests();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popupRef, closeRequests]);

    const handleVerify = async () => {
        setIsLoading(true);
        if (selectedUser) {
            try {
                // Include the user's data in the request body
                const userData = {
                    email: selectedUser.email,
                    phone: selectedUser.phoneNumber,
                    fullName: selectedUser.fullName,
                    role: 'provider'  // This role can be dynamically assigned based on the user's status
                };
                console.log(userData);
                // Send POST request to verify and create an admin account
                await axios.post(`http://localhost:5001/api/users/verify/${selectedUser._id}`, userData);

                // Remove user from the pending list after successful verification
                setPendingUsers(pendingUsers.filter(user => user._id !== selectedUser._id));
                setSelectedUser(null); // Reset selected user
            } catch (error) {
                console.error('Error verifying user:', error);
            }
            finally {
                setIsLoading(false); // Stop loader
            }
            setShowConfirmation(false); // Close the confirmation popup after verifying
        }
    };


    const downloadFile = () => {
        const base64String = selectedUser.crFile; // Assuming this is the Base64 string
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${base64String}`; // Change mime type if needed
        link.download = 'CRFile.pdf'; // Provide a default name
        link.click();
    };

    const handleReject = async (userId, userDetails) => {
        setIsLoading(true);
        console.log('Rejecting user with ID:', userId); // Log the user ID
        try {
            await axios.post(`http://localhost:5001/api/users/reject/${userId}`, userDetails);
            setPendingUsers(pendingUsers.filter(user => user._id !== userId)); // Remove user from list after rejecting
            setSelectedUser(null); // Reset selected user
        } catch (error) {
            console.error('Error rejecting user:', error);
        }
        finally {
            setIsLoading(false); // Stop loader
        }
    };


    if (!show) return null; // If not visible, don't render

    return (
        <>
            <div className="popup-overlay"></div>
            <div className="popup-window" ref={popupRef}>
                {/* Close Button */}
                <button className="close-button" onClick={closeRequests}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                <h3>Requests</h3>

                {/* Tabs for switching between "Pending" and "Accepted" */}
                <div className="tab-buttons">
                    <button
                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}
                        className={activeTab === 'pending' ? 'active' : ''}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Requests
                        <span className="request-count">{pendingUsers.length}</span> {/* Display pending requests count */}
                    </button>
                    <button
                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}
                        className={activeTab === 'accepted' ? 'active' : ''}
                        onClick={() => setActiveTab('accepted')}
                    >
                        Verified Requests
                        <span className="request-count">{acceptedUsers.length}</span> {/* Display accepted requests count */}

                    </button>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : selectedUser ? (
                    // Display selected user's details
                    <div className='pending-form'>
                        <div style={{ display: 'flex', marginBottom: '10px', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                            <button style={{ backgroundColor: 'transparent', color: '#387CB8', padding: '0' }} onClick={() => setSelectedUser(null)}>
                                <FontAwesomeIcon style={{ fontSize: 'x-large' }} icon={faArrowLeft} />
                            </button>
                            {selectedUser.crFile && (
                                <button type="button" onClick={downloadFile} style={{ padding: '10px 20px', borderRadius: '20px' }}>
                                    Download CR File
                                </button>
                            )}
                        </div>
                        <h4>{selectedUser.username}</h4>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
                        <p><strong>Status:</strong> {selectedUser.verificationStatus}</p>
                        <p><strong>Location:</strong> {selectedUser.location}</p>
                        <p><strong>Description: </strong>{selectedUser.description}</p>
                        <h5 style={{ color: 'black' }}>Authority filling the form:</h5>
                        <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
                        <p><strong>Designation:</strong> {selectedUser.designation}</p>
                        {activeTab === 'pending' && (
                            <>
                                <button style={{ marginRight: '10px' }} onClick={() => setShowConfirmation(true)}>Verify</button>
                                <button onClick={() => setShowRejectionPopup(true)}>Reject</button>
                            </>
                        )}
                    </div>
                ) : (
                    <ul>
                        {activeTab === 'accepted' && (
                            <p style={{ color: 'grey', fontSize: 'small' }}>These requests are accepted by the admin but filling the profile has not yet completed by the provider. It will reach its verification status once provider completed his profile.</p>
                        )}
                        {(activeTab === 'pending' ? pendingUsers : acceptedUsers).length > 0 ? (
                            (activeTab === 'pending' ? pendingUsers : acceptedUsers).map((user) => (
                                <li key={user._id} onClick={() => setSelectedUser(user)}>
                                    <strong>{user.username}</strong> {user.email}
                                </li>
                            ))
                        ) : (
                            <li>No {activeTab} requests.</li>
                        )}
                    </ul>
                )}

                {/* Confirmation Popup for verifying user */}
                <ConfirmationPopup
                    show={showConfirmation}
                    onConfirm={handleVerify}
                    onCancel={() => setShowConfirmation(false)}
                />
                <RejectionReasonPopup
                    show={showRejectionPopup}
                    onConfirm={(reason) => {
                        if (selectedUser && selectedUser._id) {
                            handleReject(selectedUser._id, {
                                username: selectedUser.username,
                                email: selectedUser.email,
                                fullName: selectedUser.fullName,
                                reason
                            });
                            setShowRejectionPopup(false); // Close the rejection popup after confirming
                        } else {
                            console.error('Error: Selected user is not defined.');
                        }
                    }}
                    onCancel={() => setShowRejectionPopup(false)} // Close the popup when canceled
                />
                {isLoading && (
                    <div className="confirmation-overlay">
                        <div className="su-loader"></div>
                    </div>
                )}
            </div>
        </>
    );
};

export default RequestsPopup;
