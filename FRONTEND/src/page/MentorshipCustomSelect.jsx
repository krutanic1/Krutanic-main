import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './MentorshipCustomSelect.css';

const MentorshipCustomSelect = ({ options, value, onChange, placeholder, icon: Icon, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <div 
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="custom-select-left">
          {Icon && <Icon className="input-icon" />}
          <span className={`custom-select-value ${!value ? 'placeholder' : ''}`}>
            {value || placeholder}
          </span>
        </div>
        <FaChevronDown className={`custom-select-arrow ${isOpen ? 'open' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="custom-select-dropdown">
          <div className="custom-select-options">
            {options.map((opt, idx) => (
              <div 
                key={idx} 
                className={`custom-select-option ${value === opt.value ? 'selected' : ''}`}
                onClick={() => {
                  onChange({ target: { name, value: opt.value } });
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorshipCustomSelect;
