type Props = {
  title?: string;
  value?: string;
};

const OverviewCard = (props: Props) => {
  return (
    <div className="bg-white p-7 space-y-3 rounded-lg overflow-hidden">
      <p className="text-grey-dark">{props.title}</p>
      <h1 className="text-[32px] font-semibold break-words">{props.value}</h1>
    </div>
  );
};

export default OverviewCard;
