import React from 'react';
import RCTooltip from 'rc-tooltip';
import classNames from 'classnames';
import { useOnClickOutside } from 'usehooks-ts';

interface DropdownProps {
  overlay: React.ReactNode;
  placement?: string;
  children?: React.ReactElement;
  onClose?: () => void;
  align?: { offset: number[] };
  overlayClassName?: string;
  visible?: boolean;
}
const Dropdown: React.FC<DropdownProps> = ({
  placement = 'bottomRight',
  children,
  overlay,
  onClose,
  overlayClassName,
  ...restProps
}) => {
  const [isCloseForce, setIsCloseForce] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const closeDropdown = React.useCallback(() => {
    setIsCloseForce(true);

    setTimeout(() => {
      setIsCloseForce(false);
    });
    onClose?.();
  }, []);

  useOnClickOutside(ref, closeDropdown);

  return (
    <RCTooltip
      overlay={overlay}
      placement={placement}
      trigger='click'
      overlayClassName={classNames('dropdown-overlay', overlayClassName)}
      showArrow={false}
      {...(isCloseForce ? { visible: false } : {})}
      {...restProps}
    >
      {children || <span />}
    </RCTooltip>
  );
};

export default React.memo(Dropdown);
