import { FiPenTool,FiPhoneCall,FiBook,FiCreditCard    } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowSize } from "./useWindowSize";
import { useState } from "react";
import imgp1 from '../assets/process1.jpg';
import imgp2 from '../assets/process2.jpg';
import imgp3 from '../assets/process3.avif';
import imgp4 from '../assets/process4.jpg';

const VerticalAccordion = () => {
  const [open, setOpen] = useState(items[0].id);
  // hehhehe

  return (
    <section className="text-white imagebox">
      <div className="flex flex-col lg:flex-row h-fit lg:h-[400px]  shadow overflow-hidden">
        {items.map((item) => {
          return (
            <Panel
              key={item.id}
              open={open}
              setOpen={setOpen}
              id={item.id}
              Icon={item.Icon}
              title={item.title}
              imgSrc={item.imgSrc}
              description={item.description}
            />
          );
        })}
      </div>
    </section>
  );
};

const Panel = ({ open, setOpen, id, Icon, title, imgSrc, description }) => {
  const { width } = useWindowSize();
  const isOpen = open === id;

  return (
    <>
      <button
        className="bg-[rgb(255,255,255,0.2)] transition-colors p-3 border-r-[1px] border-b-[1px] border-slate-200 flex flex-row-reverse lg:flex-col justify-end items-center gap-4 relative group"
        onClick={() => setOpen(id)}
      >
        <span
          style={{
            writingMode: "vertical-lr",
          }}
          className="hidden lg:block text-xl font-light rotate-180"
        >
          {title}
        </span>
        <span className="block lg:hidden text-xl font-light">{title}</span>
        <div className="w-6 lg:w-full aspect-square bg-orange-700 text-white grid place-items-center">
          <Icon />
        </div>
        <span className="w-4 h-4 bg-white group-hover:bg-slate-50 transition-colors border-r-[1px] border-b-[1px] lg:border-b-0 lg:border-t-[1px] border-slate-200 rotate-45 absolute bottom-0 lg:bottom-[50%] right-[50%] lg:right-0 translate-y-[50%] translate-x-[50%] z-20" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={`panel-${id}`}
            variants={width && width > 1024 ? panelVariants : panelVariantsSm}
            initial="closed"
            animate="open"
            exit="closed"
            style={{
              backgroundImage: `url(${imgSrc})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            className="w-full h-full overflow-hidden relative bg-black flex items-end"
          >
            <motion.div
              variants={descriptionVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="px-4 py-2 bg-black/40 backdrop-blur-sm text-white"
            >
              <p>{description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VerticalAccordion;

const panelVariants = {
  open: {
    width: "100%",
    height: "100%",
  },
  closed: {
    width: "0%",
    height: "100%",
  },
};

const panelVariantsSm = {
  open: {
    width: "100%",
    height: "200px",
  },
  closed: {
    width: "100%",
    height: "0px",
  },
};

const descriptionVariants = {
  open: {
    opacity: 1,
    y: "0%",
    transition: {
      delay: 0.125,
    },
  },
  closed: { opacity: 0, y: "100%" },
};

const items = [
  {
    id: 1,
    title: "1. Register with us",
    Icon: FiPenTool ,
    imgSrc:
      imgp1,
    description:
      "Register now to explore professional courses that will boost your skills and career. Just select your course and complete the registration form!",
  },
  {
    id: 2,
    title: "2. Get a Call",
    Icon: FiPhoneCall ,
    imgSrc:
    imgp2,
    description:
      "After registration, one of our senior executives will call to confirm your course choice and guide you through the enrollment process.",
  },
  {
    id: 3,
    title: "3. Provide Your Details",
    Icon: FiBook  ,
    imgSrc:
      imgp3,
    description:
      "During the call, you'll share essential details about your educational background and career goals, helping our executive offer personalized course recommendations and ensure a smooth enrollment.",
  },
  {
    id: 4,
    title: "4. Pay course fee",
    Icon: FiCreditCard  ,
    imgSrc: imgp4,
    description:
      "Once details are confirmed, complete the payment to finalize your enrollment. You'll receive official confirmation and can begin your course.",
  },
];