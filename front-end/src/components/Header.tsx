import { Button, MegaMenu, Navbar } from 'flowbite-react';
import { Link } from 'react-router-dom';
import useIsAuthenticated from 'hooks/useIsAuthenticated';
import SignOut from 'components/SignOut';
import { PageRoutes } from 'consts/routes';

function Header() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <MegaMenu className='w-full'>
      <div className='w-100 w-full mx-auto flex max-w-screen-xl flex-wrap items-baseline md-items-center justify-between md:space-x-8'>
        <div className='md:flex items-center gap-12'>
          <Link to='/'>
            <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>ClipChat</span>
          </Link>
        </div>
        {isAuthenticated ? (
          <SignOut />
        ) : (
          <div className='order-2 hidden items-center md:flex gap-2'>
            <Button color='light'>
              <Link to={PageRoutes.SignIn}>Login</Link>
            </Button>

            <Button>
              <Link to={PageRoutes.SignUp}>Sign up</Link>
            </Button>
          </div>
        )}
        <Navbar.Toggle />
      </div>
    </MegaMenu>
  );
}

export default Header;
