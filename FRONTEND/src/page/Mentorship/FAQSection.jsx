import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What makes Krutanic Mentorship different?",
      a: "Unlike traditional courses, we focus on 1:1 mentorship and live sessions with industry practitioners. You build real products, not just toy examples, and get direct internship support through our partner network."
    },
    {
      q: "Do I need prior coding knowledge?",
      a: "No, our programs are designed for all levels. We start with the fundamentals and gradually move to advanced concepts. However, having a passion for the domain is essential!"
    },
    {
      q: "What is the duration of the mentorship?",
      a: "Most specialized tracks range from 4 to 6 months. This includes live training, project work, and career support phases."
    },
    {
      q: "Will I get placement assistance?",
      a: "Yes! We provide dedicated career support, including resume building, mock interviews, and access to our 100+ partner firms for internships and full-time roles."
    },
    {
      q: "Are the sessions recorded?",
      a: "Yes, all live sessions are recorded and made available on your student dashboard for lifelong access, so you never miss a lesson."
    }
  ];

  return (
    <section className="km-faq">
      <div className="km-faq__container">
        <div className="km-faq__left" data-aos="fade-right">
          <div className="km-section-chip">Support</div>
          <h2 className="km-section-title">Common <span>Questions</span></h2>
          <p className="km-faq__sub">Everything you need to know about the mentorship program and your career journey.</p>
          <p className="km-faq__contact-prompt">
            Still have questions? <br />
            <a href="https://api.whatsapp.com/send?phone=919380736449" className="km-faq__wa-link">Chat with our team on WhatsApp</a>
          </p>
        </div>

        <div className="km-faq__right" data-aos="fade-left">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`km-faq__item ${openIndex === index ? 'km-faq__item--open' : ''}`}
            >
              <button 
                className="km-faq__question" 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {faq.q}
                <span className="km-faq__toggle">
                  {openIndex === index ? <FaMinus size={12} /> : <FaPlus size={12} />}
                </span>
              </button>
              {openIndex === index && (
                <div className="km-faq__answer">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
