import React from 'react';

import { map } from 'lodash';

import './style.less';

import SortCaret from '../../helper/components/SortCaret';

const getLinkClass = (sortKey, isActive) => {
  const linkClass = ['react-redux-data-grid-row-magic-header-inline'];

  if (isActive(sortKey)) {
    linkClass.push('react-redux-data-grid-row-magic-header-active');
  }

  return linkClass.join(' ');
}

const CellMagicHeader = ({
  primarySort,
  magicSorts,
  isActive,
  isReverse,
  onSort,
  onSetMagic,
  children
}) =>
  <div className={[
      'react-redux-data-grid-row-magic-header-custom-column',
      'react-redux-data-grid-row-magic-header'
    ].join(' ')}>
    <a
      onClick={() => onSort(primarySort.sortKey, primarySort.sortFn)}
      className={getLinkClass(primarySort.sortKey, isActive)}>
      {primarySort.label}
      &nbsp;
      <SortCaret isActive={isActive(primarySort.sortKey)} isReverse={isReverse} />
    </a>
    <a className={[
        'react-redux-data-grid-row-magic-header-column-selector-sign',
        getLinkClass(primarySort.sortKey, isActive)
      ].join(' ')}>
      {children}
    </a>
    <ul className="react-redux-data-grid-row-magic-header-custom-column-selector">
      <li
        key="react-redux-data-grid-row-magic-header-custom-column-selector-heading"
        className="react-redux-data-grid-row-magic-header-custom-column-selector-info">
        <small>Toggle column data to:</small>
      </li>
      {map(magicSorts, ({ sortKey, sortFn, label }, key) =>
        <li key={key}>
          <a
            onClick={() => onSetMagic(sortKey)}
            className={getLinkClass(sortKey, isActive)}>
            {label}
          </a>
        </li>
      )}
    </ul>
  </div>;

CellMagicHeader.propTypes = {
  primarySort: React.PropTypes.object.isRequired,
  magicSorts: React.PropTypes.array.isRequired,
  isActive: React.PropTypes.func.isRequired,
  isReverse: React.PropTypes.bool,
  onSort: React.PropTypes.func.isRequired,
  onSetMagic: React.PropTypes.func.isRequired,
  children: React.PropTypes.node,
};

export default CellMagicHeader;
