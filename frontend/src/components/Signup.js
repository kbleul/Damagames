
import React , {useState} from 'react'

const Signup = () => {

    const [error , seterror] = useState({})
    const [username , setUsername] = useState("")
    const [phone , setPhone] = useState("")
    const [password , setPassword] = useState("")


function checkPhone() {
   const res= /^\d+$/;

  if(res.test(phone) && [...phone].length === 9){
      error.phone && delete error.phone 
      return true
  } else {
    const tempError = error
      seterror({...tempError, phone : "phone" });
      return false
  }       
   
}



    const handleCreate = () => {
        if(!username || [...username].length === 0) {
            const tempError = error
            seterror({...tempError, username : "username" });   
            return
          } else { error.username && delete error.username }

          if(!checkPhone())
          { return }

          if(!password || [...password].length <= 4) {
            const tempError = error
            seterror({...tempError, password : "password" });   
            return
          } else { error.password && delete error.password }
            
    }

  return (
    <article className="flex justify-center items-center text-white gap-10">
        <section className='w-3/5 max-w-[20rem]'>
            <h2 className='font-bold text-3xl mb-8'>Sign up</h2>

            <div className='relative pb-2 mb-4'>
                <div>
                    <input className='w-full p-2 text-center border  rounded-lg text-xl border-gray-500 bg-inherit' type="text" value={username} placeholder='Username' onChange={e => { setUsername(e.target.value)}} />
                 {error.username &&   <p className='bottom-[.2rem] text-black bg-gray-200 text-[.6rem] rounded-xl font-bold max-w-[80%] absolute right-0 px-2'>please fill the space !</p>}
                </div>
            </div>

            

            <div  className='relative pb-2 mb-4'>

                <div>
                    <div className='w-full p-2 text-center border  rounded-lg text-xl border-gray-500 bg-inherit flex' >
                      <p className="w-1/5">+251</p>
                      <input className="w-4/5 bg-inherit pl-5" type="tel" value={phone} placeholder='Phone no' onChange={e => { setPhone(e.target.value)}} />
                    </div>
                    
                    {error.phone && <p className='bottom-[.2rem] text-black bg-gray-200 text-[.6rem] rounded-xl font-bold max-w-[80%] absolute right-0 px-2'>please enter a valid phone !</p>}
                </div>
            </div>

            <div  className='relative pb-2 mb-4'>
                <div>
                    <input className='w-full p-2 text-center border  rounded-lg text-xl border-gray-500 bg-inherit' type="text"  value={password} placeholder='Password' onChange={e => { setPassword(e.target.value)}} />
                    {error.password && <p className='text-black bg-gray-200 text-[.6rem] rounded-xl font-bold max-w-full absolute right-0 px-2'>please enter a strong password !</p>}
                </div>
            </div>

            <button className="w-full mt-4 bg-orange-bg py-3 px-10 font-bold text-white rounded-lg max-w-[20rem]" onClick={handleCreate}>
            Create
           </button>
        </section>
    </article>
  )
}

export default Signup