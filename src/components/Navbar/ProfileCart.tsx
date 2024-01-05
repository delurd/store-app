'use client';
import {useFetch} from '@/hooks/fetch/useFetch';
import {CartDataType} from '@/utils/interfaces/globalTypes';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {};

const ProfileCart = (props: Props) => {
  const {data}: {data: any} = useSession();
  const {fetchWithToken} = useFetch();
  const fullname = data?.user?.fullname ?? '';
  // console.log('JSON.stringify(data)');

  const {
    data: cartData = [],
    isLoading,
  }: {data: CartDataType[] | undefined; isLoading: boolean} = useQuery({
    queryKey: ['cart'],
    queryFn: async () =>
      fetchWithToken('/api/user/cart').then((res) =>
        res.json().then((json) => json.data)
      ),
  });

  return (
    <div className="flex gap-5 items-center ml-5 border-l px-5">
      <Link
        href={'/dashboard'}
        className="flex items-center hover:bg-base rounded-full"
      >
        <Image
          alt=""
          src="/images/profile.png"
          className="w-10 h-10 object-cover"
        />
        <p className="px-3">Hi, {fullname?.split(' ')[0]}</p>
      </Link>
      <Link href={'/cart'} className="relative hover:bg-base p-2 rounded-full">
        <Image alt="" src="/icons/shopping.svg" />
        {cartData?.length ? (
          <div className="absolute top-0 right-0 translate-x-1/2 flex-center rounded-full aspect-square px-1.5 text-[9px] font-semibold text-white bg-success">
            {cartData?.length}
          </div>
        ) : null}
      </Link>
    </div>
  );
};

export default ProfileCart;
