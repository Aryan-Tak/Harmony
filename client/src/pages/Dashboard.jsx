import React, { useState, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import ChatComponent from '../components/ChatComponent';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [showChat, setShowChat] = useState(true);

  const db = [
    {
      name: 'Richard Hendricks',
      age: 30,
      bio: 'Software Engineer at Pied Piper.',
      topArtists: ['Artist A', 'Artist B', 'Artist C'],
      musicMatch: '80%',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvhmQuVx235_YgiZBbG7BPiA22a7EjlV4qUg&s',
    },
    {
      name: 'Erlich Bachman',
      age: 35,
      bio: 'Owner of Aviato.',
      topArtists: ['Artist D', 'Artist E', 'Artist F'],
      musicMatch: '75%',
      url: 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2024/02/solo-leveling-jin-woo.jpg',
    },
    {
      name: 'Monica Hall',
      age: 28,
      bio: 'VC at Raviga.',
      topArtists: ['Artist G', 'Artist H', 'Artist I'],
      musicMatch: '85%',
      url: 'https://qph.cf2.quoracdn.net/main-qimg-123da1e3986e24b47ab1ac13cb249c84-lq',
    },
    {
      name: 'Jared Dunn',
      age: 32,
      bio: 'COO at Pied Piper.',
      topArtists: ['Artist J', 'Artist K', 'Artist L'],
      musicMatch: '78%',
      url: 'https://preview.redd.it/say-something-bad-about-shanks-and-ill-rate-your-opinion-v0-74sxm8o68kzb1.jpg?auto=webp&s=73494645deffdbba60a26e34d96e520c605de53f',
    },
    {
      name: 'Dinesh Chugtai',
      age: 29,
      bio: 'well i made the shit so ofcourse i will be first to pop up.',
      topArtists: ['Artist M', 'Artist N', 'Artist O'],
      musicMatch: '82%',
      url: 'https://s1.zerochan.net/Shanks.600.3701953.jpg',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(db.length - 1);
  const [lastDirection, setLastDirection] = useState();
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map(() => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;
  const canSwipe = currentIndex >= 0;

  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div id="dashboard" className="flex flex-col h-screen bg-[#ffc564]">
      <Navbar onChatClick={toggleChat} />
      <div className="flex flex-1 flex-col lg:flex-row">
        {showChat && (
          <div className="w-full lg:w-1/3 hidden lg:block">
            <ChatComponent />
          </div>
        )}
        <div id="swiper-container" className="w-full lg:w-2/3 flex flex-col m-2 p-2 justify-center items-center relative">
          <div id="card-container" className="relative w-full lg:w-auto flex flex-col items-center">
            <link
              href="https://fonts.googleapis.com/css?family=Damion&display=swap"
              rel="stylesheet"
            />
            <link
              href="https://fonts.googleapis.com/css?family=Alatsi&display=swap"
              rel="stylesheet"
            />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
            <div className="cardContainer p-1 w-full lg:w-96 h-[450px] lg:h-[600px] m-4 flex flex-col items-center">
              {db.map((character, index) => (
                <TinderCard
                  ref={childRefs[index]}
                  className="swipe absolute"
                  key={character.name}
                  onSwipe={(dir) => swiped(dir, character.name, index)}
                  onCardLeftScreen={() => outOfFrame(character.name, index)}
                >
                  <div
                    style={{ backgroundImage: 'url(' + character.url + ')' }}
                    className="card relative bg-white bg-cover bg-center rounded-2xl shadow-xl w-80 h-[450px] m-4 p-4 flex flex-col justify-end"
                  >
                    <div className="bg-white bg-opacity-80 p-4 rounded-2xl">
                      <h3 className="font-bold text-lg">{character.name}, {character.age}</h3>
                      <p className="text-sm">{character.bio}</p>
                      <p className="text-sm">Top Artists: {character.topArtists.join(', ')}</p>
                      <p className="text-sm">Music Match: {character.musicMatch}</p>
                    </div>
                  </div>
                </TinderCard>
              ))}
            </div>
            <div className="buttons absolute bottom-0 w-full flex justify-center mb-4">
              <button
                className={`flex-shrink-0 p-2.5 rounded-full border-none text-white text-lg bg-indigo-300 transition duration-200 m-2.5 font-extrabold w-16 h-16 shadow-xl ${!canSwipe && 'bg-gray-300'}`}
                onClick={() => swipe('left')}
              >
                <i className="fa-solid fa-x"></i>
              </button>
              <button
                className={`flex-shrink-0 p-2.5 rounded-full border-none text-white text-lg bg-indigo-300 transition duration-200 m-2.5 font-extrabold w-16 h-16 shadow-xl ${!canGoBack && 'bg-gray-300'}`}
                onClick={() => goBack()}
              >
                <i className="fa-solid fa-rotate-right"></i>
              </button>
              <button
                className={`flex-shrink-0 p-2.5 rounded-full border-none text-white text-lg bg-indigo-300 transition duration-200 m-2.5 font-extrabold w-16 h-16 shadow-xl ${!canSwipe && 'bg-gray-300'}`}
                onClick={() => swipe('right')}
              >
                <i className="fa-regular fa-star"></i>
              </button>
            </div>
            {lastDirection ? (
              <h2 key={lastDirection} className="infoText mt-4">
                You swiped {lastDirection}
              </h2>
            ) : (
              <h2 className="infoText mt-4">
                Swipe a card or press a button to get Restore Card button visible!
              </h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
