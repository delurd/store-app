'use client';
import {varianFadeUpListItem} from '@/utils/helper/variants';
import {motion} from 'framer-motion';
import React from 'react';
import s from '../cart.module.css';

type Props = {
  data?: any;
};

const ShippingAddress = (props: Props) => {
  return (
    <div className={'space-y-5 ' + s.form}>
      <motion.div
        variants={varianFadeUpListItem}
        className="grid md:grid-cols-2 gap-5"
      >
        <div>
          <label htmlFor="address1">Address 1</label>
          <div
            className="bg-grey-base p-[10px] min-h-12 rounded-lg flex items-center overflow-hidden"
            id="address1"
          >
            {props.data?.address1}
          </div>
        </div>
        <div>
          <label htmlFor="address2">Address 2</label>
          <div
            className="bg-grey-base p-[10px] min-h-12 rounded-lg flex items-center overflow-hidden"
            id="address2"
          >
            {props.data?.address2}
          </div>
        </div>
      </motion.div>
      <motion.div
        variants={varianFadeUpListItem}
        className="grid md:grid-cols-3 gap-5"
      >
        <div>
          <label htmlFor="provice">Provice</label>
          <div
            className="bg-grey-base p-[10px] min-h-12 rounded-lg flex items-center overflow-hidden"
            id="provice"
          >
            {props.data?.provice}
          </div>
        </div>
        <div>
          <label htmlFor="city">City</label>
          <div
            className="bg-grey-base p-[10px] min-h-12 rounded-lg flex items-center overflow-hidden"
            id="city"
          >
            {props.data?.city}
          </div>
        </div>
        <div>
          <label htmlFor="postalCode">Postal Code</label>
          <div
            className="bg-grey-base p-[10px] min-h-12 rounded-lg flex items-center overflow-hidden"
            id="postalCode"
          >
            {props.data?.postalCode}
          </div>
        </div>
      </motion.div>
      <motion.div
        variants={varianFadeUpListItem}
        className="grid md:grid-cols-2 gap-5"
      >
        <div>
          <label htmlFor="country">Country</label>
          <div
            className="bg-grey-base p-[10px] min-h-12 rounded-lg flex items-center overflow-hidden"
            id="country"
          >
            {props.data?.country}
          </div>
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <div
            className="bg-grey-base p-[10px] min-h-12 rounded-lg flex items-center overflow-hidden"
            id="phone"
          >
            {props.data?.phone}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ShippingAddress;
