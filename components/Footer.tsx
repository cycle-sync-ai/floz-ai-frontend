const Footer = () => {
  return (
    <div className="w-full h-[36px] flex shadow-lg border">
      <input 
        type="text" 
        className="w-10/12 lg:w-10/12 xl:w-11/12 focus:outline-none px-8 " />
      <div className="w-[161px] flex justify-center items-center px-2 sm:px-5 py-2 bg-[#349989] border gap-3 text-white">
        <img src="/dropup.svg" alt="image" />
        <span className="hidden w-[161px] sm:flex text-center text-[16px]" >AI assistant</span>
      </div>
    </div>
  )
}

export default Footer;