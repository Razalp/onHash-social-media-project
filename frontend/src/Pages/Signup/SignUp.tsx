
import './SignUp.css'
import HashOnImage from '../../assets/HashOn.png';
import sideView from '../../assets/signupside.png';
console.log('hello')
const SignUp = () => {
  return (
    <>
       <div className='header flex items-center relative top-5 left-10'>
        <img src={HashOnImage} className='logo size-24 relative left-4' alt="" />
        <h1 className='text-4xl font-bold relative left-8'>HashOn</h1>
      </div>
      
      <div className=' main-container flex flex-col-reverse lg:flex-row justify-center items-center space-y-8 lg:space-y-0'>
        <div className='login-form flex flex-col justify-between lg:mr-8'>
          <h1 className='text-3xl font-bold relative left-1 mb-4 lg:mb-8'>Sign-up</h1>
          <input type="name" placeholder='name' className='input-style mb-4' />
          <input type="email" placeholder='Email' className='input-style mb-4' />
          <input type="password" placeholder='Password' className='input-style mb-4' />
          <div className='flex space-x-6 relative left-1'>
            <button className='btn-black'>Sign-up</button>
            <button className='btn-white'>Log-in</button>
          </div>
        </div>
        <div>
          <img src={sideView} className='size-96' alt="" />
        </div>
      </div>

    </>
   
  )
}

export default SignUp
