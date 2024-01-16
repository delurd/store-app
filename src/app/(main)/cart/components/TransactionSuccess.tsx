import Button from '@/components/Button/Button';
import {varianFadeUpListItem} from '@/utils/helper/variants';
import {motion} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type Props = {};

const TransactionSuccess = (props: Props) => {
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 100}}
      transition={{duration: 0.3}}
      className="fixed inset-0 bg-white z-30 flex-center"
    >
      <div className="md:w-1/3 container-base text-center flex flex-col items-center">
        <motion.div
          initial={{y: 50, opacity: 0}}
          animate={{y: 0, opacity: 100}}
          transition={{velocity: -1000}}
        >
          <img alt='Bag-icon' src="/icons/bag.svg" className="mb-10" />
        </motion.div>
        <motion.h1
          initial={{y: 50, opacity: 0}}
          animate={{y: 0, opacity: 100}}
          transition={{delay: 0.1, velocity: 100}}
          className="text-3xl mb-7"
        >
          Transaction Processed!
        </motion.h1>
        <motion.p
          initial={{y: 50, opacity: 0}}
          animate={{y: 0, opacity: 100}}
          transition={{delay: 0.2, velocity: 100}}
          className="mb-14"
        >
          Silahkan tunggu konfirmasi email dari kami dan kami akan
          menginformasikan resi secepat mungkin!
        </motion.p>
        <motion.div
          initial={{y: 50, opacity: 0}}
          animate={{y: 0, opacity: 100}}
          transition={{delay: 0.3, velocity: 100}}
        >
          <Link href={'/dashboard'}>
            <Button className="bg-success text-white mb-4">My Dashboard</Button>
          </Link>
        </motion.div>
        <motion.div
          initial={{y: 50, opacity: 0}}
          animate={{y: 0, opacity: 100}}
          transition={{delay: 0.4, velocity: 100}}
        >
          <Link href={'/'}>
            <Button className="bg-grey-base text-grey-secondary">
              Go to Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TransactionSuccess;
