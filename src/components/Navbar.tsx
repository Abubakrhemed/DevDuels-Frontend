import navicon from "../assets/hero.png";

export const Navbar = () => {
  return (
    <nav className="flex flex-1 justify-evenly shadow-lg items-center h-[20vh] w-full">
      <div className="flex justify-evenly items-center w-[30%]">
        <img className="h-auto w-[30%]" src={navicon} />
        <h1 className="text-2xl font-bold">DevDuels</h1>
      </div>
      <div className="w-[50%]">
        <ul className="flex space-x-5">
          <a className="nav-links" href="/home">
            Home
          </a>
          <a className="nav-links" href="/play">
            Play
          </a>
          <a className="nav-links" href="/leaderboard">
            Leaderboards
          </a>
          <a className="nav-links" href="/profile">
            Profile
          </a>
        </ul>
      </div>
    </nav>
  );
};
