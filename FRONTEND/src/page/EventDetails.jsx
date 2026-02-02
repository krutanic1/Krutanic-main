import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Helmet } from "react-helmet";
import toast, { Toaster } from "react-hot-toast";

const EventDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventCallback = async () => {
            try {
                const response = await axios.get(`${API}/event-by-slug/${slug}`);
                setEvent(response.data);
            } catch (error) {
                console.error("Error fetching event details:", error);
                toast.error("Failed to load event details.");
            } finally {
                setLoading(false);
            }
        };

        fetchEventCallback();
    }, [slug]);

    const handleJoinNow = () => {
        const token = localStorage.getItem("eventToken");
        if (token) {
            navigate("/EventDashboard");
        } else {
            navigate("/EventLogin", {
                state: {
                    message: "Please login to join this event",
                    from: { pathname: "/EventDashboard" }
                }
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Event Not Found</h2>
                        <button
                            onClick={() => navigate("/TalentHunt")}
                            className="mt-4 text-orange-600 hover:underline"
                        >
                            Back to Events
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Helmet>
                <title>{event.metaTitle || `${event.title} – Free MCQ Event for Students | Krutanic`}</title>
                <meta
                    name="description"
                    content={event.metaDescription || `Join the ${event.title} - A free MCQ contest for students. Test your skills, earn certificates, and win exciting rewards. Register now!`}
                />
            </Helmet>
            <Toaster position="top-center" />

            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-5xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Hero Section */}
                    <div className="relative h-64 md:h-96 w-full">
                        <img
                            src={event.image || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop"}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-10">
                            <span className="inline-block bg-orange-600 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full w-fit mb-3 uppercase tracking-wider">
                                {event.type || "Event"}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 shadow-sm leading-tight">
                                {event.title}
                            </h1>
                            <div className="flex flex-wrap items-center text-white/90 text-sm md:text-base font-medium gap-4">
                                {event.startDate && (
                                    <span className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        {new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                )}
                                {event.startTime && (
                                    <span className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        {event.startTime} {event.timezone ? `(${event.timezone})` : ''}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-10">
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-orange-500 pl-3">About the Event</h2>
                                <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-line">
                                    <p>
                                        {event.fullDescription || event.description || "Join us for an exciting opportunity to showcase your skills in this exclusive event."}
                                    </p>
                                </div>
                            </section>

                            {(event.benefits && event.benefits.length > 0) && (
                                <section>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-orange-500 pl-3">What You Will Get</h2>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                                        {event.benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                                                <span className="text-green-500 mr-2">✓</span> {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {event.eligibility && (
                                <section>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-orange-500 pl-3">Eligibility</h2>
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                        <p className="text-gray-700 font-medium">{event.eligibility}</p>
                                    </div>
                                </section>
                            )}

                            {/* FAQ Section */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-orange-500 pl-3">Frequently Asked Questions</h2>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <h3 className="font-bold text-gray-900">Is this event free?</h3>
                                        <p className="text-gray-600 text-sm mt-1">{event.isFree ? "Yes, this event is completely free to join." : "No, there is a registration fee for this event."}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <h3 className="font-bold text-gray-900">Who can participate?</h3>
                                        <p className="text-gray-600 text-sm mt-1">{event.eligibility || "This event is open to students and recent graduates looking to upgrade their skills."}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <h3 className="font-bold text-gray-900">Will I get a certificate?</h3>
                                        <p className="text-gray-600 text-sm mt-1">Yes, all active participants will receive a certificate of participation.</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar / CTA */}
                        <div className="md:col-span-1">
                            <div className="bg-white border rounded-xl shadow-sm p-6 sticky top-24">
                                <div className="text-center mb-6">
                                    <span className="block text-gray-500 text-sm uppercase tracking-wide font-semibold mb-1">Entry Fee</span>
                                    <span className={`text-3xl font-extrabold ${event.isFree ? 'text-green-600' : 'text-gray-900'}`}>
                                        {event.isFree ? "Free" : "Paid"}
                                    </span>
                                </div>

                                {event.prizeMoney && (
                                    <div className="text-center mb-6 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                        <span className="block text-yellow-700 text-xs uppercase tracking-wide font-bold mb-1">Prize Pool</span>
                                        <span className="text-xl font-bold text-yellow-800">{event.prizeMoney}</span>
                                    </div>
                                )}

                                <button
                                    onClick={handleJoinNow}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-2xl mb-4 text-lg"
                                >
                                    Register Now
                                </button>

                                {event.maxParticipants && (
                                    <p className="text-xs text-center text-gray-400 mb-4">Limited slots available. Max: {event.maxParticipants}</p>
                                )}

                                <div className="border-t pt-4">
                                    <h4 className="font-bold text-gray-900 mb-2">Event Details</h4>
                                    <div className="space-y-3 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Mode:</span>
                                            <span className="font-semibold text-gray-900 capitalize">{event.mode || "Online"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Location:</span>
                                            <span className="font-semibold text-gray-900">{event.location || event.mode || "Online"}</span>
                                        </div>
                                        {event.endDate && (
                                            <div className="flex justify-between">
                                                <span>End Date:</span>
                                                <span className="font-semibold text-gray-900">{new Date(event.endDate).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
export default EventDetails;
