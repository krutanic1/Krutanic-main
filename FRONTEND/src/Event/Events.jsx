import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const Events = () => {
  const [users, setUsers] = useState([]);
  const [event, setEvent] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [appliedUsers, setAppliedUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const userId = localStorage.getItem("eventuserId");
  const userName = localStorage.getItem("eventUserName");

  const fetchEventUsers = async () => {
    try {
      const response = await axios.get(`${API}/alleventregistrations`);
      // console.log("event users", response.data);
      setUsers(response.data);
      const sortedUsers = response.data.sort(
        (a, b) => b.totalCoins - a.totalCoins
      );
      setLeaderboard(sortedUsers);
    } catch (error) {
      console.error("There was an error fetching the event users", error);
    }
  };

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${API}/allevents`);
      // console.log("event", response.data);
      setEvent(
        response.data?.filter((item) => item.status === "Upcoming Events")
      );
      setOngoing(response.data?.filter((item) => item.status === "Ongoing"));
      setCompleted(
        response.data?.filter((item) => item.status === "Completed")
      );
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleApply = async (event) => {
    try {
      if (!userId || !event) {
        toast.error("User ID or Event is missing.");
        return;
      }
      const response = await axios.post(`${API}/eventapplications`, {
        userId,
        eventId: event._id,
        remarks: event.title,
      });
      toast.success("Applied Successfully!");
      fetchAppliedUsers();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Already Applied");
    }
  };

  const fetchAppliedUsers = async () => {
    try {
      const response = await axios.get(`${API}/eventapplications`);
      setAppliedUsers(response.data);
    } catch (error) {
      console.error("Error fetching applied users:", error);
    }
  };

  useEffect(() => {
    fetchEvent();
    fetchAppliedUsers();
    fetchEventUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      fetchAppliedUsers();
    }
  }, [users]);

  const EventCard = ({ dets, status }) => {
    const appliedCount = Array.isArray(appliedUsers)
      ? appliedUsers.filter(
          (user) => user.eventId && user.eventId._id === dets._id
        ).length
      : 0;
    const isAlreadyApplied = Array.isArray(appliedUsers)
      ? appliedUsers.some(
          (user) =>
            user.eventId &&
            user.eventId._id === dets._id &&
            user.userId &&
            user.userId._id === userId
        )
      : false;

    return (
      <div className="p-[4px] mb-4 relative rounded-lg shadow-black shadow-md bg-[#080808]">
        <span
          className={`absolute rounded-lg inset-0 bg-gradient-to-r ${
            status === "Ongoing" ? "animate-pulse" : null
          }  from-blue-500 to-purple-500 p-[2px] mask mask-out`}
        ></span>
        <span className="relative block bg-black w-full rounded-lg px-4 py-4">
          <h2 className="text-xl font-bold text-white text-center mb-2">
            {dets.title}
          </h2>
          <p className=" text-md text-center">
            {new Date(dets.start).toLocaleString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-gray-300 text-sm">
              {appliedCount > 0 ? `${appliedCount} registered` : "0 registered"}
            </p>
            {status === "Completed" ? (
              <p className="text-sm text-red-500">Quiz has been ended</p>
            ) : isAlreadyApplied ? (
              <button className=" text-red-500 rounded-md cursor-not-allowed opacity-75">
                Already Applied
              </button>
            ) : (
              <button
                onClick={() => handleApply(dets)}
                className="px-3 py-1 bg-gradient-to-r  from-blue-500 to-purple-500 text-white rounded-md transition-colors"
              >
                Apply Now
              </button>
            )}
          </div>
        </span>
      </div>
    );
  };
  const filteredLeaderboard = leaderboard.filter((user) => user.totalCoins > 0);
  return (
    <div className="eventheight  text-white">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="grid lg:grid-cols-4  scrollbar-hidden gap-1 py-1 backdrop-blur-xl bg-[#e7dfdf1e] h-full">
        {/* Events Sections */}
        <div className="lg:col-span-3 grid lg:grid-cols-3 gap-1">
          {/* Upcoming Events */}
          <div className=" shadow-black  pereventheigth rounded-lg p-4 shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Upcoming Events
            </h2>
            <div className="max-h-[70vh] scrollbar-hidden">
              {event.length > 0 ? (
                event.map((dets) => (
                  <EventCard key={dets._id} dets={dets} status="Upcoming" />
                ))
              ) : (
                <p className="text-center text-black">No upcoming events</p>
              )}
            </div>
          </div>

          {/* Ongoing Events */}
          <div className=" shadow-black pereventheigth rounded-lg p-4 shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Ongoing Events
            </h2>
            <div className="max-h-[70vh] scrollbar-hidden">
              {ongoing.length > 0 ? (
                ongoing.map((dets) => (
                  <EventCard key={dets._id} dets={dets} status="Ongoing" />
                ))
              ) : (
                <p className="text-center text-black">No ongoing events</p>
              )}
            </div>
          </div>

          {/* Completed Events */}
          <div className=" shadow-black pereventheigth rounded-lg p-4 shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Completed Events
            </h2>
            <div className="max-h-[70vh] scrollbar-hidden">
              {completed.length > 0 ? (
                completed.map((dets) => (
                  <EventCard key={dets._id} dets={dets} status="Completed" />
                ))
              ) : (
                <p className="text-center text-black">No completed events</p>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className=" shadow-black pereventheigth rounded-lg p-4 shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Leaderboard Top 3
          </h2>
          <div className="space-y-4">
            {filteredLeaderboard.length > 0 ? (
              filteredLeaderboard.slice(0, 3).map((user, index) => {
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <div
                    key={index}
                    className="relative p-[3px] drop-shadow-sm shadow-black shadow-lg bg-[#080808] rounded-full"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r animate-pulse from-blue-500 to-purple-500 rounded-full p-[2px] mask mask-out"></span>
                    <span className="relative block bg-black w-full rounded-full px-2 py-2">
                      <div className="flex items-center justify-between">
                        <div className="text-md font-medium flex items-center gap-2 justify-center">
                          <img
                            src={user.profilePhoto || "default-avatar.png"}
                            className="h-11 w-11 rounded-full"
                            alt="User Avatar"
                          />
                          <span>
                            {medals[index]}
                            {user.name}
                          </span>
                        </div>
                        <span className="text-md text-yellow-400 mr-2">
                          Score: {user.totalCoins}
                        </span>
                      </div>
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-black">
                <p>Leaderboard is empty. Be the first to score!</p>
              </div>
            )}
          </div>
          <div className="relative p-[3px] mt-5 drop-shadow-sm shadow-black shadow-lg  bg-[#080808] rounded-full">
            <span className="absolute inset-0 bg-gradient-to-r animate-pulse from-blue-500 to-purple-500 rounded-full p-[2px] mask mask-out"></span>
            <span className="relative block bg-black w-full rounded-full px-2 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 justify-center">
                  {leaderboard
                    .filter((user) => user.name === userName)
                    .map((user) => (
                      <img
                        src={user.profilePhoto}
                        className={`h-12 w-12 ${
                          !user.profilePhoto
                            ? "bg-gradient-to-r animate-pulse from-blue-500 to-purple-500"
                            : ""
                        } rounded-full`}
                        alt=""
                      />
                    ))}
                  <span className="text-md"> Your Score : </span>
                </div>
                <span className="text-md text-yellow-400 mr-2">
                  {leaderboard
                    .filter((user) => user.name === userName)
                    .map((user) => user.totalCoins)}
                </span>
              </div>
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pereventheigth {
          height: calc(100vh - 133px);
        }
      `}</style>
    </div>
  );
};

export default Events;
