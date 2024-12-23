import PieCharts from "@/components/pieChart";

export default function Home() {
  return (
    <div className='min-h-screen p-2 flex flex-col items-center gap-y-4'>
      <div className='max-w-lg w-full p-1 m-1 rounded-lg bg'>
        <PieCharts />
      </div>
    </div>
  );
}
