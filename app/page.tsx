import PieCharts from "@/components/pieChart";
import Link from "next/link";

export default function Home() {
  return (
    <div className='min-h-screen p-2 flex flex-col items-center gap-y-4'>
      <h1 className='text-2xl'>Tomtom Farm</h1>
      <div className='max-w-lg w-full p-1 m-1 rounded-lg bg'>
        <div className='flex flex-row justify-between mb-4'>
          <Link href='/manage-farms'>Manage Farms</Link>
          <Link href='/manage-crops'>Manage Crops</Link>
        </div>
        <PieCharts />
      </div>
    </div>
  );
}
