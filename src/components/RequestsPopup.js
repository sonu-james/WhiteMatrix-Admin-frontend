import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ConfirmationPopup from "./ConfirmationPopup"; // Import the confirmation popup
import RejectionReasonPopup from "./RejectionReasonPopup";
import "./requestsPopup.css"; // Create a new CSS file for popup-specific styles

const RequestsPopup = ({ show, closeRequests, selectedUser }) => {
  const popupRef = useRef(null);

  // Handle click outside the popup to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closeRequests();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef, closeRequests]);
  const downloadFile = () => {
    const base64String = selectedUser.crFile; // Assuming this is the Base64 string
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${base64String}`; // Change mime type if needed
    link.download = "CRFile.pdf"; // Provide a default name
    link.click();
  };

  if (!show || !selectedUser) return null;

  return (
    <>
      <div className="popup-overlay"></div>
      <div className="popup-window" ref={popupRef}>
        <button className="close-button" onClick={closeRequests}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h3>Request Details</h3>
        <div className="pending-form">
          <h4>{selectedUser.username}</h4>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
          <p><strong>Status:</strong> {selectedUser.verificationStatus}</p>
          <p><strong>Location:</strong> {selectedUser.location}</p>
          <p><strong>Description:</strong> {selectedUser.description}</p>
          <h5>Authority filling the form:</h5>
          <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
          <p><strong>Designation:</strong> {selectedUser.designation}</p>
        </div>
        <button onClick={downloadFile} className="download-button">
          Download Uploaded File
        </button>
      </div>
    </>
  );
};

export default RequestsPopup;
