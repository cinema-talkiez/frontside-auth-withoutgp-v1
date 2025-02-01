import Link from "next/link";
import useFetchData from "@/hooks/useFetchData";
import Spinner from "@/components/Spinner";
import Head from "next/head";

import { FaEye, FaHeart, FaStar } from "react-icons/fa";

export default function Anime() {
  // Fetch data with custom hook
  const { alldata, loading } = useFetchData("/api/getmovies");

  // Filter for published anime
  const publishedData = (alldata || []).filter((ab) => ab.status === "publish");

  // Filter and sort data specifically for anime
  const animeData = publishedData
    .filter((ab) => ab.titlecategory === "anime")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort by updatedAt in descending order

  return (
    <>
      <Head>
        <title>ALL Animes</title>
        <meta name="description" content="All the Anime in Telugu" />
      </Head>

      <section className="genrenamesec">
        <div className="logo3">
          <p>Animes will be Added Soon</p>
        </div>
      </section>


    </>
  );
}
