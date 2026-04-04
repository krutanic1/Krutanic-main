import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

// Contribution note: minor non-functional update for repository activity.

const Events = () => {
  const [users, setUsers] = useState([]);
  const [event, setEvent] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [appliedUsers, setAppliedUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [eventLeaderboards, setEventLeaderboards] = useState({});
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

  const fetchEventLeaderboards = async () => {
    try {
      const response = await axios.get(`${API}/eventapplications`);
      const applications = response.data;
      console.log("Event applications data:", applications);
      
      // Group applications by eventId and get top 3 for each
      const leaderboards = {};
      applications.forEach((app) => {
        if (app.eventId && app.userId && app.coin != null && app.coin > 0) {
          const eventId = typeof app.eventId === 'object' ? app.eventId._id : app.eventId;
          const userName = typeof app.userId === 'object' ? app.userId.name : null;
          const userPhoto = typeof app.userId === 'object' ? app.userId.profilePhoto : null;
          
          if (!leaderboards[eventId]) {
            leaderboards[eventId] = [];
          }
          leaderboards[eventId].push({
            name: userName || 'Unknown',
            profilePhoto: userPhoto,
            coin: app.coin,
            eventTitle: app.remarks
          });
        }
      });
      
      // Sort and keep only top 3 for each event
      Object.keys(leaderboards).forEach((eventId) => {
        leaderboards[eventId] = leaderboards[eventId]
          .sort((a, b) => b.coin - a.coin)
          .slice(0, 3);
      });
      
      console.log("Processed leaderboards:", leaderboards);
      setEventLeaderboards(leaderboards);
    } catch (error) {
      console.error("Error fetching event leaderboards:", error);
    }
  };

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${API}/allevents`);
      // console.log("event", response.data);
      setEvent(
        response.data?.filter((item) => item.status === "Upcoming Events" || item.status === "upcoming")
      );
      setOngoing(response.data?.filter((item) => item.status === "Ongoing" || item.status === "ongoing"));
      setCompleted(
        response.data?.filter((item) => item.status === "Completed" || item.status === "completed")
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
    fetchEventLeaderboards();
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
          className={`absolute rounded-lg inset-0 bg-gradient-to-r ${status === "Ongoing" ? "animate-pulse" : null
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
          {/* <p className="text-gray-300 text-sm">
            {appliedCount > 0 ? `${appliedCount} registered` : "0 registered"}
          </p> */}
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
  
  // Check if there are any completed events with leaderboard data
  const hasCompletedEventsWithLeaderboards = completed.some(
    (event) => eventLeaderboards[event._id] && eventLeaderboards[event._id].length > 0
  );

  return (
    <div className="eventheight  text-white">
      <Toaster position="top-center" reverseOrder={false} />
      <div className={`grid ${hasCompletedEventsWithLeaderboards ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} scrollbar-hidden gap-1 py-1 backdrop-blur-xl bg-[#e7dfdf1e] h-full`}>
        {/* Events Sections */}
        <div className={`${hasCompletedEventsWithLeaderboards ? 'lg:col-span-3' : 'lg:col-span-3'} grid lg:grid-cols-3 gap-1`}>
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

        {/* Top 3 Students for Completed Events */}
        {hasCompletedEventsWithLeaderboards && (
          <div className="shadow-black pereventheigth rounded-lg p-4 shadow-lg overflow-y-auto scrollbar-hidden">
            <h2 className="text-2xl font-semibold text-center mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Top 3 Students
            </h2>
            <div className="space-y-6">
              {completed.map((event) => {
                const topStudents = eventLeaderboards[event._id];
                if (!topStudents || topStudents.length === 0) return null;
                
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <div key={event._id} className="relative p-[3px] rounded-lg shadow-black shadow-md bg-[#080808] mb-6">
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-[2px]"></span>
                    <div className="relative bg-black rounded-lg p-4">
                      <h3 className="text-base font-semibold text-white mb-4 text-center border-b border-gray-700 pb-2">
                        {event.title}
                      </h3>
                      <div className="space-y-3">
                      {topStudents.map((student, index) => (
                        <div
                          key={index}
                          className="relative p-[3px] drop-shadow-sm shadow-black shadow-lg bg-[#080808] rounded-full"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r animate-pulse from-blue-500 to-purple-500 rounded-full p-[2px] mask mask-out"></span>
                          <span className="relative block bg-black w-full rounded-full px-4 py-3">
                            <div className="flex items-center justify-between">
                              <div className="text-base font-medium flex items-center gap-2 justify-center">
                                <span className="truncate">
                                  <span className="text-2xl">{medals[index]}</span> {student.name}
                                </span>
                              </div>
                              <span className="text-base text-yellow-400 mr-2 font-semibold">
                                {student.coin}
                              </span>
                            </div>
                          </span>
                        </div>
                      ))}
                    </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
