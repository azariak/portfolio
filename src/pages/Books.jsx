import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Popup from '../components/Popup';
import booksData from '../data/books.json';
import './Books.css';

const Books = () => {
  const [popupUrl, setPopupUrl] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Books that should open in new tabs instead of popups
  const booksWithoutPopup = ['The Mind-Body Problem'];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const openPopup = (url) => {
    setPopupUrl(url);
  };

  const closePopup = () => {
    setPopupUrl(null);
  };

  return (
    <div className="books-page">
      <h1>My Bookshelf</h1>
      <h3>A small collection of books I've read recently and enjoyed:</h3>
      <div className="books-grid">
        {booksData.map((book, index) => (
          <Card
            key={index}
            title={book.title}
            description={book.author}
            image={book.image}
            bookWiki={book.bookWiki}
            authorWiki={book.authorWiki}
            onLearnMoreClick={booksWithoutPopup.includes(book.title) ? undefined : openPopup}
            isMobile={isMobile}
          />
        ))}
      </div>
      {popupUrl && <Popup url={popupUrl} onClose={closePopup} />}
    </div>
  );
};

export default Books;
