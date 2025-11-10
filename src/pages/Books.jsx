import React from 'react';
import Card from '../components/Card';
import booksData from '../data/books.json';
import './Books.css';

const Books = () => {
  return (
    <div className="books-page">
      <h1>My Bookshelf</h1>
      <div className="books-grid">
        {booksData.map((book, index) => (
          <Card
            key={index}
            title={book.title}
            description={book.author}
            image={book.image}
            bookWiki={book.bookWiki}
            authorWiki={book.authorWiki}
          />
        ))}
      </div>
    </div>
  );
};

export default Books;
