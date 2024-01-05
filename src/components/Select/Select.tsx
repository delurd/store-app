'use client';
import {Listbox, ListboxProps} from '@headlessui/react';
import {useState} from 'react';

type dataPropsType = {
  name?: string;
  value?: string;
};

type Props = {
  data?: any[] | undefined;
  contentWidth?: string;
  selectWidth?: string;
  getValue?(value: any): void;
  //   value?: any;
  //   onChange?(value: any): void;
  defaultValue?: any;
  name?: string;
};

const Select = (props: Props) => {
  //   const [selectedItem, setSelectedItem] = useState(
  //     props.data ? props.data[0] : {}
  //   );

  return (
    <div
      className={
        'relative max-md:w-full ' + (props.selectWidth ? props.selectWidth : '')
      }
    >
      <Listbox
        // value={props.value}
        // onChange={props.onChange}
        name={'category'}
        defaultValue={props.defaultValue}
        by={'name'}
      >
        {({open}) => (
          <>
            <Listbox.Button
              className={`w-full flex items-center justify-between px-[6px] min-h-12 rounded-lg bg-grey-base border-2 gap-5 ${
                open ? 'border-success' : 'border-transparent'
              }`}
            >
              {({value}) => (
                <>
                  {value?.name ?? 'Select'}
                  <span
                    className={`inline-block duration-300 mr-3 ${
                      open ? 'rotate-90' : '-rotate-90'
                    }`}
                  >
                    ❮
                  </span>
                </>
              )}
            </Listbox.Button>
            <Listbox.Options
              className={
                'absolute mt-1 bg-white shadow-xl overflow-y-auto rounded-lg max-h-64 z-10 ' +
                (props.contentWidth ? props.contentWidth : 'w-full')
              }
            >
              {props.data?.map((item: any, idx) => (
                <Listbox.Option
                  className={({active}) =>
                    'p-2 cursor-default hover:bg-grey-base border-b last:border-b-0 border-grey-base ' +
                    (active ? 'bg-grey-base' : '')
                  }
                  key={item?.value ?? idx}
                  value={item}
                  onClick={() => {
                    props.getValue && props.getValue(item);
                  }}
                >
                  {({selected}) => (
                    <div className="flex justify-between items-center gap-5">
                      {item?.name}{' '}
                      {selected ? (
                        <span className="mr-2 text-xs">✔</span>
                      ) : null}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </>
        )}
      </Listbox>
    </div>
  );
};

export default Select;
