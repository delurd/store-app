import Image from 'next/image';

type Props = {
  name?: string;
  review?: string;
};

const CustomerReviewItem = (props: Props) => {
  return (
    <div className="flex">
      <div>
        <div className="h-14 aspect-square overflow-hidden rounded-full bg-orange-200">
          <img
            alt="profile-review"
            src="/images/profile.png"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="space-y-1 py-2 mx-4">
        <p className="font-semibold">{props.name}</p>
        <p>{props.review}</p>
      </div>
    </div>
  );
};

export default CustomerReviewItem;
