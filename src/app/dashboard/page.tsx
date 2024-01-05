'use client';
import Header from './components/Header';
import OverviewCard from './components/OverviewCard';
import TransactionList from './components/TransactionList';

type Props = {};

const Dashboard = (props: Props) => {
  return (
    <div className="">
      <Header
        title="Dashboard"
        description={<p>Look what you have made today!</p>}
      />
      <div className="grid md:grid-cols-3 gap-10 mb-6">
        <OverviewCard title="Customer" value="15,209" />
        <OverviewCard title="Revenue" value="$931,290" />
        <OverviewCard title="Transaction" value="22,409,399" />
      </div>
      <div>
        <h3 className="mb-4 font-medium">Recent Sell Transactions</h3>
        <TransactionList typeTransaction={'sell'} />
      </div>
    </div>
  );
};

export default Dashboard;
