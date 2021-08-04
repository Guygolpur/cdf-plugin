"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDataGridCellPopover = EuiDataGridCellPopover;

var _react = _interopRequireDefault(require("react"));

var _popover = require("../popover");

var _services = require("../../services");

var _flex = require("../flex");

var _button_empty = require("../button/button_empty");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function EuiDataGridCellPopover(_ref) {
  var anchorContent = _ref.anchorContent,
      cellContentProps = _ref.cellContentProps,
      cellContentsRef = _ref.cellContentsRef,
      closePopover = _ref.closePopover,
      column = _ref.column,
      panelRefFn = _ref.panelRefFn,
      PopoverContent = _ref.popoverContent,
      popoverIsOpen = _ref.popoverIsOpen,
      renderCellValue = _ref.renderCellValue,
      rowIndex = _ref.rowIndex;
  var CellElement = renderCellValue;
  return /*#__PURE__*/_react.default.createElement(_popover.EuiPopover, {
    hasArrow: false,
    anchorClassName: "euiDataGridRowCell__expand",
    button: anchorContent,
    isOpen: popoverIsOpen,
    panelRef: panelRefFn,
    panelClassName: "euiDataGridRowCell__popover",
    panelPaddingSize: "s",
    zIndex: 8001,
    display: "block",
    closePopover: closePopover,
    onKeyDown: function onKeyDown(event) {
      if (event.key === _services.keys.F2 || event.key === _services.keys.ESCAPE) {
        event.preventDefault();
        event.stopPropagation();
        closePopover();
      }
    }
  }, popoverIsOpen ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(PopoverContent, {
    cellContentsElement: cellContentsRef
  }, /*#__PURE__*/_react.default.createElement(CellElement, _extends({}, cellContentProps, {
    isDetails: true
  }))), column && column.cellActions && column.cellActions.length ? /*#__PURE__*/_react.default.createElement(_popover.EuiPopoverFooter, null, /*#__PURE__*/_react.default.createElement(_flex.EuiFlexGroup, {
    gutterSize: "s"
  }, column.cellActions.map(function (Action, idx) {
    var CellButtonElement = Action;
    return /*#__PURE__*/_react.default.createElement(_flex.EuiFlexItem, {
      key: idx
    }, /*#__PURE__*/_react.default.createElement(CellButtonElement, {
      rowIndex: rowIndex,
      columnId: column.id,
      Component: function Component(props) {
        return /*#__PURE__*/_react.default.createElement(_button_empty.EuiButtonEmpty, _extends({}, props, {
          size: "s"
        }));
      },
      isExpanded: true,
      closePopover: closePopover
    }));
  }))) : null) : null);
}