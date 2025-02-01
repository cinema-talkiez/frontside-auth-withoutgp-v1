import Head from "next/head";
import Link from "next/link";
import useFectchData from "@/hooks/useFetchData";
import Spinner from "@/components/Spinner";

import { FaEye, FaHeart, FaStar } from "react-icons/fa";


export default function all() {

  // fetch data with usehook
  const { alldata, loading } = useFectchData("/api/getmovies");

  // filter for published movies required
  const publishedData = alldata.filter((ab) => ab.status === "publish");

  return (
    <>
      <Head>
        <title>All Animes & Series</title>
      </Head>

      <section className="genrenamesec">
        <div className="logo3">
          <h1></h1>
          <p>
            All Animes, Series & Movies
          </p>
        </div>
      </section>

      <section className="genremoviesec">
        <div className="genremovie">
          {loading ? (<Spinner />) : (<>
            {publishedData.map((movie) => {
              return (<div className="mcard">
                <Link href={`/movies/${movie.slug}`}>
                  <div className="cardimg">
                    <img
                      src={movie.smposter}
                      alt="movie"
                      loading="lazy"
                    />
                  </div>
                  <div className="contents">
                    <h5>{movie.title}</h5>
                    <h6>
                      <span>{movie.language}</span>  <span>{movie.type}</span>
                    </h6>
                  </div>
                </Link>
              </div>
              );
            })}
          </>
          )}
        </div>
      </section>

    </>
  )
}

