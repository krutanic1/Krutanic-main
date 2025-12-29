import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import './index.css'
import './style/header.css'
import './style/landingpage.css'
import './style/Collabration.css'
import './style/Login.css'
import './style/Contact.css'
import './style/AboutUs.css'
import './style/AdvanceCourses.css'
import './style/TalentHunt.css'
import './style/footermain.css'
import './style/Adance.css';
import './style/Style.scss'
import './style/Mentorship.css'
import './style/FeesStructure.css'
import './Admin/AdminPanel.css'
import './User/UserPanel.css'
import './BDA/BdaPanel.css'
import './Operation/OperationPanel.css'
import './style/MasterClass.css'
import './style/OnBoardingForm.css'
import "./axiosConfig";
import "./style/Event.css";
import "./style/verify.css";
import './style/Linkedin.css'
import "./style/ReferAndEarn.css"
import "./style/CreateMarketingTeam.css"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
