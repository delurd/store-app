'use client';
import Button from '@/components/Button/Button';
import Footer from '@/components/Footer/Footer';
import {
  varianFadeUpListContainer,
  varianFadeUpListItem,
} from '@/utils/helper/variants';
import {motion} from 'framer-motion';
import Link from 'next/link';

type Props = {};

const SignupSuccess = (props: Props) => {
  return (
    <motion.div
      initial={'hidden'}
      animate={'show'}
      variants={varianFadeUpListContainer}
      className="flex flex-col fixed inset-0 bg-white z-30"
    >
      <div className="flex-center flex-1">
        <div className="w-72 text-center flex flex-col items-center">
          <motion.img
            variants={varianFadeUpListItem}
            src="/icons/bag.svg"
            className="mb-10"
          />
          <motion.h1 variants={varianFadeUpListItem} className="text-3xl mb-7">
            Welcome to Store
          </motion.h1>
          <motion.p variants={varianFadeUpListItem} className="mb-14">
            Kamu sudah berhasil terdaftar bersama kami. Let’s grow up now.
          </motion.p>
          <motion.div variants={varianFadeUpListItem}>
            <Link href={'/dashboard'}>
              <Button className="bg-success text-white mb-4">
                My Dashboard
              </Button>
            </Link>
          </motion.div>
          <motion.div variants={varianFadeUpListItem}>
            <Link href={'/'}>
              <Button className="bg-grey-base text-grey-secondary">
                Go to Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default SignupSuccess;
