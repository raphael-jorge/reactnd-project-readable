import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { capitalize } from '../util/utils';

export default function Header(props) {
  const {
    categories,
    activePath,
  } = props;
  return (
    <header className="header">
      <div className="container">

        <Link to="/">
          <h1>Readable</h1>
        </Link>

        {categories.length > 0 &&
          <nav className="header-nav">
            <ul>
              {categories.map((category) => (
                <li
                  key={category.name}
                  className={`category-item ${category.path === activePath ? 'active' : ''}`}
                >
                  <Link to={`/${category.path}`}>
                    {capitalize(category.name)}
                  </Link>
                </li>

              ))}
            </ul>
          </nav>
        }

      </div>
    </header>
  );
}

Header.propTypes = {
  categories: PropTypes.array.isRequired,
  activePath: PropTypes.string,
};
