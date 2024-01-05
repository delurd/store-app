import React from 'react';

// type Props = {
//   height?: string;
//   width?: string;
// };
interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = (props: Props) => {
  return (
    <div
      {...props}
      className={
        'h-12 w-full bg-grey-base animate-pulse duration-200 rounded-lg ' +
        props.className
      }
    ></div>
  );
};

export default Skeleton;
