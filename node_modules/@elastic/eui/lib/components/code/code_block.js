"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiCodeBlock = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _code_block = require("./_code_block");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EuiCodeBlock = function EuiCodeBlock(_ref) {
  var rest = _extends({}, _ref);

  return /*#__PURE__*/_react.default.createElement(_code_block.EuiCodeBlockImpl, _extends({
    inline: false
  }, rest));
};

exports.EuiCodeBlock = EuiCodeBlock;
EuiCodeBlock.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string
};