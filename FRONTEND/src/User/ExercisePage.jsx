import React from "react";
import UserLayout from "./UserLayout";
import Exercise from "./Excercise";

const ExercisePage = () => {
  return (
    <UserLayout title="Exercise Prep">
      <Exercise />
    </UserLayout>
  );
};

export default ExercisePage;
