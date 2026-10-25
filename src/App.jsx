import React, { useEffect, useMemo, useState } from "react";
import {
  Search, Bell, Play, ChevronRight, House, LayoutGrid, History,
  UserRound, Clapperboard, Drama, Smile, Video, Orbit, Heart,
  X, Clock3, LoaderCircle
} from "lucide-react";

const SCRIPT_URL = ""; // Paste your deployed Google Apps Script Web App URL here.

const demo = {
  featured: {
    title: "JOHN WICK", subtitle: "CHAPTER 4", genres: ["ACTION", "CRIME", "DRAMA"],
    description: "Baba Yaga is back. John Wick's most dangerous chapter yet.",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91add6b9f?auto=format&fit=crop&w=1800&q=85",
    poster: "https://image.tmdb.org/t/p/w780/vZloFAK7NmvMGKE7VkF5U9OYy2E.jpg",
    watchUrl: ""
  },
  continueWatching: [
    { title: "The Batman", duration: "1h 45m", progress: 46, poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg" },
    { title: "John Wick 4", duration: "2h 49m", progress: 72, poster: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5U9OYy2E.jpg" },
    { title: "Avengers Endgame", duration: "3h 01m", progress: 53, poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" },
    { title: "Dune", duration: "2h 35m", progress: 61, poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg" }
  ],
  trending: [
    { title: "Joker", poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", hd: true },
    { title: "Deadpool 2", poster: "https://image.tmdb.org/t/p/w500/to0spRl1CMDvyUbOnbb4fTk3VAd.jpg", hd: true },
    { title: "Interstellar", poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6Mudh5gH7.jpg", hd: true },
    { title: "The Shawshank Redemption", poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", hd: true }
  ],
  categories: ["Action", "Drama", "Comedy", "Thriller", "Sci-Fi", "Romance"]
};

const categoryIcons = [Clapperboard, Drama, Smile, Video, Orbit, Heart];

function SectionTitle({ children, onSeeAll }) {
  return <div className="section-title"><h2>{children}</h2><button className="see-all" onClick={onSeeAll}>See All <ChevronRight size={18}/></button></div>;
}
function MovieCard({ movie, continueItem, onPlay }) {
  return <article className={`movie-card ${continueItem ? "continue-card" : ""}`}>
    <div className="poster-wrap">
      <img src={movie.poster || demo.continueWatching[0].poster} alt={`${movie.title} poster`} loading="lazy"
        onError={e => { e.currentTarget.style.opacity = "0.15"; e.currentTarget.alt = `${movie.title} artwork unavailable`; }} />
      {continueItem && <button className="poster-play" aria-label={`Play ${movie.title}`} onClick={() => onPlay(movie)}><Play size={23} fill="white"/></button>}
      {continueItem && <div className="progress-track"><span style={{width: `${movie.progress}%`}}/></div>}
      {!continueItem && movie.hd && <span className="hd-tag">HD</span>}
      {!continueItem && <div className="poster-caption">{movie.title}</div>}
    </div>
    {continueItem && <div className="movie-info"><strong>{movie.title}</strong><span>{movie.duration}</span></div>}
  </article>;
}

function normalizeGenres(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map(item => item.trim()).filter(Boolean);
  }
  return demo.featured.genres;
}

export default function App() {
  const [data, setData] = useState(demo);
  const [activeTab, setActiveTab] = useState("Home");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [notice, setNotice] = useState("");
  const [playing, setPlaying] = useState(null);
  const [loading, setLoading] = useState(Boolean(SCRIPT_URL));

  useEffect(() => {
    if (!SCRIPT_URL) return;
    fetch(`${SCRIPT_URL}?action=home`)
      .then(r => { if (!r.ok) throw new Error("Could not load sheet data"); return r.json(); })
      .then(json => { if (json && json.success && json.data) setData({ ...demo, ...json.data }); })
      .catch(() => setNotice("Showing demo content. Check your Apps Script URL and deployment access."))
      .finally(() => setLoading(false));
  }, []);

  const allMovies = useMemo(() => [...(data.continueWatching || []), ...(data.trending || [])], [data]);
  const filtered = allMovies.filter(m => m.title.toLowerCase().includes(searchText.toLowerCase()));

  function goTab(tab) {
    setActiveTab(tab);
    if (tab !== "Home") setNotice(`${tab} tab will be added in the next step.`);
    else setNotice("");
  }
  function playMovie(movie) {
    const url = movie.watchUrl || movie.videoUrl || "";
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    else setPlaying(movie);
  }

  return <div className="app-shell">
    <div className="status-bar"><span>9:41</span><span className="status-icons">▮▮▮　◉　▰</span></div>
    <header className="topbar">
      <a className="brand" href="#home" onClick={e => { e.preventDefault(); goTab("Home"); }}>
        <div className="brand-mark"><span className="hat">⌃</span><span className="mark-m">M</span></div>
        <div><div className="brand-name">Mafia<span>Cine</span></div><div className="brand-tagline">MOVIES <b>•</b> SERIES <b>•</b> ALWAYS</div></div>
      </a>
      <div className="header-actions">
        <button aria-label="Search" onClick={() => setSearchOpen(v => !v)}><Search size={29}/></button>
        <button aria-label="Notifications" onClick={() => setNotice("You're all caught up on notifications.")} className="bell-button"><Bell size={27}/><i/></button>
      </div>
    </header>

    {searchOpen && <div className="search-panel"><Search size={19}/><input autoFocus placeholder="Search movies..." value={searchText} onChange={e => setSearchText(e.target.value)}/><button onClick={() => {setSearchOpen(false);setSearchText("");}} aria-label="Close search"><X size={19}/></button></div>}
    {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss"><X size={16}/></button></div>}
    {loading && <div className="loading"><LoaderCircle className="spin" size={18}/> Loading Google Sheets…</div>}

    <main id="home">
      <section className="hero" style={{"--hero-image": `url("${data.featured?.backdrop || demo.featured.backdrop}")`}}>
        <div className="hero-shade"/>
        <div className="hero-content">
          <div className="genres">{normalizeGenres(data.featured?.genres).map((g,i,arr)=><React.Fragment key={g}><span>{g}</span>{i < arr.length-1 && <b>•</b>}</React.Fragment>)}</div>
          <h1>{data.featured?.title || "JOHN WICK"}</h1>
          <h3>{data.featured?.subtitle || "CHAPTER 4"}</h3>
          <p>{data.featured?.description || demo.featured.description}</p>
          <button className="watch-button" onClick={() => playMovie(data.featured || demo.featured)}><Play size={21} fill="white"/> Watch Now</button>
        </div>
        <div className="hero-dots"><i className="active"/><i/><i/><i/><i/></div>
      </section>

      <section className="content-section">
        <SectionTitle onSeeAll={() => setNotice("Continue Watching: your in-progress titles will appear here.")}>Continue Watching</SectionTitle>
        <div className="horizontal-row continue-row">{(data.continueWatching || []).map((m,i)=><MovieCard key={m.title || i} movie={m} continueItem onPlay={playMovie}/>)}</div>
      </section>

      <section className="content-section trending-section">
        <SectionTitle onSeeAll={() => goTab("Category")}>Trending Now</SectionTitle>
        <div className="horizontal-row trending-row">{(data.trending || []).map((m,i)=><MovieCard key={m.title || i} movie={m}/>)}</div>
      </section>

      <section className="content-section category-section">
        <SectionTitle onSeeAll={() => goTab("Category")}>Explore by Category</SectionTitle>
        <div className="category-row">{(data.categories || demo.categories).map((name,i)=>{const Icon=categoryIcons[i % categoryIcons.length];return <button className="category-tile" key={name} onClick={() => {setNotice(`${name} movies will be available in the Category tab.`);setActiveTab("Category");}}><Icon size={31} fill="currentColor" strokeWidth={2.5}/><span>{name}</span></button>})}</div>
      </section>
    </main>

    <nav className="bottom-nav" aria-label="Main navigation">
      {[["Home",House],["Category",LayoutGrid],["History",History],["Profile",UserRound]].map(([name,Icon])=><button key={name} className={`nav-item ${activeTab===name?"selected":""}`} onClick={() => goTab(name)}><Icon size={27} strokeWidth={activeTab===name?2.8:2.2} fill={name==="Home"&&activeTab===name?"currentColor":"none"}/><span>{name}</span>{activeTab===name&&<i/>}</button>)}
    </nav>
    <div className="safe-area"/>
    {playing && <div className="modal-backdrop" onClick={() => setPlaying(null)}><div className="play-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setPlaying(null)} aria-label="Close"><X/></button><div className="modal-icon"><Play size={32} fill="white"/></div><h2>{playing.title}</h2><p>No authorized video URL is configured for this title yet.</p><small>Add a <code>watchUrl</code> value in your Google Sheet to enable playback.</small><button className="watch-button modal-ok" onClick={() => setPlaying(null)}>Got it</button></div></div>}
  </div>;
}