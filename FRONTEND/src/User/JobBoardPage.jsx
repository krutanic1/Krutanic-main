import React from "react";
import UserLayout from "./UserLayout";
import PostedJob from "./JobBoard";

const JobBoardPage = () => {
  return (
    <UserLayout title="Job Board">
      <PostedJob />
    </UserLayout>
  );
};

export default JobBoardPage;
