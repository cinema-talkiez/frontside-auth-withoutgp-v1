import useFectchData from "@/hooks/useFetchData";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "swiper/swiper-bundle.css";

import Loader from "@/components/Loader";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Adventure() {
  const { alldata, loading } = useFectchData("/api/getmovies");
  const [wloading, setWLoading] = useState(true);

  // Filter for published movies
  const publishedData = alldata?.filter((ab) => ab.status === "publish");

  // Genre and category states
  const [selectedGenre, setSelectGenre] = useState('all movies');



  const [updatedData, setUpdatedData] = useState([]);

  useEffect(() => {
    if (!loading) {
      const sortedData = publishedData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setUpdatedData(sortedData);
    }
  }, [alldata, loading]);

  // Navbar and search states
  const [clicked, setClicked] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [searchbar, setSearchbar] = useState(false);

  const [activeLink, setActiveLink] = useState("/");

  // Search functionality
  const [movieshortname, setMovieshortname] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    if (!movieshortname.trim()) {
      setSearchResult([]);
      return;
    }

    const filteredMovies = publishedData.filter((movie) =>
      movie.title.toLowerCase().includes(movieshortname.toLowerCase())
    );

    setSearchResult(filteredMovies);
  }, [movieshortname]);


  const searchRef = useRef(null);

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setMovieshortname("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });



  // Navbar handling

  // Search bar handling

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);







  return (
    <>
    <h1 className="logo4">Adventure</h1>
<section className="genremoviesec">
  <div className="genremovie">
    {loading ? (
      <Loader />
    ) : (
      // Render the mapped movies
      publishedData
        .filter((movie) => movie.genre.includes("adventure")) // Filter adventure/action movies
        .map((movie) => (
          <div key={movie.slug} className="mcard">
            <Link href={`/movies/${movie.slug}`}>
              <div className="cardimg">
                <img src={movie.smposter} alt={movie.title} loading="lazy" />
              </div>
              <div className="contents">
                <h5>{movie.title}</h5>
                <h6>
                  <span>{movie.language}</span>  <span>{movie.type}</span>
                </h6>
              </div>
            </Link>
          </div>
        ))
    )}
  </div>
</section>

    </>
  );
}
