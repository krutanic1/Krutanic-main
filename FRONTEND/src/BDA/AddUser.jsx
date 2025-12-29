import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API from '../API';
import toast ,{Toaster} from 'react-hot-toast';

const AddUser = () => {
  const [fullname, setFullname] = useState('');
  const [transactionId, setTransactionId] = useState('');
   const [option, setOption] = useState('');
  const bdaName = localStorage.getItem('bdaName');
  const handleFullnameChange = (e) => {
    setFullname(e.target.value);
  };

  const handleTransactionIdChange = (e) => {
    setTransactionId(e.target.value);
  };
 
  const [getTransactionId, setGetTransactionId] = useState([]);
  const getTransactionIdList = async () => {
    
    try {
        const response = await axios.get(`${API}/gettransactionid`);
        setGetTransactionId(response.data.filter((item) => item.counselor === bdaName));
        }
    catch (error) {
        console.error(error);
    }
    };

   useEffect(() => {
    getTransactionIdList();
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
   
    const data = { fullname,transactionId,counselor:bdaName , option};
    try {
      const response = await axios.post(`${API}/addtransactionid`, data);
      toast.success('Details added successfully');
        setFullname('');
        setTransactionId('');
         setOption('');
        getTransactionIdList();
    } catch (error) {
        toast.error('Error adding Details or user already exsists');
    }finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div id="AdminAddCourse">
         <Toaster position="top-center" reverseOrder={false}/>
        <div className='adduser'>
      <h2>Hi <span className='text-red-600 font-bold' >{localStorage.getItem('bdaName')}</span> kindly add Email ID below before sharing the onboarding link !!</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            id="fullname"
            value={fullname}
            placeholder='Enter candidate name'
            onChange={handleFullnameChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            id="transactionId"
            value={transactionId}
            placeholder='Candidate email id'
            onChange={handleTransactionIdChange}
            required
          />
        </div>
        <div>
        <select
          id="option"
          name="option"
          value={option}
          onChange={(e) => setOption(e.target.value)}
          required
        >
          <option value="" disabled>Select Option</option>
          <option value="CGFL">CGFL</option>
          <option value="SGFL">SGFL</option>
          <option value="Ram Charan">Ram Charan</option>
          <option value="Abhilash">Abhilash</option>
        </select>
        </div>
        <div>
          <button disabled={isSubmitting} type="submit">Submit</button>
        </div>
      </form>
        </div>
     
 
        <div className='coursetable'>
        <table>
            <thead>
                <tr>
                    <th>Sl.No</th>
                <th>Full Name</th>
                <th>Email Id</th>
                <th>Counselor Name</th>
                <th>Lead</th>
                </tr>
            </thead>
            <tbody>
                {getTransactionId.map((transactionId , index) => (
                <tr key={transactionId._id}>
                    <td>{index + 1}</td>
                    <td>{transactionId.fullname}</td>
                    <td>{transactionId.transactionId}</td>
                    <td>{transactionId.counselor}</td>
                    <td>{transactionId.lead}</td>
                </tr>
                ))}
            </tbody>
        </table>
        </div>
        
     
    </div>
  );
};

export default AddUser;
