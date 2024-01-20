'use client';
import {useQuery} from '@tanstack/react-query';
import BillingList from './components/BillingList';
import Header from './components/Header';
import OverviewCard from './components/OverviewCard';
import TransactionList from './components/TransactionList';
import {useFetch} from '@/hooks/fetch/useFetch';
import {formatToCurency} from '@/utils/helper/formatNumberToCurency';

type Props = {};

const Dashboard = (props: Props) => {
  const {fetchWithToken} = useFetch();

  const {data: totalCustomer} = useQuery({
    queryKey: ['customer'],
    queryFn: async () =>
      fetchWithToken('/api/user/store/customer').then(
        async (res) => await res.json().then((json) => json.data)
      ),
  });

  const {data: totalRevenue} = useQuery({
    queryKey: ['revenue'],
    queryFn: async () =>
      fetchWithToken('/api/user/store/revenue').then(
        async (res) => await res.json().then((json) => json.data)
      ),
  });

  const {data: totalTransaction} = useQuery({
    queryKey: ['transactionTotal'],
    queryFn: async () =>
      fetchWithToken('/api/user/store/transactionTotal').then(
        async (res) => await res.json().then((json) => json.data)
      ),
  });

  return (
    <div className="">
      <Header
        title="Dashboard"
        description={<p>Look what you have made today!</p>}
      />
      <div className="grid md:grid-cols-3 gap-10 mb-6">
        <OverviewCard
          title="Customer"
          value={formatToCurency(totalCustomer ?? '0')}
        />
        <OverviewCard
          title="Revenue"
          value={'Rp' + formatToCurency(totalRevenue ?? '0')}
        />
        <OverviewCard
          title="Transaction"
          value={formatToCurency(totalTransaction ?? '0')}
        />
      </div>
      <div className="grid lg:grid-cols-9 gap-10">
        <div className="lg:col-span-6 max-lg:order-last">
          <h3 className="mb-4 font-medium">Recent Sell Transactions</h3>
          <TransactionList typeTransaction={'sell'} />
        </div>
        <div className="lg:col-span-3">
          <h3 className="mb-4 font-medium">Billing Payment</h3>
          <BillingList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
