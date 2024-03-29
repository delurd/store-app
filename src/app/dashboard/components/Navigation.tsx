'use client';
import Link from 'next/link';
import React from 'react';
import s from './navigation.module.css';
import {usePathname} from 'next/navigation';
import {signOut} from 'next-auth/react';
import {motion} from 'framer-motion';
import {
  varianFadeUpListContainer,
  varianFadeUpListItem,
} from '@/utils/helper/variants';
import Image from 'next/image';

type Props = {};

const Navigation = (props: Props) => {
  const pathName = usePathname();

  return (
    <>
      <aside
        className={
          'bg-white h-full sticky top-0 left-0 w-full max-h-screen ' +
          s.navigation
        }
      >
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 100}}
          className="flex-center py-8"
        >
          <Link href={'/'} className="w-10 sm:w-20 h-[50px] sm:h-[90px]">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 41 51"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M38.1074 12.5315C38.0628 12.0033 37.6179 11.5986 37.0878 11.6038H29.3383V8.6671C29.3383 3.88028 25.4577 0 20.6712 0C15.8844 0 12.0041 3.88028 12.0041 8.6671V11.6038H4.25474C3.72699 11.6058 3.28646 12.0065 3.23508 12.5315L0.563654 43.2439C0.442171 44.6678 0.923323 46.0778 1.8908 47.1306C2.85789 48.1829 4.22208 48.7815 5.65159 48.7803H35.7009C37.1304 48.7815 38.4946 48.1829 39.4616 47.1306C40.4291 46.0778 40.9107 44.6678 40.7892 43.2439L38.1074 12.5315ZM14.0435 8.6671C14.0435 5.00669 17.0108 2.03932 20.6712 2.03932C24.3317 2.03932 27.299 5.00669 27.299 8.6671V11.6038H14.0435V8.6671ZM37.9545 45.752C37.3777 46.3869 36.5584 46.7466 35.7009 46.741H5.64124C4.78369 46.7414 3.96557 46.3817 3.38564 45.75C2.80611 45.1179 2.51813 44.2715 2.59262 43.4172L5.18239 13.6431H12.0041V20.0056C10.3643 20.5103 9.34029 22.1382 9.5956 23.8349C9.85052 25.5313 11.3083 26.786 13.0238 26.786C14.7393 26.786 16.1967 25.5313 16.452 23.8349C16.7069 22.1382 15.6829 20.5103 14.0435 20.0056V13.6328H27.299V20.0056C25.6592 20.5103 24.6352 22.1382 24.8905 23.8349C25.1454 25.5313 26.6032 26.786 28.3187 26.786C30.0342 26.786 31.4916 25.5313 31.7469 23.8349C32.0018 22.1382 30.9778 20.5103 29.3383 20.0056V13.6328H36.1497L38.7395 43.4068C38.8232 44.2648 38.5376 45.1175 37.9545 45.752ZM12.8709 21.9024C12.9724 21.9159 13.0752 21.9159 13.1768 21.9024C13.9307 21.9836 14.49 22.6408 14.4493 23.398C14.4083 24.1556 13.7822 24.749 13.0238 24.749C12.265 24.749 11.6389 24.1556 11.5983 23.398C11.5576 22.6408 12.1165 21.9836 12.8709 21.9024ZM28.1657 21.9024C28.2673 21.9159 28.3701 21.9159 28.4716 21.9024C29.2256 21.9836 29.7848 22.6408 29.7442 23.398C29.7032 24.1556 29.0771 24.749 28.3187 24.749C27.5599 24.749 26.9338 24.1556 26.8932 23.398C26.8525 22.6408 27.4114 21.9836 28.1657 21.9024Z"
                fill="black"
              />
              <path
                d="M25.1084 38.3477C25.1084 38.9717 24.9584 39.5537 24.6584 40.0937C24.3584 40.6217 23.9024 41.0477 23.2904 41.3717C22.6784 41.6957 21.9284 41.8577 21.0404 41.8577C20.1764 41.8577 19.4024 41.7077 18.7184 41.4077C18.0344 41.0957 17.4884 40.6637 17.0804 40.1117C16.6724 39.5597 16.4384 38.9237 16.3784 38.2037H18.5744C18.6344 38.7557 18.8684 39.2297 19.2764 39.6257C19.6964 40.0217 20.2544 40.2197 20.9504 40.2197C21.5744 40.2197 22.0544 40.0517 22.3904 39.7157C22.7384 39.3797 22.9124 38.9477 22.9124 38.4197C22.9124 37.9637 22.7864 37.5917 22.5344 37.3037C22.2824 37.0037 21.9704 36.7697 21.5984 36.6017C21.2264 36.4337 20.7164 36.2417 20.0684 36.0257C19.2764 35.7737 18.6284 35.5217 18.1244 35.2697C17.6324 35.0177 17.2124 34.6517 16.8644 34.1717C16.5164 33.6917 16.3424 33.0617 16.3424 32.2817C16.3424 31.5977 16.5104 30.9977 16.8464 30.4817C17.1824 29.9657 17.6624 29.5697 18.2864 29.2937C18.9104 29.0057 19.6304 28.8617 20.4464 28.8617C21.7424 28.8617 22.7684 29.1737 23.5244 29.7977C24.2924 30.4217 24.7304 31.2377 24.8384 32.2457H22.6244C22.5404 31.7657 22.3124 31.3577 21.9404 31.0217C21.5804 30.6737 21.0824 30.4997 20.4464 30.4997C19.8704 30.4997 19.4084 30.6497 19.0604 30.9497C18.7124 31.2377 18.5384 31.6577 18.5384 32.2097C18.5384 32.6417 18.6584 33.0017 18.8984 33.2897C19.1384 33.5657 19.4384 33.7877 19.7984 33.9557C20.1704 34.1117 20.6744 34.2977 21.3104 34.5137C22.1144 34.7657 22.7684 35.0237 23.2724 35.2877C23.7884 35.5397 24.2204 35.9117 24.5684 36.4037C24.9284 36.8957 25.1084 37.5437 25.1084 38.3477Z"
                fill="#29A867"
              />
            </svg>
          </Link>
        </motion.div>

        <motion.ul
          variants={varianFadeUpListContainer}
          initial={'hidden'}
          animate={'show'}
        >
          <motion.li variants={varianFadeUpListItem}>
            <Link
              href={'/dashboard'}
              className={pathName.toString() == '/dashboard' ? s.active : ''}
            >
              <img
                alt=""
                className="sm:hidden"
                src="/icons/dashboard/home.svg"
              />
              <span className="max-sm:hidden">Dashboard</span>
            </Link>
          </motion.li>
          <motion.li variants={varianFadeUpListItem}>
            <Link
              href={'/dashboard/products'}
              className={pathName.includes('products') ? s.active : ''}
            >
              <img
                alt=""
                className="sm:hidden"
                src="/icons/dashboard/layout.svg"
              />
              <span className="max-sm:hidden">My Products</span>
            </Link>
          </motion.li>
          <motion.li variants={varianFadeUpListItem}>
            <Link
              href={'/dashboard/transactions'}
              className={pathName.includes('transactions') ? s.active : ''}
            >
              <img
                alt=""
                className="sm:hidden"
                src="/icons/dashboard/card.svg"
              />
              <span className="max-sm:hidden">Transactions</span>
            </Link>
          </motion.li>
          <motion.li variants={varianFadeUpListItem}>
            <Link
              href={'/dashboard/settings'}
              className={pathName.includes('settings') ? s.active : ''}
            >
              <img
                alt=""
                className="sm:hidden"
                src="/icons/dashboard/settings.svg"
              />
              <span className="max-sm:hidden">Store Settings</span>
            </Link>
          </motion.li>
          <motion.li variants={varianFadeUpListItem}>
            <Link
              href={'/dashboard/account'}
              className={pathName.includes('account') ? s.active : ''}
            >
              <img
                alt=""
                className="sm:hidden"
                src="/icons/dashboard/user.svg"
              />
              <span className="max-sm:hidden">My Account</span>
            </Link>
          </motion.li>
        </motion.ul>
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 100}}
          className="px-6 absolute bottom-20"
        >
          <button
            className="text-grey-dark hover:text-alert"
            onClick={() => {
              signOut({callbackUrl: '/'});
            }}
          >
            <img
              alt=""
              className="sm:hidden rotate-180 active:bg-grey-base rounded-full"
              src="/icons/dashboard/logout.svg"
            />
            <span className="max-sm:hidden">Sign Out</span>
          </button>
        </motion.div>
      </aside>
    </>
  );
};

export default Navigation;
