import React from 'react';
import { connect } from 'react-redux';

import { selectors } from '../../ducks';

const sortList = (fn) => (list) => fn ? fn(list) : list;

const withSort = (DataGrid) => {
  const WithSort = (props) => <DataGrid { ...props } />;

  const mapStateToProps = (state, { list, stateKey }) => {
    const { sortFn } = selectors.getSort(state, stateKey);
    return {
      list: sortList(sortFn)(list),
    };
  };

  return connect(mapStateToProps)(WithSort);
};

export default withSort;
