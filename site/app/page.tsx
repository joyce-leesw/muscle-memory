import CalendarView from "@/components/CalendarView";
import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Muscle Memory - Your workout logs</title>
        <meta name="description" content="Track your workout progress" />
      </Head>
      <CalendarView />
    </div>
  );
}