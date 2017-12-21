import React from 'react';
import { Link } from 'react-router';

export default function Footer () {
  return(
        <footer>
          <p>&copy; Stephen Brown</p>
          <div id="footer-links">
            <Link to="/about">About s_(MASHED)</Link>
            <Link to="/online">sMASHERS Online</Link>
          </div>
        </footer>
  )
}
