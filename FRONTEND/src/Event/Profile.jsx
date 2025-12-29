import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userEmail = localStorage.getItem("eventuserEmail");
  const userId = localStorage.getItem("eventuserId");
  const [file, setFile] = useState(null);
 

  const fetchEventUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API}/alleventregistrations`);
      setUsers( response.data.filter((item) => item.email && item.email === userEmail));
    } catch (error) {
      console.error("There was an error fetching the event users", error);
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileSizeKB = selectedFile.size / 1024; // Convert bytes to KB
      if (fileSizeKB > 50) {
        toast.error("File size must be under 50KB!");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const response = await axios.post(
          `${API}/upload-profile-photo/${userId}`,
          {
            image: reader.result,
          }
        );

        if (response.status === 200) {
          toast.success("Profile photo updated successfully!");
          fetchEventUsers();
          setFile(null);
        } else {
          toast.error("Upload failed. Please try again.");
        }
      } catch (error) {
        console.error("Upload Error:", error);
        toast.error("Error uploading photo.");
      }
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (userEmail) {
      fetchEventUsers();
    } else {
      setError("No user email found. Please log in.");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="eventheight flex items-center justify-center">
        <p className="text-white">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="eventheight flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const applicationData = users?.[0]?.applicationData || [];

  return (
    <div className="eventheight">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="backdrop-blur-2xl bg-[#9e9a9a46] profile h-full">
        <div className="p-1 border-r-2 border-[#0808083a]">
          {users.length > 0 ? (
            users.map((user, index) => (
              <div key={index} className="space-y-6 text-center p-3 bg-gradient-to-r from-white to-purple-500 text-transparent bg-clip-text">
                <div className="flex flex-col items-center gap-4">
                  <form
                    onSubmit={handleUpload}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="relative group">
                      <img
                        src={user.profilePhoto || "/default-avatar.png"}
                        alt="Profile"
                        className="w-28 h-28 rounded-full object-cover border-4 border-purple-500 shadow-lg"
                      />
                      <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <i className="fa fa-edit text-white text-xl"></i>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 active:bg-purple-500 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-md"
                    >
                      Update
                    </button>
                  </form>
                </div>

                <h2 className="text-2xl font-semibold">
                  {/* <span className="font-bold">Name: </span> */}
                  {user.name}
                </h2>
                <h2 className="text-xl font-semibold">
                  {/* <span className="font-bold">Email: </span> */}
                  {/* {user.email} */}
                </h2>
                <h2 className="text-xl font-semibold">
                  {/* <span className="font-bold">Phone No: </span> */}
                  {/* {user.phone} */}
                </h2>
                <h2 className="text-xl font-semibold">
                  <span className="font-bold">Krutanic Coins: </span>
                  {user.totalCoins}
                </h2>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-black text-center">
                No profile data found for this email.
              </p>
            </div>
          )}
          <div className="text-center mt-5 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-black gradient-text">
              | Follow Us
            </h2>
            <p className=" text-lg text-black">
              Stay updated with the latest news and announcements on our social
              channels.
            </p>
            <div className=" flex justify-center gap-6">
              <a
                target="_blank"
                href="https://www.facebook.com/people/Krutanic-Solutions/61563953173071/"
                className="text-blue-500 text-4xl hover:text-blue-700"
              >
                <span className="fa fa-facebook"></span>
              </a>
              <a
                target="_blank"
                href="https://www.youtube.com/@KrutanicSolutions"
                className="text-red-800 text-4xl hover:text-red-900"
              >
                <span className="fa fa-youtube"></span>
              </a>
              <a
                target="_blank"
                href="https://www.instagram.com/krutanic"
                className="text-pink-500 text-4xl hover:text-pink-700"
              >
                <span className="fa fa-instagram"></span>
              </a>
              <a
                target="_blank"
                href="https://www.linkedin.com/company/krutanic/"
                className="text-blue-700 text-4xl hover:text-blue-900"
              >
                <span className="fa fa-linkedin"></span>
              </a>
              <a
                target="_blank"
                href="https://github.com/Krutanic/"
                className="text-black text-4xl"
              >
                <span className="fa fa-github"></span>
              </a>
            </div>
          </div>
        </div>

        <div className="p-4 scrollbar-hidden">
          <h2 className="text-2xl text-white font-bold text-center">
            Events Details
          </h2>
          <div className="rounded-xl mt-3 overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <th className=" px-4 py-2">SL No</th>
                  <th className=" px-4 py-2">Events</th>
                  <th className=" px-4 py-2">Date & Time</th>
                  <th className=" px-4 py-2">Coins</th>
                </tr>
              </thead>
              <tbody>
                {applicationData.length > 0 ? (
                  applicationData.map((user, index) => (
                    <tr
                      key={index}
                      className="bg-white odd:bg-gray-100 text-center"
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className=" px-4 py-2">{user.remarks || "N/A"}</td>
                      <td className=" px-4 py-2">
                        {new Date(user.createdAt).toLocaleString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td className=" px-4 py-2">
                        {user.coin !== null ? user.coin : "Not Assigned"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center px-4 py-2">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
