"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getColumnActions = getColumnActions;

var _react = _interopRequireDefault(require("react"));

var _i18n = require("../i18n");

var _data_grid_schema = require("./data_grid_schema");

var _column_sorting_draggable = require("./column_sorting_draggable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getColumnActions(column, columns, schema, schemaDetectors, setVisibleColumns, setIsPopoverOpen, sorting, switchColumnPos) {
  var _column$actions, _column$actions3, _column$actions5, _column$actions7, _column$actions9, _column$actions11, _column$actions12;

  if (column.actions === false) {
    return [];
  }

  var colIdx = columns.findIndex(function (col) {
    return col.id === column.id;
  });
  var sortingIdx = sorting ? sorting.columns.findIndex(function (col) {
    return col.id === column.id;
  }) : -1;

  var sortBy = function sortBy() {
    var _sorting$columns$sort;

    var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'asc';

    if (!sorting) {
      return;
    }

    if (sortingIdx >= 0 && ((_sorting$columns$sort = sorting.columns[sortingIdx]) === null || _sorting$columns$sort === void 0 ? void 0 : _sorting$columns$sort.direction) === direction) {
      // unsort if the same current and new direction are same
      var newColumns = sorting.columns.filter(function (val, idx) {
        return idx !== sortingIdx;
      });
      sorting.onSort(newColumns);
    } else if (sortingIdx >= 0) {
      // replace existing sort
      var _newColumns = Object.values(_objectSpread(_objectSpread({}, sorting.columns), {}, _defineProperty({}, sortingIdx, {
        id: column.id,
        direction: direction
      })));

      sorting.onSort(_newColumns);
    } else {
      // add new sort
      var _newColumns2 = [].concat(_toConsumableArray(sorting.columns), [{
        id: column.id,
        direction: direction
      }]);

      sorting.onSort(_newColumns2);
    }
  };

  var onClickHideColumn = function onClickHideColumn() {
    return setVisibleColumns(columns.filter(function (col) {
      return col.id !== column.id;
    }).map(function (col) {
      return col.id;
    }));
  };

  var onClickSortAsc = function onClickSortAsc() {
    sortBy('asc');
  };

  var onClickSortDesc = function onClickSortDesc() {
    sortBy('desc');
  };

  var onClickMoveLeft = function onClickMoveLeft() {
    var targetCol = columns[colIdx - 1];

    if (targetCol) {
      switchColumnPos(column.id, targetCol.id);
    }
  };

  var onClickMoveRight = function onClickMoveRight() {
    var targetCol = columns[colIdx + 1];

    if (targetCol) {
      switchColumnPos(column.id, targetCol.id);
    }
  };

  var result = [];

  if (((_column$actions = column.actions) === null || _column$actions === void 0 ? void 0 : _column$actions.showHide) !== false) {
    var _column$actions2;

    var option = {
      label: /*#__PURE__*/_react.default.createElement(_i18n.EuiI18n, {
        token: "euiColumnActions.hideColumn",
        default: "Hide column"
      }),
      onClick: onClickHideColumn,
      iconType: 'eyeClosed',
      size: 'xs',
      color: 'text'
    };

    if (_typeof((_column$actions2 = column.actions) === null || _column$actions2 === void 0 ? void 0 : _column$actions2.showHide) === 'object') {
      result.push(_objectSpread(_objectSpread({}, option), column.actions.showHide));
    } else {
      result.push(option);
    }
  }

  var schemaDetails = schema.hasOwnProperty(column.id) && schema[column.id].columnType != null ? (0, _data_grid_schema.getDetailsForSchema)(schemaDetectors, schema[column.id].columnType) : null;

  if (((_column$actions3 = column.actions) === null || _column$actions3 === void 0 ? void 0 : _column$actions3.showSortAsc) !== false && sorting) {
    var _column$actions4;

    var label = schemaDetails ? schemaDetails.sortTextAsc : _column_sorting_draggable.defaultSortAscLabel;
    var _option = {
      label: /*#__PURE__*/_react.default.createElement(_i18n.EuiI18n, {
        token: "euiColumnActions.sort",
        default: "Sort {schemaLabel}",
        values: {
          schemaLabel: label
        }
      }),
      onClick: onClickSortAsc,
      isDisabled: column.isSortable === false,
      className: sortingIdx >= 0 && sorting.columns[sortingIdx].direction === 'asc' ? 'euiDataGridHeader__action--selected' : '',
      iconType: 'sortUp',
      size: 'xs',
      color: 'text'
    };

    if (_typeof((_column$actions4 = column.actions) === null || _column$actions4 === void 0 ? void 0 : _column$actions4.showSortAsc) === 'object') {
      result.push(_objectSpread(_objectSpread({}, _option), column.actions.showSortAsc));
    } else {
      result.push(_option);
    }
  }

  if (((_column$actions5 = column.actions) === null || _column$actions5 === void 0 ? void 0 : _column$actions5.showSortDesc) !== false && sorting) {
    var _column$actions6;

    var _label = schemaDetails ? schemaDetails.sortTextDesc : _column_sorting_draggable.defaultSortDescLabel;

    var _option2 = {
      label: /*#__PURE__*/_react.default.createElement(_i18n.EuiI18n, {
        token: "euiColumnActions.sort",
        default: "Sort {schemaLabel}",
        values: {
          schemaLabel: _label
        }
      }),
      onClick: onClickSortDesc,
      isDisabled: column.isSortable === false,
      className: sortingIdx >= 0 && sorting.columns[sortingIdx].direction === 'desc' ? 'euiDataGridHeader__action--selected' : '',
      iconType: 'sortDown',
      size: 'xs',
      color: 'text'
    };

    if (_typeof((_column$actions6 = column.actions) === null || _column$actions6 === void 0 ? void 0 : _column$actions6.showSortDesc) === 'object') {
      result.push(_objectSpread(_objectSpread({}, _option2), column.actions.showSortDesc));
    } else {
      result.push(_option2);
    }
  }

  if (((_column$actions7 = column.actions) === null || _column$actions7 === void 0 ? void 0 : _column$actions7.showMoveLeft) !== false) {
    var _column$actions8;

    var _option3 = {
      label: /*#__PURE__*/_react.default.createElement(_i18n.EuiI18n, {
        token: "euiColumnActions.moveLeft",
        default: "Move left"
      }),
      iconType: 'sortLeft',
      size: 'xs',
      color: 'text',
      onClick: onClickMoveLeft,
      isDisabled: colIdx === 0
    };

    if (_typeof((_column$actions8 = column.actions) === null || _column$actions8 === void 0 ? void 0 : _column$actions8.showMoveLeft) === 'object') {
      result.push(_objectSpread(_objectSpread({}, _option3), column.actions.showMoveLeft));
    } else {
      result.push(_option3);
    }
  }

  if (((_column$actions9 = column.actions) === null || _column$actions9 === void 0 ? void 0 : _column$actions9.showMoveRight) !== false) {
    var _column$actions10;

    var _option4 = {
      label: /*#__PURE__*/_react.default.createElement(_i18n.EuiI18n, {
        token: "euiColumnActions.moveRight",
        default: "Move right"
      }),
      iconType: 'sortRight',
      size: 'xs',
      color: 'text',
      onClick: onClickMoveRight,
      isDisabled: colIdx === columns.length - 1
    };

    if (_typeof((_column$actions10 = column.actions) === null || _column$actions10 === void 0 ? void 0 : _column$actions10.showMoveRight) === 'object') {
      result.push(_objectSpread(_objectSpread({}, _option4), column.actions.showMoveRight));
    } else {
      result.push(_option4);
    }
  }

  var allActions = ((_column$actions11 = column.actions) === null || _column$actions11 === void 0 ? void 0 : _column$actions11.additional) ? [].concat(result, _toConsumableArray((_column$actions12 = column.actions) === null || _column$actions12 === void 0 ? void 0 : _column$actions12.additional)) : result; //wrap EuiListGroupItem onClick function to close the popover and prevet bubbling up

  return allActions.map(function (action) {
    return _objectSpread(_objectSpread({}, action), {
      onClick: function onClick(ev) {
        ev.stopPropagation();
        setIsPopoverOpen(false);

        if (action && action.onClick) {
          action.onClick(ev);
        }
      }
    });
  });
}