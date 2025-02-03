import { useState} from 'react'

const SignupFeatures = ({setShow }) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [comments, setComments] = useState('');

  const clear =  () => {
    
  }

  return (
    <>
      {
          <div className="signupfeaturesfixed fixed z-10000 w-screen h-screen flex flex-col top-0 left-0 items-center justify-center bg-[rgba(0,0,0,0.4)]">
            <div className="w-[640px] h-[456px] flex flex-col bg-transparent">
              <div className="closeButton flex justify-end mb-[15px]">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className='cursor-pointer' onClick={() => setShow(false)}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.4984 12.7004L21.9984 6.15039C22.2984 5.85039 22.2984 5.40039 21.9984 5.10039L20.9984 4.05039C20.6984 3.75039 20.2484 3.75039 19.9484 4.05039L13.3984 10.6004C13.1984 10.8004 12.8984 10.8004 12.6984 10.6004L6.14844 4.00039C5.84844 3.70039 5.39844 3.70039 5.09844 4.00039L4.04844 5.05039C3.74844 5.35039 3.74844 5.80039 4.04844 6.10039L10.5984 12.6504C10.7984 12.8504 10.7984 13.1504 10.5984 13.3504L3.99844 19.9504C3.69844 20.2504 3.69844 20.7004 3.99844 21.0004L5.04844 22.0504C5.34844 22.3504 5.79844 22.3504 6.09844 22.0504L12.6484 15.5004C12.8484 15.3004 13.1484 15.3004 13.3484 15.5004L19.8984 22.0504C20.1984 22.3504 20.6484 22.3504 20.9484 22.0504L21.9984 21.0004C22.2984 20.7004 22.2984 20.2504 21.9984 19.9504L15.4984 13.4004C15.2984 13.2004 15.2984 12.9004 15.4984 12.7004Z" fill="white" />
                </svg>
              </div>
              <div className="main grow rounded-md bg-white flex flex-col justify-between">
                <div className="header-title font-bold h-[56px] flex items-center justify-center text-center rounded-t-md border-b-[1px] text-[20px] border-gray-400">
                  <div>
                    Sign up for our upcoming features!
                  </div>
                </div>
                <div className="flex flex-col justify-items-center mx-[196px] gap-1">
                  <div className="name text-xs font-bold text-gray-500">Name*</div>
                  <input className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="First Last" value={name} onChange={(e)=>setName(e.target.value)}></input>
                  <div className="email text-xs font-bold text-gray-500">Email*</div>
                  <input className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="floz@flozdesign.com"  value={email} onChange={(e)=>setEmail(e.target.value)}></input>
                  <div className="password text-xs font-bold text-gray-500">Role in project</div>
                  <input className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="Architect/PM/Contructor/Client"  value={role} onChange={(e)=>setRole(e.target.value)}></input>
                  <div className="confirm-password text-xs font-bold text-gray-500">Comments</div>
                  <textarea className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="Any thoughts for us better understand your needs?"  value={comments} onChange={(e)=>setComments(e.target.value)}></textarea>
                </div>
                <div className="footer h-[56px] flex items-center justify-center rounded-bmd border-t-[1px] rounded-b-md border-gray-400 bg-gray-100" >
                  <button className="w-[73px] h-[32px] rounded-md text-white text-[13px] bg-[#349989]" onClick={() => setShow(false)}>Submit</button>
                </div>
              </div>
            </div>
          </div>
      }
    </>
  )
}

export default SignupFeatures;