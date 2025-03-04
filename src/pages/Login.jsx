

function Login() {
  return (
    <div className='min-h-screen bg-[#E75018] flex items-center justify-center'>
      <div className='bg-white w-[500px] p-6 sm:p-10 md:p-10 lg:p-12 rounded-lg shadow-lg flex flex-col items-center justify-center gap-8 mx-4 sm:mx-6 md:mx-8'>
        <div className="flex items-center justify-center w-full px-4">
          <img src="logo.png" className="h-12" alt="Logo" />
        </div>

        <form action="" className='w-full'>
          <div className='flex flex-col gap-5 w-full'>
            <label className='text-black-700 font-bold text-lg'>Username :</label>
            <input
              type='text'
              placeholder='Enter username'
              className='border-2 border-gray-300 p-3 rounded w-full focus:outline-none hover:outline hover:outline-2 hover:outline-[#E75018]'
            />
          </div>
          <div className='flex flex-col gap-5 w-full mt-5'>
            <label className='text-black-700 font-bold text-lg'>Password :</label>
            <input
              type='password'
              placeholder='Enter password'
              className='border-2  p-3 rounded w-full focus:outline-none hover:outline hover:outline-2 hover:outline-[#E75018]'
            />
          </div>
          <div className='flex justify-center mt-9'>
            <button className='bg-[#E75018] text-white py-2 px-8 rounded '>
              Submit
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Login;
