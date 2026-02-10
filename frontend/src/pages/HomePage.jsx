
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton
} from '@clerk/clerk-react';
import  toast  from 'react-hot-toast';

function HomePage() {
  return (
    <div>
      <button className='btn btn-secondary' onClick={() => toast.success("Logged in successfully!")}>
        Click me
      </button>

      <SignedOut>
        <SignInButton mode='modal'>
             <button>Login</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton/>
      </SignedIn>

      <UserButton/>
    </div>
  )
}

export default HomePage;
