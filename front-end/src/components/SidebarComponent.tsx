import React from 'react';
import { PageRoutes } from '../consts/routes';
import { Link } from 'react-router-dom';
import { BiGroup, BiUser } from 'react-icons/bi';

const pages = [
  {
    label: 'users',
    path: PageRoutes.Users,
    Icon: <BiUser size={20} />
  }
];

const SidebarComponent = () => (
  <div>
    <aside
      id='default-sidebar'
      className='w-64 h-screen transition-transform -translate-x-full sm:translate-x-0'
      aria-label='Sidenav'
    >
      <div className='overflow-y-auto py-5 px-3 h-full border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
        <ul className='space-y-2'>
          {pages.map(page => (
            <Link to={page.path} key={page.path}>
              <li className='flex items-center uppercase p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'>
                {page.Icon}
                <span className='ml-3'>{page.label}</span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </aside>
  </div>
);

export default SidebarComponent;
