import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import routes from '../routes';
import capitalize from '../util/capitalize';

Navbar.propTypes = {
  categories: PropTypes.array.isRequired,
  activeCategoryPath: PropTypes.string,
};

/*  */
export default function Navbar(props) {
  const {
    categories,
    activeCategoryPath,
  } = props;

  return (
    <div className={`navbar ${activeCategoryPath}`}>
      <div className="container">

        <Link to={routes.root}>
          <h1 className="navbar-header">Readable</h1>
        </Link>

        <nav className="navbar-nav">
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
    </div>
  );
}
