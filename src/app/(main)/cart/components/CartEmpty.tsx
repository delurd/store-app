import Button from '@/components/Button/Button';
import {useRouter} from 'next/navigation';

type Props = {};

const CartEmpty = (props: Props) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-5 text-grey-secondary">
      <p>Keranjang Masih Kosong</p>
      <Button
        onClick={() => {
          router.push('/');
        }}
        className="bg-success text-white max-w-max"
      >
        Mulai Belanja
      </Button>
    </div>
  );
};

export default CartEmpty;
