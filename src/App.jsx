import { useState, useEffect } from 'react'
import './App.css'
import Hls from 'hls.js';

const trending_api = "https://dramalama-api.vercel.app/meta/anilist/trending"
const popular_api = "https://dramalama-api.vercel.app/meta/anilist/popular"
const updated_api = "https://dramalama-api.vercel.app/meta/anilist/recent-episodes"
const search_api = "https://dramalama-api.vercel.app/meta/anilist/"

function App() {
    const [trending, setTrending] = useState(null);
    const [popular, setPopular] = useState(null);
    const [updated, setUpdated] = useState(null);

    const [search, setSearch] = useState("");
    const [results, setResults] = useState(null);
    function handleKey(event) {
        if ((event.code === "Enter" || event.code === 13 || event.key === "Enter") && search != "") {
            fetch_results(search);
        }
    }

    function fetch_results(input) {
        fetch(search_api + input)
            .then(res => res.json())
            .then(data => {
                setResults(data)
                document.querySelector(".popup").style.display = "flex"
            })
            .catch(error => console.log("Some error occured", error))
    }

    const [animeInfo, setAnimeInfo] = useState(null);
    function fetch_anime_info(input) {
        document.querySelector(".tempPop").style.display = 'flex';
        let info_api = `https://dramalama-api.vercel.app/meta/anilist/info/${input}`
        fetch(info_api)
            .then(res => res.json())
            .then(data => {
                setAnimeInfo(data)
                document.querySelector(".tempPop").style.display = 'none';
                let test = document.querySelector(".animeInfo");
                test.style.display = "flex";
            })
            .catch(error => console.log("Some error occured", error))

    }

    function popup_exit(input) {
        document.querySelector(input).style.display = "none";
    }

    function handleSearchClicks(input) {
        document.querySelector(".popup").style.display = "none";
        document.querySelector(".tempPop").style.display = 'flex';
        fetch_anime_info(input);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const trendingResponse = await fetch(trending_api);
                const trendingData = await trendingResponse.json();
                setTrending(trendingData);

                const popularResponse = await fetch(popular_api);
                const popularData = await popularResponse.json();
                setPopular(popularData);

                const updatedResponse = await fetch(updated_api);
                const updatedData = await updatedResponse.json();
                setUpdated(updatedData);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const renderList = (list) => {

        if (!list) {
            return <p style={{ color: "white", fontFamily: "Atkinson Hyperlegible", fontSize: "18px" }}>Loading...</p>;
        }

        if (!list.results || list.results.length === 0) {
            return <p>No entries found.</p>;
        }

        return list && list.results.map((item, index) => (
            <div key={index} className='trendingEntries' id={item.id} onClick={() => fetch_anime_info(item.id)}>
                <img className='image' src={item.image} alt={item.title["english"]} />
                <p className='title'>{item.title["english"]}</p>
            </div>
        ));
    };

    // Video Player
    const [videoLink, setVideoLink] = useState(null);
    function handleVideoPlay(input) {
        fetch(`https://dramalama-api.vercel.app/meta/anilist/watch/${input}`)
            .then(res => res.json())
            .then(data => {
                setVideoLink(data)
                document.querySelector(".videoContainer").style.display = "flex";
            })
            .catch(error => console.log("Some error occured", error))
    }
    useEffect(() => {
        if (videoLink && Hls.isSupported()) {
            const video = document.getElementById("video");
            const hls = new Hls();
            hls.loadSource(videoLink.sources[3].url);
            hls.attachMedia(video);
        }
    }, [videoLink]);

    return (
        <div>
            <div className='navbar'>
                <p className='header'>Aniverse</p>
                <input placeholder='Enter anime title'
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => handleKey(event)}
                />
            </div>

            <div className='introTexts'>
                <p>Trending</p>
                <img src='https://anitsuki.vercel.app/_next/static/media/flame.e15d5da4.svg' alt="trending" className='trendingImg'></img>
            </div>
            <div className='trending'>
                {renderList(trending)}
            </div>

            <br />

            <div className='introTexts'>
                <p>Popular</p>
                <img src='https://anitsuki.vercel.app/_next/static/media/star.90a83646.svg' alt="popular" className='trendingImg'></img>
            </div>
            <div className='trending'>
                {renderList(popular)}
            </div>

            <br />

            <div className='introTexts'>
                <p>Recently Updated</p>
                <img src='https://anitsuki.vercel.app/_next/static/media/star.90a83646.svg' alt="updated" className='trendingImg'></img>
            </div>
            <div className='trending'>
                {renderList(updated)}
            </div>


            <div className='animeInfo'>
                {animeInfo && (
                    <div className='movieInfoContainer'>
                        <img className='infoCover' src={animeInfo.cover} onClick={() => popup_exit(".animeInfo")}></img>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "10px", justifyContent: "space-between", margin: "10px auto" }}>
                            <p className='infoTitle'>{animeInfo.title["english"]}</p>
                            <img className='infoImage' src={animeInfo.image}></img>
                        </div>

                        <p className='infoDesc'>{animeInfo.description.split("<br>")[0]}</p>

                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                            <p className='infoEpisodes'>Current: {animeInfo.currentEpisode}</p>
                            <p className='infoEpisodes'>Episodes: {animeInfo.totalEpisodes}</p>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <p style={{ color: "white", fontFamily: "Kanit", fontSize: "30px", marginTop: "-10px" }}>Episodes</p>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <p style={{ color: "white", fontFamily: "Kanit", fontSize: "20px", marginTop: "10px", cursor: "pointer" }} onClick={() => document.querySelector(".episodesContainer").scrollBy({ left: -1000, behavior: "smooth" })}>⬅️</p>
                                <p style={{ color: "white", fontFamily: "Kanit", fontSize: "20px", marginTop: "10px", cursor: "pointer" }} onClick={() => document.querySelector(".episodesContainer").scrollBy({ left: 1000, behavior: "smooth"})}>➡️</p>
                            </div>
                        </div>



                        <div className='episodesContainer'>
                            {animeInfo && animeInfo.episodes.map((item, index) => (
                                <div key={index} className='episodesEntries' style={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", alignItems: "center", padding: "5px" }} onClick={() => handleVideoPlay(item.id)}>
                                    <img className='episodesImage' src={item.image}></img>
                                    <button className='episodesButtons'>{item.number}</button>
                                </div>
                            ))}
                        </div>

                    </div>
                )}
            </div>


            <div className='popup'>
                <div style={{ width: "85%", height: "80%",margin: "10px auto", display: "flex", flexDirection: "column", backgroundColor: "#383838f1", padding: "20px", overflow: "auto", borderRadius: "10px" }} className='popupContainer' onClick={() => (
                    document.querySelector(".popup").style.display = "none"
                )}>
                    {results && results.results.map((item, index) => (
                        <div key={index} className='animeEntries' onClick={() => handleSearchClicks(item.id)}>
                            <p>{item.title["romaji"]}</p>
                            <img src={item.image}></img>
                        </div>
                    ))}
                </div>
            </div>


            <div className='tempPop'>
                <p style={{ color: "white", fontFamily: "Kanit", fontSize: "24px" }}>Loading...</p>
            </div>

            <div className='videoContainer' onClick={(event) => (
                event.target.className === "videoContainer" ? popup_exit(".videoContainer") : null
            )}>
                <video className="video_player" id="video" controls playsInline crossOrigin='true' preload="auto"></video>
            </div>

        </div>
    )
}

export default App;
