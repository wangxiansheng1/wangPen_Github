;(function () {
	

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define('fastclick',[],function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}());

/*
 * Swipe 2.0
 *
 * Brad Birdsall
 * Copyright 2013, MIT License
 *
*/

var swipe = function Swipe(container, options) {

  

  // utilities
  var noop = function() {}; // simple no operation function
  var offloadFn = function(fn) { setTimeout(fn || noop, 0) }; // offload a functions execution

  // check browser capabilities
  var browser = {
    addEventListener: !!window.addEventListener,
    touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    transitions: (function(temp) {
      var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
      for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
      return false;
    })(document.createElement('swipe'))
  };

  // quit if no root element
  if (!container) return;
  var element = container.children[0];
  var slides, slidePos, width, length;
  options = options || {};
  var index = parseInt(options.startSlide, 10) || 0;
  var speed = options.speed || 300;
  options.continuous = options.continuous !== undefined ? options.continuous : true;

  function setup() {

    // cache slides
    slides = element.children;
    length = slides.length;

    // set continuous to false if only one slide
    if (slides.length < 2) options.continuous = false;

    //special case if two slides
    if (browser.transitions && options.continuous && slides.length < 3) {
      element.appendChild(slides[0].cloneNode(true));
      element.appendChild(element.children[1].cloneNode(true));
      slides = element.children;
    }

    // create an array to store current positions of each slide
    slidePos = new Array(slides.length);

    // determine width of each slide
    width = container.getBoundingClientRect().width || container.offsetWidth;

    element.style.width = (slides.length * width) + 'px';

    // stack elements
    var pos = slides.length;
    while(pos--) {

      var slide = slides[pos];

      slide.style.width = width + 'px';
      slide.setAttribute('data-index', pos);

      if (browser.transitions) {
        slide.style.left = (pos * -width) + 'px';
        move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
      }

    }

    // reposition elements before and after index
    if (options.continuous && browser.transitions) {
      move(circle(index-1), -width, 0);
      move(circle(index+1), width, 0);
    }

    if (!browser.transitions) element.style.left = (index * -width) + 'px';

    container.style.visibility = 'visible';

  }

  function prev() {

    if (options.continuous) slide(index-1);
    else if (index) slide(index-1);

  }

  function next() {

    if (options.continuous) slide(index+1);
    else if (index < slides.length - 1) slide(index+1);

  }

  function circle(index) {

    // a simple positive modulo using slides.length
    return (slides.length + (index % slides.length)) % slides.length;

  }

  function slide(to, slideSpeed) {

    // do nothing if already on requested slide
    if (index == to) return;

    if (browser.transitions) {

      var direction = Math.abs(index-to) / (index-to); // 1: backward, -1: forward

      // get the actual position of the slide
      if (options.continuous) {
        var natural_direction = direction;
        direction = -slidePos[circle(to)] / width;

        // if going forward but to < index, use to = slides.length + to
        // if going backward but to > index, use to = -slides.length + to
        if (direction !== natural_direction) to =  -direction * slides.length + to;

      }

      var diff = Math.abs(index-to) - 1;

      // move all the slides between index and to in the right direction
      while (diff--) move( circle((to > index ? to : index) - diff - 1), width * direction, 0);

      to = circle(to);

      move(index, width * direction, slideSpeed || speed);
      move(to, 0, slideSpeed || speed);

      if (options.continuous) move(circle(to - direction), -(width * direction), 0); // we need to get the next in place

    } else {

      to = circle(to);
      animate(index * -width, to * -width, slideSpeed || speed);
      //no fallback for a circular continuous if the browser does not accept transitions
    }

    index = to;
    offloadFn(options.callback && options.callback(index, slides[index]));
  }

  function move(index, dist, speed) {

    translate(index, dist, speed);
    slidePos[index] = dist;

  }

  function translate(index, dist, speed) {

    var slide = slides[index];
    var style = slide && slide.style;

    if (!style) return;

    style.webkitTransitionDuration =
    style.MozTransitionDuration =
    style.msTransitionDuration =
    style.OTransitionDuration =
    style.transitionDuration = speed + 'ms';

    style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
    style.msTransform =
    style.MozTransform =
    style.OTransform = 'translateX(' + dist + 'px)';

  }

  function animate(from, to, speed) {

    // if not an animation, just reposition
    if (!speed) {

      element.style.left = to + 'px';
      return;

    }

    var start = +new Date;

    var timer = setInterval(function() {

      var timeElap = +new Date - start;

      if (timeElap > speed) {

        element.style.left = to + 'px';

        if (delay) begin();

        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

        clearInterval(timer);
        return;

      }

      element.style.left = (( (to - from) * (Math.floor((timeElap / speed) * 100) / 100) ) + from) + 'px';

    }, 4);

  }

  // setup auto slideshow
  var delay = options.auto || 0;
  var interval;

  function begin() {

    interval = setTimeout(next, delay);

  }

  function stop() {

    delay = 0;
    clearTimeout(interval);

  }


  // setup initial vars
  var start = {};
  var delta = {};
  var isScrolling;

  // setup event capturing
  var events = {

    handleEvent: function(event) {

      switch (event.type) {
        case 'touchstart': this.start(event); break;
        case 'touchmove': this.move(event); break;
        case 'touchend': offloadFn(this.end(event)); break;
        case 'webkitTransitionEnd':
        case 'msTransitionEnd':
        case 'oTransitionEnd':
        case 'otransitionend':
        case 'transitionend': offloadFn(this.transitionEnd(event)); break;
        case 'resize': offloadFn(setup); break;
      }

      if (options.stopPropagation) event.stopPropagation();

    },
    start: function(event) {

      var touches = event.touches[0];

      // measure start values
      start = {

        // get initial touch coords
        x: touches.pageX,
        y: touches.pageY,

        // store time to determine touch duration
        time: +new Date

      };

      // used for testing first move event
      isScrolling = undefined;

      // reset delta and end measurements
      delta = {};

      // attach touchmove and touchend listeners
      element.addEventListener('touchmove', this, false);
      element.addEventListener('touchend', this, false);

    },
    move: function(event) {

      // ensure swiping with one touch and not pinching
      if ( event.touches.length > 1 || event.scale && event.scale !== 1) return

      if (options.disableScroll) event.preventDefault();

      var touches = event.touches[0];

      // measure change in x and y
      delta = {
        x: touches.pageX - start.x,
        y: touches.pageY - start.y
      }

      // determine if scrolling test has run - one time test
      if ( typeof isScrolling == 'undefined') {
        isScrolling = !!( isScrolling || Math.abs(delta.x) < Math.abs(delta.y) );
      }

      // if user is not trying to scroll vertically
      if (!isScrolling) {

        // prevent native scrolling
        event.preventDefault();

        // stop slideshow
        stop();

        // increase resistance if first or last slide
        if (options.continuous) { // we don't add resistance at the end

          translate(circle(index-1), delta.x + slidePos[circle(index-1)], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(circle(index+1), delta.x + slidePos[circle(index+1)], 0);

        } else {

          delta.x =
            delta.x /
              ( (!index && delta.x > 0               // if first slide and sliding left
                || index == slides.length - 1        // or if last slide and sliding right
                && delta.x < 0                       // and if sliding at all
              ) ?
              ( Math.abs(delta.x) / width + 1 )      // determine resistance level
              : 1 );                                 // no resistance if false

          // translate 1:1
          translate(index-1, delta.x + slidePos[index-1], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(index+1, delta.x + slidePos[index+1], 0);
        }

      }

    },
    end: function(event) {

      // measure duration
      var duration = +new Date - start.time;

      // determine if slide attempt triggers next/prev slide
      var isValidSlide =
            Number(duration) < 250               // if slide duration is less than 250ms
            && Math.abs(delta.x) > 20            // and if slide amt is greater than 20px
            || Math.abs(delta.x) > width/2;      // or if slide amt is greater than half the width

      // determine if slide attempt is past start and end
      var isPastBounds =
            !index && delta.x > 0                            // if first slide and slide amt is greater than 0
            || index == slides.length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

      if (options.continuous) isPastBounds = false;

      // determine direction of swipe (true:right, false:left)
      var direction = delta.x < 0;

      // if not scrolling vertically
      if (!isScrolling) {

        if (isValidSlide && !isPastBounds) {

          if (direction) {

            if (options.continuous) { // we need to get the next in this direction in place

              move(circle(index-1), -width, 0);
              move(circle(index+2), width, 0);

            } else {
              move(index-1, -width, 0);
            }

            move(index, slidePos[index]-width, speed);
            move(circle(index+1), slidePos[circle(index+1)]-width, speed);
            index = circle(index+1);

          } else {
            if (options.continuous) { // we need to get the next in this direction in place

              move(circle(index+1), width, 0);
              move(circle(index-2), -width, 0);

            } else {
              move(index+1, width, 0);
            }

            move(index, slidePos[index]+width, speed);
            move(circle(index-1), slidePos[circle(index-1)]+width, speed);
            index = circle(index-1);

          }

          options.callback && options.callback(index, slides[index]);

        } else {

          if (options.continuous) {

            move(circle(index-1), -width, speed);
            move(index, 0, speed);
            move(circle(index+1), width, speed);

          } else {

            move(index-1, -width, speed);
            move(index, 0, speed);
            move(index+1, width, speed);
          }

        }

      }

      // kill touchmove and touchend event listeners until touchstart called again
      element.removeEventListener('touchmove', events, false)
      element.removeEventListener('touchend', events, false)

    },
    transitionEnd: function(event) {

      if (parseInt(event.target.getAttribute('data-index'), 10) == index) {

        if (delay) begin();

        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

      }

    }

  }

  // trigger setup
  setup();

  // start auto slideshow if applicable
  if (delay) begin();


  // add event listeners
  if (browser.addEventListener) {

    // set touchstart event on element
    if (browser.touch) element.addEventListener('touchstart', events, false);

    if (browser.transitions) {
      element.addEventListener('webkitTransitionEnd', events, false);
      element.addEventListener('msTransitionEnd', events, false);
      element.addEventListener('oTransitionEnd', events, false);
      element.addEventListener('otransitionend', events, false);
      element.addEventListener('transitionend', events, false);
    }

    // set resize event on window
    window.addEventListener('resize', events, false);

  } else {

    window.onresize = function () { setup() }; // to play nice with old IE

  }

  // expose the Swipe API
  return {
    setup: function() {

      setup();

    },
    slide: function(to, speed) {

      // cancel slideshow
      stop();

      slide(to, speed);

    },
    prev: function() {

      // cancel slideshow
      stop();

      prev();

    },
    next: function() {

      // cancel slideshow
      stop();

      next();

    },
    stop: function() {

      // cancel slideshow
      stop();

    },
    getPos: function() {

      // return current index position
      return index;

    },
    getNumSlides: function() {

      // return total number of slides
      return length;
    },
    kill: function() {

      // cancel slideshow
      stop();

      // reset element
      element.style.width = '';
      element.style.left = '';

      // reset slides
      var pos = slides.length;
      while(pos--) {

        var slide = slides[pos];
        slide.style.width = '';
        slide.style.left = '';

        if (browser.transitions) translate(pos, 0, 0);

      }

      // removed event listeners
      if (browser.addEventListener) {

        // remove current event listeners
        element.removeEventListener('touchstart', events, false);
        element.removeEventListener('webkitTransitionEnd', events, false);
        element.removeEventListener('msTransitionEnd', events, false);
        element.removeEventListener('oTransitionEnd', events, false);
        element.removeEventListener('otransitionend', events, false);
        element.removeEventListener('transitionend', events, false);
        window.removeEventListener('resize', events, false);

      }
      else {

        window.onresize = null;

      }

    }
  }

}


// if ( window.jQuery || window.Zepto ) {
//   (function($) {
//     $.fn.Swipe = function(element, params) {
//       return new Swipe(element, params)
//     }
//   })( window.jQuery || window.Zepto )
// }

if ( typeof define === "function" && define.amd ) {
  define( "swipe", [], function () { return swipe; } );
};
/**
 * Zepto picLazyLoad Plugin
 * ximan http://ons.me/484.html
 * 20140517 v1.0
 */
;(function($){$.fn.picLazyLoad=function(settings){var $this=$(this),_winScrollTop=0,_winHeight=$(window).height();settings=$.extend({threshold:0,placeholder:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC'},settings||{});lazyLoadPic();$(window).on('scroll',function(){_winScrollTop=$(window).scrollTop();lazyLoadPic();});function lazyLoadPic(){$this.each(function(){var $self=$(this);if($self.is('img')){if($self.attr('data-original')){var _offsetTop=$self.offset().top;if((_offsetTop-settings.threshold)<=(_winHeight+_winScrollTop)){$self.attr('src',$self.attr('data-original'));$self.removeAttr('data-original');}}}else{if($self.attr('data-original')){if($self.css('background-image')=='none'){$self.css('background-image','url('+settings.placeholder+')');}
var _offsetTop=$self.offset().top;if((_offsetTop-settings.threshold)<=(_winHeight+_winScrollTop)){$self.css('background-image','url('+$self.attr('data-original')+')');$self.removeAttr('data-original');}}}});}}})(Zepto);
define("imagelazyload", function(){});

/**
 * @license RequireJS text 2.0.14 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define('text',['module'], function (module) {
    

    var text, fs, Cc, Ci, xpcIsWindows,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.14',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.lastIndexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config && config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config && config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            // Do not load if it is an empty: url
            if (url.indexOf('empty:') === 0) {
                onLoad();
                return;
            }

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node &&
            !process.versions['node-webkit'] &&
            !process.versions['atom-shell'])) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback, errback) {
            try {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file[0] === '\uFEFF') {
                    file = file.substring(1);
                }
                callback(file);
            } catch (e) {
                if (errback) {
                    errback(e);
                }
            }
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status || 0;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        if (errback) {
                            errback(err);
                        }
                    } else {
                        callback(xhr.responseText);
                    }

                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                if (line !== null) {
                    stringBuffer.append(line);
                }

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    } else if (masterConfig.env === 'xpconnect' || (!masterConfig.env &&
            typeof Components !== 'undefined' && Components.classes &&
            Components.interfaces)) {
        //Avert your gaze!
        Cc = Components.classes;
        Ci = Components.interfaces;
        Components.utils['import']('resource://gre/modules/FileUtils.jsm');
        xpcIsWindows = ('@mozilla.org/windows-registry-key;1' in Cc);

        text.get = function (url, callback) {
            var inStream, convertStream, fileObj,
                readData = {};

            if (xpcIsWindows) {
                url = url.replace(/\//g, '\\');
            }

            fileObj = new FileUtils.File(url);

            //XPCOM, you so crazy
            try {
                inStream = Cc['@mozilla.org/network/file-input-stream;1']
                           .createInstance(Ci.nsIFileInputStream);
                inStream.init(fileObj, 1, 0, false);

                convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                                .createInstance(Ci.nsIConverterInputStream);
                convertStream.init(inStream, "utf-8", inStream.available(),
                Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

                convertStream.readString(inStream.available(), readData);
                convertStream.close();
                inStream.close();
                callback(readData.value);
            } catch (e) {
                throw new Error((fileObj && fileObj.path || '') + ': ' + e);
            }
        };
    }
    return text;
});


define('text!template_components_index',[],function () { return '<div>\n<div class="ajax_noload"><img src="images/wifi.png">网络请求失败，请稍候再试<span><img src="images/sx.png"></span></div>\n\n    <!--顶部-->\n    <div class="nheader">\n    <div class="nheader_cover"></div>\n        <div class="nindex_shaomiao" onClick="scan_code_fun()"></div>\n        <div class="nindex_sousuo" onClick="search_fun()" unselectable="on" style="-moz-user-select:none;-webkit-user-select:none;" onselectstart="return false;"><em></em>全球购，找到好口碑</div>\n        <div class="nindex_xiaoxi" onClick="message_fun()"></div>\n    </div>\n    <!--/顶部-->\n    \n    <!--banner-->\n    <div class="nbanner">\n        <div class="swiper-container">\n            <div class="swiper-wrapper" id="ajax_banner">\n <div class="swiper-slide"><img class="lazyload" src="http://lehumall.b0.upaiyun.com//upload/image/admin/2016/20160709/201607091553187203.jpg"></div>\n           \n              \n            </div>\n            <div class="swiper-pagination"></div>\n        </div>\n    </div>\n    <!--/banner-->\n    \n    <!--标签-->\n    <div class="ntag" id="ajax_fastList">\n    <a href="javascript:;"><img class="lazyload" src="http://lehumall.b0.upaiyun.com//upload/image/admin/2016/20160627/201606271437018396.png"><span>摇一摇</span></a>\n    \n    <a href="javascript:;"><img class="lazyload" src="http://lehumall.b0.upaiyun.com//upload/image/admin/2016/20160627/201606271441106415.png"><span>免费试用</span></a>\n    \n    <a href="javascript:;" ><img class="lazyload" src="http://lehumall.b0.upaiyun.com//upload/image/admin/2016/20160627/201606271447537282.png"><span>每日签到</span></a>\n    \n\n    \n    <a href="javascript:;"><img class="lazyload" src="http://lehumall.b0.upaiyun.com/upload/image/admin/2016/20160709/201607091607357640.png"><span>更多</span></a>\n    \n    </div>\n    <!--/标签-->\n    \n    <div class="nhr nmiaosha_nhr" ></div>\n    \n    <!--秒杀-->\n    <div class="nmiaosha" >     \n        <div class="nmiaosha_top">\n            <img src="images/index_28.png" >&nbsp;<b class="ajax_timetext">距离开始</b><span class="getting-started"><em>00</em>:<em>00</em>:<em>00</em></span>&nbsp;<i class="ajax_REMARK"></i>\n            <a href="javascript:;" data-title="nmiaosha_more" data-url="">更多>></a></div>\n        <div class="nmiaosha_main" id="ajax_seckillList">\n          <!--<a href="">\n                <img class="lazyload" src="images/list_mr.jpg">\n                <title>花印清新净颜卸妆水(滋养型)</title>\n                <span>￥00.00</span>\n          </a>\n            <a href="">\n                <img class="lazyload" src="images/list_mr.jpg">\n                <title>花印清新净颜卸妆水(滋养型)</title>\n                <span>￥00.00</span>\n          </a>\n            <a href="">\n                <img class="lazyload" src="images/list_mr.jpg">\n                <title>花印清新净颜卸妆水(滋养型)</title>\n                <span>￥00.00</span>\n          </a>\n            <a href="">\n                <img class="lazyload" src="images/list_mr.jpg">\n                <title>花印清新净颜卸妆水(滋养型)</title>\n                <span>￥00.00</span>\n          </a>\n            <a href="">\n                <img class="lazyload" src="images/list_mr.jpg">\n                <title>花印清新净颜卸妆水(滋养型)</title>\n                <span>￥00.00</span>\n          </a>\n            <a href="">\n                <img class="lazyload" src="images/list_mr.jpg">\n                <title>花印清新净颜卸妆水(滋养型)</title>\n                <span>￥00.00</span>\n          </a>-->\n        </div>\n    </div>\n    <!--/秒杀-->\n    \n    <div class="nhr"></div>\n    \n    <!--广告位-->\n    <div class="nindex_ad" id="ajax_hotRecommendation">\n    \n      <div class="nindex_ad_one"><a href="javascript:;" ><img class="lazyload" src="http://lehumall.b0.upaiyun.com//upload/image/admin/2016/20160709/201607091614136508.jpg"></a></div>\n        <div class="nindex_ad_one"><a href="javascript:;" ><img class="lazyload" src="http://lehumall.b0.upaiyun.com//upload/image/admin/2016/20160709/201607091609224298.jpg"></a></div>\n        <div class="nindex_ad_one"><a href="javascript:;" ><img class="lazyload" src="http://lehumall.b0.upaiyun.com//upload/image/admin/2016/20160709/201607091616531809.jpg"></a></div>\n        \n    </div>\n    <!--/广告位-->\n    <div class="nhr"></div>\n    \n    <!--分类楼层-->\n    <div id="ajax_prommotionLayout">\n    </div>\n    \n    <!--发现-->\n    <div class="nfaxian">\n     <div class="ajax_nfaxian_top"></div>\n        \n        <div class="nfaxian_main" id="ajax_showList"> \n        </div>\n    </div>\n    <!--/发现-->\n\n</div>\n\n<a href="#" class="fix_go_top" onclick="return false;"></a>';});

define('lehu.h5.component.index', [
    'zepto',
    'zepto.cookie',
    'can',
    'md5',
    'store',
    'fastclick',
    'lehu.h5.business.config',
    'lehu.h5.api',
    'lehu.hybrid',

    'swipe',
    'imagelazyload',

    'text!template_components_index'
  ],

  function($, cookie, can, md5, store, Fastclick, LHConfig, LHAPI, LHHybrid,
    Swipe, imagelazyload,
    template_components_index) {
    

    return can.Control.extend({

      helpers: {

      },

      /**
       * @override
       * @description 初始化方法
       */
      init: function() {
        var that = this;

        this.juli = null;
        this.shengyu = null;

        this.initData();

        var renderIndex = can.mustache(template_components_index);
        var html = renderIndex(this.options);
        this.element.html(html);

        var api = new LHAPI({
          url: "initIndex.do",
          data: {}
        });
        api.sendRequest()
          .done(function(data) {

            // 设置数据类型
            $("html").attr("data_type", data.type);

            // 渲染幻灯片
            that.renderBannerList(data);

            // 渲染标签
            that.renderTagList(data);

            // 渲染秒杀
            that.renderSecondkillList(data);

            // 渲染首页广告列表
            that.renderHotRecommendation(data);

            // 楼层
            that.renderProductList(data);

            // 发现
            that.renderDiscovery(data);

            // 绑定滚动事件
            that.bindScroll();

            // 执行倒计时
            that.timer = setInterval(function() {
              that.countDown();
            }, 1000);
          })
          .fail(function(error) {
            $(".ajax_noload").show();
          })

      },

      initData: function() {
        this.URL = LHHybrid.getUrl();
      },

      lazyload: function() {
        $('.lazyload').picLazyLoad({
          threshold: 400
        });
      },

      //扫描
      ".nindex_shaomiao click": function(element, event) {
        var jsonParams = {
          'funName': 'scan_code_fun',
          'params': {}
        };
        LHHybrid.nativeFun(jsonParams);
      },

      //消息
      ".nindex_xiaoxi click": function(element, event) {
        var jsonParams = {
          'funName': 'message_fun',
          'params': {}
        };
        LHHybrid.nativeFun(jsonParams);
      },

      //搜索
      ".nindex_sousuo click": function(element, event) {
        var jsonParams = {
          'funName': 'search_fun',
          'params': {}
        };
        LHHybrid.nativeFun(jsonParams);
      },

      ".nmiaosha_top a click": function(element, event) {
        var title = element.attr("data-title");
        var url = element.attr("data-url");
        var jsonParams = {
          'funName': 'seckill_more_fun',
          'params': {}
        };
        LHHybrid.nativeFun(jsonParams);
      },

      renderBannerList: function(data) {
        var html = "";
        var bannerList = data.bannerList;
        for (var k = 0; k < bannerList.length; k++) {
          html += "<div class='swiper-slide' data-SORT='" + bannerList[k]['SORT'] + "' data-BANNER_JUMP_ID='" + bannerList[k]['BANNER_JUMP_ID'] + "' data-BANNER_CONTENT='" + bannerList[k]['BANNER_CONTENT'] + "' data-BANNER_IMG='" + bannerList[k]['BANNER_IMG'] + "' data-ID='" + bannerList[k]['ID'] + "' data-BANNER_LAYOUT='" + bannerList[k]['BANNER_LAYOUT'] + "' data-BANNER_JUMP_FLAG='" + bannerList[k]['BANNER_JUMP_FLAG'] + "' data-STATUS='" + bannerList[k]['STATUS'] + "' data-NUM='" + bannerList[k]['NUM'] + "' data-BANNER_NAME='" + bannerList[k]['BANNER_NAME'] + "'>";
          html += "<img class='lazyload' data-original=" + this.URL.IMAGE_URL + bannerList[k]['BANNER_IMG'] + " >";
          html += "</div>";
        }

        $("#ajax_banner").empty().append(html);

        //插件_幻灯片
        // var swiper = new Swipe('.nbanner .swiper-container', {
        //   pagination: '.nbanner .swiper-pagination',
        //   autoplay: 2000,
        //   autoplayDisableOnInteraction: false,
        //   speed: 300,
        //   loop: true,
        //   longSwipesRatio: 0.1,

        // });

        new Swipe($('.nbanner .swiper-container')[0], {
          startSlide: 0,
          speed: 300,
          auto: 2000,
          continuous: true,
          disableScroll: false,
          stopPropagation: false,
          callback: function(index, elem) {

          },
          transitionEnd: function(index, elem) {}
        });

        //点击_幻灯片
        $(".nbanner .swiper-slide").click(function() {
          var SORT = $(this).attr("data-SORT");
          var BANNER_JUMP_ID = $(this).attr("data-BANNER_JUMP_ID");
          var BANNER_CONTENT = $(this).attr("data-BANNER_CONTENT");
          var BANNER_IMG = $(this).attr("data-BANNER_IMG");
          var ID = $(this).attr("data-ID");
          var BANNER_LAYOUT = $(this).attr("data-BANNER_LAYOUT");
          var BANNER_JUMP_FLAG = $(this).attr("data-BANNER_JUMP_FLAG");
          var STATUS = $(this).attr("data-STATUS");
          var NUM = $(this).attr("data-NUM");
          var BANNER_NAME = $(this).attr("data-BANNER_NAME");

          var jsonParams = {
            'funName': 'banner_item_fun',
            'params': {
              'SORT': SORT,
              'BANNER_JUMP_ID': BANNER_JUMP_ID,
              'BANNER_CONTENT': BANNER_CONTENT,
              'BANNER_IMG': BANNER_IMG,
              'ID': ID,
              'BANNER_LAYOUT': BANNER_LAYOUT,
              'BANNER_JUMP_FLAG': BANNER_JUMP_FLAG,
              'STATUS': STATUS,
              'NUM': NUM,
              'BANNER_NAME': BANNER_NAME
            }
          };
          LHHybrid.nativeFun(jsonParams);

        })
      },

      renderTagList: function(data) {
        var fastList_html = "";
        var fastList = data.fastList;

        for (var k = 0; k < fastList.length; k++) {

          fastList_html += "<a href='javascript:;' data-FAST_NAME='" + fastList[k]['FAST_NAME'] + "' data-ID='" + fastList[k]['ID'] + "' data-LINK_NAME='" + fastList[k]['LINK_NAME'] + "' data-FAST_IMG='" + fastList[k]['FAST_IMG'] + "'>";
          fastList_html += "<img class='lazyload' data-original=" + this.URL.IMAGE_URL + fastList[k]['FAST_IMG'] + " >";
          fastList_html += "<span>" + fastList[k]['FAST_NAME'] + "</span>";
          fastList_html += "</a>";
        }

        $("#ajax_fastList").empty().append(fastList_html);
        this.lazyload();

        //点击_标签
        $(".ntag a").click(function() {
          var FAST_NAME = $(this).attr("data-FAST_NAME");
          var ID = $(this).attr("data-ID");
          var LINK_NAME = $(this).attr("data-LINK_NAME");
          var FAST_IMG = $(this).attr("data-FAST_IMG");
          //console.log(funName,url);
          var jsonParams = {
            'funName': 'shortcut_fun',
            'params': {
              'FAST_NAME': FAST_NAME,
              'dID': ID,
              'LINK_NAME': LINK_NAME,
              'FAST_IMG': FAST_IMG
            }
          };
          LHHybrid.nativeFun(jsonParams);
        })
      },

      renderSecondkillList: function(data) {
        if (data.seckillList) {

          $(".nmiaosha,.nmiaosha_nhr").css("display", "block");
          var seckillList = data.seckillList;
          var ajax_REMARK = seckillList['REMARK'];
          $(".ajax_REMARK").empty().append(ajax_REMARK);

          if (seckillList['END_TIME']) {
            var endtime = Date.parse(new Date(seckillList['END_TIME']));
            endtime = endtime / 1000;
            var START_TIME = Date.parse(new Date(seckillList['START_TIME']));
            START_TIME = START_TIME / 1000;
            var current_Time = Date.parse(new Date(data.currentTime));
            current_Time = current_Time / 1000;
            this.juli = START_TIME - current_Time; //距离时间
            this.shengyu = endtime - current_Time; //距离时间
          }

          //加载_秒杀列表

          var COMMODITY_LIST_html = "";
          var COMMODITY_LIST = data.seckillList['COMMODITY_LIST'];
          if (COMMODITY_LIST) {
            $(".nmiaosha,.nmiaosha_nhr").css("display", "block");
            for (var k = 0; k < COMMODITY_LIST.length; k++) {
              var PRICE = String(COMMODITY_LIST[k]['GOODS_PRICE'].toString());
              var q = Math.floor(PRICE);
              var h = (PRICE).slice(-2);
              COMMODITY_LIST_html += "<a href='javascript:;' data-GOODS_IMG='" + COMMODITY_LIST[k]['GOODS_NAME'] + "'  data-GOODS_PRICE='" + COMMODITY_LIST[k]['GOODS_PRICE'] + "' data-PRICE='" + COMMODITY_LIST[k]['PRICE'] + "' data-GOODS_NAME='" + COMMODITY_LIST[k]['GOODS_NAME'] + "' data-STORE_ID='" + COMMODITY_LIST[k]['STORE_ID'] + "' data-GOODS_NO='" + COMMODITY_LIST[k]['GOODS_NO'] + "' data-GOODS_ID='" + COMMODITY_LIST[k]['GOODS_ID'] + "' data-DISCOUNT_TYPE='" + COMMODITY_LIST[k]['DISCOUNT_TYPE'] + "' data-DISCOUNT='" + COMMODITY_LIST[k]['DISCOUNT'] + "' data-NUM='" + COMMODITY_LIST[k]['NUM'] + "'>";
              COMMODITY_LIST_html += "<img class='lazyload' data-original=" + this.URL.IMAGE_URL + COMMODITY_LIST[k]['GOODS_IMG'] + " >";
              COMMODITY_LIST_html += "<title>" + COMMODITY_LIST[k]['GOODS_NAME'] + "</title>";
              COMMODITY_LIST_html += "<span>￥" + q + ".<em>" + h + "</em>" + "</span>";

              COMMODITY_LIST_html += "<del>￥" + COMMODITY_LIST[k]['ORIGINAL_PRICE'] + "</del>";

              COMMODITY_LIST_html += "</a>";
            }

            $("#ajax_seckillList").empty().append(COMMODITY_LIST_html);
            this.lazyload();
          }

        } else {
          $(".nmiaosha,.nmiaosha_nhr").css("display", "none");
        }
      },

      renderHotRecommendation: function(data) {
        var that = this;

        var html = "";
        var hotRecommendation = data.hotRecommendation;

        if (hotRecommendation && hotRecommendation.length > 0) {
          for (var k = 0; k < hotRecommendation.length; k++) {
            if (hotRecommendation[k]['TEMPLATE'] == 1) {
              html += "<div class='nindex_ad_one'><a href='javascript:;'  data-IMG_URL='" + hotRecommendation[k]['goods'][0].IMG_URL + "'  data-GOODS_ID='" + hotRecommendation[k]['goods'][0].GOODS_ID + "' data-ID='" + hotRecommendation[k]['ID'] + "'  data-TEMPLATE='" + hotRecommendation[k]['TEMPLATE'] + "'>";
              html += "<img  class='lazyload' data-original=" + that.URL.IMAGE_URL + hotRecommendation[k]['goods'][0].IMG_URL + " >";
              html += "</a></div>";
            }
            if (hotRecommendation[k]['TEMPLATE'] == 2) {
              html += "<div class='nindex_ad_two'>";
              for (var i = 0; i < hotRecommendation[k]['goods'].length; i++) {
                html += "<a href='javascript:;'  data-IMG_URL='" + hotRecommendation[k]['goods'][i].IMG_URL + "'  data-GOODS_ID='" + hotRecommendation[k]['goods'][i].GOODS_ID + "' data-ID='" + hotRecommendation[k]['ID'] + "'  data-TEMPLATE='" + hotRecommendation[k]['TEMPLATE'] + "'>";
                html += "<img  class='lazyload' data-original=" + that.URL.IMAGE_URL + hotRecommendation[k]['goods'][i].IMG_URL + " >";
                html += "</a>";
              }
              html += "</div>";
            }
            if (hotRecommendation[k]['TEMPLATE'] == 3) {
              html += "<div class='nindex_ad_three'>";
              for (var i = 0; i < hotRecommendation[k]['goods'].length; i++) {
                html += "<a href='javascript:;'  data-IMG_URL='" + hotRecommendation[k]['goods'][i].IMG_URL + "'  data-GOODS_ID='" + hotRecommendation[k]['goods'][i].GOODS_ID + "' data-ID='" + hotRecommendation[k]['ID'] + "'  data-TEMPLATE='" + hotRecommendation[k]['TEMPLATE'] + "'>";
                html += "<img  class='lazyload' data-original=" + that.URL.IMAGE_URL + hotRecommendation[k]['goods'][i].IMG_URL + " >";
                html += "</a>";
              }
              html += "</div>";
            }
          }

          $("#ajax_hotRecommendation").empty().append(html);
          this.lazyload();
        }


        $(".nindex_ad a").click(function() {
          var IMG_URL = $(this).attr("data-IMG_URL");
          var GOODS_ID = $(this).attr("data-GOODS_ID");
          var ID = $(this).attr("data-ID");
          var TEMPLATE = $(this).attr("data-TEMPLATE");
          var jsonParams = {
            'funName': 'hot_recommendation_fun',
            'params': {
              'IMG_URL': IMG_URL,
              'GOODS_ID': GOODS_ID,
              'ID': ID,
              'TEMPLATE': TEMPLATE
            }
          };
          LHHybrid.nativeFun(jsonParams);
        })
      },

      renderProductList: function(data) {
        var that = this;
        var html = "";
        var prommotionLayout = data.prommotionLayout;

        for (var k = 0; k < prommotionLayout.length; k++) {
          html += "<div class='ntuijian'><div class='ntuijian_top'><span><em>" + prommotionLayout[k]['PROMOTION_NAME'] + "</em></span></div>";

          html += "<div class='ntuijian_ad'><a href='javascript:;' data-id='" + prommotionLayout[k]['ID'] + "'   data-promotion_name='" + prommotionLayout[k]['PROMOTION_NAME'] + "'   data-detail_layout='" + prommotionLayout[k]['DETAIL_LAYOUT'] + "' class='prommotionLayout_ad'><img class='lazyload' data-original=" + that.URL.IMAGE_URL + prommotionLayout[k]['PROMOTION_BANNER'] + "></a></div>";

          html += "<div class='ntuijian_main'><div class='swiper-container' style=''><div class='swiper-wrapper'>";

          var prommotionLayout_detail = data.prommotionLayout[k]['goodsList'];

          for (var i = 0; i < prommotionLayout_detail.length; i++) {
            //var a= i+1;
            var PRICE = String(prommotionLayout_detail[i]['GOODS_PRICE'].toString());
            var q = Math.floor(PRICE);
            var h = (PRICE).slice(-2);

            html += "<a href='javascript:;'  data-GOODS_PRICE='" + prommotionLayout_detail[i]['GOODS_PRICE'] + "' data-GOODS_NAME='" + prommotionLayout_detail[i]['GOODS_NAME'] + "' data-STORE_ID='" + prommotionLayout_detail[i]['STORE_ID'] + "' data-GOODS_NO='" + prommotionLayout_detail[i]['GOODS_NO'] + "' data-GOODS_ID='" + prommotionLayout_detail[i]['ID'] + "' data-NUM='" + prommotionLayout_detail[i]['NUM'] + "' class='swiper-slide prommotionLayout_detail'>";
            html += "<img class='lazyload' data-original=" + that.URL.IMAGE_URL + prommotionLayout_detail[i]['GOODS_IMG'] + " >";
            html += "<title>" + prommotionLayout_detail[i]['GOODS_NAME'] + "</title>";
            html += "<span>￥" + q + ".<i>" + h + "</i>" + "</span>";
            html += "</a>";
          }
          html += "<a href='javascript:;' data-id='" + prommotionLayout[k]['ID'] + "' data-promotion_name='" + prommotionLayout[k]['PROMOTION_NAME'] + "'   data-detail_layout='" + prommotionLayout[k]['DETAIL_LAYOUT'] + "' class='swiper-slide prommotionLayout_detail_more'><img class='lazyload' data-original='images/more.jpg'></a></div></div></div>";


          html += "</div><div class='nhr'></div>";
        }

        $("#ajax_prommotionLayout").empty().append(html);

        this.lazyload();

        prommotionLayout_swiper();

        $(".prommotionLayout_ad,.prommotionLayout_detail_more").click(function() {
          var id = $(this).attr("data-id");
          var promotion_name = $(this).attr("data-promotion_name");
          var detail_layout = $(this).attr("data-detail_layout");
          var jsonParams = {
            'funName': 'promotion_more_fun',
            'params': {
              'id': id,
              'promotion_name': promotion_name,
              'detail_layout': detail_layout
            }
          };
          LHHybrid.nativeFun(jsonParams);
        })



        //商品
        $(".nmiaosha_main a,.prommotionLayout_detail").click(function() {

          var STORE_ID = $(this).attr("data-STORE_ID");
          var GOODS_NO = $(this).attr("data-GOODS_NO");
          var GOODS_ID = $(this).attr("data-GOODS_ID");
          var jsonParams = {
            'funName': 'good_detail_fun',
            'params': {
              'STORE_ID': STORE_ID,
              'GOODS_NO': GOODS_NO,
              'GOODS_ID': GOODS_ID
            }
          };
          LHHybrid.nativeFun(jsonParams);

        })
      },

      renderDiscovery: function(data) {
        var that = this;

        setTimeout(
          //发现

          function() {
            var html = "";
            var showList = data.showList;
            $(".nfaxian_top").empty();
            if (showList && showList.length > 0) {
              $(".ajax_nfaxian_top").prepend('<div class="nfaxian_top"><span><em>发现</em></span></div>');
            }

            for (var k = 0; k < showList.length; k++) {
              var type = showList[k]['TYPE'];
              if (type == 3) {
                html += "<div class=' nshow_list_video' data-id='" + showList[k]['ID'] + "' data-SHOW_FILE='" + showList[k]['SHOW_FILE'] + "' data-SHOW_GOODS_IDS='" + showList[k]['SHOW_GOODS_IDS'] + "' data-FACE_IMAGE_PATH='" + showList[k]['FACE_IMAGE_PATH'] + "' data-USER_ID='" + showList[k]['USER_ID'] + "' data-CREATE_TIME='" + showList[k]['CREATE_TIME'] + "' data-SHOW_IMG='" + showList[k]['SHOW_IMG'] + "' data-PHONE='" + showList[k]['PHONE'] + "' data-SPOTLIGHT_CIRCLE_ID='" + showList[k]['SPOTLIGHT_CIRCLE_ID'] + "' data-CIRCLE_NAME='" + showList[k]['CIRCLE_NAME'] + "' data-VIDEO_IMG='" + showList[k]['VIDEO_IMG'] + "' data-LIKENUM='" + showList[k]['LIKENUM'] + "' data-CONTENT='" + showList[k]['CONTENT'] + "' data-USER_NAME='" + showList[k]['USER_NAME'] + "' data-NUM='" + showList[k]['NUM'] + "' data-APPRAISENUM='" + showList[k]['APPRAISENUM'] + "' data-TYPE='" + showList[k]['TYPE'] + "'  data-TITLE='" + showList[k]['TITLE'] + "'>";
                html += "<div class=' nshow_listbox_video'><video class='myVideo' src=" + that.URL.IMAGE_URL + showList[k]['SHOW_FILE'] + " controls poster=" + that.URL.IMAGE_URL + showList[k]['VIDEO_IMG'] + "></video></div>"

              } else {


                html += "<div class='nshow_listbox' data-id='" + showList[k]['ID'] + "' data-SHOW_FILE='" + showList[k]['SHOW_FILE'] + "' data-SHOW_GOODS_IDS='" + showList[k]['SHOW_GOODS_IDS'] + "' data-FACE_IMAGE_PATH='" + showList[k]['FACE_IMAGE_PATH'] + "' data-USER_ID='" + showList[k]['USER_ID'] + "' data-CREATE_TIME='" + showList[k]['CREATE_TIME'] + "' data-SHOW_IMG='" + showList[k]['SHOW_IMG'].split(',')[0] + "' data-PHONE='" + showList[k]['PHONE'] + "' data-SPOTLIGHT_CIRCLE_ID='" + showList[k]['SPOTLIGHT_CIRCLE_ID'] + "' data-CIRCLE_NAME='" + showList[k]['CIRCLE_NAME'] + "' data-VIDEO_IMG='" + showList[k]['VIDEO_IMG'] + "' data-LIKENUM='" + showList[k]['LIKENUM'] + "' data-CONTENT='" + showList[k]['CONTENT'] + "' data-USER_NAME='" + showList[k]['USER_NAME'] + "' data-NUM='" + showList[k]['NUM'] + "' data-APPRAISENUM='" + showList[k]['APPRAISENUM'] + "' data-TYPE='" + showList[k]['TYPE'] + "'  data-TITLE='" + showList[k]['TITLE'] + "'>";
                html += "<a href='javascript:;' class='nshow_listbox_img'><img class='lazyload' data-original=" + that.URL.IMAGE_URL + showList[k]['SHOW_IMG'].split(',')[0] + "></a>"
              }

              html += "<div class='nshow_listbox_title ell'>" + showList[k]['TITLE'] + "</div>"

              if (showList[k]['FACE_IMAGE_PATH']) {
                html += "<div class='nshow_listmsg'><a class=''><img class='lazyload' data-original=" + that.URL.IMAGE_URL + showList[k]['FACE_IMAGE_PATH'] + "><span class='nshow_listmsg_name ell'>" + showList[k]['USER_NAME'] + "</span><span class='nshow_listmsg_time'>" + showList[k]['TIME'] + "发布于：" + "<b>" + showList[k]['CIRCLE_NAME'] + "</b>" + "</span>"
              } else {
                html += "<div class='nshow_listmsg'><a  class=''><img class='lazyload' data-original='images/Shortcut_114_114.png'><span class='nshow_listmsg_name ell'>" + showList[k]['USER_NAME'] + "</span><span class='nshow_listmsg_time'>" + showList[k]['TIME'] + "发布于：" + "<b>" + showList[k]['CIRCLE_NAME'] + "</b>" + "</span>"
              }

              html += "<div class='nshow_listmsg_zh'><i class='nshow_iconfont'>&#xe601;</i><span>" + showList[k]['LIKENUM'] + "</span></div>"
              html += "<div class='nshow_listmsg_pl'><i class='nshow_iconfont'>&#xe600;</i><span>" + showList[k]['APPRAISENUM'] + "</span></div>"
              html += "</a></div></div>";
            }

            $("#ajax_showList").empty().append(html);

            this.lazyload();

            $(".nshow_listbox").click(function() {
              var id = $(this).attr("data-id");
              var SHOW_FILE = $(this).attr("data-SHOW_FILE");
              var SHOW_GOODS_IDS = $(this).attr("data-SHOW_GOODS_IDS");
              var FACE_IMAGE_PATH = $(this).attr("data-FACE_IMAGE_PATH");
              var USER_ID = $(this).attr("data-USER_ID");
              var CREATE_TIME = $(this).attr("data-CREATE_TIME");
              var SHOW_IMG = $(this).attr("data-SHOW_IMG");
              var PHONE = $(this).attr("data-PHONE");
              var SPOTLIGHT_CIRCLE_ID = $(this).attr("data-SPOTLIGHT_CIRCLE_ID");
              var CIRCLE_NAME = $(this).attr("data-CIRCLE_NAME");
              var VIDEO_IMG = $(this).attr("data-VIDEO_IMG");
              var LIKENUM = $(this).attr("data-LIKENUM");
              var CONTENT = $(this).attr("data-CONTENT");
              var USER_NAME = $(this).attr("data-USER_NAME");
              var NUM = $(this).attr("data-NUM");
              var APPRAISENUM = $(this).attr("data-APPRAISENUM");
              var TYPE = $(this).attr("data-TYPE");
              var TITLE = $(this).attr("data-TITLE");
              var jsonParams = {
                'funName': 'show_detail_fun',
                'params': {
                  'ID': id,
                  'SHOW_FILE': SHOW_FILE,
                  'SHOW_GOODS_IDS': SHOW_GOODS_IDS,
                  'FACE_IMAGE_PATH': FACE_IMAGE_PATH,
                  'USER_ID': USER_ID,
                  'CREATE_TIME': CREATE_TIME,
                  'SHOW_IMG': SHOW_IMG,
                  'PHONE': PHONE,
                  'SPOTLIGHT_CIRCLE_ID': SPOTLIGHT_CIRCLE_ID,
                  'CIRCLE_NAME': CIRCLE_NAME,
                  'VIDEO_IMG': VIDEO_IMG,
                  'LIKENUM': LIKENUM,
                  'CONTENT': CONTENT,
                  'USER_NAME': USER_NAME,
                  'NUM': NUM,
                  'APPRAISENUM': APPRAISENUM,
                  'TYPE': TYPE,
                  'TITLE': TITLE,
                  'jsonParams': jsonParams
                }
              };
              LHHybrid.nativeFun(jsonParams);
            })


            $(".nshow_list_video .nshow_listbox_title,.nshow_list_video .nshow_listmsg").click(function() {
              var id = $(this).parent().attr("data-id");
              var SHOW_FILE = $(this).parent().attr("data-SHOW_FILE");
              var SHOW_GOODS_IDS = $(this).parent().attr("data-SHOW_GOODS_IDS");
              var FACE_IMAGE_PATH = $(this).parent().attr("data-FACE_IMAGE_PATH");
              var USER_ID = $(this).parent().attr("data-USER_ID");
              var CREATE_TIME = $(this).parent().attr("data-CREATE_TIME");
              var SHOW_IMG = $(this).parent().attr("data-SHOW_IMG");
              var PHONE = $(this).parent().attr("data-PHONE");
              var SPOTLIGHT_CIRCLE_ID = $(this).parent().attr("data-SPOTLIGHT_CIRCLE_ID");
              var CIRCLE_NAME = $(this).parent().attr("data-CIRCLE_NAME");
              var VIDEO_IMG = $(this).parent().attr("data-VIDEO_IMG");
              var LIKENUM = $(this).parent().attr("data-LIKENUM");
              var CONTENT = $(this).parent().attr("data-CONTENT");
              var USER_NAME = $(this).parent().attr("data-USER_NAME");
              var NUM = $(this).parent().attr("data-NUM");
              var APPRAISENUM = $(this).parent().attr("data-APPRAISENUM");
              var TYPE = $(this).parent().attr("data-TYPE");
              var TITLE = $(this).parent().attr("data-TITLE");
              var jsonParams = {
                'funName': 'show_detail_fun',
                'params': {
                  'ID': id,
                  'SHOW_FILE': SHOW_FILE,
                  'SHOW_GOODS_IDS': SHOW_GOODS_IDS,
                  'FACE_IMAGE_PATH': FACE_IMAGE_PATH,
                  'USER_ID': USER_ID,
                  'CREATE_TIME': CREATE_TIME,
                  'SHOW_IMG': SHOW_IMG,
                  'PHONE': PHONE,
                  'SPOTLIGHT_CIRCLE_ID': SPOTLIGHT_CIRCLE_ID,
                  'CIRCLE_NAME': CIRCLE_NAME,
                  'VIDEO_IMG': VIDEO_IMG,
                  'LIKENUM': LIKENUM,
                  'CONTENT': CONTENT,
                  'USER_NAME': USER_NAME,
                  'NUM': NUM,
                  'APPRAISENUM': APPRAISENUM,
                  'TYPE': TYPE,
                  'TITLE': TITLE,
                  'jsonParams': jsonParams
                }
              };
              LHHybrid.nativeFun(jsonParams);
            })



          }, 1500);

      },

      prommotionLayout_swiper: function() {
        var swiper = new Swiper('.ntuijian_main .swiper-container', {
          slidesPerView: 3,
          paginationClickable: true,
          spaceBetween: 8,
          freeMode: true
        });
      },

      bindScroll: function() {
        $(window).scroll(function() {
          var s = $(window).scrollTop();
          if (s > 100) {
            $(".nheader_cover").animate({
              opacity: 0.9
            });
            $(".nheader_cover").css({
              'border-bottom': '1px solid #d2d2d2'
            });
            $(".nindex_sousuo").animate({
              color: '#707070'
            });
            $(".nindex_sousuo").animate({
              background: 'rgba(238,238,238,.9)'
            });
            $(".nindex_shaomiao").css({
              'background-image': 'url(images/shaoyishao2.png)'
            });
            $(".nindex_sousuo em").css({
              'background-image': 'url(images/soshuo2.png)'
            });
            $(".nindex_xiaoxi").css({
              'background-image': 'url(images/xiaoxi2.png)'
            });

          } else {
            $(".nheader_cover").animate({
              opacity: 0
            });
            $(".nheader_cover").css({
              'border-bottom': '0px solid #d2d2d2'
            });
            $(".nindex_sousuo").animate({
              color: '#a0a0a0'
            });
            $(".nindex_sousuo").animate({
              background: 'rgba(255,255,255,.7)'
            });
            $(".nindex_shaomiao").css({
              'background-image': 'url(images/shaoyishao.png)'
            });
            $(".nindex_sousuo em").css({
              'background-image': 'url(images/soshuo.png)'
            });
            $(".nindex_xiaoxi").css({
              'background-image': 'url(images/xiaoxi.png)'
            });
          };
        });
      },

      countDown: function() {
        var hours;
        var minutes;
        var seconds;

        if (this.juli >= 0) {
          hours = Math.floor(this.juli / 3600);
          minutes = Math.floor((this.juli % 3600) / 60);
          seconds = Math.floor(this.juli % 60);

          if (hours < 10) hours = '0' + hours;
          if (minutes < 10) minutes = '0' + minutes;
          if (seconds < 10) seconds = '0' + seconds;

          $(".ajax_timetext").empty().append("距离开始");
          $(".getting-started").empty().append("<em>" + hours + "</em>:<em>" + minutes + "</em>:<em>" + seconds + "</em>");
          --this.juli;
        } else {
          hours = Math.floor(this.shengyu / 3600);
          minutes = Math.floor((this.shengyu % 3600) / 60);
          seconds = Math.floor(this.shengyu % 60);

          if (hours < 10) hours = '0' + hours;
          if (minutes < 10) minutes = '0' + minutes;
          if (seconds < 10) seconds = '0' + seconds;

          $(".ajax_timetext").empty().append("剩余");
          $(".ajax_REMARK").css("display", "inline-block");
          $(".getting-started").empty().append("<em>" + hours + "</em>:<em>" + minutes + "</em>:<em>" + seconds + "</em>");
          --this.shengyu;
        }

        if (this.shengyu < 0) {
          clearInterval(this.timer);
          $(".nmiaosha,.nmiaosha_nhr").css("display", "none");
        }
      }
    });
  });
define('lehu.h5.page.index', [
        'can',
        'zepto',
        'fastclick',
        'lehu.util',
        'lehu.h5.framework.comm',
        'lehu.h5.business.config',
        'lehu.env.switcher',
        'lehu.hybrid',

        'lehu.h5.component.index'
    ],

    function(can, $, Fastclick, util, LHFrameworkComm, LHConfig, LHSwitcher, LHHybrid,
        LHIndex) {
        

        Fastclick.attach(document.body);

        var Index = can.Control.extend({

            /**
             * [init 初始化]
             * @param  {[type]} element 元素
             * @param  {[type]} options 选项
             */
            init: function(element, options) {
                var index = new LHIndex("#index");
            }
        });

        new Index('#index');
    });

require(["lehu.h5.page.index"]);
