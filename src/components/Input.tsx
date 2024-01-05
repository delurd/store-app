import React, {useEffect, useState} from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
}

const Input = (props: Props) => {
  const {isError, ...res} = props;
  // const [error, setError] = useState(false);

  // useEffect(() => {
  //   setError(props.isError ?? false);
  // }, [props.isError]);

  // return (
  //   <input
  //     {...res}
  //     className={
  //       'bg-grey-base p-[10px] w-full outline-none border-2 border-transparent focus:border-success rounded-lg' +
  //       ' ' +
  //       props.className +
  //       ' ' +
  //       (error ? 'border-alert' : '')
  //     }
  //     onKeyUp={() => {
  //       setError(false);
  //     }}
  //   />
  // );

  return (
    <input
      {...res}
      className={
        'bg-grey-base p-[10px] w-full outline-none border-2 border-transparent focus:border-success rounded-lg' +
        ' ' +
        props.className
      }
    />
  );
};

export default Input;
