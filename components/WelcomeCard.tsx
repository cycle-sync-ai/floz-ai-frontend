const WelcomeCard = () => {
  return (
    <div className="my-10 border rounded py-16 px-10 bg-teal-100 flex justify-center w-11/12 flex-col lg:flex-row">
      <div className="flex flex-col justify-center w-full mb-5 lg:w-3/6,mb-0">
        <h3 className="text-xl font-semibold">Welcome, Joseph Ongaco</h3>
        <p className="text-base">Check out these suggestions to start your day!</p>
      </div>
      <div className="flex flex-col sm:flex-row lg:flex-wrap gap-9 w-full lg:w-3/6">
        <div className="bg-white w-full sm:w-3/12 lg:w-2/5 p-5 border flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="font-semibold">Upload the audio</h3>
            <p>10:00 AM phone call with GC</p>
          </div>
          <div>
            <img src="close.svg" alt="image"></img>
          </div>
        </div>
        <div className="bg-white w-full sm:w-3/12 lg:w-2/5 p-5 border flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="font-semibold">Upload the recording</h3>
            <p>4:00 PM meeting with the client</p>
          </div>
          <div>
            <img src="close.svg" alt="image"></img>
          </div>
        </div>
        <div className="bg-white w-full sm:w-3/12 lg:w-2/5 p-5 border flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="font-semibold">Upload the audio</h3>
            <p>1:00 PM phone call with HVAC</p>
          </div>
          <div>
            <img src="close.svg" alt="image"></img>
          </div>
        </div>
        <div className="bg-white w-full sm:w-3/12 lg:w-2/5 p-5 border flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="font-semibold">Email GC</h3>
            <p>Reconfirm the second quotes</p>
          </div>
          <div>
            <img src="close.svg" alt="image"></img>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeCard;