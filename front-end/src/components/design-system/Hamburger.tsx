import './Hamburger.scss';
import classNames from 'classnames';
import { HTMLAttributes } from 'react';

interface HamburgerIconProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
}

export default function HamburgerIcon({ isOpen, onClick }: HamburgerIconProps) {
  return (
    <div onClick={onClick} className={classNames('nav-icon cursor-pointer', isOpen && 'open')}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
