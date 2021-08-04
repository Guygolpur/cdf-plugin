"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiRelativeTab = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _datemath = _interopRequireDefault(require("@elastic/datemath"));

var _to_case = require("../../../../services/string/to_case");

var _services = require("../../../../services");

var _flex = require("../../../flex");

var _form = require("../../../form");

var _spacer = require("../../../spacer");

var _time_units = require("../time_units");

var _relative_options = require("../relative_options");

var _relative_utils = require("../relative_utils");

var _accessibility = require("../../../accessibility");

var _i18n = require("../../../i18n");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var EuiRelativeTab = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(EuiRelativeTab, _Component);

  var _super = _createSuper(EuiRelativeTab);

  function EuiRelativeTab() {
    var _this;

    (0, _classCallCheck2.default)(this, EuiRelativeTab);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", _objectSpread(_objectSpread({}, (0, _relative_utils.parseRelativeParts)(_this.props.value)), {}, {
      sentenceCasedPosition: (0, _to_case.toSentenceCase)(_this.props.position)
    }));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "generateId", (0, _services.htmlIdGenerator)());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onCountChange", function (event) {
      var sanitizedValue = parseInt(event.target.value, 10);

      _this.setState({
        count: isNaN(sanitizedValue) ? undefined : sanitizedValue
      }, _this.handleChange);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onUnitChange", function (event) {
      _this.setState({
        unit: event.target.value
      }, _this.handleChange);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onRoundChange", function (event) {
      _this.setState({
        round: event.target.checked
      }, _this.handleChange);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleChange", function () {
      var _this$state = _this.state,
          count = _this$state.count,
          round = _this$state.round,
          roundUnit = _this$state.roundUnit,
          unit = _this$state.unit;
      var onChange = _this.props.onChange;

      if (count === undefined || count < 0) {
        return;
      }

      var date = (0, _relative_utils.toRelativeStringFromParts)({
        count: count,
        round: round,
        roundUnit: roundUnit,
        unit: unit
      });
      onChange(date);
    });
    return _this;
  }

  (0, _createClass2.default)(EuiRelativeTab, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state2 = this.state,
          count = _this$state2.count,
          unit = _this$state2.unit;
      var relativeDateInputNumberDescriptionId = this.generateId();
      var isInvalid = count === undefined || count < 0;

      var parsedValue = _datemath.default.parse(this.props.value, {
        roundUp: this.props.roundUp
      });

      var formatedValue = isInvalid || !parsedValue || !parsedValue.isValid() ? '' : parsedValue.locale(this.props.locale || 'en').format(this.props.dateFormat);
      return /*#__PURE__*/_react.default.createElement(_form.EuiForm, {
        className: "euiDatePopoverContent__padded"
      }, /*#__PURE__*/_react.default.createElement(_flex.EuiFlexGroup, {
        gutterSize: "s",
        responsive: false
      }, /*#__PURE__*/_react.default.createElement(_flex.EuiFlexItem, null, /*#__PURE__*/_react.default.createElement(_i18n.EuiI18n, {
        tokens: ['euiRelativeTab.numberInputError', 'euiRelativeTab.numberInputLabel'],
        defaults: ['Must be >= 0', 'Time span amount']
      }, function (_ref) {
        var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
            numberInputError = _ref2[0],
            numberInputLabel = _ref2[1];

        return /*#__PURE__*/_react.default.createElement(_form.EuiFormRow, {
          isInvalid: isInvalid,
          error: isInvalid ? numberInputError : null
        }, /*#__PURE__*/_react.default.createElement(_form.EuiFieldNumber, {
          compressed: true,
          "aria-label": numberInputLabel,
          "aria-describedby": relativeDateInputNumberDescriptionId,
          "data-test-subj": 'superDatePickerRelativeDateInputNumber',
          value: count,
          onChange: _this2.onCountChange,
          isInvalid: isInvalid
        }));
      })), /*#__PURE__*/_react.default.createElement(_flex.EuiFlexItem, null, /*#__PURE__*/_react.default.createElement(_i18n.EuiI18n, {
        token: "euiRelativeTab.unitInputLabel",
        default: "Relative time span"
      }, function (unitInputLabel) {
        return /*#__PURE__*/_react.default.createElement(_form.EuiSelect, {
          compressed: true,
          "aria-label": unitInputLabel,
          "data-test-subj": 'superDatePickerRelativeDateInputUnitSelector',
          value: unit,
          options: _relative_options.relativeOptions,
          onChange: _this2.onUnitChange
        });
      }))), /*#__PURE__*/_react.default.createElement(_spacer.EuiSpacer, {
        size: "m"
      }), /*#__PURE__*/_react.default.createElement(_i18n.EuiI18n, {
        token: "euiRelativeTab.roundingLabel",
        default: "Round to the {unit}",
        values: {
          unit: _time_units.timeUnits[unit.substring(0, 1)]
        }
      }, function (roundingLabel) {
        return /*#__PURE__*/_react.default.createElement(_form.EuiSwitch, {
          "data-test-subj": 'superDatePickerRelativeDateRoundSwitch',
          label: roundingLabel,
          checked: _this2.state.round,
          onChange: _this2.onRoundChange
        });
      }), /*#__PURE__*/_react.default.createElement(_spacer.EuiSpacer, {
        size: "m"
      }), /*#__PURE__*/_react.default.createElement(_form.EuiFieldText, {
        compressed: true,
        value: formatedValue,
        readOnly: true,
        prepend: /*#__PURE__*/_react.default.createElement(_form.EuiFormLabel, null, /*#__PURE__*/_react.default.createElement(_i18n.EuiI18n, {
          token: "euiRelativeTab.relativeDate",
          default: "{position} date",
          values: {
            position: this.state.sentenceCasedPosition
          }
        }))
      }), /*#__PURE__*/_react.default.createElement(_accessibility.EuiScreenReaderOnly, null, /*#__PURE__*/_react.default.createElement("p", {
        id: relativeDateInputNumberDescriptionId
      }, /*#__PURE__*/_react.default.createElement(_i18n.EuiI18n, {
        token: "euiRelativeTab.fullDescription",
        default: "The unit is changeable. Currently set to {unit}.",
        values: {
          unit: unit
        }
      }))));
    }
  }]);
  return EuiRelativeTab;
}(_react.Component);

exports.EuiRelativeTab = EuiRelativeTab;
EuiRelativeTab.propTypes = {
  dateFormat: _propTypes.default.string.isRequired,
  locale: _propTypes.default.any,
  value: _propTypes.default.string.isRequired,
  onChange: _propTypes.default.func.isRequired,
  roundUp: _propTypes.default.bool,
  position: _propTypes.default.oneOf(["start", "end"]).isRequired
};