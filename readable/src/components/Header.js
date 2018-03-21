import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import routes from '../routes';
import { capitalize } from '../util/utils';

export default function Header(props) {
  const {
    categories,
    activeCategoryPath,
  } = props;

  return (
    <header className={`header ${activeCategoryPath}`}>
      <div className="container">

        <Link to={routes.root}>
          <h1>Readable</h1>
        </Link>

        <nav className="header-nav">
          <ul>

            {/* Link para a homepage */}
            <li className="category-item">
              <NavLink activeClassName="active" exact to={routes.root}>
                Home
              </NavLink>
            </li>

            {/* Links para as categorias */}
            {categories.length > 0 && categories.map((category) => (
              <li key={category.name} className="category-item">
                <NavLink
                  className={category.path}
                  activeClassName="active"
                  to={`/${category.path}`}
                  exact
                >
                  {capitalize(category.name)}
                </NavLink>
              </li>
            ))}

          </ul>
        </nav>

      </div>
    </header>
  );
}

Header.propTypes = {
  categories: PropTypes.array.isRequired,
  activePath: PropTypes.string,
};
