import React, { useState } from "react";

const FAQMentor = ({ hideHeading = false }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Are there any prerequisites before starting a course?",
      answer:
        "There are no prerequisites required! our courses are designed for all skill levels, whether you're a beginner or looking to enhance existing knowledge. Just a willingness to learn is all you need!",
    },
    {
      question: "What is the duration of this course?",
      answer:
        "The course duration is 2–3 months, with each session including 1 hour of teaching and a 30-minute doubt-clearing session mostly classes are conveniently scheduled to start after 6 PM.",
    },
    {
      question: "How do I attend live classes?",
      answer:
        "You will receive the class link on your registered email ID. Classes are conducted on platforms such as Zoom, Google Meet, or the LMS portal.",
    },
    {
      question: "Do I get access to recorded sessions if I miss a class? ",
      answer:
        "Yes! Simply log in to the LMS portal to access the recorded sessions of any classes you missed.",
    },

    {
      question: "What is the refund policy? ",
      answer:
        "Our courses are crafted with care and commitment. Therefore, we do not offer refunds. We are confident in the value and quality of our educational services!",
    },
  ];
  return (
    <div>
      <div className="container mx-auto">
        {!hideHeading && (
          <h1 data-aos='fade-up' className=" font-bold text-[#f15b29] text-center mb-4">
            | Frequently Asked Questions
          </h1>
        )}
        <div data-aos='fade-up' className="lg:flex gap-4">
          <div className="space-y-3 lg:w-1/2 w-full">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden ease-linear duration-500"
              >
                <button
                  className="flex justify-between items-center w-full p-4 text-left bg-[#111827] hover:bg-[#0f172a] transition-colors"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <h3 className="text-lg font-semibold pr-8 text-white">{faq.question}</h3>
                  <span className="text-2xl bg-[#0b1220] px-2 rounded-full text-[#f15b29]">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="p-4 bg-white border border-[#e5e7eb]">
                    <p className="text-[#475467]">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="bg-cover rounded-md bg-center bg-[url('https://images.unsplash.com/photo-1565689157206-0fddef7589a2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] lg:w-1/2 w-full h-[380px]"></div>
        </div>
      </div>
    </div>
  );
};

export default FAQMentor;
