'use client';
import {useFetch} from '@/hooks/fetch/useFetch';
import {rajaongkirKey} from '@/utils/variables';
import {Listbox} from '@headlessui/react';
import {useQuery} from '@tanstack/react-query';
import {motion} from 'framer-motion';
import {request} from 'https';
import {redirect} from 'next/navigation';
import React, {useEffect, useState} from 'react';

type Props = {};
const people = [
  {id: 1, name: 'Durward Reynolds'},
  {id: 2, name: 'Kenton Towne'},
  {id: 3, name: 'Therese Wunsch'},
  {id: 4, name: 'Benedict Kessler'},
  {id: 5, name: 'Katelyn Rohan'},
];

const container = {
  hidden: {opacity: 0},
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.5,
    },
  },
};

const item = {
  hidden: {opacity: 0},
  show: {
    opacity: 1,
  },
};

const variants = {
  open: {color: 'red', scale: 1.2, transition: {duration: 0.5}},
  closed: {
    color: 'transparent',
    scale: 1,
    transition: {duration: 0.5},
  },
};

const Reward = (props: Props) => {
  const [selectedPerson, setSelectedPerson] = useState(people[0]);
  const [selectedItem, setSelectedItem] = useState(1);

  const {fetchData} = useFetch();

  const fetching = async () => {
    return fetchData('/api/ongkir/province')
      .then(async (res) => {
        console.log(await res.json().then((json) => json.data));
        console.log('berhasil');

        return res;
      })
      .catch((res) => {
        console.log('eror');

        return res;
      });
  };

  useEffect(() => {
    // fetching();
  }, []);

  return <div className="flex-1 flex-center">Under Development</div>;
  return (
    <div className="flex-1">
      Reward
      <Listbox
        value={selectedPerson}
        onChange={setSelectedPerson}
        name="assignee"
      >
        <Listbox.Button>{selectedPerson.name}</Listbox.Button>
        <Listbox.Options>
          {people.map((person) => (
            <Listbox.Option key={person.id} value={person}>
              {person.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-max m-5 space-y-2"
      >
        <motion.li className="bg-orange-200 p-2" variants={item}>
          aku
        </motion.li>
        <motion.li className="bg-orange-200 p-2" variants={item}>
          suka
        </motion.li>
      </motion.ul>
      <div className="my-10 max-w-max">
        <motion.div
          animate={selectedItem == 1 ? 'open' : 'close'}
          variants={variants}
          className="p-2"
          onClick={() => {
            setSelectedItem(1);
          }}
        >
          option 1
        </motion.div>
        <motion.div
          animate={selectedItem == 2 ? 'open' : 'close'}
          variants={variants}
          className="p-2"
          onClick={() => {
            setSelectedItem(2);
          }}
        >
          option 2
        </motion.div>
      </div>
    </div>
  );
};

export default Reward;
