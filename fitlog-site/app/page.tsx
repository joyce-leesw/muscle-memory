import Fitlog from "@/components/Fitlog";
import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Fitlog - Your workout logs</title>
        <meta name="description" content="Track your workout progress" />
      </Head>
      <Fitlog />
    </div>
  );
}