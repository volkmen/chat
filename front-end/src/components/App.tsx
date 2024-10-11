import Signup from '../pages/signup/Signup';
import Providers from './Providers';

export default function App() {
  return (
    <Providers>
      <div className='container'>
        <Signup />
      </div>
    </Providers>
  );
}
