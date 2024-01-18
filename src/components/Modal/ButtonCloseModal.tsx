import React from 'react';

type Props = {
  onClick?(): void;
};

const ButtonCloseModal = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      className="aspect-square w-10 rounded-md text-grey hover:text-grey-dark"
    >
      ✕
    </button>
  );
};

export default ButtonCloseModal;
