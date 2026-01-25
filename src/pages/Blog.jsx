import React, { useEffect } from 'react';
import './Blog.css';

const Blog = () => {
  useEffect(() => {
    document.title = 'Azaria Kelman - Blog';
  }, []);

  return (
    <div className="blog-container">
      <h1>What should I write about?</h1>
    </div>
  );
};

export default Blog;


