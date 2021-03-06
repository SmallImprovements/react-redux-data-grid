import { uniq } from '../../helper/util/uniq';

import { applyResetByStateKeys, RESET_BY_STATE_KEYS } from '../reset';

const SLICE_NAME = 'tableSelect';

const SELECT_ITEM = `${SLICE_NAME}/SELECT_ITEM`;
const SELECT_ITEMS = `${SLICE_NAME}/SELECT_ITEMS`;
const SELECT_ITEMS_RANGE = `${SLICE_NAME}/SELECT_ITEM_RANGE`;
const SELECT_ITEMS_EXCLUSIVELY = `${SLICE_NAME}/SELECT_ITEMS_EXCLUSIVELY`;
const SELECT_ITEMS_RESET = `${SLICE_NAME}/SELECT_ITEMS_RESET`;

const INITIAL_STATE = {};

function doSelectItem(stateKey, id) {
  return {
    type: SELECT_ITEM,
    payload: {
      stateKey,
      id,
    }
  };
}

function doSelectItems(stateKey, ids, isSelect) {
  return {
    type: SELECT_ITEMS,
    payload: {
      stateKey,
      ids,
      isSelect,
    }
  };
}

function doSelectItemsRange(stateKey, id, preselected, unselectables, allIds) {
  return {
    type: SELECT_ITEMS_RANGE,
    payload: {
      stateKey,
      id,
      preselected,
      unselectables,
      allIds,
    }
  };
}

function doSelectItemsExclusively(stateKey, ids, isSelect) {
  return {
    type: SELECT_ITEMS_EXCLUSIVELY,
    payload: {
      stateKey,
      ids,
      isSelect,
    }
  };
}

function doSelectItemsReset(stateKey) {
  return {
    type: SELECT_ITEMS_RESET,
    payload: {
      stateKey,
    }
  };
}

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SELECT_ITEM:
      return applySelectItem(state, action);
    case SELECT_ITEMS:
      return applySelectItems(state, action);
    case SELECT_ITEMS_RANGE:
      return applySelectItemsRange(state, action);
    case SELECT_ITEMS_EXCLUSIVELY:
      return applySelectItemsExclusively(state, action);
    case SELECT_ITEMS_RESET:
      return applyResetSelectedItems(state, action);
    case RESET_BY_STATE_KEYS:
      return applyResetByStateKeys(state, action);
  }
  return state;
};

function applySelectItem(state, action) {
  const { stateKey, id } = action.payload;
  const currentSelection = state[stateKey] && state[stateKey].selectedItems ?
    state[stateKey].selectedItems :
    [];
  const index = currentSelection.indexOf(id);
  const isSelect = index === -1;
  const selectedItems = isSelect ? addItem(currentSelection, id) : removeItem(currentSelection, index);
  const lastSelectedItem = isSelect ? id : null;
  const lastUnselectedItem = isSelect ? null : id;
  return { ...state, [stateKey]: { selectedItems, lastSelectedItem, lastUnselectedItem } };
}

function applySelectItems(state, action) {
  return toggleItems(state, action, false);
}

function applySelectItemsRange(state, action) {
  const { stateKey, id, preselected, unselectables, allIds } = action.payload;
  const currentSelection = state[stateKey] && state[stateKey].selectedItems
    ? state[stateKey].selectedItems
    : [];
  const isSelect = currentSelection.indexOf(id) === -1;
  if (allIds && allIds.length) {
    let newState = {};
    if (isSelect) {
      const lastSelectedItem = state[stateKey].lastSelectedItem || id;
      const selectedRange = getSelectedRange(id, lastSelectedItem, preselected, unselectables, allIds);
      const selectedItems = uniq([...currentSelection, ...selectedRange]);
      newState = { selectedItems, lastSelectedItem };
    } else {
      const lastUnselectedItem = state[stateKey].lastUnselectedItem || id;
      const unselectedRange = getSelectedRange(id, lastUnselectedItem, preselected, unselectables, allIds);
      const selectedItems = removeItems(currentSelection, unselectedRange);
      newState = { selectedItems, lastUnselectedItem };
    }
    return { ...state, [stateKey]: newState };
  }
  // Fallback to selecting a single item if allIds is not provided.
  return applySelectItem(state, action);
}

function getSelectedRange(id, lastSelectedItem, preselected = [], unselectables = [], allIds) {
  const lastSelectedItemIndex = allIds.indexOf(lastSelectedItem);
  const currentSelectedItemIndex = allIds.indexOf(id);
  const firstIndex = Math.min(lastSelectedItemIndex, currentSelectedItemIndex);
  const lastIndex = Math.max(lastSelectedItemIndex, currentSelectedItemIndex);
  return allIds
    .slice(firstIndex, lastIndex + 1)
    .filter(id => {
      const isSelectable = preselected.indexOf(id) === -1 && unselectables.indexOf(id) === -1;
      return isSelectable;
    });
}

function applySelectItemsExclusively(state, action) {
  return toggleItems(state, action, true);
}

function toggleItems(state, action, selectExclusively) {
  let { stateKey, isSelect, ids } = action.payload;
  let list = state[stateKey] && state[stateKey].selectedItems ?
    state[stateKey].selectedItems :
    [];
  let selectedItems;

  if (isSelect) {
    selectedItems = uniq(selectExclusively ? ids : [...list, ...ids]);
  } else {
    selectedItems = removeItems(list, ids);
  }

  return { ...state, [stateKey]: { selectedItems, lastSelectedItem: null } };
}

function applyResetSelectedItems(state, action) {
  const { stateKey } = action.payload;
  return { ...state, [stateKey]: { selectedItems: [], lastSelectedItem: null } };
}

function removeItems(list, ids) {
  return ids.reduce((result, value) => {
    let index = result.indexOf(value);
    result = (index !== -1) ? removeItem(result, index) : result;
    return result;
  }, list);
}

function removeItem(list, index) {
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ];
}

function addItem(list, id) {
  return [...list, id];
}

function getSelection(state, stateKey) {
  return state[SLICE_NAME][stateKey] && state[SLICE_NAME][stateKey].selectedItems ?
    state[SLICE_NAME][stateKey].selectedItems :
    [];
}

function getLastSelectedItem(state, stateKey) {
  return state[SLICE_NAME][stateKey].lastSelectedItem;
}

function getIsSelected(state, stateKey, id) {
  return getSelection(state, stateKey).indexOf(id) !== -1;
}

const selectors = {
  getSelection,
  getLastSelectedItem,
  getIsSelected
};

const actionCreators = {
  doSelectItem,
  doSelectItems,
  doSelectItemsRange,
  doSelectItemsExclusively,
  doSelectItemsReset
};

const reducers = { [SLICE_NAME]: reducer };

const actionTypes = {
  SELECT_ITEM,
  SELECT_ITEMS,
  SELECT_ITEMS_EXCLUSIVELY,
  SELECT_ITEMS_RESET
};

export {
  reducers,
  selectors,
  actionCreators,
  actionTypes
};
