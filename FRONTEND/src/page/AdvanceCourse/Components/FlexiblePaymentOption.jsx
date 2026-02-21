
import Flashaidlogo from "../../../assets/Flashaidlogo.jpg";
const FlexiblePaymentOption = () => {
  return (
    <div>
       <section className="py-[60px] px-[10px]">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-center font-extrabold text-[#f15b29] mb-12 text-3xl md:text-4xl">
              Our Flexible Payment Options
            </h1>
            
            {/* Payment Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Left: Total Fee Box */}
              <div className="bg-gradient-to-br from-[#f15b29] to-[#b5401f] rounded-l-[80px] rounded-r-lg p-8 md:p-12 flex flex-col justify-center items-center shadow-2xl">
                <p className="text-white text-lg md:text-xl mb-4 font-medium">Total program fee</p>
                <p className="text-white text-5xl md:text-6xl font-bold">₹89,000</p>
              </div>
              
              {/* Right: Payment Breakdown */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-[#eee] text-lg">Registration</span>
                  <span className="text-[#eee] text-lg font-semibold">₹10,000</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-[#eee] text-lg">Installment 1</span>
                  <span className="text-[#eee] text-lg font-semibold">₹40,000</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-[#eee] text-lg">Installment 2</span>
                  <span className="text-[#eee] text-lg font-semibold">₹39,000</span>
                </div>
              </div>
            </div>
            
            {/* Financial Partner */}
            <div className="flex flex-col justify-center items-center mt-12">
              <p className="mb-2 text-[#f15b29]">| Our Financial Partner</p>
              <img src={Flashaidlogo} alt="Financial Partner" className="h-[80px]"/>
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
