'use client';
import Button from '@/components/Button/Button';
import {useRouter} from 'next/navigation';
import React from 'react';

type Props = {};

const BackButton = (props: Props) => {
  const route = useRouter();
  return (
    <Button
      onClick={() => {
        route.back();
      }}
      className="text-grey-dark hover:text-success flex items-center gap-1 hover:gap-2 duration-200"
    >
      <span className="inline-block rotate-180">➜</span> Kembali
    </Button>
  );
};

export default BackButton;
