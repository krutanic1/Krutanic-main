import React from 'react';
import MentorshipForm from '../page/MentorshipForm';

const HomePopup = ({ onClose }) => {
    return (
        <MentorshipForm isPopup={true} onClose={onClose} />
    );
};

export default HomePopup;
