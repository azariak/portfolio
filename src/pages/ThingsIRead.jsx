import React from 'react';
import Card from '../components/Card';
import booksData from '../data/books.json';
import './ThingsIRead.css';

const ThingsIRead = () => {
  return (
    <div className="books-page">
      <h1>Things I Read</h1>
      <div className="card-grid">
        {booksData.map((book, index) => (
          <Card
            key={index}
            title={book.title}
            description={`${book.description} - ${book.author}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ThingsIRead;
