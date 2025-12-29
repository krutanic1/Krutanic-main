import React from 'react'
import logo from '../assets/LOGO3.png'

const EventLogin = () => {
  return (
    <div>
      <div className="container mx-auto">
        <header className="py-4 px-4 bg-white shadow-md">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <img src={logo} alt="logo" className=" h-16"/>
                </div>
                <div className="flex items-center">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
                </div>
            </div>
        </header>
        <main className="flex justify-center items-center">
            <div className="w-1/3">
                <h1 className="text-4xl font-bold mb-4">Login</h1>
                <form action="" className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block">Email</label>
                        <input type="email" id="email" className="w-full border border-gray-400 p-2 rounded-md"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block">OTP</label>
                        <input type="password" id="password" className="w-full border border-gray-400 p-2 rounded-md"/>
                    </div>
                    <div>
                        <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
                    </div>
                </form>
            </div>
        </main>
      </div>
    </div>
  )
}

export default EventLogin
