import React from 'react';
import { PageRoutes } from '../consts/routes';
import { Link } from 'react-router-dom';
import { TiMessages } from 'react-icons/ti';

const pages = [
  // {
  //   label: 'users',
  //   path: PageRoutes.Users,
  //   Icon: <TiUser size={20} />
  // },
  {
    label: 'channels',
    path: PageRoutes.Channels,
    Icon: <TiMessages size={20} />
  }
];

const SidebarComponent = () => (
  <aside
    id='default-sidebar'
    className='w-64 transition-transform -translate-x-full sm:translate-x-0'
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
);

export default SidebarComponent;
