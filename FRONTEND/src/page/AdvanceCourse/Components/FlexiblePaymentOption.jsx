
import Flashaidlogo from "../../../assets/Flashaidlogo.jpg";
const FlexiblePaymentOption = () => {
  return (
    <div>
       <section className="py-[60px] px-[10px]">
          <div className="container mx-auto">
            <h1  className="text-center font-extrabold text-[#f15b29] mb-8" >  | Flexible Payment Options </h1>
             <div className="flex flex-col justify-center items-center mb-8">
             <p className="mb-2 text-[#f15b29]">| Our Financial Partner</p>
              <img src={Flashaidlogo} alt="emi" className="h-[100px]"/>
             </div>
            <div  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                <div className="bg-[#ffffff11] drop-shadow-md overflow-hidden shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl" >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-2xl font-bold text-[#eee]">
                    Installments
                    </h3>
                    <p className="mt-2 text-sm text-[#eee]">
                    Learning is now more accessible than ever. With our flexible EMI options, you can break down the cost of your course into manageable payments. Choose a plan that fits your budget and schedule, and focus on mastering new skills without worrying about the financial burden.
                    </p>
                   
                  </div>
                </div>
                <div className="bg-[#ffffff11] drop-shadow-md overflow-hidden shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl" >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-2xl font-bold text-[#eee]">
                    Full Payment
                    </h3>
                    <p className="mt-2 text-sm text-[#eee]">
                    Invest in your future with a one-time payment that grants you lifetime access to all course materials. No recurring fees or hidden costs—just seamless, uninterrupted learning. Plus, enjoy additional savings with this all-inclusive option, ensuring you get the most value for your education.
                    </p>
                  </div>
                </div>
            </div>
          </div>
          
         <div className="fixed bottom-16 animate-bounce bg-green-800 right-7 z-50 px-3 py-2 rounded-full">
        <a
          href="https://api.whatsapp.com/send?phone=919380736449&text=Hello%20Krutanic%20Team,%0A%0AI%20have%20some%20queries%20regarding%20my%20course.%0A%0AThank%20you!"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa fa-whatsapp rounded-full text-[3rem]"></i>
        </a>
         </div>
        </section>
    </div>
  )
}

export default FlexiblePaymentOption;
