import ProfileCart from '@/components/Navbar/ProfileCart';
import React from 'react';

type Props = {
  title?: string;
  description?: React.ReactNode;
};

const Header = (props: Props) => {
  return (
    <header className="flex max-sm:flex-col-reverse justify-between py-6 gap-5 sticky top-0 bg-base z-20">
      <div className="space-y-1">
        <h1>{props.title}</h1>
        <div className="text-grey-dark">{props.description}</div>
      </div>
      <div className="max-sm:flex max-sm:justify-end">
        <ProfileCart />
      </div>
    </header>
  );
};

export default Header;
