import React from 'react';
import { Toaster } from 'react-hot-toast';
import EnrollmentForm from './EnrollmentForm';

const Home = () => {
  return (
    <div className="adv-landing">
      <Toaster position="top-center" reverseOrder={false} />
      <EnrollmentForm />
    </div>
  );
};

export default Home;
