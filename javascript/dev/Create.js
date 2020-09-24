/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"Create": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./javascript/Create/index.jsx","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./javascript/Create/Form.js":
/*!***********************************!*\
  !*** ./javascript/Create/Form.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Share_States__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Share/States */ "./javascript/Share/States.js");


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var defaultTrip = {
  additionalMembers: '',
  host: '',
  contactHost: '',
  contactPhone: '',
  destinationCity: '',
  destinationCountry: '',
  destinationState: '',
  housingAddress: '',
  organizationId: 0,
  secContactName: '',
  secContactPhone: '',
  submitDate: 0,
  submitEmail: '',
  submitName: '',
  timeDeparting: 0,
  timeEventStarts: 0,
  timeReturn: 0,
  visitPurpose: ''
};

var createStates = function createStates() {
  var inputs = [];
  _Share_States__WEBPACK_IMPORTED_MODULE_2__["states"].forEach(function (element) {
    inputs.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      key: element
    }, element));
  });
  return inputs;
};

var Form = function Form() {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({
    defaultTrip: defaultTrip
  }),
      _useState2 = _slicedToArray(_useState, 2),
      Trip = _useState2[0],
      setTrip = _useState2[1];

  var setFormElement = function setFormElement(key, value) {
    Trip[key] = value;
    setTrip(Trip);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("fieldset", {
    className: "mb-4"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("legend", null, "Host information"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col-sm-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    className: "lead mb-0"
  }, "Host name"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    className: "small"
  }, "Enter the name of facility, team, group, etc. you are visiting"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
    type: "text",
    className: "form-control",
    value: Trip.host,
    onChange: function onChange(e) {
      setFormElement('host', e.target.value);
    }
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col-sm-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, "City"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
    type: "text",
    className: "form-control",
    value: Trip.destinationCity,
    onChange: function onChange(e) {
      setFormElement('destinationCity', e.target.value);
    }
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col-sm-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
    className: "form-control",
    value: Trip.destinationState
  }, createStates())))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("fieldset", {
    className: "mb-4"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("legend", null, "Contact information"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "Enter a name and phone number of someone we can contact.")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col-sm-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, "Contact host phone"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
    type: "text",
    className: "form-control",
    value: Trip.contactPhone,
    onChange: function onChange(e) {
      setFormElement('contactPhone', e.target.value);
    }
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col-sm-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, "Contact host name"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
    type: "text",
    className: "form-control",
    value: Trip.contactHost,
    onChange: function onChange(e) {
      setFormElement('contactHost', e.target.value);
    }
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col-sm-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, "Contact host name"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
    type: "text",
    className: "form-control",
    value: Trip.contactHost,
    onChange: function onChange(e) {
      setFormElement('contactHost', e.target.value);
    }
  }))));
};

Form.propTypes = {};
Form.defaultProps = {};
/* harmony default export */ __webpack_exports__["default"] = (Form);

/***/ }),

/***/ "./javascript/Create/index.jsx":
/*!*************************************!*\
  !*** ./javascript/Create/index.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Create; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Form */ "./javascript/Create/Form.js");


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





var Create = /*#__PURE__*/function (_Component) {
  _inherits(Create, _Component);

  var _super = _createSuper(Create);

  function Create(props) {
    var _this;

    _classCallCheck(this, Create);

    _this = _super.call(this, props);
    _this.state = {};
    return _this;
  }

  _createClass(Create, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Form__WEBPACK_IMPORTED_MODULE_2__["default"], null));
    }
  }]);

  return Create;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);


react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Create, null), document.getElementById('Create'));

/***/ }),

/***/ "./javascript/Share/States.js":
/*!************************************!*\
  !*** ./javascript/Share/States.js ***!
  \************************************/
/*! exports provided: states */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "states", function() { return states; });
var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vamF2YXNjcmlwdC9DcmVhdGUvRm9ybS5qcyIsIndlYnBhY2s6Ly8vLi9qYXZhc2NyaXB0L0NyZWF0ZS9pbmRleC5qc3giLCJ3ZWJwYWNrOi8vLy4vamF2YXNjcmlwdC9TaGFyZS9TdGF0ZXMuanMiXSwibmFtZXMiOlsiZGVmYXVsdFRyaXAiLCJhZGRpdGlvbmFsTWVtYmVycyIsImhvc3QiLCJjb250YWN0SG9zdCIsImNvbnRhY3RQaG9uZSIsImRlc3RpbmF0aW9uQ2l0eSIsImRlc3RpbmF0aW9uQ291bnRyeSIsImRlc3RpbmF0aW9uU3RhdGUiLCJob3VzaW5nQWRkcmVzcyIsIm9yZ2FuaXphdGlvbklkIiwic2VjQ29udGFjdE5hbWUiLCJzZWNDb250YWN0UGhvbmUiLCJzdWJtaXREYXRlIiwic3VibWl0RW1haWwiLCJzdWJtaXROYW1lIiwidGltZURlcGFydGluZyIsInRpbWVFdmVudFN0YXJ0cyIsInRpbWVSZXR1cm4iLCJ2aXNpdFB1cnBvc2UiLCJjcmVhdGVTdGF0ZXMiLCJpbnB1dHMiLCJzdGF0ZXMiLCJmb3JFYWNoIiwiZWxlbWVudCIsInB1c2giLCJGb3JtIiwidXNlU3RhdGUiLCJUcmlwIiwic2V0VHJpcCIsInNldEZvcm1FbGVtZW50Iiwia2V5IiwidmFsdWUiLCJlIiwidGFyZ2V0IiwicHJvcFR5cGVzIiwiZGVmYXVsdFByb3BzIiwiQ3JlYXRlIiwicHJvcHMiLCJzdGF0ZSIsIkNvbXBvbmVudCIsIlJlYWN0RE9NIiwicmVuZGVyIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsUUFBUSxvQkFBb0I7UUFDNUI7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7UUFFQTtRQUNB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REFBUSxDQUFDQyxNQUFULGVBQWdCLDJEQUFDLE1BQUQsT0FBaEIsRUFBNEJDLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixRQUF4QixDQUE1QixFOzs7Ozs7Ozs7Ozs7QUNwQkE7QUFBQTtBQUFBLElBQU10QixNQUFNLEdBQUcsQ0FDYixTQURhLEVBRWIsUUFGYSxFQUdiLFNBSGEsRUFJYixVQUphLEVBS2IsWUFMYSxFQU1iLFVBTmEsRUFPYixhQVBhLEVBUWIsVUFSYSxFQVNiLFNBVGEsRUFVYixTQVZhLEVBV2IsUUFYYSxFQVliLE9BWmEsRUFhYixVQWJhLEVBY2IsU0FkYSxFQWViLE1BZmEsRUFnQmIsUUFoQmEsRUFpQmIsVUFqQmEsRUFrQmIsV0FsQmEsRUFtQmIsT0FuQmEsRUFvQmIsVUFwQmEsRUFxQmIsZUFyQmEsRUFzQmIsVUF0QmEsRUF1QmIsV0F2QmEsRUF3QmIsYUF4QmEsRUF5QmIsVUF6QmEsRUEwQmIsU0ExQmEsRUEyQmIsVUEzQmEsRUE0QmIsUUE1QmEsRUE2QmIsZUE3QmEsRUE4QmIsWUE5QmEsRUErQmIsWUEvQmEsRUFnQ2IsVUFoQ2EsRUFpQ2IsZ0JBakNhLEVBa0NiLGNBbENhLEVBbUNiLE1BbkNhLEVBb0NiLFVBcENhLEVBcUNiLFFBckNhLEVBc0NiLGNBdENhLEVBdUNiLGNBdkNhLEVBd0NiLGdCQXhDYSxFQXlDYixjQXpDYSxFQTBDYixXQTFDYSxFQTJDYixPQTNDYSxFQTRDYixNQTVDYSxFQTZDYixTQTdDYSxFQThDYixVQTlDYSxFQStDYixZQS9DYSxFQWdEYixlQWhEYSxFQWlEYixXQWpEYSxFQWtEYixTQWxEYSxDQUFmIiwiZmlsZSI6IkNyZWF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuIFx0ZnVuY3Rpb24gd2VicGFja0pzb25wQ2FsbGJhY2soZGF0YSkge1xuIFx0XHR2YXIgY2h1bmtJZHMgPSBkYXRhWzBdO1xuIFx0XHR2YXIgbW9yZU1vZHVsZXMgPSBkYXRhWzFdO1xuIFx0XHR2YXIgZXhlY3V0ZU1vZHVsZXMgPSBkYXRhWzJdO1xuXG4gXHRcdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuIFx0XHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcbiBcdFx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMCwgcmVzb2x2ZXMgPSBbXTtcbiBcdFx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG4gXHRcdFx0XHRyZXNvbHZlcy5wdXNoKGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSk7XG4gXHRcdFx0fVxuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG4gXHRcdH1cbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZihwYXJlbnRKc29ucEZ1bmN0aW9uKSBwYXJlbnRKc29ucEZ1bmN0aW9uKGRhdGEpO1xuXG4gXHRcdHdoaWxlKHJlc29sdmVzLmxlbmd0aCkge1xuIFx0XHRcdHJlc29sdmVzLnNoaWZ0KCkoKTtcbiBcdFx0fVxuXG4gXHRcdC8vIGFkZCBlbnRyeSBtb2R1bGVzIGZyb20gbG9hZGVkIGNodW5rIHRvIGRlZmVycmVkIGxpc3RcbiBcdFx0ZGVmZXJyZWRNb2R1bGVzLnB1c2guYXBwbHkoZGVmZXJyZWRNb2R1bGVzLCBleGVjdXRlTW9kdWxlcyB8fCBbXSk7XG5cbiBcdFx0Ly8gcnVuIGRlZmVycmVkIG1vZHVsZXMgd2hlbiBhbGwgY2h1bmtzIHJlYWR5XG4gXHRcdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xuIFx0fTtcbiBcdGZ1bmN0aW9uIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCkge1xuIFx0XHR2YXIgcmVzdWx0O1xuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0dmFyIGRlZmVycmVkTW9kdWxlID0gZGVmZXJyZWRNb2R1bGVzW2ldO1xuIFx0XHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuIFx0XHRcdGZvcih2YXIgaiA9IDE7IGogPCBkZWZlcnJlZE1vZHVsZS5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0dmFyIGRlcElkID0gZGVmZXJyZWRNb2R1bGVbal07XG4gXHRcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbZGVwSWRdICE9PSAwKSBmdWxmaWxsZWQgPSBmYWxzZTtcbiBcdFx0XHR9XG4gXHRcdFx0aWYoZnVsZmlsbGVkKSB7XG4gXHRcdFx0XHRkZWZlcnJlZE1vZHVsZXMuc3BsaWNlKGktLSwgMSk7XG4gXHRcdFx0XHRyZXN1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IGRlZmVycmVkTW9kdWxlWzBdKTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHRyZXR1cm4gcmVzdWx0O1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuIFx0Ly8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4gXHQvLyBQcm9taXNlID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0XCJDcmVhdGVcIjogMFxuIFx0fTtcblxuIFx0dmFyIGRlZmVycmVkTW9kdWxlcyA9IFtdO1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHR2YXIganNvbnBBcnJheSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSB8fCBbXTtcbiBcdHZhciBvbGRKc29ucEZ1bmN0aW9uID0ganNvbnBBcnJheS5wdXNoLmJpbmQoanNvbnBBcnJheSk7XG4gXHRqc29ucEFycmF5LnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjaztcbiBcdGpzb25wQXJyYXkgPSBqc29ucEFycmF5LnNsaWNlKCk7XG4gXHRmb3IodmFyIGkgPSAwOyBpIDwganNvbnBBcnJheS5sZW5ndGg7IGkrKykgd2VicGFja0pzb25wQ2FsbGJhY2soanNvbnBBcnJheVtpXSk7XG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IG9sZEpzb25wRnVuY3Rpb247XG5cblxuIFx0Ly8gYWRkIGVudHJ5IG1vZHVsZSB0byBkZWZlcnJlZCBsaXN0XG4gXHRkZWZlcnJlZE1vZHVsZXMucHVzaChbXCIuL2phdmFzY3JpcHQvQ3JlYXRlL2luZGV4LmpzeFwiLFwidmVuZG9yXCJdKTtcbiBcdC8vIHJ1biBkZWZlcnJlZCBtb2R1bGVzIHdoZW4gcmVhZHlcbiBcdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xuIiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQgUmVhY3QsIHt1c2VTdGF0ZX0gZnJvbSAncmVhY3QnXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnXG5pbXBvcnQge3N0YXRlc30gZnJvbSAnLi4vU2hhcmUvU3RhdGVzJ1xuXG5jb25zdCBkZWZhdWx0VHJpcCA9IHtcbiAgYWRkaXRpb25hbE1lbWJlcnM6ICcnLFxuICBob3N0OiAnJyxcbiAgY29udGFjdEhvc3Q6ICcnLFxuICBjb250YWN0UGhvbmU6ICcnLFxuICBkZXN0aW5hdGlvbkNpdHk6ICcnLFxuICBkZXN0aW5hdGlvbkNvdW50cnk6ICcnLFxuICBkZXN0aW5hdGlvblN0YXRlOiAnJyxcbiAgaG91c2luZ0FkZHJlc3M6ICcnLFxuICBvcmdhbml6YXRpb25JZDogMCxcbiAgc2VjQ29udGFjdE5hbWU6ICcnLFxuICBzZWNDb250YWN0UGhvbmU6ICcnLFxuICBzdWJtaXREYXRlOiAwLFxuICBzdWJtaXRFbWFpbDogJycsXG4gIHN1Ym1pdE5hbWU6ICcnLFxuICB0aW1lRGVwYXJ0aW5nOiAwLFxuICB0aW1lRXZlbnRTdGFydHM6IDAsXG4gIHRpbWVSZXR1cm46IDAsXG4gIHZpc2l0UHVycG9zZTogJycsXG59XG5jb25zdCBjcmVhdGVTdGF0ZXMgPSAoKSA9PiB7XG4gIGNvbnN0IGlucHV0cyA9IFtdXG4gIHN0YXRlcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgaW5wdXRzLnB1c2goPG9wdGlvbiBrZXk9e2VsZW1lbnR9PntlbGVtZW50fTwvb3B0aW9uPilcbiAgfSlcbiAgcmV0dXJuIGlucHV0c1xufVxuXG5jb25zdCBGb3JtID0gKCkgPT4ge1xuICBjb25zdCBbVHJpcCwgc2V0VHJpcF0gPSB1c2VTdGF0ZSh7ZGVmYXVsdFRyaXB9KVxuICBjb25zdCBzZXRGb3JtRWxlbWVudCA9IChrZXksIHZhbHVlKSA9PiB7XG4gICAgVHJpcFtrZXldID0gdmFsdWVcbiAgICBzZXRUcmlwKFRyaXApXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8ZmllbGRzZXQgY2xhc3NOYW1lPVwibWItNFwiPlxuICAgICAgICA8bGVnZW5kPkhvc3QgaW5mb3JtYXRpb248L2xlZ2VuZD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS02XCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwibGVhZCBtYi0wXCI+SG9zdCBuYW1lPC9sYWJlbD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInNtYWxsXCI+XG4gICAgICAgICAgICAgIEVudGVyIHRoZSBuYW1lIG9mIGZhY2lsaXR5LCB0ZWFtLCBncm91cCwgZXRjLiB5b3UgYXJlIHZpc2l0aW5nXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgICB2YWx1ZT17VHJpcC5ob3N0fVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRGb3JtRWxlbWVudCgnaG9zdCcsIGUudGFyZ2V0LnZhbHVlKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tNlwiPlxuICAgICAgICAgICAgPGxhYmVsPkNpdHk8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgdmFsdWU9e1RyaXAuZGVzdGluYXRpb25DaXR5fVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRGb3JtRWxlbWVudCgnZGVzdGluYXRpb25DaXR5JywgZS50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTZcIj5cbiAgICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdmFsdWU9e1RyaXAuZGVzdGluYXRpb25TdGF0ZX0+XG4gICAgICAgICAgICAgIHtjcmVhdGVTdGF0ZXMoKX1cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZmllbGRzZXQ+XG5cbiAgICAgIDxmaWVsZHNldCBjbGFzc05hbWU9XCJtYi00XCI+XG4gICAgICAgIDxsZWdlbmQ+Q29udGFjdCBpbmZvcm1hdGlvbjwvbGVnZW5kPlxuICAgICAgICA8cD5FbnRlciBhIG5hbWUgYW5kIHBob25lIG51bWJlciBvZiBzb21lb25lIHdlIGNhbiBjb250YWN0LjwvcD5cbiAgICAgIDwvZmllbGRzZXQ+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS02XCI+XG4gICAgICAgICAgPGxhYmVsPkNvbnRhY3QgaG9zdCBwaG9uZTwvbGFiZWw+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgdmFsdWU9e1RyaXAuY29udGFjdFBob25lfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgICAgIHNldEZvcm1FbGVtZW50KCdjb250YWN0UGhvbmUnLCBlLnRhcmdldC52YWx1ZSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTZcIj5cbiAgICAgICAgICA8bGFiZWw+Q29udGFjdCBob3N0IG5hbWU8L2xhYmVsPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIHZhbHVlPXtUcmlwLmNvbnRhY3RIb3N0fVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgICAgIHNldEZvcm1FbGVtZW50KCdjb250YWN0SG9zdCcsIGUudGFyZ2V0LnZhbHVlKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tNlwiPlxuICAgICAgICAgIDxsYWJlbD5Db250YWN0IGhvc3QgbmFtZTwvbGFiZWw+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgdmFsdWU9e1RyaXAuY29udGFjdEhvc3R9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICAgICAgc2V0Rm9ybUVsZW1lbnQoJ2NvbnRhY3RIb3N0JywgZS50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuRm9ybS5wcm9wVHlwZXMgPSB7fVxuXG5Gb3JtLmRlZmF1bHRQcm9wcyA9IHt9XG5leHBvcnQgZGVmYXVsdCBGb3JtXG4iLCIndXNlIHN0cmljdCdcbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xuaW1wb3J0IEZvcm0gZnJvbSAnLi9Gb3JtJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGUgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc3RhdGUgPSB7fVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8Rm9ybSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cblJlYWN0RE9NLnJlbmRlcig8Q3JlYXRlIC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnQ3JlYXRlJykpXG4iLCJjb25zdCBzdGF0ZXMgPSBbXG4gICdBbGFiYW1hJyxcbiAgJ0FsYXNrYScsXG4gICdBcml6b25hJyxcbiAgJ0Fya2Fuc2FzJyxcbiAgJ0NhbGlmb3JuaWEnLFxuICAnQ29sb3JhZG8nLFxuICAnQ29ubmVjdGljdXQnLFxuICAnRGVsYXdhcmUnLFxuICAnRmxvcmlkYScsXG4gICdHZW9yZ2lhJyxcbiAgJ0hhd2FpaScsXG4gICdJZGFobycsXG4gICdJbGxpbm9pcycsXG4gICdJbmRpYW5hJyxcbiAgJ0lvd2EnLFxuICAnS2Fuc2FzJyxcbiAgJ0tlbnR1Y2t5JyxcbiAgJ0xvdWlzaWFuYScsXG4gICdNYWluZScsXG4gICdNYXJ5bGFuZCcsXG4gICdNYXNzYWNodXNldHRzJyxcbiAgJ01pY2hpZ2FuJyxcbiAgJ01pbm5lc290YScsXG4gICdNaXNzaXNzaXBwaScsXG4gICdNaXNzb3VyaScsXG4gICdNb250YW5hJyxcbiAgJ05lYnJhc2thJyxcbiAgJ05ldmFkYScsXG4gICdOZXcgSGFtcHNoaXJlJyxcbiAgJ05ldyBKZXJzZXknLFxuICAnTmV3IE1leGljbycsXG4gICdOZXcgWW9yaycsXG4gICdOb3J0aCBDYXJvbGluYScsXG4gICdOb3J0aCBEYWtvdGEnLFxuICAnT2hpbycsXG4gICdPa2xhaG9tYScsXG4gICdPcmVnb24nLFxuICAnUGVubnN5bHZhbmlhJyxcbiAgJ1Job2RlIElzbGFuZCcsXG4gICdTb3V0aCBDYXJvbGluYScsXG4gICdTb3V0aCBEYWtvdGEnLFxuICAnVGVubmVzc2VlJyxcbiAgJ1RleGFzJyxcbiAgJ1V0YWgnLFxuICAnVmVybW9udCcsXG4gICdWaXJnaW5pYScsXG4gICdXYXNoaW5ndG9uJyxcbiAgJ1dlc3QgVmlyZ2luaWEnLFxuICAnV2lzY29uc2luJyxcbiAgJ1d5b21pbmcnLFxuXVxuZXhwb3J0IHtzdGF0ZXN9XG4iXSwic291cmNlUm9vdCI6IiJ9