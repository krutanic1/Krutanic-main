import React, { useState } from "react";
import axios from "axios";
import API from "../API";
import toast from "react-hot-toast";
import girl from "../assets/girl.png";
import "../page/MentorshipForm.css";

const AdvancedApplyPopup = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        number: "",
        currentRole: "",
        experience: "",
        goal: "",
        goalOther: "",
        reason: "",
        domain: "",
        domainOther: "",
        interestedDomain: "",
        passedOutYear: ""
    });

    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const phoneRegex = /^[0-9]{10}$/;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        if (!emailVerified) {
            toast.error("Please verify your email before submitting.");
            return;
        }

        if (!phoneRegex.test(formData.number)) {
            toast.error("Please enter a valid phone number.");
            return;
        }

        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        try {
            await axios.post(`${API}/advance/register`, {
                name: formData.name,
                email: formData.email,
                phone: formData.number,
                currentRole: formData.currentRole,
                experience: formData.experience,
                goal: formData.goal,
                goalOther: formData.goal === "Other" ? formData.goalOther : undefined,
                reason: formData.reason,
                domain: formData.domain,
                domainOther:
                    formData.domain === "Other" ? formData.domainOther : undefined,
                interestedDomain: formData.interestedDomain,
                passedOutYear: formData.passedOutYear || undefined,

            });
            return (
                <div className="shared-form-overlay">
                    <div className="shared-form-shell max-w-[920px] lg:flex">
                        <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-[#0f172a] text-white p-8">
                            <div className="relative z-10 flex w-full flex-col justify-between">
                                <div>
                                    <div className="shared-form-chip mb-4">Krutanic</div>
                                    <h2 className="text-3xl font-extrabold tracking-tight">Apply with confidence</h2>
                                    <p className="mt-3 max-w-sm text-sm leading-6 text-slate-200">
                                        Get access to hands-on learning, expert mentorship, and a counselor who can guide your next step.
                                    </p>
                                </div>
                                <ul className="mt-8 space-y-4 text-sm leading-6 text-slate-100">
                                    <li>
                                        <i className="fa fa-hand-o-right text-[#ff8a4c] pr-2"></i>Hands-On Learning Via 50+ Projects
                                    </li>
                                    <li>
                                        <i className="fa fa-hand-o-right text-[#ff8a4c] pr-2"></i>1:1 Mentorship From AI Specialists
                                    </li>
                                    <li>
                                        <i className="fa fa-hand-o-right text-[#ff8a4c] pr-2"></i>Personalized Career Guidance
                                    </li>
                                </ul>
                            </div>
                            <img
                                src={girl}
                                alt="girl"
                                className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-auto object-contain"
                            />
                        </div>

                        <div className="w-full lg:w-7/12">
                            <div className="shared-form-header">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="shared-form-close"
                                    aria-label="Close form"
                                >
                                    <i className="fa fa-times"></i>
                                </button>
                                <div className="shared-form-chip">Apply now</div>
                                <h2>Apply Now</h2>
                                <p>
                                    Complete the form below to apply for your selected program. We will verify your email before submission.
                                </p>
                            </div>

                            <div className="shared-form-body max-h-[75vh] overflow-y-auto">
                                <form onSubmit={handleFormSubmit} className="shared-form-grid">
                                    <div className="shared-form-field">
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="shared-form-field">
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={emailVerified}
                                            required
                                        />
                                    </div>

                                    {!emailVerified ? (
                                        !otpSent ? (
                                            <button
                                                type="button"
                                                onClick={sendOTP}
                                                className="shared-form-verify"
                                            >
                                                Verify Email
                                            </button>
                                        ) : (
                                            <div className="shared-form-otp">
                                                <input
                                                    type="text"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    placeholder="Enter OTP"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={verifyOTP}
                                                    className="shared-form-submit !w-auto !px-5 !min-h-[48px] !bg-emerald-600 !shadow-none"
                                                >
                                                    Submit OTP
                                                </button>
                                            </div>
                                        )
                                    ) : (
                                        <div className="shared-form-status">Email verified successfully</div>
                                    )}

                                    <div className="shared-form-field">
                                        <input
                                            type="number"
                                            id="number"
                                            name="number"
                                            placeholder="Enter your phone number"
                                            value={formData.number}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="shared-form-field">
                                        <select
                                            id="currentRole"
                                            name="currentRole"
                                            value={formData.currentRole}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option disabled value="">
                                                What do you currently do?
                                            </option>
                                            <option value="Founder">Founder</option>
                                            <option value="Student">Student</option>
                                            <option value="Working Professional">Working Professional</option>
                                            <option value="Self Employed">Self Employed</option>
                                        </select>
                                    </div>

                                    <div className="shared-form-field">
                                        <select
                                            id="experience"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option disabled value="">
                                                Select Experience
                                            </option>
                                            <option value="0 year">0 year (Fresher)</option>
                                            <option value="1-2 years">1-2 years</option>
                                            <option value="3-5 years">3-5 years</option>
                                            <option value="5+ years">5+ years</option>
                                        </select>
                                    </div>

                                    <div className="shared-form-field">
                                        <select
                                            id="goal"
                                            name="goal"
                                            value={formData.goal}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option disabled value="">
                                                Goal of taking this program
                                            </option>
                                            <option value="Career Transition">Career Transition</option>
                                            <option value="Kickstart Career">Kickstart Career</option>
                                            <option value="Upskilling">Upskilling</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {formData.goal === "Other" && (
                                        <div className="shared-form-field">
                                            <input
                                                type="text"
                                                name="goalOther"
                                                value={formData.goalOther}
                                                onChange={handleInputChange}
                                                placeholder="Please specify your goal"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="shared-form-field">
                                        <select
                                            id="reason"
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option disabled value="">
                                                Reason to take this program
                                            </option>
                                            <option value="I Want to Know More About the Program">I Want to Know More About the Program</option>
                                            <option value="I've Reviewed the Program – Need Career Guidance">I've Reviewed the Program – Need Career Guidance</option>
                                            <option value="I'm Ready to Enroll">I'm Ready to Enroll</option>
                                            <option value="I'm Already Enrolled – Need Support">I'm Already Enrolled – Need Support</option>
                                        </select>
                                    </div>

                                    <div className="shared-form-field">
                                        <select
                                            id="domain"
                                            name="domain"
                                            value={formData.domain}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option disabled value="">
                                                Domain currently working in
                                            </option>
                                            <option value="Digital Marketing/Performance marketing">
                                                Digital Marketing/Performance Marketing
                                            </option>
                                            <option value="Marketing/Sales">Marketing/Sales</option>
                                            <option value="Management/Operations">Management/Operations</option>
                                            <option value="IT/Tech/Product">IT/Tech/Product</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {formData.domain === "Other" && (
                                        <div className="shared-form-field">
                                            <input
                                                type="text"
                                                name="domainOther"
                                                value={formData.domainOther}
                                                onChange={handleInputChange}
                                                placeholder="Please specify your domain"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="shared-form-field">
                                        <input
                                            type="text"
                                            id="passedOutYear"
                                            name="passedOutYear"
                                            placeholder="Passed Out Year (e.g. 2023)"
                                            value={formData.passedOutYear}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="shared-form-field">
                                        <select
                                            id="interestedDomain"
                                            name="interestedDomain"
                                            value={formData.interestedDomain}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option disabled value="">
                                                Select interested domain
                                            </option>
                                            <option value="Data Science">Data Science</option>
                                            <option value="Digital Marketing">Digital Marketing</option>
                                            <option value="Investment Banking">Investment Banking</option>
                                            <option value="MERN Stack Development">MERN Stack Development</option>
                                            <option value="Product Management">Product Management</option>
                                            <option value="Performance Marketing">Performance Marketing</option>
                                            <option value="Generative AI With Prompt Engineering">Generative AI With Prompt Engineering</option>
                                        </select>
                                    </div>

                                    <div className="shared-form-actions">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="shared-form-cancel"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!emailVerified}
                                            className="shared-form-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Submit Application
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            );
                            value={formData.interestedDomain}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 p-1.5 rounded-md"
                            required
                        >
                            <option disabled value="">
                                Select interested domain
                            </option>
                            <option value="Data Science">
                                Data Science
                            </option>
                            <option value="Digital Marketing">Digital Marketing</option>
                            <option value="Investment Banking"> Investment Banking</option>
                            <option value="MERN Stack Development">MERN Stack Development</option>
                            <option value="Product Management">Product Management</option>
                            <option value="Performance Marketing">Performance Marketing</option>
                            <option value="Generative AI With Prompt Engineering">Generative AI With Prompt Engineering</option>
                        </select>
                        <div className="flex justify-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-1 text-gray-500 border border-gray-300 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!emailVerified}
                                className="px-4 py-1 bg-[#f15b29] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdvancedApplyPopup;
