import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faMagnifyingGlass, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import './ActivityProviders.css';
import axios from 'axios';
import RequestDetails from './RequestDetails';




function ActivityProviders() {
    const [Users, setUsers] = useState([]);// State to store all users
    const [showRequests, setShowRequests] = useState(false); // Track requests list visibility
    const [loading, setLoading] = useState(true); // Loading state


    const fetchUsers = async () => {
        try {
            setLoading(true);
           
                const response = await axios.get('http://localhost:5001/api/users/allUser') ;
                console.log(response.data);
                setUsers(response.data); // Set the all user data
                // } else if (activeTab === 'accepted') {
                //     const response = await axios.get('http://localhost:5001/api/users/accepted'); // Adjust the endpoint for accepted users
                //     setAcceptedUsers(response.data); // Set the accepted users data
        
        } catch (error) {
            console.error('There was an error fetching the users!', error);
              
        } finally {
            setLoading(false); // Stop loading after fetch
        }
    };

    const toggleRequests = () => {
        setShowRequests(!showRequests); // Toggle requests list visibility
    };


    const closeRequests = () => {
        setShowRequests(false); // Close the requests list
    };

    useEffect(() => {
        fetchUsers();
    }, [])
  return (
    <>

<div className='activity-container'>
                <div className='activity-heading'> <h1>Activity Providers</h1>
                </div>
                {loading?(
                    <h1 style={{display:'flex',alignItems:'center',justifyContent:'center', color:'red'}}> Loading</h1>
                ): Users?.length>0 ?( <div className='activity-table-container'>
                    <h4>Activity Providers</h4>
                    <table className='activity-details '>
                        <thead>
                            <th>Academy Name </th>
                            <th> Request Date</th>
                            <th> Address</th>
                            <th>Contact Number</th>
                            <th>Actions</th>

                        </thead>
                        <tbody>
                            {Users?.map((item)=>(<tr>
                                {/* {console.log(item) } */}
                                <td> <div className='activity-profile-container'>
                                    <div className='activity-img'><img src={item.logo}></img></div>
                                    <td id='activity-profile-name'> {item?.username}</td>
                                </div></td>

                                <td >{item.requestFiledDate}</td>
                                <td className='activity-address'> {item?.fullName},{item?.designation},{item?.location},{item?.licenceNo}</td>
                                <td >{item?.phoneNumber}</td>

                                <td>
                                    <div style={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex', padding: '5px' }} >
                                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#115ea6", }} size='2x'   onClick={toggleRequests} />
                                        {showRequests && (
                                        <RequestDetails show={showRequests} closeRequests={closeRequests} />
                                        )}
                                       
                                    </div>

                                </td>
                            </tr>))
                            }

                        </tbody>
                    </table>
                  
                </div>):  <p style={{display:'flex',alignItems:'center',justifyContent:'center',color:'red',fontSize:'30px',marginTop:'70px'}}>
                    Nothing to Display   </p>}


            </div>
    
    </>
  )
}

export default ActivityProviders