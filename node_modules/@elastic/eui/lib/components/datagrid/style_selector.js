"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDataGridStyleSelector = exports.startingStyles = void 0;

var _react = _interopRequireWildcard(require("react"));

var _i18n = require("../i18n");

var _popover = require("../popover");

var _button = require("../button");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var startingStyles = {
  cellPadding: 'm',
  fontSize: 'm',
  border: 'all',
  stripes: false,
  rowHover: 'highlight',
  header: 'shade',
  footer: 'overline',
  stickyFooter: true
};
exports.startingStyles = startingStyles;
var densityStyles = {
  expanded: {
    fontSize: 'l',
    cellPadding: 'l'
  },
  normal: {
    fontSize: 'm',
    cellPadding: 'm'
  },
  compact: {
    fontSize: 's',
    cellPadding: 's'
  }
};

var useDataGridStyleSelector = function useDataGridStyleSelector(initialStyles) {
  // track styles specified by the user at run time
  var _useState = (0, _react.useState)({}),
      _useState2 = _slicedToArray(_useState, 2),
      userGridStyles = _useState2[0],
      setUserGridStyles = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isOpen = _useState4[0],
      setIsOpen = _useState4[1]; // These are the available options. They power the gridDensity hook and also the options in the render


  var densityOptions = ['expanded', 'normal', 'compact']; // Normal is the default density

  var _useState5 = (0, _react.useState)(densityOptions[1]),
      _useState6 = _slicedToArray(_useState5, 2),
      gridDensity = _useState6[0],
      _setGridDensity = _useState6[1];

  var setGridDensity = function setGridDensity(density) {
    _setGridDensity(density);

    setUserGridStyles(densityStyles[density]);
  }; // merge the developer-specified styles with any user overrides


  var gridStyles = _objectSpread(_objectSpread({}, initialStyles), userGridStyles);

  var styleSelector = /*#__PURE__*/_react.default.createElement(_popover.EuiPopover, {
    "data-test-subj": "dataGridStyleSelectorPopover",
    isOpen: isOpen,
    closePopover: function closePopover() {
      return setIsOpen(false);
    },
    anchorPosition: "downCenter",
    panelPaddingSize: "s",
    panelClassName: "euiDataGridColumnSelectorPopover",
    button: /*#__PURE__*/_react.default.createElement(_button.EuiButtonEmpty, {
      size: "xs",
      iconType: "tableDensityExpanded",
      className: "euiDataGrid__controlBtn",
      color: "text",
      "data-test-subj": "dataGridStyleSelectorButton",
      onClick: function onClick() {
        return setIsOpen(!isOpen);
      }
    }, /*#__PURE__*/_react.default.createElement(_i18n.EuiI18n, {
      token: "euiStyleSelector.buttonText",
      default: "Density"
    }))
  }, /*#__PURE__*/_react.default.createElement(_i18n.EuiI18n, {
    tokens: ['euiStyleSelector.buttonLegend', 'euiStyleSelector.labelExpanded', 'euiStyleSelector.labelNormal', 'euiStyleSelector.labelCompact'],
    defaults: ['Select the display density for the data grid', 'Expanded density', 'Normal density', 'Compact density']
  }, function (_ref) {
    var _ref2 = _slicedToArray(_ref, 4),
        buttonLegend = _ref2[0],
        labelExpanded = _ref2[1],
        labelNormal = _ref2[2],
        labelCompact = _ref2[3];

    return /*#__PURE__*/_react.default.createElement(_button.EuiButtonGroup, {
      legend: buttonLegend,
      name: "density",
      className: "eui-displayInlineBlock",
      buttonSize: "compressed",
      options: [{
        id: densityOptions[0],
        label: labelExpanded,
        iconType: 'tableDensityExpanded'
      }, {
        id: densityOptions[1],
        label: labelNormal,
        iconType: 'tableDensityNormal'
      }, {
        id: densityOptions[2],
        label: labelCompact,
        iconType: 'tableDensityCompact'
      }],
      onChange: setGridDensity,
      idSelected: gridDensity,
      isIconOnly: true
    });
  }));

  return [styleSelector, gridStyles];
};

exports.useDataGridStyleSelector = useDataGridStyleSelector;