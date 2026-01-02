import React from "react";
import UserLayout from "./UserLayout";
import MyJob from "./MyJob";

const MyJobPage = () => {
  return (
    <UserLayout title="My Job Applications">
      <MyJob />
    </UserLayout>
  );
};

export default MyJobPage;
