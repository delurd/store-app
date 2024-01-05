'use client';
import Button from '@/components/Button/Button';
import {useRouter} from 'next/navigation';
import React from 'react';

type Props = {};

const AuthenticateRequired = (props: Props) => {
  const router = useRouter();

  return (
    <div className=" flex flex-col items-center gap-5 text-grey-secondary">
      <p>Mulai Gabung dan Berbelanja!</p>
      <Button
        onClick={() => {
          router.push('/signin');
        }}
        className="bg-success text-white max-w-max"
      >
        Sign in
      </Button>
    </div>
  );
};

export default AuthenticateRequired;
