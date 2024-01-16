import {StoreTransactionType} from '@/utils/interfaces/globalTypes';
import moment from 'moment';
import {statusShipping} from '../action';

type Props = {
  typetransaction?: string | null;
  products?: any[] | null;
  buyer?: string;
  date?: string;
  status?: string;
};

// const statusShipping = {
//   pending: {
//     title: 'Waiting',
//     color: 'bg-grey-dark',
//   },
//   success: {
//     title: 'Success',
//     color: 'bg-success',
//   },
// };

const TransactionItem = (props: Props) => {
  // console.log('props.products ', props.products);
  const products = props.products;
  const productsName = products
    ? products?.map((product) => product.product.name)
    : [];
  const seller = products ? products[0].product.store.name : '';
  const thumbnailPath = products ? products[0].product.thumbnailPath : '';

  return (
    <div className="p-3 bg-white rounded-lg grid md:grid-cols-12 max-md:gap-2 md:items-center cursor-pointer hover:shadow-lg duration-300 overflow-hidden">
      <div className="sm:flex gap-3 items-center col-span-4">
        <div className="w-11 h-11 ">
          <img
            alt="Thumbnail"
            src={thumbnailPath ? thumbnailPath : '/images/noimage.png'}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <h3>
          {productsName[0]}
          {productsName.length > 1 && `, +${productsName.length - 1}lainnya`}
        </h3>
      </div>
      <div className="col-span-3">
        <h3>{props.typetransaction == 'buy' ? seller : props.buyer}</h3>
      </div>
      <div
        className={'sm:col-span-2 ' + statusShipping(props.status ?? '').color}
      >
        <h3>{statusShipping(props.status ?? '').title}</h3>
      </div>
      <div className="max-sm:col-span-3 md:col-span-2">
        <h3>{moment(props.date).format('DD MMMM, YYYY')}</h3>
      </div>
      <div className="col-span-1 flex-center">❯</div>
    </div>
  );
};

export default TransactionItem;
