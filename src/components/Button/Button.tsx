interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = (props: Props) => {
  return (
    <button
      {...props}
      className={
        'py-[10px] px-7 flex-center active:scale-95 duration-200 rounded-lg min-h-11' +
        ' ' +
        props.className
      }
    >
      {props.children}
    </button>
  );
};

export default Button;
