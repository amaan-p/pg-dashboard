import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Adjust path as needed

function Login() {
  const [username, setUserName] = useState('');
  const [password, setPassWord] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password });
      // Navigation is now handled in the AuthContext
      
      // Clear form fields
      setUserName("");
      setPassWord('');
    } catch (err) {
      setError('Invalid username or password');
      console.log("Login error", err);
    }
  };

  return (
    <div className='min-h-screen bg-[#E75018] flex items-center justify-center'>
      <div className='bg-white w-[500px] p-6 sm:p-10 md:p-10 lg:p-12 rounded-lg shadow-lg flex flex-col items-center justify-center gap-8 mx-4 sm:mx-6 md:mx-8'>
        <div className="flex items-center justify-center w-full px-4">
          <img src="logo.png" className="h-12" alt="Logo" />
        </div>
        
        {error && (
          <div className="text-red-500 text-center w-full">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className='w-full'>
          <div className='flex flex-col gap-5 w-full'>
            <label className='text-black-700 font-bold text-lg'>Username :</label>
            <input
              type='text'
              placeholder='Enter username'
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className='border-2 border-gray-300 p-3 rounded w-full focus:outline-none hover:outline-2 hover:outline-[#E75018]'
              required
            />
          </div>
          <div className='flex flex-col gap-5 w-full mt-5'>
            <label className='text-black-700 font-bold text-lg'>Password :</label>
            <input
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassWord(e.target.value)}
              className='border-2 border-gray-300 p-3 rounded w-full focus:outline-none hover:outline-2 hover:outline-[#E75018]'
              required
            />
          </div>
          <div className='flex justify-center mt-9'>
            <button
              type="submit"
              className='bg-[#E75018] text-white py-2 px-8 rounded'
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;