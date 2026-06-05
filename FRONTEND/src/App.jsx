import React, { lazy, useEffect, useState } from "react";
import { Routes, Route, BrowserRouter, useLocation, Navigate, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactPixel from 'react-facebook-pixel';
import Header from "./Components/Header";
import AdvancedApplyPopup from "./Components/AdvancedApplyPopup";
import HomePage from "./page/landing";
import ContactUs from "./page/ContactUs";
import AboutUs from "./page/AboutUs";
import Terms from "./page/Terms";
import Privacy from "./page/Privacy";
import RefundPolicy from "./page/RefundPolicy";
import Login from "./page/Login";
import Collabration from "./page/Collabration";
import Career from "./page/Career";
import AdvanceCourses from "./page/AdvanceCourses";
import Advance from "./page/Advance";
import FeeStructure from "./page/FeeStructure";
import TalentHunt from "./page/TalentHunt";
import Footer from "./Components/Footer";
import LoginWithOtp from "./page/LoginWithOtp";
import EventRegister from "./page/EventRegister";
import EventLogin from "./page/EventLogin";
import ScrollToTop from "./Components/ScrollToTop";
import Mentorship from "./page/Mentorship";
import DataScience from "./page/AdvanceCourse/DataScience";
import DataAnalytics from "./page/AdvanceCourse/DataAnalytics";
import DigitalMarket from "./page/AdvanceCourse/DigitalMarket";
import MernStack from "./page/AdvanceCourse/MernStack";
import UIUXDesign from "./page/AdvanceCourse/UIUXDesign";
import MentorshipCourseDetails from "./page/Mentorship/CourseDetails/MentorshipCourseDetails";

import ProductManagement from "./page/AdvanceCourse/ProductManagement";
import SmoothScroll from "./SmoothScroll";
import MasterClass from "./page/MasterClass";
import MasterClassDetails from "./page/MasterClassDetails";
import AutomationTesting from "./page/AdvanceCourse/AutomationTesting";
import PromptEngineering from "./page/AdvanceCourse/PromptEngineering";
import GenerativeAI from "./page/AdvanceCourse/GenerativeAI";
import DashboardAccessForm from "./page/DashboardAccessForm";
import AdvanceDashboardAccess from "./page/AdvanceDashboardAccess";
import Alumni from "./page/Alumni";
import Attendance from "./page/Attendance";
import AdvanceApplyPage from "./page/AdvanceApplyPage";
import AdvanceForm from "./page/AdvanceForm";
// Admin
import AdminHeader from "./Admin/AdminHeader";
import AddCourse from "./Admin/AddCourse";
import AddAdvCourse from "./Admin/AddAdvCourse";
import AddModule from "./Admin/AddModule";
import AddAdvModule from "./Admin/AddAdvModule";
import AdminProjectPage from "./Admin/AdminProjectPage";
import AdvProjectPage from "./Admin/AdvProjectPage";
import AdvExercisePage from "./Admin/AdvExercisePage";
import PendingApplication from "./Admin/PendingApplication";
import AcceptedApplication from "./Admin/AcceptedApplication";
import CreateOperation from "./Admin/CreateOperation";
import CreateAdvOperation from "./Admin/CreateAdvOperation";
import CreateBDA from "./Admin/CreateBDA";
import CreateAdvTeam from "./Admin/CreateAdvTeam";
import BookedList from "./Admin/BookedList";
import DefaultList from "./Admin/DefaultList";
import FullPaidList from "./Admin/FullPaidList";
import AdminLogIn from "./Admin/AdminLogin";
import Createmanager from "./Admin/CreateManager";
import MasterClasses from "./Admin/MasterClasses";
import LoginAdmin from "./Admin/LoginAdmin";
import RevenueSheet from "./Admin/RevenueSheet";
import AdvRevenueSheet from "./Admin/advadminrevenue";
import AllTeamDetail from "./Admin/AllTeamDetail";
import AdvTeamDetail from "./Admin/AdvTeamDetail";
import AddEvent from "./Admin/AddEvent";
import EventRegistration from "./Admin/EventRegistration";
import OnBoardingDetails from "./Admin/OnBoardingDetails";
import AdvOnBoardingDetails from "./Admin/AdvOnBoardingDetails";
import AdvBooked from "./Admin/AdvBooked";
import AdvFullPaid from "./Admin/AdvFullPaid";
import AdvDefault from "./Admin/AdvDefault";
import HalfPayment from "./Admin/HalfPayment";
import Target from "./Admin/Target";
import AlumniData from "./Admin/AlumniData";
import InactiveBda from "./Admin/InactiveBda";
import ReferAndEarnResponse from "./Admin/ReferAndEarnResponse";
import CreateMarketingTeam from "./Admin/CreateMarketingTeam";
import AdminAttendance from "./Admin/AdminAttendance";
import AdvUserManagement from "./Admin/AdvUserManagement";
import LiveSalesMonitor from "./Admin/LiveSalesMonitor";
import AdvFormLeads from "./Admin/AdvFormLeads";



// Operation Team
import OperationLogin from "./Operation/OperationLogin";
import OperationHeader from "./Operation/OperationHeader";
import OperationDashboard from "./Operation/OperationDashboard";
import BookedPayment from "./Operation/BookedPayment";
import FullPayment from "./Operation/FullPayment";
import DefaultPayment from "./Operation/DefaultPayment";
import OperationRevenueSheets from "./Operation/OperationRevenueSheets";

// ADV Operation Team
import AdvOperationLogin from "./AdvOperation/OperationLogin";
import AdvOperationAgainLogin from "./AdvOperation/OperationAgainLogin";
import AdvOperationHeader from "./AdvOperation/OperationHeader";
import AdvOperationDashboard from "./AdvOperation/OperationDashboard";
import AdvBookedPayment from "./AdvOperation/BookedPayment";
import AdvFullPayment from "./AdvOperation/FullPayment";
import AdvDefaultPayment from "./AdvOperation/DefaultPayment";
import AdvOperationRevenueSheets from "./AdvOperation/OperationRevenueSheets";

// BDA Team
import TeamLogin from "./BDA/TeamLogin";
import Home from "./BDA/Home";
import Booked from "./BDA/Booked";
import BDAHeader from "./BDA/BDAHeader";
import Default from "./BDA/Default";
import FullPaid from "./BDA/FullPaid";
import OnBoarding from "./BDA/OnBoarding";
import AddUser from "./BDA/AddUser";
import TeamDetail from "./BDA/TeamDetail";
import BDARevenueSheet from "./BDA/BDARevenueSheet";
import Reference from "./BDA/Reference";
import CompanyLeads from "./BDA/CompanyLeads";
import AddTeam from "./BDA/AddTeam";
import AssignTarget from "./BDA/AssignTarget";

// User Student
import Dashboard from "./User/NewDashboard";
import EnrolledCourses from "./User/NewEnrolledCourses";
import Learning from "./User/NewLearning";
import Setting from "./User/Setting";
import JobBoardPage from "./User/JobBoardPage";
import MyJobPage from "./User/MyJobPage";
import MockInterviewPage from "./User/MockInterviewPage";
import ExercisePage from "./User/ExercisePage";
import ResumeATSPage from "./User/ResumeATSPage";
import LmsFooter from './User/LmsFooter';
import AdminDashboard from "./Admin/AdminDashboard";
import PageNotFound from "./PageNotFound";
import AdvanceQueries from "./Admin/AdvanceQueries";
import MentorQueries from "./Admin/MentorQueries";
import AdvLeadManagement from "./Admin/AdvLeadManagement";
import AdminAnalytics from "./Admin/AdminAnalytics";
import AdvLeadsCount from "./AdvTeam/AdvLeadsCount";

import AdvAdminDashboard from "./Admin/AdvAdminDashboard";
import AgentsManagement from "./Admin/AgentsManagement";
import TeamsManagement from "./Admin/TeamsManagement";
import LeadAssignments from "./Admin/LeadAssignments";
import AgentActivity from "./Admin/AgentActivity";
import AdminReports from "./Admin/AdminReports";
import AdvCallLogs from "./Admin/AdvCallLogs";

import BulkImport from "./Admin/BulkImport";
import UserLayout from "./User/UserLayout";



// placementcoordinator
import PCHeader from "./PlacementCoordinator.jsx/PCHeader";
import PClogin from "./PlacementCoordinator.jsx/PClogin";
import PCDashboard from "./PlacementCoordinator.jsx/PCDashboard";
import JobPost from "./PlacementCoordinator.jsx/JobPost";
import CreatePlacementCoordinator from "./Admin/CreatePlacementCoordinator";
import CreateInterviewer from "./Admin/CreateInterviewer";
import CreateInterview from "./Admin/CreateInterview";

// Interviewer
import InterviewerLogin from "./Interviewer/InterviewerLogin";
import InterviewerDashboard from "./Interviewer/InterviewerDashboard";

//event
import EventDashBoard from "./Event/EventDashBoard";
import Verified from "./Components/Verified";
import ReferAndEarn from "./page/ReferAndEarn";
import LeaderBoard from "./BDA/LeaderBoard";

// Advance Team
import AdvTeamLogin from "./AdvTeam/AdvTeamLogin";
import AdvTeamHeader from "./AdvTeam/AdvTeamHeader";
import AdvTeamHome from "./AdvTeam/AdvTeamHome";
import AdvTeamBooked from "./AdvTeam/AdvTeamBooked";
import AdvTeamFullPaid from "./AdvTeam/AdvTeamFullPaid";
import AdvTeamDefault from "./AdvTeam/AdvTeamDefault";
import AdvAddUser from "./AdvTeam/AdvAddUser";
import AdvTeamOnBoarding from "./AdvTeam/AdvTeamOnBoarding";
import AdvTeamRevenue from "./AdvTeam/AdvTeamRevenue";
import AdvTeamMyLeads from "./AdvTeam/AdvTeamMyLeads";
import AdvLeadsBook from "./AdvTeam/AdvLeadsBook";
import AdvTeamLeadManagement from "./AdvTeam/AdvLeadManagement";
import AdvTeamRecord from "./AdvTeam/AdvTeamRecord";
import AdvTeamTeamLogin from "./AdvTeam/AdvTeamTeamLogin";
import AdvLeaderBoard from "./AdvTeam/AdvLeaderBoard";
// MarketingLogind

import MarketingHeader from "./Marketing/MarketingHeader";
import MarketingLogin from "./Marketing/MarketingLogin";
import MarketingDashboard from "./Marketing/MarketingDashboard";
import MarketingPrePayment from "./Marketing/MarketingPrePayment";
import MarketingLeads from "./Marketing/MarketingLeads";
import MarketingAddExecutive from "./Marketing/MarketingAddExecutive";
import BDAAgainLogin from "./BDA/BDAAgainLogin";
import EventDetails from "./page/EventDetails";
import AdvanceDashboardLayout from "./new_user/AdvanceDashboardLayout";

// HR Portal
import HRLogin from "./HR/HRLogin";
import HRHeader from "./HR/HRHeader";
import HRAttendance from "./HR/HRAttendance";
import CreateHR from "./Admin/CreateHR";

// Lazily load Advanced Dashboard Pages
const OverviewPage = lazy(() => import("./new_user/pages/OverviewPage"));
const TrainingPage = lazy(() => import("./new_user/pages/TrainingPage"));
const PracticalPage = lazy(() => import("./new_user/pages/PracticalPage"));
const InternshipPage = lazy(() => import("./new_user/pages/InternshipPage"));
const PlacementPage = lazy(() => import("./new_user/pages/PlacementPage"));
const CertificatePage = lazy(() => import("./new_user/pages/CertificatePage"));
const PaymentsPage = lazy(() => import("./new_user/pages/PaymentsPage"));
const CalendarPage = lazy(() => import("./new_user/pages/CalendarPage"));
const AdvanceLearningPage = lazy(() => import("./new_user/AdvanceLearningPage"));
import ResumeBuilderPage from "./new_user/pages/ResumeBuilderPage";
import ProfilePage from "./new_user/pages/ProfilePage";

import ForgotPassword from "./page/ForgotPassword.jsx";
import Exercise from "./User/Excercise.jsx";

const queryClient = new QueryClient();

// 🛡️ 1. GLOBAL AUTH STORE & STORAGE PROXY (Zero-Latency Tab Isolation)
// This ensures that credentials are available INSTANTLY before React even starts.
if (typeof window !== "undefined") {
  window.KrutanicAuth = window.KrutanicAuth || {};
  
  // A. Immediate URL Capture (First Frame)
  const urlParams = new URLSearchParams(window.location.search);
  const impToken = urlParams.get("impToken");
  const impType = urlParams.get("impType");

  if (impToken && impType) {
    const data = {
      token: impToken,
      id: urlParams.get("impId"),
      name: urlParams.get("impName"),
      role: urlParams.get("impRole"),
      type: impType
    };
    window.KrutanicAuth[impType] = data.token;
    if (data.id) window.KrutanicAuth[impType.replace("Token", "Id")] = data.id;
    if (data.name) window.KrutanicAuth[impType.replace("Token", "Name")] = data.name;
    if (data.role) window.KrutanicAuth["designation"] = data.role;

    // Persist to Session for future reloads in this tab
    sessionStorage.setItem(impType, data.token);
    if (data.id) sessionStorage.setItem(impType.replace("Token", "Id"), data.id);
    if (data.name) sessionStorage.setItem(impType.replace("Token", "Name"), data.name);
    if (data.role) sessionStorage.setItem("designation", data.role);

    console.log("🚀 AUTH: Global handover complete for", impType);
    
    // Inject artificial session start time to satisfy Header session guards
    const now = new Date().getTime().toString();
    sessionStorage.setItem("sessionStartTime", now);
    sessionStorage.setItem("advTeamSessionStartTime", now);
    window.KrutanicAuth["sessionStartTime"] = now;
    window.KrutanicAuth["advTeamSessionStartTime"] = now;
  }

  // B. Safe Storage Proxy
  // This makes localStorage.getItem() prioritize Tab-Specific (Session) data
  // while keeping everything isolated per tab.
  const originalGetItem = localStorage.getItem;
  localStorage.getItem = function(key) {
    // 1. Try Global Store
    if (window.KrutanicAuth[key]) return window.KrutanicAuth[key];
    // 2. Try Session Store
    const sessionVal = sessionStorage.getItem(key);
    if (sessionVal !== null) return sessionVal;
    // 3. Fallback to Local
    return originalGetItem.call(localStorage, key);
  };
  
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    // If we are in an impersonated tab (any token in session), save everything to session instead
    const isIsolated = !!(sessionStorage.getItem("bdaToken") || sessionStorage.getItem("advTeamToken") || sessionStorage.getItem("operationToken"));
    if (isIsolated) {
      sessionStorage.setItem(key, value);
      window.KrutanicAuth[key] = value;
    } else {
      originalSetItem.call(localStorage, key, value);
    }
  };

  const originalRemoveItem = localStorage.removeItem;
  localStorage.removeItem = function(key) {
    const isIsolated = !!(sessionStorage.getItem("bdaToken") || sessionStorage.getItem("advTeamToken") || sessionStorage.getItem("operationToken"));
    if (isIsolated) {
      sessionStorage.removeItem(key);
      if (window.KrutanicAuth) delete window.KrutanicAuth[key];
    } else {
      originalRemoveItem.call(localStorage, key);
    }
  };

  // C. Clean URL (After a tiny delay to let components read it if needed)
  if (impToken) {
    setTimeout(() => {
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 100);
  }
}

// 🔒 2. STABLE AUTHENTICATION UTILITY
const getAuthToken = (key) => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key); // Proxy handles the isolation
};

// 🌍 3. GLOBAL TIMEZONE PROXY (IST)
if (typeof window !== "undefined") {
  const originalToLocaleString = Date.prototype.toLocaleString;
  Date.prototype.toLocaleString = function(locales, options) {
    if (!locales) {
      return originalToLocaleString.call(this, 'en-IN', { timeZone: 'Asia/Kolkata', ...options });
    }
    return originalToLocaleString.call(this, locales, options);
  };
  
  const originalToLocaleDateString = Date.prototype.toLocaleDateString;
  Date.prototype.toLocaleDateString = function(locales, options) {
    if (!locales) {
      return originalToLocaleDateString.call(this, 'en-IN', { timeZone: 'Asia/Kolkata', ...options });
    }
    return originalToLocaleDateString.call(this, locales, options);
  };

  const originalToLocaleTimeString = Date.prototype.toLocaleTimeString;
  Date.prototype.toLocaleTimeString = function(locales, options) {
    if (!locales) {
      return originalToLocaleTimeString.call(this, 'en-IN', { timeZone: 'Asia/Kolkata', ...options });
    }
    return originalToLocaleTimeString.call(this, locales, options);
  };
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAutoPopup, setShowAutoPopup] = useState(false);

  // 🛡️ SECURITY GUARDS
  const isAuthenticated = () => !!getAuthToken("token");
  const isAuthenticatedBda = () => !!getAuthToken("bdaToken");
  const isAuthenticatedOperation = () => !!getAuthToken("operationToken");
  const isAuthenticatedAdvOperation = () => !!getAuthToken("advOperationToken");
  const isAuthenticatedAdmin = () => !!getAuthToken("adminToken");
  const isAuthenticatedAdvTeam = () => !!getAuthToken("advTeamToken");
  const isAuthenticatedPC = () => !!getAuthToken("pctoken");
  const isAuthenticatedEventUser = () => !!getAuthToken("eventToken");
  const isAuthenticatedMarketing = () => !!getAuthToken("marketingToken");
  const isAuthenticatedHR = () => !!getAuthToken("hrToken");

  useEffect(() => {
    const checkTokens = () => {
      const currentPath = window.location.pathname.toLowerCase();
      
      // If we just landed with an impToken, skip the expiration check for a few seconds
      // to allow the handover to stabilize.
      if (window.location.search.includes("impToken")) return;

      const tokenKeys = ["adminToken", "bdaToken", "advTeamToken", "operationToken", "advOperationToken", "marketingToken", "studentToken"];
      const expiredTokens = [];

      tokenKeys.forEach(key => {
        const token = getAuthToken(key);
        if (token) {
          try {
            const parts = token.split('.');
            if (parts.length === 3) {
              const decoded = JSON.parse(atob(parts[1]));
              if (decoded.exp * 1000 < Date.now()) {
                expiredTokens.push(key);
              }
            }
          } catch (e) {
            // ignore malformed
          }
        }
      });

      if (expiredTokens.length > 0) {
        // Path checks
        const isAdminSection = currentPath.includes("admin") || currentPath.includes("create");
        const isBdaSection = currentPath === "/home" || currentPath === "/booked" || currentPath.includes("bda");
        const isAdvTeamSection = currentPath.includes("advteam");
        const isOpSection = currentPath.includes("operation") && !currentPath.includes("adv");
        const isAdvOpSection = currentPath.includes("advoperation");
        const isMarketingSection = currentPath.startsWith("/marketing/");

        let shouldRedirect = false;
        let redirectPath = "/";

        if (expiredTokens.includes("adminToken") && isAdminSection) {
          shouldRedirect = true;
          redirectPath = "/AdminLogin";
        } else if (expiredTokens.includes("bdaToken") && isBdaSection) {
          shouldRedirect = true;
          redirectPath = "/TeamLogin";
        } else if (expiredTokens.includes("advTeamToken") && isAdvTeamSection) {
          shouldRedirect = true;
          redirectPath = "/AdvTeamLogin";
        } else if (expiredTokens.includes("operationToken") && isOpSection) {
          shouldRedirect = true;
          redirectPath = "/OperationLogin";
        } else if (expiredTokens.includes("advOperationToken") && isAdvOpSection) {
          shouldRedirect = true;
          redirectPath = "/AdvOperationLogin";
        } else if (expiredTokens.includes("marketingToken") && isMarketingSection) {
          shouldRedirect = true;
          redirectPath = "/marketing/login";
        }

        if (shouldRedirect) {
          console.warn("Security: Session expired for matching tokens in current section", expiredTokens);
          expiredTokens.forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
          });
          
          navigate(redirectPath);
        }
      }
    };

    checkTokens();
    const interval = setInterval(checkTokens, 20000);
    return () => clearInterval(interval);
  }, [location.pathname, navigate]);

  useEffect(() => {
    // Auto-popup logic
    const allowedPaths = ["/", "/advance", "/advancecourses", "/referandearn", "/events", "/masterclass", "/alumni"];
    const currentPath = location.pathname.toLowerCase().replace(/\/$/, "");
    const isAllowed = allowedPaths.includes(currentPath || "/");

    if (isAllowed) {
      const timer = setTimeout(() => setShowAutoPopup(true), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowAutoPopup(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    ReactPixel.pageView();
  }, [location]);

  const adminheaderPaths = ["/admindashboard", "/addcourse", "/addadvcourse", "/addmodule", "/addadvmodule", "/pendingapplication", "/acceptedapplication", "/bookedlist", "/halfpayment", "/defaultlist", "/fullpaidlist", "/createoperation", "/createadvoperation", "/createbda", "/createadvteam", "/createmanager", "/mentorqueries", "/advancequeries", "/revenuesheet", "/advrevenuesheet", "/createplacementcoordinator", "/onboardingdetails", "/advonboardingdetails", "/advbooked", "/advfullpaid", "/advdefault", "/allteamdetail", "/advteamdetail", "/masterclasses", "/addevent", "/eventregistration", "/target", "/alumnidata", "/inactivebda", "/referandearnresponse", "/createmarketingteam", "/createinterviewer", "/createhr", "/createinterview", "/adminprojectpage", "/advprojectpage", "/advexercisepage", "/advleadmanagement", "/adminanalytics", "/advadmindashboard", "/admin/agents", "/admin/teams", "/admin/leadassignments", "/admin/agentactivity", "/admin/reports", "/bulkimport", "/admin/attendance", "/advusermanagement", "/admin/livemonitor", "/admin/calllogs", "/advformleads", "/admin/leads-count"];
  const operationheaderPaths = ["/operationdashboard", "/fullpayment", "/bookedpayment", "/defaultpayment", "/operationrevenuesheet"];
  const advoperationheaderPaths = ["/advoperationdashboard", "/advfullpayment", "/advbookedpayment", "/advdefaultpayment", "/advoperationrevenuesheet"];
  const marketingheaderPaths = ["/marketing/home", "/marketing/previous", "/marketing/addexecutive"];
  const bdaheaderPaths = ["/home", "/fullpaid", "/default", "/booked", "/onboarding", "/adduser", "/teamdetail", "/bdarevenuesheet", "/reference", "/companyleads", "/addteam", "/assigntarget", "/leaderboard"];
  const advteamheaderPaths = ["/advteam/home", "/advteam/onboarding", "/advteam/revenue", "/advteam/booked", "/advteam/fullpaid", "/advteam/default", "/advteam/record", "/advteam/lead-management", "/advteam/team-login", "/advteam/adduser", "/advteam/my-leads", "/advteam/leads-book", "/advteam/leaderboard", "/advteam/leads-count"];
  const hrheaderPaths = ["/hrdashboard"];
  const lmsFooterPaths = ["/jobboard"];
  const noFooterPaths = ["/operationdashboard", "/bookedpayment", "/fullpayment", "/defaultpayment", "/operationrevenuesheet", "/advoperationdashboard", "/advfullpayment", "/advbookedpayment", "/advdefaultpayment", "/advoperationrevenuesheet", "/advteam/home", "/advteam/onboarding", "/advteam/revenue", "/advteam/booked", "/advteam/fullpaid", "/advteam/default", "/advteam/record", "/advteam/lead-management", "/advteam/team-login", "/advteam/adduser", "/advteam/my-leads", "/advteam/leads-book", "/advteam/leaderboard", "/home", "/fullpaid", "/default", "/booked", "/onboarding", "/adduser", "/teamdetail", "/bdarevenuesheet", "/reference", "/companyleads", "/addteam", "/assigntarget", "/leaderboard", "/setting"];
  const placementcoodinatorHeaderPaths = ["/pcdashboard", "/jobpost"];
  const headerPaths = ["/", "/login", "/loginwithotp", "/forgotpassword", "/contactus", "/aboutus", "/career", "/collabration", "/advancecourses", "/terms", "/privacy", "/refundpolicy", "/feestructure", "/advance", "/advance-apply", "/mentorship", "/datascience", "/dataanalytics", "/digitalmarket", "/mernstack", "/investmentbanking", "/productmanagement", "/automationtesting", "/promptengineering", "/generativeai", "/operationlogin", "/advoperationlogin", "/teamlogin", "/adminlogin", "/managerlogin", "/loginadmin", "/pclogin", "/advteamlogin", "/dashboardaccessform", "/advancedashboardaccess", "/masterclass", "/alumni", "/verify", "/referandearn", "/marketing/login", "/interviewer-login", "/interviewerlogin", "/hrlogin", "/advanceform"];

  return (
    <div>
      <SmoothScroll />
      <ScrollToTop />
      {adminheaderPaths.includes(location.pathname.toLowerCase()) && isAuthenticatedAdmin() ? (
        <AdminHeader />
      ) : operationheaderPaths.includes(location.pathname.toLowerCase()) && isAuthenticatedOperation() ? (
        <OperationHeader />
      ) : advoperationheaderPaths.includes(location.pathname.toLowerCase()) && isAuthenticatedAdvOperation() ? (
        <AdvOperationHeader />
      ) : marketingheaderPaths.includes(location.pathname.toLowerCase()) && isAuthenticatedMarketing() ? (
        <MarketingHeader />
      ) : bdaheaderPaths.includes(location.pathname.toLowerCase()) && isAuthenticatedBda() ? (
        <BDAHeader />
      ) : advteamheaderPaths.includes(location.pathname.toLowerCase()) && isAuthenticatedAdvTeam() ? (
        <AdvTeamHeader />
      ) : placementcoodinatorHeaderPaths.includes(location.pathname.toLowerCase()) && isAuthenticatedPC() ? (
        <PCHeader />
      ) : hrheaderPaths.includes(location.pathname.toLowerCase()) && isAuthenticatedHR() ? (
        <HRHeader />
      ) : (headerPaths.includes(location.pathname.toLowerCase()) || location.pathname.toLowerCase().startsWith('/mentorship/') || location.pathname.toLowerCase().startsWith('/masterclass/')) ? (
        <Header />
      ) : null}

      <Routes>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/LoginWithOtp" element={<LoginWithOtp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Terms" element={<Terms />} />
        <Route path="/Privacy" element={<Privacy />} />
        <Route path="/RefundPolicy" element={<RefundPolicy />} />
        <Route path="/Career" element={<Career />} />
        <Route path="/Collabration" element={<Collabration />} />
        <Route path="/AdvanceCourses" element={<Advance />} />
        <Route path="/FeeStructure" element={<FeeStructure />} />
        <Route path="/events" element={<TalentHunt />} />
        <Route path="/EventRegister" element={<EventRegister />} />
        <Route path="/Advance" element={<Advance />} />
        <Route path="/advance-apply" element={<AdvanceApplyPage />} />
        <Route path="/advanceform" element={<AdvanceForm />} />
        <Route path="/Mentorship" element={<Mentorship />} />
        <Route path="/mentorship/:courseSlug" element={<MentorshipCourseDetails />} />
        <Route path="/DataScience" element={<DataScience />} />
        <Route path="/DataAnalytics" element={<DataAnalytics />} />
        <Route path="/DigitalMarket" element={<DigitalMarket />} />
        <Route path="/MernStack" element={<MernStack />} />
        <Route path="/UIUX" element={<UIUXDesign />} />
        <Route path="/UIUXDesign" element={<UIUXDesign />} />
        <Route path="/ui-ux" element={<UIUXDesign />} />

        <Route path="/ProductManagement" element={<ProductManagement />} />
        <Route path="/AutomationTesting" element={<AutomationTesting />} />
        <Route path="/PromptEngineering" element={<PromptEngineering />} />
        <Route path="/GenerativeAI" element={<GenerativeAI />} />
        <Route path="/DashboardAccessForm" element={<DashboardAccessForm />} />
        <Route path="/AdvanceDashboardAccess" element={<AdvanceDashboardAccess />} />
        <Route path="/MasterClass" element={<MasterClass />} />
        <Route path="/MasterClass/:id" element={<MasterClassDetails />} />
        <Route path="/Alumni" element={<Alumni />} />
        <Route path="/Verify" element={<Verified />} />
        <Route path="/ReferAndEarn" element={<ReferAndEarn />} />
        <Route path="/attendance" element={<Attendance />} />

        {/* Admin Panel Start */}
        <Route path="/AdminLogin" element={<AdminLogIn />} />
        <Route path="/LoginAdmin" element={<LoginAdmin />} />
        <Route path="/AdminDashboard" element={isAuthenticatedAdmin() ? <AdminDashboard /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AddCourse" element={isAuthenticatedAdmin() ? <AddCourse /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AddAdvCourse" element={isAuthenticatedAdmin() ? <AddAdvCourse /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AddModule" element={isAuthenticatedAdmin() ? <AddModule /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AddAdvModule" element={isAuthenticatedAdmin() ? <AddAdvModule /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AdminProjectPage" element={isAuthenticatedAdmin() ? <AdminProjectPage /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AdvProjectPage" element={isAuthenticatedAdmin() ? <AdvProjectPage /> : <Navigate to="/AdminLogin" />} />
        <Route path="/CreateOperation" element={isAuthenticatedAdmin() ? <CreateOperation /> : <Navigate to="/AdminLogin" />} />
        <Route path="/CreateAdvOperation" element={isAuthenticatedAdmin() ? <CreateAdvOperation /> : <Navigate to="/AdminLogin" />} />
        <Route path="/CreateBDA" element={isAuthenticatedAdmin() ? <CreateBDA /> : <Navigate to="/AdminLogin" />} />
        <Route path="/CreateAdvTeam" element={isAuthenticatedAdmin() ? <CreateAdvTeam /> : <Navigate to="/AdminLogin" />} />
        <Route path="/PendingApplication" element={isAuthenticatedAdmin() ? <PendingApplication /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AcceptedApplication" element={isAuthenticatedAdmin() ? <AcceptedApplication /> : <Navigate to="/AdminLogin" />} />
        <Route path="/BookedList" element={isAuthenticatedAdmin() ? <BookedList /> : <Navigate to="/AdminLogin" />} />
        <Route path="/HalfPayment" element={isAuthenticatedAdmin() ? <HalfPayment /> : <Navigate to="/AdminLogin" />} />
        <Route path="/DefaultList" element={isAuthenticatedAdmin() ? <DefaultList /> : <Navigate to="/AdminLogin" />} />
        <Route path="/FullPaidList" element={isAuthenticatedAdmin() ? <FullPaidList /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AdvanceQueries" element={isAuthenticatedAdmin() ? <AdvanceQueries /> : <Navigate to="/AdminLogin" />} />
        <Route path="/MentorQueries" element={isAuthenticatedAdmin() ? <MentorQueries /> : <Navigate to="/AdminLogin" />} />
        <Route path="/CreateManager" element={isAuthenticatedAdmin() ? <Createmanager /> : <Navigate to="/AdminLogin" />} />
        <Route path="/RevenueSheet" element={isAuthenticatedAdmin() ? <RevenueSheet /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AdvRevenueSheet" element={isAuthenticatedAdmin() ? <AdvRevenueSheet /> : <Navigate to="/AdminLogin" />} />
        <Route path="/OnBoardingDetails" element={isAuthenticatedAdmin() ? <OnBoardingDetails /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AdvOnBoardingDetails" element={isAuthenticatedAdmin() ? <AdvOnBoardingDetails /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AdvBooked" element={isAuthenticatedAdmin() ? <AdvBooked /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AdvFullPaid" element={isAuthenticatedAdmin() ? <AdvFullPaid /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AdvDefault" element={isAuthenticatedAdmin() ? <AdvDefault /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AllTeamDetail" element={isAuthenticatedAdmin() ? <AllTeamDetail /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AdvTeamDetail" element={isAuthenticatedAdmin() ? <AdvTeamDetail /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AdvUserManagement" element={isAuthenticatedAdmin() ? <AdvUserManagement /> : <Navigate to="/AdminLogin" />} />


        <Route path="/CreatePlacementCoordinator" element={isAuthenticatedAdmin() ? (<CreatePlacementCoordinator />) : (<Navigate to="/AdminLogin" />)} />
        <Route path="/MasterClasses" element={isAuthenticatedAdmin() ? (<MasterClasses />) : (<Navigate to="/AdminLogin" />)} />
        <Route path="/AddEvent" element={isAuthenticatedAdmin() ? (<AddEvent />) : (<Navigate to="/AdminLogin" />)} />
        <Route path="/EventRegistration" element={isAuthenticatedAdmin() ? (<EventRegistration />) : (<Navigate to="/AdminLogin" />)} />
        <Route path="/Target" element={isAuthenticatedAdmin() ? (<Target />) : (<Navigate to="/AdminLogin" />)} />
        <Route path="/AlumniData" element={isAuthenticatedAdmin() ? (<AlumniData />) : (<Navigate to="/AdminLogin" />)} />
        <Route path="/InactiveBda" element={isAuthenticatedAdmin() ? (<InactiveBda />) : (<Navigate to="/AdminLogin" />)} />
        <Route path="/ReferAndEarnResponse" element={isAuthenticatedAdmin() ? (<ReferAndEarnResponse />) : (<Navigate to="/AdminLogin" />)} />
        <Route path="/CreateMarketingTeam" element={isAuthenticatedAdmin() ? (<CreateMarketingTeam />) : (<Navigate to="/AdminLogin" />)} />
        <Route path="/CreateInterviewer" element={isAuthenticatedAdmin() ? (<CreateInterviewer />) : (<Navigate to="/AdminLogin" />)} />
        <Route path="/CreateInterview" element={isAuthenticatedAdmin() ? (<CreateInterview />) : (<Navigate to="/AdminLogin" />)} />
        <Route path="/CreateHR" element={isAuthenticatedAdmin() ? (<CreateHR />) : (<Navigate to="/AdminLogin" />)} />
        <Route path="/AdvExercisePage" element={isAuthenticatedAdmin() ? (<AdvExercisePage />) : (<Navigate to="/AdminLogin" />)} />
        <Route path="/advleadmanagement" element={
          isAuthenticatedAdmin() ? <AdvLeadManagement /> : <Navigate to="/AdminLogin" />
        } />
        <Route path="/advteam/lead-management" element={
          isAuthenticatedAdvTeam() ? <AdvTeamLeadManagement /> : <Navigate to="/AdvTeamLogin" />
        } />
        <Route path="/advteam/leads-count" element={
          isAuthenticatedAdvTeam() ? <AdvLeadsCount isAdmin={false} /> : <Navigate to="/AdvTeamLogin" />
        } />
        <Route path="/admin/leads-count" element={
          isAuthenticatedAdmin() ? <AdvLeadsCount isAdmin={true} /> : <Navigate to="/AdminLogin" />
        } />
        <Route path="/AdminAnalytics" element={isAuthenticatedAdmin() ? (<AdminAnalytics />) : (<Navigate to="/AdminLogin" />)} />

        {/* HR Portal Start */}
        <Route path="/hrlogin" element={<HRLogin />} />
        <Route path="/hrdashboard" element={isAuthenticatedHR() ? <HRAttendance /> : <Navigate to="/hrlogin" />} />
        {/* HR Portal End */}

        {/* Phase 13 Admin CRM Routes */}
        <Route path="/AdvAdminDashboard" element={isAuthenticatedAdmin() ? <AdvAdminDashboard /> : <Navigate to="/AdminLogin" />} />
        <Route path="/Admin/Agents" element={isAuthenticatedAdmin() ? <AgentsManagement /> : <Navigate to="/AdminLogin" />} />
        <Route path="/Admin/Teams" element={isAuthenticatedAdmin() ? <TeamsManagement /> : <Navigate to="/AdminLogin" />} />
        <Route path="/Admin/LeadAssignments" element={isAuthenticatedAdmin() ? <LeadAssignments /> : <Navigate to="/AdminLogin" />} />
        <Route path="/Admin/AgentActivity/:agentId" element={isAuthenticatedAdmin() ? <AgentActivity /> : <Navigate to="/AdminLogin" />} />
        <Route path="/Admin/Reports" element={isAuthenticatedAdmin() ? <AdminReports /> : <Navigate to="/AdminLogin" />} />
        <Route path="/Admin/CallLogs" element={isAuthenticatedAdmin() ? <AdvCallLogs /> : <Navigate to="/AdminLogin" />} />
        <Route path="/AdvFormLeads" element={isAuthenticatedAdmin() ? <AdvFormLeads /> : <Navigate to="/AdminLogin" />} />

        <Route path="/BulkImport" element={isAuthenticatedAdmin() ? (<BulkImport />) : (<Navigate to="/AdminLogin" />)} />
        <Route path="/Admin/Attendance" element={isAuthenticatedAdmin() ? <AdminAttendance /> : <Navigate to="/AdminLogin" />} />
        <Route path="/Admin/LiveMonitor" element={isAuthenticatedAdmin() ? <LiveSalesMonitor /> : <Navigate to="/AdminLogin" />} />



        {/* Admin Panel End */}

        {/* Operation Panel Start */}
        <Route path="/OperationDashboard" element={<OperationDashboard />} />
        <Route path="/BookedPayment" element={isAuthenticatedOperation() ? <BookedPayment /> : <Navigate to="/OperationLogin" />} />
        <Route path="/FullPayment" element={isAuthenticatedOperation() ? <FullPayment /> : <Navigate to="/OperationLogin" />} />
        <Route path="/DefaultPayment" element={isAuthenticatedOperation() ? <DefaultPayment /> : <Navigate to="/OperationLogin" />} />
        <Route path="/OperationRevenueSheet" element={isAuthenticatedOperation() ? <OperationRevenueSheets /> : <Navigate to="/OperationLogin" />} />
        <Route path="/OperationLogin" element={<OperationLogin />} />
        {/* Operation Panel End */}

        {/* ADV Operation Panel Start */}
        <Route path="/AdvOperationLogin" element={<AdvOperationLogin />} />
        <Route path="/AdvOperationAgainLogin" element={<AdvOperationAgainLogin />} />
        <Route path="/AdvOperationDashboard" element={isAuthenticatedAdvOperation() ? <AdvOperationDashboard /> : <Navigate to="/AdvOperationLogin" />} />
        <Route path="/AdvBookedPayment" element={isAuthenticatedAdvOperation() ? <AdvBookedPayment /> : <Navigate to="/AdvOperationLogin" />} />
        <Route path="/AdvFullPayment" element={isAuthenticatedAdvOperation() ? <AdvFullPayment /> : <Navigate to="/AdvOperationLogin" />} />
        <Route path="/AdvDefaultPayment" element={isAuthenticatedAdvOperation() ? <AdvDefaultPayment /> : <Navigate to="/AdvOperationLogin" />} />
        <Route path="/AdvOperationRevenueSheet" element={isAuthenticatedAdvOperation() ? <AdvOperationRevenueSheets /> : <Navigate to="/AdvOperationLogin" />} />
        {/* ADV Operation Panel End */}


        {/* Marketing Panel */}
        <Route path="/marketing/login" element={<MarketingLogin />} />
        <Route path="/marketing/home" element={isAuthenticatedMarketing() ? <MarketingDashboard /> : <Navigate to="/marketing/login" />} />
        <Route path="/marketing/previous" element={isAuthenticatedMarketing() ? <MarketingPrePayment /> : <Navigate to="/marketing/login" />} />
        {/* <Route path="/marketing/leads" element={isAuthenticatedMarketing() ? <MarketingLeads /> : <Navigate to="/marketing/login" />} /> */}  {/* DISABLED */}
        <Route path="/marketing/addexecutive" element={isAuthenticatedMarketing() ? <MarketingAddExecutive /> : <Navigate to="/marketing/login" />} />
        {/* Marketing Panel */}

        {/* bda panel start */}
        <Route path="/TeamLogin" element={<TeamLogin />} />
        <Route path="/BDAAgainLogin" element={<BDAAgainLogin />} />
        <Route path="/Home" element={isAuthenticatedBda() ? <Home /> : <Navigate to="/TeamLogin" />} />
        <Route path="/FullPaid" element={isAuthenticatedBda() ? <FullPaid /> : <Navigate to="/TeamLogin" />} />
        <Route path="/Default" element={isAuthenticatedBda() ? <Default /> : <Navigate to="/TeamLogin" />} />
        <Route path="/Booked" element={isAuthenticatedBda() ? <Booked /> : <Navigate to="/TeamLogin" />} />
        <Route path="/OnBoarding" element={isAuthenticatedBda() ? <OnBoarding /> : <Navigate to="/TeamLogin" />} />
        <Route path="/AddUser" element={isAuthenticatedBda() ? <AddUser /> : <Navigate to="/TeamLogin" />} />
        <Route path="/TeamDetail" element={isAuthenticatedBda() ? <TeamDetail /> : <Navigate to="/TeamLogin" />} />
        <Route path="/BDARevenueSheet" element={isAuthenticatedBda() ? <BDARevenueSheet /> : <Navigate to="/TeamLogin" />} />
        <Route path="/Reference" element={isAuthenticatedBda() ? <Reference /> : <Navigate to="/TeamLogin" />} />
        <Route path="/CompanyLeads" element={isAuthenticatedBda() ? <CompanyLeads /> : <Navigate to="/TeamLogin" />} />
        <Route path="/AddTeam" element={isAuthenticatedBda() ? <AddTeam /> : <Navigate to="/TeamLogin" />} />
        <Route path="/AssignTarget" element={isAuthenticatedBda() ? <AssignTarget /> : <Navigate to="/TeamLogin" />} />
        <Route path="/LeaderBoard" element={isAuthenticatedBda() ? <LeaderBoard /> : <Navigate to="/TeamLogin" />} />


        {/* bda panel ends */}

        {/* Advance Team Panel Start */}
        <Route path="/AdvTeamLogin" element={<AdvTeamLogin />} />
        <Route path="/advteam/home" element={isAuthenticatedAdvTeam() ? <AdvTeamHome /> : <Navigate to="/AdvTeamLogin" />} />
        <Route path="/advteam/onboarding" element={isAuthenticatedAdvTeam() ? <AdvTeamOnBoarding /> : <Navigate to="/AdvTeamLogin" />} />
        <Route path="/advteam/revenue" element={isAuthenticatedAdvTeam() ? <AdvTeamRevenue /> : <Navigate to="/AdvTeamLogin" />} />
        <Route path="/advteam/booked" element={isAuthenticatedAdvTeam() ? <AdvTeamBooked /> : <Navigate to="/AdvTeamLogin" />} />
        <Route path="/advteam/fullpaid" element={isAuthenticatedAdvTeam() ? <AdvTeamFullPaid /> : <Navigate to="/AdvTeamLogin" />} />
        <Route path="/advteam/default" element={isAuthenticatedAdvTeam() ? <AdvTeamDefault /> : <Navigate to="/AdvTeamLogin" />} />
        <Route path="/advteam/adduser" element={isAuthenticatedAdvTeam() ? <AdvAddUser /> : <Navigate to="/AdvTeamLogin" />} />
        <Route path="/advteam/my-leads" element={isAuthenticatedAdvTeam() ? <AdvTeamMyLeads /> : <Navigate to="/AdvTeamLogin" />} />
        <Route path="/advteam/leads-book" element={isAuthenticatedAdvTeam() ? <AdvLeadsBook /> : <Navigate to="/AdvTeamLogin" />} />
        <Route path="/advteam/record" element={isAuthenticatedAdvTeam() ? <AdvTeamRecord /> : <Navigate to="/AdvTeamLogin" />} />
        <Route path="/advteam/team-login" element={isAuthenticatedAdvTeam() ? <AdvTeamTeamLogin /> : <Navigate to="/AdvTeamLogin" />} />
        <Route path="/advteam/leaderboard" element={isAuthenticatedAdvTeam() ? <AdvLeaderBoard /> : <Navigate to="/AdvTeamLogin" />} />
        {/* Advance Team Panel End */}

        {/* User Panel */}
        <Route element={<UserLayout />}>
          <Route path="/Dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/EnrolledCourses" element={isAuthenticated() ? <EnrolledCourses /> : <Navigate to="/login" />} />
          <Route path="/Setting" element={isAuthenticated() ? <Setting /> : <Navigate to="/login" />} />
          <Route path="/Learning" element={isAuthenticated() ? <Learning /> : <Navigate to="/login" />} />
          <Route path="/JobBoard" element={isAuthenticated() ? <JobBoardPage /> : <Navigate to="/login" />} />
          <Route path="/MyJob" element={isAuthenticated() ? <MyJobPage /> : <Navigate to="/login" />} />
          <Route path="/MockInterview" element={isAuthenticated() ? <MockInterviewPage /> : <Navigate to="/login" />} />
          <Route path="/ResumeATS" element={isAuthenticated() ? <ResumeATSPage /> : <Navigate to="/login" />} />
          <Route path="/Exercise" element={isAuthenticated() ? <ExercisePage /> : <Navigate to="/login" />} />
          <Route path="/resume-builder" element={<ResumeBuilderPage />} />
        </Route>
        {/* User Panel End */}

        {/* placement coodinator panel starts */}
        <Route path="/PClogin" element={<PClogin />} />
        <Route path="/PCDashboard" element={isAuthenticatedPC() ? <PCDashboard /> : <Navigate to="/PClogin" />} />
        <Route path="/JobPost" element={isAuthenticatedPC() ? <JobPost /> : <Navigate to="/PClogin" />} />
        {/* placement coodinator panel ends */}

        {/* Interviewer Panel */}
        <Route path="/interviewer-login" element={<InterviewerLogin />} />
        <Route path="/InterviewerDashboard" element={<InterviewerDashboard />} />

        {/* event */}
        <Route path="/EventLogin" element={<EventLogin />} />
        <Route path="/EventDashboard" element={isAuthenticatedEventUser() ? <EventDashBoard /> : <Navigate to="/events" />} />
        <Route path="/register/:slug" element={<EventDetails />} />
        <Route path="/advancedashboard" element={<AdvanceDashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="setting" element={<Setting />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="training" element={<TrainingPage />} />
          <Route path="practical" element={<PracticalPage />} />
          <Route path="internship" element={<InternshipPage />} />
          <Route path="placement" element={<PlacementPage />} />
          <Route path="certificates" element={<CertificatePage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="jobs" element={<JobBoardPage />} />
          <Route path="my-job" element={<MyJobPage />} />
          <Route path="mock-interview" element={<MockInterviewPage />} />
          <Route path="resume-ats" element={<ResumeATSPage />} />
          <Route path="exercise" element={<ExercisePage />} />
          <Route path="resume-builder" element={<ResumeBuilderPage />} />
        </Route>
        {/* Advanced dashboard video player — standalone, no old sidebar */}
        <Route path="/advancedashboard/learning" element={<AdvanceLearningPage />} />

      </Routes>

      {/* Global Footers - Exclude authenticated dashboards and login pages; only show on public paths */}
      {(() => {
        const path = location.pathname.toLowerCase();
        
        // Exclude all login pages from having a footer
        if (path.includes('login')) return null;

        // Custom LMS footer
        if (lmsFooterPaths.includes(path)) return <LmsFooter />;

        // Explicit exclusions
        if (path === "/attendance") return null;

        // Determine if it is a public marketing/informational page
        const isPublicPath = headerPaths.includes(path) || 
                             path.startsWith('/mentorship/') || 
                             path.startsWith('/masterclass/') ||
                             path.startsWith('/register/') ||
                             path === '/events' || 
                             path === '/eventregister' || 
                             path === '/uiux' || 
                             path === '/uiuxdesign';
                             
        if (isPublicPath) return <Footer />;

        return null;
      })()}

      {showAutoPopup && <AdvancedApplyPopup onClose={() => setShowAutoPopup(false)} />}
    </div>
  );
};

export default App;
