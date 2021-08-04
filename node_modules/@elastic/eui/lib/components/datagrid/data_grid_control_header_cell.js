"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDataGridControlHeaderCell = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _services = require("../../services");

var _tabbable = _interopRequireDefault(require("tabbable"));

var _data_grid_context = require("./data_grid_context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var EuiDataGridControlHeaderCell = function EuiDataGridControlHeaderCell(props) {
  var controlColumn = props.controlColumn,
      index = props.index,
      headerIsInteractive = props.headerIsInteractive,
      className = props.className;

  var _useContext = (0, _react.useContext)(_data_grid_context.DataGridFocusContext),
      setFocusedCell = _useContext.setFocusedCell,
      onFocusUpdate = _useContext.onFocusUpdate;

  var HeaderCellRender = controlColumn.headerCellRender,
      width = controlColumn.width,
      id = controlColumn.id;
  var classes = (0, _classnames.default)('euiDataGridHeaderCell', className);

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      isFocused = _useState2[0],
      setIsFocused = _useState2[1];

  (0, _react.useEffect)(function () {
    onFocusUpdate([index, -1], function (isFocused) {
      setIsFocused(isFocused);
    });
  }, [index, onFocusUpdate]);
  var headerRef = (0, _react.useRef)(null);

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isCellEntered = _useState4[0],
      setIsCellEntered = _useState4[1];

  (0, _react.useEffect)(function () {
    if (headerRef.current) {
      var enableInteractives = function enableInteractives() {
        var interactiveElements = headerRef.current.querySelectorAll('[data-euigrid-tab-managed]');

        for (var i = 0; i < interactiveElements.length; i++) {
          interactiveElements[i].setAttribute('tabIndex', '0');
        }
      };

      var disableInteractives = function disableInteractives() {
        var tababbles = (0, _tabbable.default)(headerRef.current);

        if (tababbles.length > 1) {
          console.warn("EuiDataGridHeaderCell expects at most 1 tabbable element, ".concat(tababbles.length, " found instead"));
        }

        for (var i = 0; i < tababbles.length; i++) {
          var element = tababbles[i];
          element.setAttribute('data-euigrid-tab-managed', 'true');
          element.setAttribute('tabIndex', '-1');
        }
      };

      if (isCellEntered) {
        enableInteractives();
        var tabbables = (0, _tabbable.default)(headerRef.current);

        if (tabbables.length > 0) {
          tabbables[0].focus();
        }
      } else {
        disableInteractives();
      }
    }
  }, [isCellEntered]);
  (0, _react.useEffect)(function () {
    if (headerRef.current) {
      // focusin bubbles while focus does not, and this needs to react to children gaining focus
      var onFocusIn = function onFocusIn(e) {
        if (headerIsInteractive === false) {
          // header is not interactive, avoid focusing
          requestAnimationFrame(function () {
            return headerRef.current.blur();
          });
          e.preventDefault();
          return false;
        } else {
          // take the focus
          setFocusedCell([index, -1]);
        }
      }; // focusout bubbles while blur does not, and this needs to react to the children losing focus


      var onFocusOut = function onFocusOut() {
        // wait for the next element to receive focus, then update interactives' state
        requestAnimationFrame(function () {
          if (headerRef.current) {
            if (headerRef.current.contains(document.activeElement) === false) {
              setIsCellEntered(false);
            }
          }
        });
      };

      var onKeyUp = function onKeyUp(event) {
        switch (event.key) {
          case _services.keys.ENTER:
            {
              event.preventDefault();
              setIsCellEntered(true);
              break;
            }

          case _services.keys.ESCAPE:
            {
              event.preventDefault(); // move focus to cell

              setIsCellEntered(false);
              headerRef.current.focus();
              break;
            }

          case _services.keys.F2:
            {
              event.preventDefault();

              if (document.activeElement === headerRef.current) {
                // move focus into cell's interactives
                setIsCellEntered(true);
              } else {
                // move focus to cell
                setIsCellEntered(false);
                headerRef.current.focus();
              }

              break;
            }
        }
      };

      if (isFocused) {
        var interactives = headerRef.current.querySelectorAll('[data-euigrid-tab-managed]');

        if (interactives.length === 1) {
          setIsCellEntered(true);
        } else {
          headerRef.current.focus();
        }
      } else {
        setIsCellEntered(false);
      }

      var headerNode = headerRef.current; // @ts-ignore-next line TS doesn't have focusin

      headerNode.addEventListener('focusin', onFocusIn);
      headerNode.addEventListener('focusout', onFocusOut);
      headerNode.addEventListener('keyup', onKeyUp);
      return function () {
        // @ts-ignore-next line TS doesn't have focusin
        headerNode.removeEventListener('focusin', onFocusIn);
        headerNode.removeEventListener('focusout', onFocusOut);
        headerNode.removeEventListener('keyup', onKeyUp);
      };
    }
  }, [setFocusedCell, headerIsInteractive, isFocused, setIsCellEntered, index]);
  return /*#__PURE__*/_react.default.createElement("div", {
    role: "columnheader",
    ref: headerRef,
    tabIndex: isFocused ? 0 : -1,
    className: classes,
    "data-test-subj": "dataGridHeaderCell-".concat(id),
    style: width != null ? {
      width: "".concat(width, "px")
    } : {}
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "euiDataGridHeaderCell__content"
  }, /*#__PURE__*/_react.default.createElement(HeaderCellRender, null)));
};

exports.EuiDataGridControlHeaderCell = EuiDataGridControlHeaderCell;
EuiDataGridControlHeaderCell.propTypes = {
  index: _propTypes.default.number.isRequired,
  controlColumn: _propTypes.default.shape({
    /**
       * Used as the React `key` when rendering content
       */
    id: _propTypes.default.string.isRequired,

    /**
       * Component to render in the column header
       */
    headerCellRender: _propTypes.default.elementType.isRequired,

    /**
       * Component to render for each row in the column
       */
    rowCellRender: _propTypes.default.oneOfType([_propTypes.default.func.isRequired, _propTypes.default.func.isRequired]).isRequired,

    /**
       * Width of the column, uses are unable to change this
       */
    width: _propTypes.default.number.isRequired
  }).isRequired,
  headerIsInteractive: _propTypes.default.bool.isRequired,
  className: _propTypes.default.string
};