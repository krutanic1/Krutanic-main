import React from "react";
import UserLayout from "./UserLayout";
import ResumeATS from "./ResumeATS";

const ResumeATSPage = () => {
  return (
    <UserLayout title="ATS Checker">
      <ResumeATS />
    </UserLayout>
  );
};

export default ResumeATSPage;
