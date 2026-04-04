import { Helmet } from "react-helmet";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import API from "../API";
import Header from "../Components/Header";

const fallbackEventImage =
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop";

const TalentHunt = () => {
  const [events, setEvents] = useState([]);
  const [topEarners, setTopEarners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    fetchTopEarners();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/allevents`);
      const rows = Array.isArray(response.data) ? response.data : [];
      setEvents(rows);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTopEarners = async () => {
    try {
      const response = await axios.get(`${API}/top-earners`);
      setTopEarners(response.data);
    } catch (error) {
      console.error("Error fetching top earners:", error);
    }
  };

  const normalizeStatus = (status) => {
    const value = (status || "").toLowerCase();
    if (value.includes("ongoing") || value.includes("live")) return "ongoing";
    if (value.includes("complete") || value.includes("ended")) return "completed";
    return "upcoming";
  };

  const formatDate = (value) => {
    if (!value) return "Date announced soon";
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const eventsByStatus = {
    upcoming: events.filter((item) => normalizeStatus(item.status) === "upcoming"),
    ongoing: events.filter((item) => normalizeStatus(item.status) === "ongoing"),
    completed: events.filter((item) => normalizeStatus(item.status) === "completed"),
  };

  const leadEvent =
    eventsByStatus.ongoing[0] ||
    eventsByStatus.upcoming[0] ||
    eventsByStatus.completed[0] ||
    null;

  const topThree = topEarners.slice(0, 3);

  const eventColumns = [
    {
      title: "Upcoming",
      tone: "upcoming",
      items: eventsByStatus.upcoming,
      emptyText: "No upcoming events right now.",
      countLabel: `${eventsByStatus.upcoming.length} soon`,
    },
    {
      title: "Ongoing",
      tone: "ongoing",
      items: eventsByStatus.ongoing,
      emptyText: "No ongoing events currently.",
      countLabel: `${eventsByStatus.ongoing.length} live`,
    },
    {
      title: "Completed",
      tone: "completed",
      items: eventsByStatus.completed,
      emptyText: "No completed events yet.",
      countLabel: `${eventsByStatus.completed.length} archived`,
    },
  ];

  return (
    <div id="talenthunt" className="talent-events">
      <Helmet>
        <title>Krutanic Events | Discover Top Tech Talent</title>
        <meta name="description" content="Participate in Krutanic Talent Hunt events and showcase your skills." />
      </Helmet>
      <Toaster position="top-center" />

      <Header />

      <main className="events-page-shell">
        <section className="events-hero">
          <div className="events-hero-copy">
            <span className="events-chip">The Kinetic Curator</span>
            <h1>
              Krutanic
              <span>Events</span>
            </h1>
            <p>
              Compete, collaborate, and level up through curated challenges, practical workshops, and high-impact masterclasses.
            </p>
            <div className="events-hero-metrics">
              <article>
                <strong>{eventsByStatus.upcoming.length}</strong>
                <span>Upcoming</span>
              </article>
              <article>
                <strong>{eventsByStatus.ongoing.length}</strong>
                <span>Live</span>
              </article>
              <article>
                <strong>{eventsByStatus.completed.length}</strong>
                <span>Completed</span>
              </article>
            </div>
          </div>

          <div className="events-hero-visual">
            <img src={leadEvent?.image || fallbackEventImage} alt={leadEvent?.title || "Featured Krutanic event"} />
            <div className="events-hero-overlay">
              <span>Now spotlighting</span>
              <strong>{leadEvent?.title || "New workshops launching weekly"}</strong>
            </div>
          </div>
        </section>

        <section className="events-streams">
          {loading ? (
            <div className="events-loading">Loading events...</div>
          ) : (
            eventColumns.map((column) => (
              <article key={column.title} className={`events-column is-${column.tone}`}>
                <div className="events-column-head">
                  <h2>{column.title}</h2>
                  <span>{column.countLabel}</span>
                </div>
                <p className="events-column-copy">
                  {column.tone === "upcoming" && "Plan your next sprint and register before slots fill up."}
                  {column.tone === "ongoing" && "Jump in now and keep your momentum running."}
                  {column.tone === "completed" && "Replay highlights and celebrate top performers."}
                </p>

                <div className="events-column-scroll-wrapper">
                  <div className="events-column-list">
                    {column.items.length > 0 ? (
                      column.items.map((item) => (
                        <article key={item._id} className="event-tile">
                          <div className="event-tile-image-wrap">
                            <img src={item.image || fallbackEventImage} alt={item.title} />
                            <span className="event-tile-tag">{item.type || item.category || "Event"}</span>
                          </div>
                          <div className="event-tile-body">
                            <h3>{item.title}</h3>
                            <p>
                              {item.shortDescription || item.fullDescription || item.description || "Skill-first event designed to sharpen execution and communication."}
                            </p>
                            <div className="event-tile-meta">
                              <span>{formatDate(item.startDate || item.start || item.date)}</span>
                              <span>{item.coin ? `${item.coin} coins` : "Free entry"}</span>
                            </div>
                            {item.slug ? (
                              <Link to={`/register/${item.slug}`} className="event-tile-cta">
                                {column.tone === "completed" ? "View Recap" : "Join Event"}
                              </Link>
                            ) : (
                              <button type="button" className="event-tile-cta is-disabled" disabled>
                                Coming Soon
                              </button>
                            )}
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="events-empty">{column.emptyText}</div>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        {topThree.length > 0 && (
          <section className="events-hall">
            <div className="events-hall-head">
              <h2>Hall Of Fame</h2>
              <p>Recognizing top performers who turned consistent effort into standout results.</p>
            </div>

            <div className="events-podium">
              <article className="podium-card is-second">
                <div className="podium-avatar">{topThree[1]?.name?.charAt(0) || "2"}</div>
                <strong>{topThree[1]?.name || "Second Place"}</strong>
                <span>{topThree[1]?.totalCoins || 0} coins</span>
              </article>

              <article className="podium-card is-first">
                <div className="podium-avatar large">{topThree[0]?.name?.charAt(0) || "1"}</div>
                <small>Top Performer</small>
                <strong>{topThree[0]?.name || "Champion"}</strong>
                <span>{topThree[0]?.totalCoins || 0} coins</span>
              </article>

              <article className="podium-card is-third">
                <div className="podium-avatar">{topThree[2]?.name?.charAt(0) || "3"}</div>
                <strong>{topThree[2]?.name || "Third Place"}</strong>
                <span>{topThree[2]?.totalCoins || 0} coins</span>
              </article>
            </div>
          </section>
        )}

        <section className="events-cta">
          <div>
            <h2>Don&apos;t Miss The Next Big Momentum.</h2>
            <p>Get event drops, registration links, and challenge updates directly in your inbox.</p>
          </div>
          <form className="events-cta-form" onSubmit={(eventObj) => eventObj.preventDefault()}>
            <input type="email" placeholder="Enter your email" aria-label="Enter your email" />
            <button type="submit">Notify Me</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default TalentHunt;