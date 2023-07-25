import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { createTextVNode, Fragment, Comment, isVNode, defineComponent, inject, ref, onMounted, onBeforeUnmount, onActivated, onDeactivated, provide, computed, onBeforeMount, watchEffect, h, Transition, TransitionGroup, toRef, mergeProps, watch, nextTick, vShow, withDirectives, cloneVNode, Text, useSSRContext, withCtx, unref, createVNode, vModelText, openBlock, createBlock, renderList, createCommentVNode, reactive, getCurrentInstance, onServerPrefetch, createElementBlock, toRefs, toDisplayString } from 'vue';
import { _ as _export_sfc } from './_plugin-vue_export-helper-cc2b3d55.mjs';
import { hash as hash$1 } from 'ohash';
import { b as useNuxtApp, c as createError } from '../server.mjs';
import { NButton, NSpace, NCheckbox, NModal, NCard } from 'naive-ui';
import { Star, Info, X } from 'lucide-vue-next';
import { useToast } from '@ark-ui/vue';
import { rgba, scaleColor, composite, getPreciseEventTarget, depx, getPadding, happensIn, changeColor } from 'seemly';
import { createIndexGetter, createTreeMate } from 'treemate';
import { resizeObserverManager, VResizeObserver, VirtualList, VFollower, VFocusTrap, VBinder, VTarget, VOverflow } from 'vueuc';
import { useMemo, useIsMounted, useIsIos, useMergedState, useCompitable } from 'vooks';
import { clickoutside, mousemoveoutside, zindexable } from 'vdirs';
import { CssRender, hash, exists } from 'css-render';
import { plugin as plugin$1 } from '@css-render/plugin-bem';
import { merge, upperFirst, map } from 'lodash-es';
import { useSsrAdapter } from '@css-render/vue3-ssr';
import { on, off } from 'evtd';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
import 'ufo';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'defu';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'klona';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'http-graceful-shutdown';

function keep(object, keys = [], rest) {
    const keepedObject = {};
    keys.forEach((key) => {
        keepedObject[key] = object[key];
    });
    return Object.assign(keepedObject, rest);
}

// o(n) flatten
function flatten(vNodes, filterCommentNode = true, result = []) {
    vNodes.forEach((vNode) => {
        if (vNode === null)
            return;
        if (typeof vNode !== 'object') {
            if (typeof vNode === 'string' || typeof vNode === 'number') {
                result.push(createTextVNode(String(vNode)));
            }
            return;
        }
        if (Array.isArray(vNode)) {
            flatten(vNode, filterCommentNode, result);
            return;
        }
        if (vNode.type === Fragment) {
            if (vNode.children === null)
                return;
            if (Array.isArray(vNode.children)) {
                flatten(vNode.children, filterCommentNode, result);
            }
            // rawSlot
        }
        else if (vNode.type !== Comment) {
            result.push(vNode);
        }
    });
    return result;
}

function call(funcs, ...args) {
    if (Array.isArray(funcs)) {
        funcs.forEach((func) => call(func, ...args));
    }
    else
        return funcs(...args);
}

const render = (r, ...args) => {
    if (typeof r === 'function') {
        return r(...args);
    }
    else if (typeof r === 'string') {
        return createTextVNode(r);
    }
    else if (typeof r === 'number') {
        return createTextVNode(String(r));
    }
    else {
        return null;
    }
};

function warn(location, message) {
    console.error(`[naive/${location}]: ${message}`);
}
function throwError(location, message) {
    throw new Error(`[naive/${location}]: ${message}`);
}

function getTitleAttribute(value) {
    switch (typeof value) {
        case 'string':
            // The empty string should also be reset to undefined.
            return value || undefined;
        case 'number':
            return String(value);
        default:
            return undefined;
    }
}

function getFirstSlotVNode(slots, slotName = 'default', props = undefined) {
    const slot = slots[slotName];
    if (!slot) {
        warn('getFirstSlotVNode', `slot[${slotName}] is empty`);
        return null;
    }
    const slotContent = flatten(slot(props));
    // vue will normalize the slot, so slot must be an array
    if (slotContent.length === 1) {
        return slotContent[0];
    }
    else {
        warn('getFirstSlotVNode', `slot[${slotName}] should have exactly one child`);
        return null;
    }
}

function createInjectionKey(key) {
    return key;
}

function ensureValidVNode(vnodes) {
    return vnodes.some((child) => {
        if (!isVNode(child)) {
            return true;
        }
        if (child.type === Comment) {
            return false;
        }
        if (child.type === Fragment &&
            !ensureValidVNode(child.children)) {
            return false;
        }
        return true;
    })
        ? vnodes
        : null;
}
/**
 * We shouldn't use the following functions with slot flags `_: 1, 2, 3`
 */
function resolveSlot(slot, fallback) {
    return (slot && ensureValidVNode(slot())) || fallback();
}
/**
 * Resolve slot with wrapper if content exists, no fallback
 */
function resolveWrappedSlot(slot, wrapper) {
    const children = slot && ensureValidVNode(slot());
    return wrapper(children || null);
}
function isSlotEmpty(slot) {
    return !(slot && ensureValidVNode(slot()));
}

function mergeEventHandlers(handlers) {
    const filteredHandlers = handlers.filter((handler) => handler !== undefined);
    if (filteredHandlers.length === 0)
        return undefined;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (filteredHandlers.length === 1)
        return filteredHandlers[0];
    return (e) => {
        handlers.forEach((handler) => {
            if (handler) {
                handler(e);
            }
        });
    };
}

const Wrapper = defineComponent({
    render() {
        var _a, _b;
        return (_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
});

const pureNumberRegex = /^(\d|\.)+$/;
const numberRegex = /(\d|\.)+/;
function formatLength(length, { c = 1, offset = 0, attachPx = true } = {}) {
    if (typeof length === 'number') {
        const result = (length + offset) * c;
        if (result === 0)
            return '0';
        return `${result}px`;
    }
    else if (typeof length === 'string') {
        if (pureNumberRegex.test(length)) {
            const result = (Number(length) + offset) * c;
            if (attachPx) {
                if (result === 0)
                    return '0';
                return `${result}px`;
            }
            else {
                return `${result}`;
            }
        }
        else {
            const result = numberRegex.exec(length);
            if (!result)
                return length;
            return length.replace(numberRegex, String((Number(result[0]) + offset) * c));
        }
    }
    return length;
}

function color2Class(color) {
    return color.replace(/#|\(|\)|,|\s/g, '_');
}

function createKey(prefix, suffix) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (prefix +
        (suffix === 'default'
            ? ''
            : suffix.replace(/^[a-z]/, (startChar) => startChar.toUpperCase())));
}
createKey('abc', 'def');

/* eslint-disable @typescript-eslint/restrict-template-expressions */
const namespace = 'n';
const prefix = `.${namespace}-`;
const elementPrefix = '__';
const modifierPrefix = '--';
const cssr = CssRender();
const plugin = plugin$1({
    blockPrefix: prefix,
    elementPrefix,
    modifierPrefix
});
cssr.use(plugin);
const { c, find } = cssr;
const { cB, cE, cM, cNotM } = plugin;
// child block
const cCB = ((...args) => {
    return c('>', [cB(...args)]);
});

let _isJsdom;
function isJsdom() {
    if (_isJsdom === undefined) {
        _isJsdom =
            navigator.userAgent.includes('Node.js') ||
                navigator.userAgent.includes('jsdom');
    }
    return _isJsdom;
}

const isBrowser = typeof document !== 'undefined' && "undefined" !== 'undefined';

const eventSet = new WeakSet();
function markEventEffectPerformed(event) {
    eventSet.add(event);
}

const internalSelectionMenuInjectionKey = createInjectionKey('n-internal-select-menu');
const internalSelectionMenuBodyInjectionKey = createInjectionKey('n-internal-select-menu-body');

const modalBodyInjectionKey = createInjectionKey('n-modal-body');

const drawerBodyInjectionKey = createInjectionKey('n-drawer-body');

const popoverBodyInjectionKey = createInjectionKey('n-popover-body');

const teleportDisabled = '__disabled__';
function useAdjustedTo(props) {
    const modal = inject(modalBodyInjectionKey, null);
    const drawer = inject(drawerBodyInjectionKey, null);
    const popover = inject(popoverBodyInjectionKey, null);
    const selectMenu = inject(internalSelectionMenuBodyInjectionKey, null);
    const fullscreenElementRef = ref();
    if (typeof document !== 'undefined') {
        fullscreenElementRef.value = document.fullscreenElement;
        const handleFullscreenChange = () => {
            fullscreenElementRef.value = document.fullscreenElement;
        };
        onMounted(() => {
            on('fullscreenchange', document, handleFullscreenChange);
        });
        onBeforeUnmount(() => {
            off('fullscreenchange', document, handleFullscreenChange);
        });
    }
    return useMemo(() => {
        var _a;
        const { to } = props;
        if (to !== undefined) {
            if (to === false)
                return teleportDisabled;
            if (to === true)
                return fullscreenElementRef.value || 'body';
            return to;
        }
        if (modal === null || modal === void 0 ? void 0 : modal.value) {
            return (_a = modal.value.$el) !== null && _a !== void 0 ? _a : modal.value;
        }
        if (drawer === null || drawer === void 0 ? void 0 : drawer.value)
            return drawer.value;
        if (popover === null || popover === void 0 ? void 0 : popover.value)
            return popover.value;
        if (selectMenu === null || selectMenu === void 0 ? void 0 : selectMenu.value)
            return selectMenu.value;
        return to !== null && to !== void 0 ? to : (fullscreenElementRef.value || 'body');
    });
}
// teleport disabled key
useAdjustedTo.tdkey = teleportDisabled;
useAdjustedTo.propTo = {
    type: [String, Object, Boolean],
    default: undefined
};

function useOnResize(elRef, onResize) {
    // it needn't be reactive since it's for internal usage
    if (onResize) {
        onMounted(() => {
            const { value: el } = elRef;
            if (el) {
                resizeObserverManager.registerHandler(el, onResize);
            }
        });
        onBeforeUnmount(() => {
            const { value: el } = elRef;
            if (el) {
                resizeObserverManager.unregisterHandler(el);
            }
        });
    }
}

function useReactivated(callback) {
    const isDeactivatedRef = { isDeactivated: false };
    let activateStateInitialized = false;
    onActivated(() => {
        isDeactivatedRef.isDeactivated = false;
        if (!activateStateInitialized) {
            activateStateInitialized = true;
            return;
        }
        callback();
    });
    onDeactivated(() => {
        isDeactivatedRef.isDeactivated = true;
        if (!activateStateInitialized) {
            activateStateInitialized = true;
        }
    });
    return isDeactivatedRef;
}

const formItemInjectionKey = createInjectionKey('n-form-item');
function useFormItem(props, { defaultSize = 'medium', mergedSize, mergedDisabled } = {}) {
    const NFormItem = inject(formItemInjectionKey, null);
    provide(formItemInjectionKey, null);
    const mergedSizeRef = computed(mergedSize
        ? () => mergedSize(NFormItem)
        : () => {
            const { size } = props;
            if (size)
                return size;
            if (NFormItem) {
                const { mergedSize } = NFormItem;
                if (mergedSize.value !== undefined) {
                    return mergedSize.value;
                }
            }
            return defaultSize;
        });
    const mergedDisabledRef = computed(mergedDisabled
        ? () => mergedDisabled(NFormItem)
        : () => {
            const { disabled } = props;
            if (disabled !== undefined) {
                return disabled;
            }
            if (NFormItem) {
                return NFormItem.disabled.value;
            }
            return false;
        });
    const mergedStatusRef = computed(() => {
        const { status } = props;
        if (status)
            return status;
        return NFormItem === null || NFormItem === void 0 ? void 0 : NFormItem.mergedValidationStatus.value;
    });
    onBeforeUnmount(() => {
        if (NFormItem) {
            NFormItem.restoreValidation();
        }
    });
    return {
        mergedSizeRef,
        mergedDisabledRef,
        mergedStatusRef,
        nTriggerFormBlur() {
            if (NFormItem) {
                NFormItem.handleContentBlur();
            }
        },
        nTriggerFormChange() {
            if (NFormItem) {
                NFormItem.handleContentChange();
            }
        },
        nTriggerFormFocus() {
            if (NFormItem) {
                NFormItem.handleContentFocus();
            }
        },
        nTriggerFormInput() {
            if (NFormItem) {
                NFormItem.handleContentInput();
            }
        }
    };
}

const commonVariables$4 = {
    fontFamily: 'v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    fontFamilyMono: 'v-mono, SFMono-Regular, Menlo, Consolas, Courier, monospace',
    fontWeight: '400',
    fontWeightStrong: '500',
    cubicBezierEaseInOut: 'cubic-bezier(.4, 0, .2, 1)',
    cubicBezierEaseOut: 'cubic-bezier(0, 0, .2, 1)',
    cubicBezierEaseIn: 'cubic-bezier(.4, 0, 1, 1)',
    borderRadius: '3px',
    borderRadiusSmall: '2px',
    fontSize: '14px',
    fontSizeMini: '12px',
    fontSizeTiny: '12px',
    fontSizeSmall: '14px',
    fontSizeMedium: '14px',
    fontSizeLarge: '15px',
    fontSizeHuge: '16px',
    lineHeight: '1.6',
    heightMini: '16px',
    heightTiny: '22px',
    heightSmall: '28px',
    heightMedium: '34px',
    heightLarge: '40px',
    heightHuge: '46px'
};

const {
  fontSize,
  fontFamily,
  lineHeight
} = commonVariables$4;
// All the components need the style
// It is static and won't be changed in the app's lifetime
// If user want to overrides it they need to use `n-global-style` is provided
//
// Technically we can remove font-size & font-family & line-height to make
// it pure. However the coding cost doesn't worth it.
//
// -webkit-tap-hilight-color:
// https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-tap-highlight-color
// In some android devices, there will be the style.
const globalStyle = c('body', `
 margin: 0;
 font-size: ${fontSize};
 font-family: ${fontFamily};
 line-height: ${lineHeight};
 -webkit-text-size-adjust: 100%;
 -webkit-tap-highlight-color: transparent;
`, [c('input', `
 font-family: inherit;
 font-size: inherit;
 `)]);

const configProviderInjectionKey = createInjectionKey('n-config-provider');

const cssrAnchorMetaName = 'naive-ui-style';

/* eslint-disable @typescript-eslint/consistent-type-assertions */
function createTheme(theme) {
    return theme;
}
function useTheme(resolveId, mountId, style, defaultTheme, props, clsPrefixRef) {
    const ssrAdapter = useSsrAdapter();
    const NConfigProvider = inject(configProviderInjectionKey, null);
    if (style) {
        const mountStyle = () => {
            const clsPrefix = clsPrefixRef === null || clsPrefixRef === void 0 ? void 0 : clsPrefixRef.value;
            style.mount({
                id: clsPrefix === undefined ? mountId : clsPrefix + mountId,
                head: true,
                props: {
                    bPrefix: clsPrefix ? `.${clsPrefix}-` : undefined
                },
                anchorMetaName: cssrAnchorMetaName,
                ssr: ssrAdapter
            });
            if (!(NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.preflightStyleDisabled)) {
                globalStyle.mount({
                    id: 'n-global',
                    head: true,
                    anchorMetaName: cssrAnchorMetaName,
                    ssr: ssrAdapter
                });
            }
        };
        if (ssrAdapter) {
            mountStyle();
        }
        else {
            onBeforeMount(mountStyle);
        }
    }
    const mergedThemeRef = computed(() => {
        var _a;
        // keep props to make theme overrideable
        const { theme: { common: selfCommon, self, peers = {} } = {}, themeOverrides: selfOverrides = {}, builtinThemeOverrides: builtinOverrides = {} } = props;
        const { common: selfCommonOverrides, peers: peersOverrides } = selfOverrides;
        const { common: globalCommon = undefined, [resolveId]: { common: globalSelfCommon = undefined, self: globalSelf = undefined, peers: globalPeers = {} } = {} } = (NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedThemeRef.value) || {};
        const { common: globalCommonOverrides = undefined, [resolveId]: globalSelfOverrides = {} } = (NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedThemeOverridesRef.value) || {};
        const { common: globalSelfCommonOverrides, peers: globalPeersOverrides = {} } = globalSelfOverrides;
        const mergedCommon = merge({}, selfCommon || globalSelfCommon || globalCommon || defaultTheme.common, globalCommonOverrides, globalSelfCommonOverrides, selfCommonOverrides);
        const mergedSelf = merge(
        // {}, executed every time, no need for empty obj
        (_a = (self || globalSelf || defaultTheme.self)) === null || _a === void 0 ? void 0 : _a(mergedCommon), builtinOverrides, globalSelfOverrides, selfOverrides);
        return {
            common: mergedCommon,
            self: mergedSelf,
            peers: merge({}, defaultTheme.peers, globalPeers, peers),
            peerOverrides: merge({}, builtinOverrides.peers, globalPeersOverrides, peersOverrides)
        };
    });
    return mergedThemeRef;
}
useTheme.props = {
    theme: Object,
    themeOverrides: Object,
    builtinThemeOverrides: Object
};

const defaultClsPrefix = 'n';
function useConfig(props = {}, options = {
    defaultBordered: true
}) {
    const NConfigProvider = inject(configProviderInjectionKey, null);
    return {
        // NConfigProvider,
        inlineThemeDisabled: NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.inlineThemeDisabled,
        mergedRtlRef: NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedRtlRef,
        mergedComponentPropsRef: NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedComponentPropsRef,
        mergedBreakpointsRef: NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedBreakpointsRef,
        mergedBorderedRef: computed(() => {
            var _a, _b;
            const { bordered } = props;
            if (bordered !== undefined)
                return bordered;
            return ((_b = (_a = NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedBorderedRef.value) !== null && _a !== void 0 ? _a : options.defaultBordered) !== null && _b !== void 0 ? _b : true);
        }),
        mergedClsPrefixRef: computed(() => {
            const clsPrefix = NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedClsPrefixRef.value;
            return clsPrefix || defaultClsPrefix;
        }),
        namespaceRef: computed(() => NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedNamespaceRef.value)
    };
}

const enUS = {
    name: 'en-US',
    global: {
        undo: 'Undo',
        redo: 'Redo',
        confirm: 'Confirm',
        clear: 'Clear'
    },
    Popconfirm: {
        positiveText: 'Confirm',
        negativeText: 'Cancel'
    },
    Cascader: {
        placeholder: 'Please Select',
        loading: 'Loading',
        loadingRequiredMessage: (label) => `Please load all ${label}'s descendants before checking it.`
    },
    Time: {
        dateFormat: 'yyyy-MM-dd',
        dateTimeFormat: 'yyyy-MM-dd HH:mm:ss'
    },
    DatePicker: {
        yearFormat: 'yyyy',
        monthFormat: 'MMM',
        dayFormat: 'eeeeee',
        yearTypeFormat: 'yyyy',
        monthTypeFormat: 'yyyy-MM',
        dateFormat: 'yyyy-MM-dd',
        dateTimeFormat: 'yyyy-MM-dd HH:mm:ss',
        quarterFormat: 'yyyy-qqq',
        clear: 'Clear',
        now: 'Now',
        confirm: 'Confirm',
        selectTime: 'Select Time',
        selectDate: 'Select Date',
        datePlaceholder: 'Select Date',
        datetimePlaceholder: 'Select Date and Time',
        monthPlaceholder: 'Select Month',
        yearPlaceholder: 'Select Year',
        quarterPlaceholder: 'Select Quarter',
        startDatePlaceholder: 'Start Date',
        endDatePlaceholder: 'End Date',
        startDatetimePlaceholder: 'Start Date and Time',
        endDatetimePlaceholder: 'End Date and Time',
        startMonthPlaceholder: 'Start Month',
        endMonthPlaceholder: 'End Month',
        monthBeforeYear: true,
        firstDayOfWeek: 6,
        today: 'Today'
    },
    DataTable: {
        checkTableAll: 'Select all in the table',
        uncheckTableAll: 'Unselect all in the table',
        confirm: 'Confirm',
        clear: 'Clear'
    },
    LegacyTransfer: {
        sourceTitle: 'Source',
        targetTitle: 'Target'
    },
    Transfer: {
        selectAll: 'Select all',
        unselectAll: 'Unselect all',
        clearAll: 'Clear',
        total: (num) => `Total ${num} items`,
        selected: (num) => `${num} items selected`
    },
    Empty: {
        description: 'No Data'
    },
    Select: {
        placeholder: 'Please Select'
    },
    TimePicker: {
        placeholder: 'Select Time',
        positiveText: 'OK',
        negativeText: 'Cancel',
        now: 'Now'
    },
    Pagination: {
        goto: 'Goto',
        selectionSuffix: 'page'
    },
    DynamicTags: {
        add: 'Add'
    },
    Log: {
        loading: 'Loading'
    },
    Input: {
        placeholder: 'Please Input'
    },
    InputNumber: {
        placeholder: 'Please Input'
    },
    DynamicInput: {
        create: 'Create'
    },
    ThemeEditor: {
        title: 'Theme Editor',
        clearAllVars: 'Clear All Variables',
        clearSearch: 'Clear Search',
        filterCompName: 'Filter Component Name',
        filterVarName: 'Filter Variable Name',
        import: 'Import',
        export: 'Export',
        restore: 'Reset to Default'
    },
    Image: {
        tipPrevious: 'Previous picture (←)',
        tipNext: 'Next picture (→)',
        tipCounterclockwise: 'Counterclockwise',
        tipClockwise: 'Clockwise',
        tipZoomOut: 'Zoom out',
        tipZoomIn: 'Zoom in',
        tipClose: 'Close (Esc)',
        // TODO: translation
        tipOriginalSize: 'Zoom to original size'
    }
};
const enUS$1 = enUS;

function buildFormatLongFn(args) {
  return function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // TODO: Remove String()
    var width = options.width ? String(options.width) : args.defaultWidth;
    var format = args.formats[width] || args.formats[args.defaultWidth];
    return format;
  };
}

function buildLocalizeFn(args) {
  return function (dirtyIndex, options) {
    var context = options !== null && options !== void 0 && options.context ? String(options.context) : 'standalone';
    var valuesArray;
    if (context === 'formatting' && args.formattingValues) {
      var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      var width = options !== null && options !== void 0 && options.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      var _defaultWidth = args.defaultWidth;
      var _width = options !== null && options !== void 0 && options.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[_width] || args.values[_defaultWidth];
    }
    var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
    // @ts-ignore: For some reason TypeScript just don't want to match it, no matter how hard we try. I challenge you to try to remove it!
    return valuesArray[index];
  };
}

function buildMatchFn(args) {
  return function (string) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var width = options.width;
    var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    var matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    var matchedString = matchResult[0];
    var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    var key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, function (pattern) {
      return pattern.test(matchedString);
    }) : findKey(parsePatterns, function (pattern) {
      return pattern.test(matchedString);
    });
    var value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value: value,
      rest: rest
    };
  };
}
function findKey(object, predicate) {
  for (var key in object) {
    if (object.hasOwnProperty(key) && predicate(object[key])) {
      return key;
    }
  }
  return undefined;
}
function findIndex(array, predicate) {
  for (var key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return undefined;
}

function buildMatchPatternFn(args) {
  return function (string) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    var matchedString = matchResult[0];
    var parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value: value,
      rest: rest
    };
  };
}

var formatDistanceLocale = {
  lessThanXSeconds: {
    one: 'less than a second',
    other: 'less than {{count}} seconds'
  },
  xSeconds: {
    one: '1 second',
    other: '{{count}} seconds'
  },
  halfAMinute: 'half a minute',
  lessThanXMinutes: {
    one: 'less than a minute',
    other: 'less than {{count}} minutes'
  },
  xMinutes: {
    one: '1 minute',
    other: '{{count}} minutes'
  },
  aboutXHours: {
    one: 'about 1 hour',
    other: 'about {{count}} hours'
  },
  xHours: {
    one: '1 hour',
    other: '{{count}} hours'
  },
  xDays: {
    one: '1 day',
    other: '{{count}} days'
  },
  aboutXWeeks: {
    one: 'about 1 week',
    other: 'about {{count}} weeks'
  },
  xWeeks: {
    one: '1 week',
    other: '{{count}} weeks'
  },
  aboutXMonths: {
    one: 'about 1 month',
    other: 'about {{count}} months'
  },
  xMonths: {
    one: '1 month',
    other: '{{count}} months'
  },
  aboutXYears: {
    one: 'about 1 year',
    other: 'about {{count}} years'
  },
  xYears: {
    one: '1 year',
    other: '{{count}} years'
  },
  overXYears: {
    one: 'over 1 year',
    other: 'over {{count}} years'
  },
  almostXYears: {
    one: 'almost 1 year',
    other: 'almost {{count}} years'
  }
};
var formatDistance = function formatDistance(token, count, options) {
  var result;
  var tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === 'string') {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace('{{count}}', count.toString());
  }
  if (options !== null && options !== void 0 && options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return 'in ' + result;
    } else {
      return result + ' ago';
    }
  }
  return result;
};
const formatDistance$1 = formatDistance;

var dateFormats = {
  full: 'EEEE, MMMM do, y',
  long: 'MMMM do, y',
  medium: 'MMM d, y',
  short: 'MM/dd/yyyy'
};
var timeFormats = {
  full: 'h:mm:ss a zzzz',
  long: 'h:mm:ss a z',
  medium: 'h:mm:ss a',
  short: 'h:mm a'
};
var dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: '{{date}}, {{time}}',
  short: '{{date}}, {{time}}'
};
var formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: 'full'
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: 'full'
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: 'full'
  })
};
const formatLong$1 = formatLong;

var formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: 'P'
};
var formatRelative = function formatRelative(token, _date, _baseDate, _options) {
  return formatRelativeLocale[token];
};
const formatRelative$1 = formatRelative;

var eraValues = {
  narrow: ['B', 'A'],
  abbreviated: ['BC', 'AD'],
  wide: ['Before Christ', 'Anno Domini']
};
var quarterValues = {
  narrow: ['1', '2', '3', '4'],
  abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
  wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter']
};

// Note: in English, the names of days of the week and months are capitalized.
// If you are making a new locale based on this one, check if the same is true for the language you're working on.
// Generally, formatted dates should look like they are in the middle of a sentence,
// e.g. in Spanish language the weekdays and months should be in the lowercase.
var monthValues = {
  narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};
var dayValues = {
  narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
};
var dayPeriodValues = {
  narrow: {
    am: 'a',
    pm: 'p',
    midnight: 'mi',
    noon: 'n',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  },
  abbreviated: {
    am: 'AM',
    pm: 'PM',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  },
  wide: {
    am: 'a.m.',
    pm: 'p.m.',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  }
};
var formattingDayPeriodValues = {
  narrow: {
    am: 'a',
    pm: 'p',
    midnight: 'mi',
    noon: 'n',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  },
  abbreviated: {
    am: 'AM',
    pm: 'PM',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  },
  wide: {
    am: 'a.m.',
    pm: 'p.m.',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  }
};
var ordinalNumber = function ordinalNumber(dirtyNumber, _options) {
  var number = Number(dirtyNumber);

  // If ordinal numbers depend on context, for example,
  // if they are different for different grammatical genders,
  // use `options.unit`.
  //
  // `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
  // 'day', 'hour', 'minute', 'second'.

  var rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + 'st';
      case 2:
        return number + 'nd';
      case 3:
        return number + 'rd';
    }
  }
  return number + 'th';
};
var localize = {
  ordinalNumber: ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: 'wide'
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: 'wide',
    argumentCallback: function argumentCallback(quarter) {
      return quarter - 1;
    }
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: 'wide'
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: 'wide'
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: 'wide',
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: 'wide'
  })
};
const localize$1 = localize;

var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern = /\d+/i;
var matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
var parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
var parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
  narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
  any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
};
var matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: function valueCallback(value) {
      return parseInt(value, 10);
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseEraPatterns,
    defaultParseWidth: 'any'
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: 'any',
    valueCallback: function valueCallback(index) {
      return index + 1;
    }
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: 'any'
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseDayPatterns,
    defaultParseWidth: 'any'
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: 'any',
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: 'any'
  })
};
const match$1 = match;

/**
 * @type {Locale}
 * @category Locales
 * @summary English locale (United States).
 * @language English
 * @iso-639-2 eng
 * @author Sasha Koss [@kossnocorp]{@link https://github.com/kossnocorp}
 * @author Lesha Koss [@leshakoss]{@link https://github.com/leshakoss}
 */
var locale = {
  code: 'en-US',
  formatDistance: formatDistance$1,
  formatLong: formatLong$1,
  formatRelative: formatRelative$1,
  localize: localize$1,
  match: match$1,
  options: {
    weekStartsOn: 0 /* Sunday */,
    firstWeekContainsDate: 1
  }
};
const defaultLocale = locale;

const dateEnUs = {
    name: 'en-US',
    locale: defaultLocale
};
const dateEnUS = dateEnUs;

function useLocale(ns) {
    const { mergedLocaleRef, mergedDateLocaleRef } = inject(configProviderInjectionKey, null) || {};
    const localeRef = computed(() => {
        var _a, _b;
        return (_b = (_a = mergedLocaleRef === null || mergedLocaleRef === void 0 ? void 0 : mergedLocaleRef.value) === null || _a === void 0 ? void 0 : _a[ns]) !== null && _b !== void 0 ? _b : enUS$1[ns];
    });
    const dateLocaleRef = computed(() => {
        var _a;
        return (_a = mergedDateLocaleRef === null || mergedDateLocaleRef === void 0 ? void 0 : mergedDateLocaleRef.value) !== null && _a !== void 0 ? _a : dateEnUS;
    });
    return {
        dateLocaleRef,
        localeRef
    };
}

function useStyle(mountId, style, clsPrefixRef) {
    if (!style) {
        return;
    }
    const ssrAdapter = useSsrAdapter();
    const NConfigProvider = inject(configProviderInjectionKey, null);
    const mountStyle = () => {
        const clsPrefix = clsPrefixRef === null || clsPrefixRef === void 0 ? void 0 : clsPrefixRef.value;
        style.mount({
            id: clsPrefix === undefined ? mountId : clsPrefix + mountId,
            head: true,
            anchorMetaName: cssrAnchorMetaName,
            props: {
                bPrefix: clsPrefix ? `.${clsPrefix}-` : undefined
            },
            ssr: ssrAdapter
        });
        if (!(NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.preflightStyleDisabled)) {
            globalStyle.mount({
                id: 'n-global',
                head: true,
                anchorMetaName: cssrAnchorMetaName,
                ssr: ssrAdapter
            });
        }
    };
    if (ssrAdapter) {
        mountStyle();
    }
    else {
        onBeforeMount(mountStyle);
    }
}

function useThemeClass(componentName, hashRef, cssVarsRef, props) {
    var _a;
    if (!cssVarsRef)
        throwError('useThemeClass', 'cssVarsRef is not passed');
    const mergedThemeHashRef = (_a = inject(configProviderInjectionKey, null)) === null || _a === void 0 ? void 0 : _a.mergedThemeHashRef;
    const themeClassRef = ref('');
    const ssrAdapter = useSsrAdapter();
    let renderCallback;
    const hashClassPrefix = `__${componentName}`;
    const mountStyle = () => {
        let finalThemeHash = hashClassPrefix;
        const hashValue = hashRef ? hashRef.value : undefined;
        const themeHash = mergedThemeHashRef === null || mergedThemeHashRef === void 0 ? void 0 : mergedThemeHashRef.value;
        if (themeHash)
            finalThemeHash += '-' + themeHash;
        if (hashValue)
            finalThemeHash += '-' + hashValue;
        const { themeOverrides, builtinThemeOverrides } = props;
        if (themeOverrides) {
            finalThemeHash += '-' + hash(JSON.stringify(themeOverrides));
        }
        if (builtinThemeOverrides) {
            finalThemeHash += '-' + hash(JSON.stringify(builtinThemeOverrides));
        }
        themeClassRef.value = finalThemeHash;
        renderCallback = () => {
            const cssVars = cssVarsRef.value;
            let style = '';
            for (const key in cssVars) {
                style += `${key}: ${cssVars[key]};`;
            }
            c(`.${finalThemeHash}`, style).mount({
                id: finalThemeHash,
                ssr: ssrAdapter
            });
            renderCallback = undefined;
        };
    };
    watchEffect(() => {
        mountStyle();
    });
    return {
        themeClass: themeClassRef,
        onRender: () => {
            renderCallback === null || renderCallback === void 0 ? void 0 : renderCallback();
        }
    };
}

function useRtl(mountId, rtlStateRef, clsPrefixRef) {
    if (!rtlStateRef)
        return undefined;
    const ssrAdapter = useSsrAdapter();
    const componentRtlStateRef = computed(() => {
        const { value: rtlState } = rtlStateRef;
        if (!rtlState) {
            return undefined;
        }
        const componentRtlState = rtlState[mountId];
        if (!componentRtlState) {
            return undefined;
        }
        return componentRtlState;
    });
    const mountStyle = () => {
        watchEffect(() => {
            const { value: clsPrefix } = clsPrefixRef;
            const id = `${clsPrefix}${mountId}Rtl`;
            // if it already exists, we only need to watch clsPrefix, although in most
            // of time it's unnecessary... However we can at least listen less
            // handlers, which is great.
            if (exists(id, ssrAdapter))
                return;
            const { value: componentRtlState } = componentRtlStateRef;
            if (!componentRtlState)
                return;
            componentRtlState.style.mount({
                id,
                head: true,
                anchorMetaName: cssrAnchorMetaName,
                props: {
                    bPrefix: clsPrefix ? `.${clsPrefix}-` : undefined
                },
                ssr: ssrAdapter
            });
        });
    };
    if (ssrAdapter) {
        mountStyle();
    }
    else {
        onBeforeMount(mountStyle);
    }
    return componentRtlStateRef;
}

const NIconSwitchTransition = defineComponent({
    name: 'BaseIconSwitchTransition',
    setup(_, { slots }) {
        const isMountedRef = useIsMounted();
        return () => (h(Transition, { name: "icon-switch-transition", appear: isMountedRef.value }, slots));
    }
});

const NFadeInExpandTransition = defineComponent({
    name: 'FadeInExpandTransition',
    props: {
        appear: Boolean,
        group: Boolean,
        mode: String,
        onLeave: Function,
        onAfterLeave: Function,
        onAfterEnter: Function,
        width: Boolean,
        // reverse mode is only used in tree
        // it make it from expanded to collapsed after mounted
        reverse: Boolean
    },
    setup(props, { slots }) {
        function handleBeforeLeave(el) {
            if (props.width) {
                el.style.maxWidth = `${el.offsetWidth}px`;
            }
            else {
                el.style.maxHeight = `${el.offsetHeight}px`;
            }
            void el.offsetWidth;
        }
        function handleLeave(el) {
            if (props.width) {
                el.style.maxWidth = '0';
            }
            else {
                el.style.maxHeight = '0';
            }
            void el.offsetWidth;
            const { onLeave } = props;
            if (onLeave)
                onLeave();
        }
        function handleAfterLeave(el) {
            if (props.width) {
                el.style.maxWidth = '';
            }
            else {
                el.style.maxHeight = '';
            }
            const { onAfterLeave } = props;
            if (onAfterLeave)
                onAfterLeave();
        }
        function handleEnter(el) {
            el.style.transition = 'none';
            if (props.width) {
                const memorizedWidth = el.offsetWidth;
                el.style.maxWidth = '0';
                void el.offsetWidth;
                el.style.transition = '';
                el.style.maxWidth = `${memorizedWidth}px`;
            }
            else {
                if (props.reverse) {
                    el.style.maxHeight = `${el.offsetHeight}px`;
                    void el.offsetHeight;
                    el.style.transition = '';
                    el.style.maxHeight = '0';
                }
                else {
                    const memorizedHeight = el.offsetHeight;
                    el.style.maxHeight = '0';
                    void el.offsetWidth;
                    el.style.transition = '';
                    el.style.maxHeight = `${memorizedHeight}px`;
                }
            }
            void el.offsetWidth;
        }
        function handleAfterEnter(el) {
            var _a;
            if (props.width) {
                el.style.maxWidth = '';
            }
            else {
                if (!props.reverse) {
                    el.style.maxHeight = '';
                }
            }
            (_a = props.onAfterEnter) === null || _a === void 0 ? void 0 : _a.call(props);
        }
        return () => {
            const { group, width, appear, mode } = props;
            const type = group ? TransitionGroup : Transition;
            const resolvedProps = {
                name: width
                    ? 'fade-in-width-expand-transition'
                    : 'fade-in-height-expand-transition',
                appear,
                onEnter: handleEnter,
                onAfterEnter: handleAfterEnter,
                onBeforeLeave: handleBeforeLeave,
                onLeave: handleLeave,
                onAfterLeave: handleAfterLeave
            };
            if (!group) {
                resolvedProps.mode = mode;
            }
            return h(type, resolvedProps, slots);
        };
    }
});

const style$c = cB('base-icon', `
 height: 1em;
 width: 1em;
 line-height: 1em;
 text-align: center;
 display: inline-block;
 position: relative;
 fill: currentColor;
 transform: translateZ(0);
`, [c('svg', `
 height: 1em;
 width: 1em;
 `)]);

const NBaseIcon = defineComponent({
    name: 'BaseIcon',
    props: {
        role: String,
        ariaLabel: String,
        ariaDisabled: {
            type: Boolean,
            default: undefined
        },
        ariaHidden: {
            type: Boolean,
            default: undefined
        },
        clsPrefix: {
            type: String,
            required: true
        },
        onClick: Function,
        onMousedown: Function,
        onMouseup: Function
    },
    setup(props) {
        useStyle('-base-icon', style$c, toRef(props, 'clsPrefix'));
    },
    render() {
        return (h("i", { class: `${this.clsPrefix}-base-icon`, onClick: this.onClick, onMousedown: this.onMousedown, onMouseup: this.onMouseup, role: this.role, "aria-label": this.ariaLabel, "aria-hidden": this.ariaHidden, "aria-disabled": this.ariaDisabled }, this.$slots));
    }
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function replaceable(name, icon) {
    return defineComponent({
        name: upperFirst(name),
        setup() {
            var _a;
            const mergedIconsRef = (_a = inject(configProviderInjectionKey, null)) === null || _a === void 0 ? void 0 : _a.mergedIconsRef;
            return () => {
                var _a;
                const iconOverride = (_a = mergedIconsRef === null || mergedIconsRef === void 0 ? void 0 : mergedIconsRef.value) === null || _a === void 0 ? void 0 : _a[name];
                return iconOverride ? iconOverride() : icon;
            };
        }
    });
}

const CheckmarkIcon = defineComponent({
    name: 'Checkmark',
    render() {
        return (h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 16 16" },
            h("g", { fill: "none" },
                h("path", { d: "M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032z", fill: "currentColor" }))));
    }
});

const CloseIcon = replaceable('close', h("svg", { viewBox: "0 0 12 12", version: "1.1", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": true },
    h("g", { stroke: "none", "stroke-width": "1", fill: "none", "fill-rule": "evenodd" },
        h("g", { fill: "currentColor", "fill-rule": "nonzero" },
            h("path", { d: "M2.08859116,2.2156945 L2.14644661,2.14644661 C2.32001296,1.97288026 2.58943736,1.95359511 2.7843055,2.08859116 L2.85355339,2.14644661 L6,5.293 L9.14644661,2.14644661 C9.34170876,1.95118446 9.65829124,1.95118446 9.85355339,2.14644661 C10.0488155,2.34170876 10.0488155,2.65829124 9.85355339,2.85355339 L6.707,6 L9.85355339,9.14644661 C10.0271197,9.32001296 10.0464049,9.58943736 9.91140884,9.7843055 L9.85355339,9.85355339 C9.67998704,10.0271197 9.41056264,10.0464049 9.2156945,9.91140884 L9.14644661,9.85355339 L6,6.707 L2.85355339,9.85355339 C2.65829124,10.0488155 2.34170876,10.0488155 2.14644661,9.85355339 C1.95118446,9.65829124 1.95118446,9.34170876 2.14644661,9.14644661 L5.293,6 L2.14644661,2.85355339 C1.97288026,2.67998704 1.95359511,2.41056264 2.08859116,2.2156945 L2.14644661,2.14644661 L2.08859116,2.2156945 Z" })))));

const EmptyIcon = defineComponent({
    name: 'Empty',
    render() {
        return (h("svg", { viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            h("path", { d: "M26 7.5C26 11.0899 23.0899 14 19.5 14C15.9101 14 13 11.0899 13 7.5C13 3.91015 15.9101 1 19.5 1C23.0899 1 26 3.91015 26 7.5ZM16.8536 4.14645C16.6583 3.95118 16.3417 3.95118 16.1464 4.14645C15.9512 4.34171 15.9512 4.65829 16.1464 4.85355L18.7929 7.5L16.1464 10.1464C15.9512 10.3417 15.9512 10.6583 16.1464 10.8536C16.3417 11.0488 16.6583 11.0488 16.8536 10.8536L19.5 8.20711L22.1464 10.8536C22.3417 11.0488 22.6583 11.0488 22.8536 10.8536C23.0488 10.6583 23.0488 10.3417 22.8536 10.1464L20.2071 7.5L22.8536 4.85355C23.0488 4.65829 23.0488 4.34171 22.8536 4.14645C22.6583 3.95118 22.3417 3.95118 22.1464 4.14645L19.5 6.79289L16.8536 4.14645Z", fill: "currentColor" }),
            h("path", { d: "M25 22.75V12.5991C24.5572 13.0765 24.053 13.4961 23.5 13.8454V16H17.5L17.3982 16.0068C17.0322 16.0565 16.75 16.3703 16.75 16.75C16.75 18.2688 15.5188 19.5 14 19.5C12.4812 19.5 11.25 18.2688 11.25 16.75L11.2432 16.6482C11.1935 16.2822 10.8797 16 10.5 16H4.5V7.25C4.5 6.2835 5.2835 5.5 6.25 5.5H12.2696C12.4146 4.97463 12.6153 4.47237 12.865 4H6.25C4.45507 4 3 5.45507 3 7.25V22.75C3 24.5449 4.45507 26 6.25 26H21.75C23.5449 26 25 24.5449 25 22.75ZM4.5 22.75V17.5H9.81597L9.85751 17.7041C10.2905 19.5919 11.9808 21 14 21L14.215 20.9947C16.2095 20.8953 17.842 19.4209 18.184 17.5H23.5V22.75C23.5 23.7165 22.7165 24.5 21.75 24.5H6.25C5.2835 24.5 4.5 23.7165 4.5 22.75Z", fill: "currentColor" })));
    }
});

const ChevronDownIcon = defineComponent({
    name: 'ChevronDown',
    render() {
        return (h("svg", { viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            h("path", { d: "M3.14645 5.64645C3.34171 5.45118 3.65829 5.45118 3.85355 5.64645L8 9.79289L12.1464 5.64645C12.3417 5.45118 12.6583 5.45118 12.8536 5.64645C13.0488 5.84171 13.0488 6.15829 12.8536 6.35355L8.35355 10.8536C8.15829 11.0488 7.84171 11.0488 7.64645 10.8536L3.14645 6.35355C2.95118 6.15829 2.95118 5.84171 3.14645 5.64645Z", fill: "currentColor" })));
    }
});

const ClearIcon = replaceable('clear', h("svg", { viewBox: "0 0 16 16", version: "1.1", xmlns: "http://www.w3.org/2000/svg" },
    h("g", { stroke: "none", "stroke-width": "1", fill: "none", "fill-rule": "evenodd" },
        h("g", { fill: "currentColor", "fill-rule": "nonzero" },
            h("path", { d: "M8,2 C11.3137085,2 14,4.6862915 14,8 C14,11.3137085 11.3137085,14 8,14 C4.6862915,14 2,11.3137085 2,8 C2,4.6862915 4.6862915,2 8,2 Z M6.5343055,5.83859116 C6.33943736,5.70359511 6.07001296,5.72288026 5.89644661,5.89644661 L5.89644661,5.89644661 L5.83859116,5.9656945 C5.70359511,6.16056264 5.72288026,6.42998704 5.89644661,6.60355339 L5.89644661,6.60355339 L7.293,8 L5.89644661,9.39644661 L5.83859116,9.4656945 C5.70359511,9.66056264 5.72288026,9.92998704 5.89644661,10.1035534 L5.89644661,10.1035534 L5.9656945,10.1614088 C6.16056264,10.2964049 6.42998704,10.2771197 6.60355339,10.1035534 L6.60355339,10.1035534 L8,8.707 L9.39644661,10.1035534 L9.4656945,10.1614088 C9.66056264,10.2964049 9.92998704,10.2771197 10.1035534,10.1035534 L10.1035534,10.1035534 L10.1614088,10.0343055 C10.2964049,9.83943736 10.2771197,9.57001296 10.1035534,9.39644661 L10.1035534,9.39644661 L8.707,8 L10.1035534,6.60355339 L10.1614088,6.5343055 C10.2964049,6.33943736 10.2771197,6.07001296 10.1035534,5.89644661 L10.1035534,5.89644661 L10.0343055,5.83859116 C9.83943736,5.70359511 9.57001296,5.72288026 9.39644661,5.89644661 L9.39644661,5.89644661 L8,7.293 L6.60355339,5.89644661 Z" })))));

// vars:
// --n-close-border-radius
// --n-close-color-hover
// --n-close-color-pressed
// --n-close-icon-color
// --n-close-icon-color-hover
// --n-close-icon-color-pressed
// --n-close-icon-color-disabled
const style$b = cB('base-close', `
 display: flex;
 align-items: center;
 justify-content: center;
 cursor: pointer;
 background-color: transparent;
 color: var(--n-close-icon-color);
 border-radius: var(--n-close-border-radius);
 height: var(--n-close-size);
 width: var(--n-close-size);
 font-size: var(--n-close-icon-size);
 outline: none;
 border: none;
 position: relative;
 padding: 0;
`, [cM('absolute', `
 height: var(--n-close-icon-size);
 width: var(--n-close-icon-size);
 `), c('&::before', `
 content: "";
 position: absolute;
 width: var(--n-close-size);
 height: var(--n-close-size);
 left: 50%;
 top: 50%;
 transform: translateY(-50%) translateX(-50%);
 transition: inherit;
 border-radius: inherit;
 `), cNotM('disabled', [c('&:hover', `
 color: var(--n-close-icon-color-hover);
 `), c('&:hover::before', `
 background-color: var(--n-close-color-hover);
 `), c('&:focus::before', `
 background-color: var(--n-close-color-hover);
 `), c('&:active', `
 color: var(--n-close-icon-color-pressed);
 `), c('&:active::before', `
 background-color: var(--n-close-color-pressed);
 `)]), cM('disabled', `
 cursor: not-allowed;
 color: var(--n-close-icon-color-disabled);
 background-color: transparent;
 `), cM('round', [c('&::before', `
 border-radius: 50%;
 `)])]);

const NBaseClose = defineComponent({
    name: 'BaseClose',
    props: {
        isButtonTag: {
            type: Boolean,
            default: true
        },
        clsPrefix: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: undefined
        },
        focusable: {
            type: Boolean,
            default: true
        },
        round: Boolean,
        onClick: Function,
        absolute: Boolean
    },
    setup(props) {
        useStyle('-base-close', style$b, toRef(props, 'clsPrefix'));
        return () => {
            const { clsPrefix, disabled, absolute, round, isButtonTag } = props;
            const Tag = isButtonTag ? 'button' : 'div';
            return (h(Tag, { type: isButtonTag ? 'button' : undefined, tabindex: disabled || !props.focusable ? -1 : 0, "aria-disabled": disabled, "aria-label": "close", role: isButtonTag ? undefined : 'button', disabled: disabled, class: [
                    `${clsPrefix}-base-close`,
                    absolute && `${clsPrefix}-base-close--absolute`,
                    disabled && `${clsPrefix}-base-close--disabled`,
                    round && `${clsPrefix}-base-close--round`
                ], onMousedown: (e) => {
                    if (!props.focusable) {
                        e.preventDefault();
                    }
                }, onClick: props.onClick },
                h(NBaseIcon, { clsPrefix: clsPrefix }, {
                    default: () => h(CloseIcon, null)
                })));
        };
    }
});

const FocusDetector = defineComponent({
    props: {
        onFocus: Function,
        onBlur: Function
    },
    setup(props) {
        return () => (h("div", { style: "width: 0; height: 0", tabindex: 0, onFocus: props.onFocus, onBlur: props.onBlur }));
    }
});

const {
  cubicBezierEaseInOut: cubicBezierEaseInOut$2
} = commonVariables$4;
function iconSwitchTransition({
  originalTransform = '',
  left = 0,
  top = 0,
  transition = `all .3s ${cubicBezierEaseInOut$2} !important`
} = {}) {
  return [c('&.icon-switch-transition-enter-from, &.icon-switch-transition-leave-to', {
    transform: originalTransform + ' scale(0.75)',
    left,
    top,
    opacity: 0
  }), c('&.icon-switch-transition-enter-to, &.icon-switch-transition-leave-from', {
    transform: `scale(1) ${originalTransform}`,
    left,
    top,
    opacity: 1
  }), c('&.icon-switch-transition-enter-active, &.icon-switch-transition-leave-active', {
    transformOrigin: 'center',
    position: 'absolute',
    left,
    top,
    transition
  })];
}

const style$a = c([c('@keyframes loading-container-rotate', `
 to {
 -webkit-transform: rotate(360deg);
 transform: rotate(360deg);
 }
 `), c('@keyframes loading-layer-rotate', `
 12.5% {
 -webkit-transform: rotate(135deg);
 transform: rotate(135deg);
 }
 25% {
 -webkit-transform: rotate(270deg);
 transform: rotate(270deg);
 }
 37.5% {
 -webkit-transform: rotate(405deg);
 transform: rotate(405deg);
 }
 50% {
 -webkit-transform: rotate(540deg);
 transform: rotate(540deg);
 }
 62.5% {
 -webkit-transform: rotate(675deg);
 transform: rotate(675deg);
 }
 75% {
 -webkit-transform: rotate(810deg);
 transform: rotate(810deg);
 }
 87.5% {
 -webkit-transform: rotate(945deg);
 transform: rotate(945deg);
 }
 100% {
 -webkit-transform: rotate(1080deg);
 transform: rotate(1080deg);
 } 
 `), c('@keyframes loading-left-spin', `
 from {
 -webkit-transform: rotate(265deg);
 transform: rotate(265deg);
 }
 50% {
 -webkit-transform: rotate(130deg);
 transform: rotate(130deg);
 }
 to {
 -webkit-transform: rotate(265deg);
 transform: rotate(265deg);
 }
 `), c('@keyframes loading-right-spin', `
 from {
 -webkit-transform: rotate(-265deg);
 transform: rotate(-265deg);
 }
 50% {
 -webkit-transform: rotate(-130deg);
 transform: rotate(-130deg);
 }
 to {
 -webkit-transform: rotate(-265deg);
 transform: rotate(-265deg);
 }
 `), cB('base-loading', `
 position: relative;
 line-height: 0;
 width: 1em;
 height: 1em;
 `, [cE('transition-wrapper', `
 position: absolute;
 width: 100%;
 height: 100%;
 `, [iconSwitchTransition()]), cE('container', `
 display: inline-flex;
 position: relative;
 direction: ltr;
 line-height: 0;
 animation: loading-container-rotate 1568.2352941176ms linear infinite;
 font-size: 0;
 letter-spacing: 0;
 white-space: nowrap;
 opacity: 1;
 width: 100%;
 height: 100%;
 `, [cE('svg', `
 stroke: var(--n-text-color);
 fill: transparent;
 position: absolute;
 height: 100%;
 overflow: hidden;
 `), cE('container-layer', `
 position: absolute;
 width: 100%;
 height: 100%;
 animation: loading-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 `, [cE('container-layer-left', `
 display: inline-flex;
 position: relative;
 width: 50%;
 height: 100%;
 overflow: hidden;
 `, [cE('svg', `
 animation: loading-left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 width: 200%;
 `)]), cE('container-layer-patch', `
 position: absolute;
 top: 0;
 left: 47.5%;
 box-sizing: border-box;
 width: 5%;
 height: 100%;
 overflow: hidden;
 `, [cE('svg', `
 left: -900%;
 width: 2000%;
 transform: rotate(180deg);
 `)]), cE('container-layer-right', `
 display: inline-flex;
 position: relative;
 width: 50%;
 height: 100%;
 overflow: hidden;
 `, [cE('svg', `
 animation: loading-right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 left: -100%;
 width: 200%;
 `)])])]), cE('placeholder', `
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `, [iconSwitchTransition({
  left: '50%',
  top: '50%',
  originalTransform: 'translateX(-50%) translateY(-50%)'
})])])]);

const exposedLoadingProps = {
    strokeWidth: {
        type: Number,
        default: 28
    },
    stroke: {
        type: String,
        default: undefined
    }
};
const NBaseLoading = defineComponent({
    name: 'BaseLoading',
    props: Object.assign({ clsPrefix: {
            type: String,
            required: true
        }, show: {
            type: Boolean,
            default: true
        }, scale: {
            type: Number,
            default: 1
        }, radius: {
            type: Number,
            default: 100
        } }, exposedLoadingProps),
    setup(props) {
        useStyle('-base-loading', style$a, toRef(props, 'clsPrefix'));
    },
    render() {
        const { clsPrefix, radius, strokeWidth, stroke, scale } = this;
        const scaledRadius = radius / scale;
        return (h("div", { class: `${clsPrefix}-base-loading`, role: "img", "aria-label": "loading" },
            h(NIconSwitchTransition, null, {
                default: () => this.show ? (h("div", { key: "icon", class: `${clsPrefix}-base-loading__transition-wrapper` },
                    h("div", { class: `${clsPrefix}-base-loading__container` },
                        h("div", { class: `${clsPrefix}-base-loading__container-layer` },
                            h("div", { class: `${clsPrefix}-base-loading__container-layer-left` },
                                h("svg", { class: `${clsPrefix}-base-loading__svg`, viewBox: `0 0 ${2 * scaledRadius} ${2 * scaledRadius}`, xmlns: "http://www.w3.org/2000/svg", style: { color: stroke } },
                                    h("circle", { fill: "none", stroke: "currentColor", "stroke-width": strokeWidth, "stroke-linecap": "round", cx: scaledRadius, cy: scaledRadius, r: radius - strokeWidth / 2, "stroke-dasharray": 4.91 * radius, "stroke-dashoffset": 2.46 * radius }))),
                            h("div", { class: `${clsPrefix}-base-loading__container-layer-patch` },
                                h("svg", { class: `${clsPrefix}-base-loading__svg`, viewBox: `0 0 ${2 * scaledRadius} ${2 * scaledRadius}`, xmlns: "http://www.w3.org/2000/svg", style: { color: stroke } },
                                    h("circle", { fill: "none", stroke: "currentColor", "stroke-width": strokeWidth, "stroke-linecap": "round", cx: scaledRadius, cy: scaledRadius, r: radius - strokeWidth / 2, "stroke-dasharray": 4.91 * radius, "stroke-dashoffset": 2.46 * radius }))),
                            h("div", { class: `${clsPrefix}-base-loading__container-layer-right` },
                                h("svg", { class: `${clsPrefix}-base-loading__svg`, viewBox: `0 0 ${2 * scaledRadius} ${2 * scaledRadius}`, xmlns: "http://www.w3.org/2000/svg", style: { color: stroke } },
                                    h("circle", { fill: "none", stroke: "currentColor", "stroke-width": strokeWidth, "stroke-linecap": "round", cx: scaledRadius, cy: scaledRadius, r: radius - strokeWidth / 2, "stroke-dasharray": 4.91 * radius, "stroke-dashoffset": 2.46 * radius }))))))) : (h("div", { key: "placeholder", class: `${clsPrefix}-base-loading__placeholder` }, this.$slots))
            })));
    }
});

const base = {
    neutralBase: '#FFF',
    neutralInvertBase: '#000',
    neutralTextBase: '#000',
    neutralPopover: '#fff',
    neutralCard: '#fff',
    neutralModal: '#fff',
    neutralBody: '#fff',
    alpha1: '0.82',
    alpha2: '0.72',
    alpha3: '0.38',
    alpha4: '0.24',
    alpha5: '0.18',
    alphaClose: '0.6',
    alphaDisabled: '0.5',
    alphaDisabledInput: '0.02',
    alphaPending: '0.05',
    alphaTablePending: '0.02',
    alphaPressed: '0.07',
    alphaAvatar: '0.2',
    alphaRail: '0.14',
    alphaProgressRail: '.08',
    alphaBorder: '0.12',
    alphaDivider: '0.06',
    alphaInput: '0',
    alphaAction: '0.02',
    alphaTab: '0.04',
    alphaScrollbar: '0.25',
    alphaScrollbarHover: '0.4',
    alphaCode: '0.05',
    alphaTag: '0.02',
    // primary
    primaryHover: '#36ad6a',
    primaryDefault: '#18a058',
    primaryActive: '#0c7a43',
    primarySuppl: '#36ad6a',
    // info
    infoHover: '#4098fc',
    infoDefault: '#2080f0',
    infoActive: '#1060c9',
    infoSuppl: '#4098fc',
    // error
    errorHover: '#de576d',
    errorDefault: '#d03050',
    errorActive: '#ab1f3f',
    errorSuppl: '#de576d',
    // warning
    warningHover: '#fcb040',
    warningDefault: '#f0a020',
    warningActive: '#c97c10',
    warningSuppl: '#fcb040',
    // success
    successHover: '#36ad6a',
    successDefault: '#18a058',
    successActive: '#0c7a43',
    successSuppl: '#36ad6a'
};
const baseBackgroundRgb = rgba(base.neutralBase);
const baseInvertBackgroundRgb = rgba(base.neutralInvertBase);
const overlayPrefix = 'rgba(' + baseInvertBackgroundRgb.slice(0, 3).join(', ') + ', ';
function overlay(alpha) {
    return overlayPrefix + String(alpha) + ')';
}
function neutral(alpha) {
    const overlayRgba = Array.from(baseInvertBackgroundRgb);
    overlayRgba[3] = Number(alpha);
    return composite(baseBackgroundRgb, overlayRgba);
}
const derived = Object.assign(Object.assign({ name: 'common' }, commonVariables$4), { baseColor: base.neutralBase, 
    // primary color
    primaryColor: base.primaryDefault, primaryColorHover: base.primaryHover, primaryColorPressed: base.primaryActive, primaryColorSuppl: base.primarySuppl, 
    // info color
    infoColor: base.infoDefault, infoColorHover: base.infoHover, infoColorPressed: base.infoActive, infoColorSuppl: base.infoSuppl, 
    // success color
    successColor: base.successDefault, successColorHover: base.successHover, successColorPressed: base.successActive, successColorSuppl: base.successSuppl, 
    // warning color
    warningColor: base.warningDefault, warningColorHover: base.warningHover, warningColorPressed: base.warningActive, warningColorSuppl: base.warningSuppl, 
    // error color
    errorColor: base.errorDefault, errorColorHover: base.errorHover, errorColorPressed: base.errorActive, errorColorSuppl: base.errorSuppl, 
    // text color
    textColorBase: base.neutralTextBase, textColor1: 'rgb(31, 34, 37)', textColor2: 'rgb(51, 54, 57)', textColor3: 'rgb(118, 124, 130)', 
    // textColor4: neutral(base.alpha4), // disabled, placeholder, icon
    // textColor5: neutral(base.alpha5),
    textColorDisabled: neutral(base.alpha4), placeholderColor: neutral(base.alpha4), placeholderColorDisabled: neutral(base.alpha5), iconColor: neutral(base.alpha4), iconColorHover: scaleColor(neutral(base.alpha4), { lightness: 0.75 }), iconColorPressed: scaleColor(neutral(base.alpha4), { lightness: 0.9 }), iconColorDisabled: neutral(base.alpha5), opacity1: base.alpha1, opacity2: base.alpha2, opacity3: base.alpha3, opacity4: base.alpha4, opacity5: base.alpha5, dividerColor: 'rgb(239, 239, 245)', borderColor: 'rgb(224, 224, 230)', 
    // close
    closeIconColor: neutral(Number(base.alphaClose)), closeIconColorHover: neutral(Number(base.alphaClose)), closeIconColorPressed: neutral(Number(base.alphaClose)), closeColorHover: 'rgba(0, 0, 0, .09)', closeColorPressed: 'rgba(0, 0, 0, .13)', 
    // clear
    clearColor: neutral(base.alpha4), clearColorHover: scaleColor(neutral(base.alpha4), { lightness: 0.75 }), clearColorPressed: scaleColor(neutral(base.alpha4), { lightness: 0.9 }), scrollbarColor: overlay(base.alphaScrollbar), scrollbarColorHover: overlay(base.alphaScrollbarHover), scrollbarWidth: '5px', scrollbarHeight: '5px', scrollbarBorderRadius: '5px', progressRailColor: neutral(base.alphaProgressRail), railColor: 'rgb(219, 219, 223)', popoverColor: base.neutralPopover, tableColor: base.neutralCard, cardColor: base.neutralCard, modalColor: base.neutralModal, bodyColor: base.neutralBody, tagColor: '#eee', avatarColor: neutral(base.alphaAvatar), invertedColor: 'rgb(0, 20, 40)', inputColor: neutral(base.alphaInput), codeColor: 'rgb(244, 244, 248)', tabColor: 'rgb(247, 247, 250)', actionColor: 'rgb(250, 250, 252)', tableHeaderColor: 'rgb(250, 250, 252)', hoverColor: 'rgb(243, 243, 245)', 
    // use color with alpha since it can be nested with header filter & sorter effect
    tableColorHover: 'rgba(0, 0, 100, 0.03)', tableColorStriped: 'rgba(0, 0, 100, 0.02)', pressedColor: 'rgb(237, 237, 239)', opacityDisabled: base.alphaDisabled, inputColorDisabled: 'rgb(250, 250, 252)', 
    // secondary button color
    // can also be used in tertiary button & quaternary button
    buttonColor2: 'rgba(46, 51, 56, .05)', buttonColor2Hover: 'rgba(46, 51, 56, .09)', buttonColor2Pressed: 'rgba(46, 51, 56, .13)', boxShadow1: '0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04)', boxShadow2: '0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05)', boxShadow3: '0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)' });
const commonLight = derived;

const commonVars$1 = {
    iconSizeSmall: '34px',
    iconSizeMedium: '40px',
    iconSizeLarge: '46px',
    iconSizeHuge: '52px'
};

const self$7 = (vars) => {
    const { textColorDisabled, iconColor, textColor2, fontSizeSmall, fontSizeMedium, fontSizeLarge, fontSizeHuge } = vars;
    return Object.assign(Object.assign({}, commonVars$1), { fontSizeSmall,
        fontSizeMedium,
        fontSizeLarge,
        fontSizeHuge, textColor: textColorDisabled, iconColor, extraTextColor: textColor2 });
};
const emptyLight = {
    name: 'Empty',
    common: commonLight,
    self: self$7
};
const emptyLight$1 = emptyLight;

// vars:
// --n-font-size
// --n-icon-size
// --n-icon-color
// --n-bezier
// --n-text-color
// --n-extra-text-color
const style$9 = cB('empty', `
 display: flex;
 flex-direction: column;
 align-items: center;
 font-size: var(--n-font-size);
`, [cE('icon', `
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 line-height: var(--n-icon-size);
 color: var(--n-icon-color);
 transition:
 color .3s var(--n-bezier);
 `, [c('+', [cE('description', `
 margin-top: 8px;
 `)])]), cE('description', `
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `), cE('extra', `
 text-align: center;
 transition: color .3s var(--n-bezier);
 margin-top: 12px;
 color: var(--n-extra-text-color);
 `)]);

const emptyProps = Object.assign(Object.assign({}, useTheme.props), { description: String, showDescription: {
        type: Boolean,
        default: true
    }, showIcon: {
        type: Boolean,
        default: true
    }, size: {
        type: String,
        default: 'medium'
    }, renderIcon: Function });
const NEmpty = defineComponent({
    name: 'Empty',
    props: emptyProps,
    setup(props) {
        const { mergedClsPrefixRef, inlineThemeDisabled } = useConfig(props);
        const themeRef = useTheme('Empty', '-empty', style$9, emptyLight$1, props, mergedClsPrefixRef);
        const { localeRef } = useLocale('Empty');
        const NConfigProvider = inject(configProviderInjectionKey, null);
        const mergedDescriptionRef = computed(() => {
            var _a, _b, _c;
            return ((_a = props.description) !== null && _a !== void 0 ? _a : (_c = (_b = NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedComponentPropsRef.value) === null || _b === void 0 ? void 0 : _b.Empty) === null || _c === void 0 ? void 0 : _c.description);
        });
        const mergedRenderIconRef = computed(() => {
            var _a, _b;
            return ((_b = (_a = NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedComponentPropsRef.value) === null || _a === void 0 ? void 0 : _a.Empty) === null || _b === void 0 ? void 0 : _b.renderIcon) ||
                (() => h(EmptyIcon, null));
        });
        const cssVarsRef = computed(() => {
            const { size } = props;
            const { common: { cubicBezierEaseInOut }, self: { [createKey('iconSize', size)]: iconSize, [createKey('fontSize', size)]: fontSize, textColor, iconColor, extraTextColor } } = themeRef.value;
            return {
                '--n-icon-size': iconSize,
                '--n-font-size': fontSize,
                '--n-bezier': cubicBezierEaseInOut,
                '--n-text-color': textColor,
                '--n-icon-color': iconColor,
                '--n-extra-text-color': extraTextColor
            };
        });
        const themeClassHandle = inlineThemeDisabled
            ? useThemeClass('empty', computed(() => {
                let hash = '';
                const { size } = props;
                hash += size[0];
                return hash;
            }), cssVarsRef, props)
            : undefined;
        return {
            mergedClsPrefix: mergedClsPrefixRef,
            mergedRenderIcon: mergedRenderIconRef,
            localizedDescription: computed(() => {
                return mergedDescriptionRef.value || localeRef.value.description;
            }),
            cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
            themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass,
            onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender
        };
    },
    render() {
        const { $slots, mergedClsPrefix, onRender } = this;
        onRender === null || onRender === void 0 ? void 0 : onRender();
        return (h("div", { class: [`${mergedClsPrefix}-empty`, this.themeClass], style: this.cssVars },
            this.showIcon ? (h("div", { class: `${mergedClsPrefix}-empty__icon` }, $slots.icon ? ($slots.icon()) : (h(NBaseIcon, { clsPrefix: mergedClsPrefix }, { default: this.mergedRenderIcon })))) : null,
            this.showDescription ? (h("div", { class: `${mergedClsPrefix}-empty__description` }, $slots.default ? $slots.default() : this.localizedDescription)) : null,
            $slots.extra ? (h("div", { class: `${mergedClsPrefix}-empty__extra` }, $slots.extra())) : null));
    }
});

const self$6 = (vars) => {
    const { scrollbarColor, scrollbarColorHover } = vars;
    return {
        color: scrollbarColor,
        colorHover: scrollbarColorHover
    };
};
const scrollbarLight = {
    name: 'Scrollbar',
    common: commonLight,
    self: self$6
};
const scrollbarLight$1 = scrollbarLight;

const {
  cubicBezierEaseInOut: cubicBezierEaseInOut$1
} = commonVariables$4;
function fadeInTransition({
  name = 'fade-in',
  enterDuration = '0.2s',
  leaveDuration = '0.2s',
  enterCubicBezier = cubicBezierEaseInOut$1,
  leaveCubicBezier = cubicBezierEaseInOut$1
} = {}) {
  return [c(`&.${name}-transition-enter-active`, {
    transition: `all ${enterDuration} ${enterCubicBezier}!important`
  }), c(`&.${name}-transition-leave-active`, {
    transition: `all ${leaveDuration} ${leaveCubicBezier}!important`
  }), c(`&.${name}-transition-enter-from, &.${name}-transition-leave-to`, {
    opacity: 0
  }), c(`&.${name}-transition-leave-from, &.${name}-transition-enter-to`, {
    opacity: 1
  })];
}

// vars:
// --n-scrollbar-bezier
// --n-scrollbar-color
// --n-scrollbar-color-hover
// --n-scrollbar-width
// --n-scrollbar-height
// --n-scrollbar-border-radius
const style$8 = cB('scrollbar', `
 overflow: hidden;
 position: relative;
 z-index: auto;
 height: 100%;
 width: 100%;
`, [c('>', [cB('scrollbar-container', `
 width: 100%;
 overflow: scroll;
 height: 100%;
 max-height: inherit;
 scrollbar-width: none;
 `, [c('&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb', `
 width: 0;
 height: 0;
 display: none;
 `), c('>', [cB('scrollbar-content', `
 box-sizing: border-box;
 min-width: 100%;
 `)])])]), c('>, +', [cB('scrollbar-rail', `
 position: absolute;
 pointer-events: none;
 user-select: none;
 -webkit-user-select: none;
 `, [cM('horizontal', `
 left: 2px;
 right: 2px;
 bottom: 4px;
 height: var(--n-scrollbar-height);
 `, [c('>', [cE('scrollbar', `
 height: var(--n-scrollbar-height);
 border-radius: var(--n-scrollbar-border-radius);
 right: 0;
 `)])]), cM('vertical', `
 right: 4px;
 top: 2px;
 bottom: 2px;
 width: var(--n-scrollbar-width);
 `, [c('>', [cE('scrollbar', `
 width: var(--n-scrollbar-width);
 border-radius: var(--n-scrollbar-border-radius);
 bottom: 0;
 `)])]), cM('disabled', [c('>', [cE('scrollbar', {
  pointerEvents: 'none'
})])]), c('>', [cE('scrollbar', `
 position: absolute;
 cursor: pointer;
 pointer-events: all;
 background-color: var(--n-scrollbar-color);
 transition: background-color .2s var(--n-scrollbar-bezier);
 `, [fadeInTransition(), c('&:hover', {
  backgroundColor: 'var(--n-scrollbar-color-hover)'
})])])])])]);

const scrollbarProps = Object.assign(Object.assign({}, useTheme.props), { size: {
        type: Number,
        default: 5
    }, duration: {
        type: Number,
        default: 0
    }, scrollable: {
        type: Boolean,
        default: true
    }, xScrollable: Boolean, trigger: {
        type: String,
        default: 'hover'
    }, useUnifiedContainer: Boolean, triggerDisplayManually: Boolean, 
    // If container is set, resize observer won't not attached
    container: Function, content: Function, containerClass: String, containerStyle: [String, Object], contentClass: String, contentStyle: [String, Object], horizontalRailStyle: [String, Object], verticalRailStyle: [String, Object], onScroll: Function, onWheel: Function, onResize: Function, internalOnUpdateScrollLeft: Function, internalHoistYRail: Boolean });
const Scrollbar = defineComponent({
    name: 'Scrollbar',
    props: scrollbarProps,
    inheritAttrs: false,
    setup(props) {
        const { mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } = useConfig(props);
        const rtlEnabledRef = useRtl('Scrollbar', mergedRtlRef, mergedClsPrefixRef);
        // dom ref
        const wrapperRef = ref(null);
        const containerRef = ref(null);
        const contentRef = ref(null);
        const yRailRef = ref(null);
        const xRailRef = ref(null);
        // data ref
        const contentHeightRef = ref(null);
        const contentWidthRef = ref(null);
        const containerHeightRef = ref(null);
        const containerWidthRef = ref(null);
        const yRailSizeRef = ref(null);
        const xRailSizeRef = ref(null);
        const containerScrollTopRef = ref(0);
        const containerScrollLeftRef = ref(0);
        const isShowXBarRef = ref(false);
        const isShowYBarRef = ref(false);
        let yBarPressed = false;
        let xBarPressed = false;
        let xBarVanishTimerId;
        let yBarVanishTimerId;
        let memoYTop = 0;
        let memoXLeft = 0;
        let memoMouseX = 0;
        let memoMouseY = 0;
        const isIos = useIsIos();
        const yBarSizeRef = computed(() => {
            const { value: containerHeight } = containerHeightRef;
            const { value: contentHeight } = contentHeightRef;
            const { value: yRailSize } = yRailSizeRef;
            if (containerHeight === null ||
                contentHeight === null ||
                yRailSize === null) {
                return 0;
            }
            else {
                return Math.min(containerHeight, (yRailSize * containerHeight) / contentHeight + props.size * 1.5);
            }
        });
        const yBarSizePxRef = computed(() => {
            return `${yBarSizeRef.value}px`;
        });
        const xBarSizeRef = computed(() => {
            const { value: containerWidth } = containerWidthRef;
            const { value: contentWidth } = contentWidthRef;
            const { value: xRailSize } = xRailSizeRef;
            if (containerWidth === null ||
                contentWidth === null ||
                xRailSize === null) {
                return 0;
            }
            else {
                return (xRailSize * containerWidth) / contentWidth + props.size * 1.5;
            }
        });
        const xBarSizePxRef = computed(() => {
            return `${xBarSizeRef.value}px`;
        });
        const yBarTopRef = computed(() => {
            const { value: containerHeight } = containerHeightRef;
            const { value: containerScrollTop } = containerScrollTopRef;
            const { value: contentHeight } = contentHeightRef;
            const { value: yRailSize } = yRailSizeRef;
            if (containerHeight === null ||
                contentHeight === null ||
                yRailSize === null) {
                return 0;
            }
            else {
                const heightDiff = contentHeight - containerHeight;
                if (!heightDiff)
                    return 0;
                return ((containerScrollTop / heightDiff) * (yRailSize - yBarSizeRef.value));
            }
        });
        const yBarTopPxRef = computed(() => {
            return `${yBarTopRef.value}px`;
        });
        const xBarLeftRef = computed(() => {
            const { value: containerWidth } = containerWidthRef;
            const { value: containerScrollLeft } = containerScrollLeftRef;
            const { value: contentWidth } = contentWidthRef;
            const { value: xRailSize } = xRailSizeRef;
            if (containerWidth === null ||
                contentWidth === null ||
                xRailSize === null) {
                return 0;
            }
            else {
                const widthDiff = contentWidth - containerWidth;
                if (!widthDiff)
                    return 0;
                return ((containerScrollLeft / widthDiff) * (xRailSize - xBarSizeRef.value));
            }
        });
        const xBarLeftPxRef = computed(() => {
            return `${xBarLeftRef.value}px`;
        });
        const needYBarRef = computed(() => {
            const { value: containerHeight } = containerHeightRef;
            const { value: contentHeight } = contentHeightRef;
            return (containerHeight !== null &&
                contentHeight !== null &&
                contentHeight > containerHeight);
        });
        const needXBarRef = computed(() => {
            const { value: containerWidth } = containerWidthRef;
            const { value: contentWidth } = contentWidthRef;
            return (containerWidth !== null &&
                contentWidth !== null &&
                contentWidth > containerWidth);
        });
        const mergedShowXBarRef = computed(() => {
            const { trigger } = props;
            return trigger === 'none' || isShowXBarRef.value;
        });
        const mergedShowYBarRef = computed(() => {
            const { trigger } = props;
            return trigger === 'none' || isShowYBarRef.value;
        });
        const mergedContainerRef = computed(() => {
            const { container } = props;
            if (container)
                return container();
            return containerRef.value;
        });
        const mergedContentRef = computed(() => {
            const { content } = props;
            if (content)
                return content();
            return contentRef.value;
        });
        const activateState = useReactivated(() => {
            // Only restore for builtin container & content
            if (!props.container) {
                // remount
                scrollTo({
                    top: containerScrollTopRef.value,
                    left: containerScrollLeftRef.value
                });
            }
        });
        // methods
        const handleContentResize = () => {
            if (activateState.isDeactivated)
                return;
            sync();
        };
        const handleContainerResize = (e) => {
            if (activateState.isDeactivated)
                return;
            const { onResize } = props;
            if (onResize)
                onResize(e);
            sync();
        };
        const scrollTo = (options, y) => {
            if (!props.scrollable)
                return;
            if (typeof options === 'number') {
                scrollToPosition(y !== null && y !== void 0 ? y : 0, options, 0, false, 'auto');
                return;
            }
            const { left, top, index, elSize, position, behavior, el, debounce = true } = options;
            if (left !== undefined || top !== undefined) {
                scrollToPosition(left !== null && left !== void 0 ? left : 0, top !== null && top !== void 0 ? top : 0, 0, false, behavior);
            }
            if (el !== undefined) {
                scrollToPosition(0, el.offsetTop, el.offsetHeight, debounce, behavior);
            }
            else if (index !== undefined && elSize !== undefined) {
                scrollToPosition(0, index * elSize, elSize, debounce, behavior);
            }
            else if (position === 'bottom') {
                scrollToPosition(0, Number.MAX_SAFE_INTEGER, 0, false, behavior);
            }
            else if (position === 'top') {
                scrollToPosition(0, 0, 0, false, behavior);
            }
        };
        const scrollBy = (options, y) => {
            if (!props.scrollable)
                return;
            const { value: container } = mergedContainerRef;
            if (!container)
                return;
            if (typeof options === 'object') {
                container.scrollBy(options);
            }
            else {
                container.scrollBy(options, y || 0);
            }
        };
        function scrollToPosition(left, top, elSize, debounce, behavior) {
            const { value: container } = mergedContainerRef;
            if (!container)
                return;
            if (debounce) {
                const { scrollTop, offsetHeight } = container;
                if (top > scrollTop) {
                    if (top + elSize <= scrollTop + offsetHeight) ;
                    else {
                        container.scrollTo({
                            left,
                            top: top + elSize - offsetHeight,
                            behavior
                        });
                    }
                    return;
                }
            }
            container.scrollTo({
                left,
                top,
                behavior
            });
        }
        function handleMouseEnterWrapper() {
            showXBar();
            showYBar();
            sync();
        }
        function handleMouseLeaveWrapper() {
            hideBar();
        }
        function hideBar() {
            hideYBar();
            hideXBar();
        }
        function hideYBar() {
            if (yBarVanishTimerId !== undefined) {
                window.clearTimeout(yBarVanishTimerId);
            }
            yBarVanishTimerId = window.setTimeout(() => {
                isShowYBarRef.value = false;
            }, props.duration);
        }
        function hideXBar() {
            if (xBarVanishTimerId !== undefined) {
                window.clearTimeout(xBarVanishTimerId);
            }
            xBarVanishTimerId = window.setTimeout(() => {
                isShowXBarRef.value = false;
            }, props.duration);
        }
        function showXBar() {
            if (xBarVanishTimerId !== undefined) {
                window.clearTimeout(xBarVanishTimerId);
            }
            isShowXBarRef.value = true;
        }
        function showYBar() {
            if (yBarVanishTimerId !== undefined) {
                window.clearTimeout(yBarVanishTimerId);
            }
            isShowYBarRef.value = true;
        }
        function handleScroll(e) {
            const { onScroll } = props;
            if (onScroll)
                onScroll(e);
            syncScrollState();
        }
        function syncScrollState() {
            // only collect scroll state, do not trigger any dom event
            const { value: container } = mergedContainerRef;
            if (container) {
                containerScrollTopRef.value = container.scrollTop;
                containerScrollLeftRef.value =
                    container.scrollLeft * ((rtlEnabledRef === null || rtlEnabledRef === void 0 ? void 0 : rtlEnabledRef.value) ? -1 : 1);
            }
        }
        function syncPositionState() {
            // only collect position state, do not trigger any dom event
            // Don't use getClientBoundingRect because element may be scale transformed
            const { value: content } = mergedContentRef;
            if (content) {
                contentHeightRef.value = content.offsetHeight;
                contentWidthRef.value = content.offsetWidth;
            }
            const { value: container } = mergedContainerRef;
            if (container) {
                containerHeightRef.value = container.offsetHeight;
                containerWidthRef.value = container.offsetWidth;
            }
            const { value: xRailEl } = xRailRef;
            const { value: yRailEl } = yRailRef;
            if (xRailEl) {
                xRailSizeRef.value = xRailEl.offsetWidth;
            }
            if (yRailEl) {
                yRailSizeRef.value = yRailEl.offsetHeight;
            }
        }
        /**
         * Sometimes there's only one element that we can scroll,
         * For example for textarea, there won't be a content element.
         */
        function syncUnifiedContainer() {
            const { value: container } = mergedContainerRef;
            if (container) {
                containerScrollTopRef.value = container.scrollTop;
                containerScrollLeftRef.value =
                    container.scrollLeft * ((rtlEnabledRef === null || rtlEnabledRef === void 0 ? void 0 : rtlEnabledRef.value) ? -1 : 1);
                containerHeightRef.value = container.offsetHeight;
                containerWidthRef.value = container.offsetWidth;
                contentHeightRef.value = container.scrollHeight;
                contentWidthRef.value = container.scrollWidth;
            }
            const { value: xRailEl } = xRailRef;
            const { value: yRailEl } = yRailRef;
            if (xRailEl) {
                xRailSizeRef.value = xRailEl.offsetWidth;
            }
            if (yRailEl) {
                yRailSizeRef.value = yRailEl.offsetHeight;
            }
        }
        function sync() {
            if (!props.scrollable)
                return;
            if (props.useUnifiedContainer) {
                syncUnifiedContainer();
            }
            else {
                syncPositionState();
                syncScrollState();
            }
        }
        function isMouseUpAway(e) {
            var _a;
            return !((_a = wrapperRef.value) === null || _a === void 0 ? void 0 : _a.contains(getPreciseEventTarget(e)));
        }
        function handleXScrollMouseDown(e) {
            e.preventDefault();
            e.stopPropagation();
            xBarPressed = true;
            on('mousemove', window, handleXScrollMouseMove, true);
            on('mouseup', window, handleXScrollMouseUp, true);
            memoXLeft = containerScrollLeftRef.value;
            memoMouseX = (rtlEnabledRef === null || rtlEnabledRef === void 0 ? void 0 : rtlEnabledRef.value)
                ? window.innerWidth - e.clientX
                : e.clientX;
        }
        function handleXScrollMouseMove(e) {
            if (!xBarPressed)
                return;
            if (xBarVanishTimerId !== undefined) {
                window.clearTimeout(xBarVanishTimerId);
            }
            if (yBarVanishTimerId !== undefined) {
                window.clearTimeout(yBarVanishTimerId);
            }
            const { value: containerWidth } = containerWidthRef;
            const { value: contentWidth } = contentWidthRef;
            const { value: xBarSize } = xBarSizeRef;
            if (containerWidth === null || contentWidth === null)
                return;
            const dX = (rtlEnabledRef === null || rtlEnabledRef === void 0 ? void 0 : rtlEnabledRef.value)
                ? window.innerWidth - e.clientX - memoMouseX
                : e.clientX - memoMouseX;
            const dScrollLeft = (dX * (contentWidth - containerWidth)) / (containerWidth - xBarSize);
            const toScrollLeftUpperBound = contentWidth - containerWidth;
            let toScrollLeft = memoXLeft + dScrollLeft;
            toScrollLeft = Math.min(toScrollLeftUpperBound, toScrollLeft);
            toScrollLeft = Math.max(toScrollLeft, 0);
            const { value: container } = mergedContainerRef;
            if (container) {
                container.scrollLeft = toScrollLeft * ((rtlEnabledRef === null || rtlEnabledRef === void 0 ? void 0 : rtlEnabledRef.value) ? -1 : 1);
                const { internalOnUpdateScrollLeft } = props;
                if (internalOnUpdateScrollLeft)
                    internalOnUpdateScrollLeft(toScrollLeft);
            }
        }
        function handleXScrollMouseUp(e) {
            e.preventDefault();
            e.stopPropagation();
            off('mousemove', window, handleXScrollMouseMove, true);
            off('mouseup', window, handleXScrollMouseUp, true);
            xBarPressed = false;
            sync();
            if (isMouseUpAway(e)) {
                hideBar();
            }
        }
        function handleYScrollMouseDown(e) {
            e.preventDefault();
            e.stopPropagation();
            yBarPressed = true;
            on('mousemove', window, handleYScrollMouseMove, true);
            on('mouseup', window, handleYScrollMouseUp, true);
            memoYTop = containerScrollTopRef.value;
            memoMouseY = e.clientY;
        }
        function handleYScrollMouseMove(e) {
            if (!yBarPressed)
                return;
            if (xBarVanishTimerId !== undefined) {
                window.clearTimeout(xBarVanishTimerId);
            }
            if (yBarVanishTimerId !== undefined) {
                window.clearTimeout(yBarVanishTimerId);
            }
            const { value: containerHeight } = containerHeightRef;
            const { value: contentHeight } = contentHeightRef;
            const { value: yBarSize } = yBarSizeRef;
            if (containerHeight === null || contentHeight === null)
                return;
            const dY = e.clientY - memoMouseY;
            const dScrollTop = (dY * (contentHeight - containerHeight)) / (containerHeight - yBarSize);
            const toScrollTopUpperBound = contentHeight - containerHeight;
            let toScrollTop = memoYTop + dScrollTop;
            toScrollTop = Math.min(toScrollTopUpperBound, toScrollTop);
            toScrollTop = Math.max(toScrollTop, 0);
            const { value: container } = mergedContainerRef;
            if (container) {
                container.scrollTop = toScrollTop;
            }
        }
        function handleYScrollMouseUp(e) {
            e.preventDefault();
            e.stopPropagation();
            off('mousemove', window, handleYScrollMouseMove, true);
            off('mouseup', window, handleYScrollMouseUp, true);
            yBarPressed = false;
            sync();
            if (isMouseUpAway(e)) {
                hideBar();
            }
        }
        watchEffect(() => {
            const { value: needXBar } = needXBarRef;
            const { value: needYBar } = needYBarRef;
            const { value: mergedClsPrefix } = mergedClsPrefixRef;
            const { value: xRailEl } = xRailRef;
            const { value: yRailEl } = yRailRef;
            if (xRailEl) {
                if (!needXBar) {
                    xRailEl.classList.add(`${mergedClsPrefix}-scrollbar-rail--disabled`);
                }
                else {
                    xRailEl.classList.remove(`${mergedClsPrefix}-scrollbar-rail--disabled`);
                }
            }
            if (yRailEl) {
                if (!needYBar) {
                    yRailEl.classList.add(`${mergedClsPrefix}-scrollbar-rail--disabled`);
                }
                else {
                    yRailEl.classList.remove(`${mergedClsPrefix}-scrollbar-rail--disabled`);
                }
            }
        });
        onMounted(() => {
            // if container exist, it always can't be resolved when scrollbar is mounted
            // for example:
            // - component
            //   - scrollbar
            //     - inner
            // if you pass inner to scrollbar, you may use a ref inside component
            // however, when scrollbar is mounted, ref is not ready at component
            // you need to init by yourself
            if (props.container)
                return;
            sync();
        });
        onBeforeUnmount(() => {
            if (xBarVanishTimerId !== undefined) {
                window.clearTimeout(xBarVanishTimerId);
            }
            if (yBarVanishTimerId !== undefined) {
                window.clearTimeout(yBarVanishTimerId);
            }
            off('mousemove', window, handleYScrollMouseMove, true);
            off('mouseup', window, handleYScrollMouseUp, true);
        });
        const themeRef = useTheme('Scrollbar', '-scrollbar', style$8, scrollbarLight$1, props, mergedClsPrefixRef);
        const cssVarsRef = computed(() => {
            const { common: { cubicBezierEaseInOut, scrollbarBorderRadius, scrollbarHeight, scrollbarWidth }, self: { color, colorHover } } = themeRef.value;
            return {
                '--n-scrollbar-bezier': cubicBezierEaseInOut,
                '--n-scrollbar-color': color,
                '--n-scrollbar-color-hover': colorHover,
                '--n-scrollbar-border-radius': scrollbarBorderRadius,
                '--n-scrollbar-width': scrollbarWidth,
                '--n-scrollbar-height': scrollbarHeight
            };
        });
        const themeClassHandle = inlineThemeDisabled
            ? useThemeClass('scrollbar', undefined, cssVarsRef, props)
            : undefined;
        const exposedMethods = {
            scrollTo,
            scrollBy,
            sync,
            syncUnifiedContainer,
            handleMouseEnterWrapper,
            handleMouseLeaveWrapper
        };
        return Object.assign(Object.assign({}, exposedMethods), { mergedClsPrefix: mergedClsPrefixRef, rtlEnabled: rtlEnabledRef, containerScrollTop: containerScrollTopRef, wrapperRef,
            containerRef,
            contentRef,
            yRailRef,
            xRailRef, needYBar: needYBarRef, needXBar: needXBarRef, yBarSizePx: yBarSizePxRef, xBarSizePx: xBarSizePxRef, yBarTopPx: yBarTopPxRef, xBarLeftPx: xBarLeftPxRef, isShowXBar: mergedShowXBarRef, isShowYBar: mergedShowYBarRef, isIos,
            handleScroll,
            handleContentResize,
            handleContainerResize,
            handleYScrollMouseDown,
            handleXScrollMouseDown, cssVars: inlineThemeDisabled ? undefined : cssVarsRef, themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass, onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender });
    },
    render() {
        var _a;
        const { $slots, mergedClsPrefix, triggerDisplayManually, rtlEnabled, internalHoistYRail } = this;
        if (!this.scrollable)
            return (_a = $slots.default) === null || _a === void 0 ? void 0 : _a.call($slots);
        const triggerIsNone = this.trigger === 'none';
        const createYRail = () => {
            return (h("div", { ref: "yRailRef", class: [
                    `${mergedClsPrefix}-scrollbar-rail`,
                    `${mergedClsPrefix}-scrollbar-rail--vertical`
                ], "data-scrollbar-rail": true, style: this.verticalRailStyle, "aria-hidden": true }, h((triggerIsNone ? Wrapper : Transition), triggerIsNone ? null : { name: 'fade-in-transition' }, {
                default: () => this.needYBar && this.isShowYBar && !this.isIos ? (h("div", { class: `${mergedClsPrefix}-scrollbar-rail__scrollbar`, style: {
                        height: this.yBarSizePx,
                        top: this.yBarTopPx
                    }, onMousedown: this.handleYScrollMouseDown })) : null
            })));
        };
        const createChildren = () => {
            var _a, _b;
            (_a = this.onRender) === null || _a === void 0 ? void 0 : _a.call(this);
            return h('div', mergeProps(this.$attrs, {
                role: 'none',
                ref: 'wrapperRef',
                class: [
                    `${mergedClsPrefix}-scrollbar`,
                    this.themeClass,
                    rtlEnabled && `${mergedClsPrefix}-scrollbar--rtl`
                ],
                style: this.cssVars,
                onMouseenter: triggerDisplayManually
                    ? undefined
                    : this.handleMouseEnterWrapper,
                onMouseleave: triggerDisplayManually
                    ? undefined
                    : this.handleMouseLeaveWrapper
            }), [
                this.container ? ((_b = $slots.default) === null || _b === void 0 ? void 0 : _b.call($slots)) : (h("div", { role: "none", ref: "containerRef", class: [
                        `${mergedClsPrefix}-scrollbar-container`,
                        this.containerClass
                    ], style: this.containerStyle, onScroll: this.handleScroll, onWheel: this.onWheel },
                    h(VResizeObserver, { onResize: this.handleContentResize }, {
                        default: () => (h("div", { ref: "contentRef", role: "none", style: [
                                {
                                    width: this.xScrollable ? 'fit-content' : null
                                },
                                this.contentStyle
                            ], class: [
                                `${mergedClsPrefix}-scrollbar-content`,
                                this.contentClass
                            ] }, $slots))
                    }))),
                internalHoistYRail ? null : createYRail(),
                this.xScrollable && (h("div", { ref: "xRailRef", class: [
                        `${mergedClsPrefix}-scrollbar-rail`,
                        `${mergedClsPrefix}-scrollbar-rail--horizontal`
                    ], style: this.horizontalRailStyle, "data-scrollbar-rail": true, "aria-hidden": true }, h((triggerIsNone ? Wrapper : Transition), triggerIsNone ? null : { name: 'fade-in-transition' }, {
                    default: () => this.needXBar && this.isShowXBar && !this.isIos ? (h("div", { class: `${mergedClsPrefix}-scrollbar-rail__scrollbar`, style: {
                            width: this.xBarSizePx,
                            right: rtlEnabled ? this.xBarLeftPx : undefined,
                            left: rtlEnabled ? undefined : this.xBarLeftPx
                        }, onMousedown: this.handleXScrollMouseDown })) : null
                })))
            ]);
        };
        const scrollbarNode = this.container ? (createChildren()) : (h(VResizeObserver, { onResize: this.handleContainerResize }, {
            default: createChildren
        }));
        if (internalHoistYRail) {
            return (h(Fragment, null,
                scrollbarNode,
                createYRail()));
        }
        else {
            return scrollbarNode;
        }
    }
});
const NScrollbar = Scrollbar;
const XScrollbar = Scrollbar;

const commonVariables$3 = {
    height: 'calc(var(--n-option-height) * 7.6)',
    paddingSmall: '4px 0',
    paddingMedium: '4px 0',
    paddingLarge: '4px 0',
    paddingHuge: '4px 0',
    optionPaddingSmall: '0 12px',
    optionPaddingMedium: '0 12px',
    optionPaddingLarge: '0 12px',
    optionPaddingHuge: '0 12px',
    loadingSize: '18px'
};

const self$5 = (vars) => {
    const { borderRadius, popoverColor, textColor3, dividerColor, textColor2, primaryColorPressed, textColorDisabled, primaryColor, opacityDisabled, hoverColor, fontSizeSmall, fontSizeMedium, fontSizeLarge, fontSizeHuge, heightSmall, heightMedium, heightLarge, heightHuge } = vars;
    return Object.assign(Object.assign({}, commonVariables$3), { optionFontSizeSmall: fontSizeSmall, optionFontSizeMedium: fontSizeMedium, optionFontSizeLarge: fontSizeLarge, optionFontSizeHuge: fontSizeHuge, optionHeightSmall: heightSmall, optionHeightMedium: heightMedium, optionHeightLarge: heightLarge, optionHeightHuge: heightHuge, borderRadius, color: popoverColor, groupHeaderTextColor: textColor3, actionDividerColor: dividerColor, optionTextColor: textColor2, optionTextColorPressed: primaryColorPressed, optionTextColorDisabled: textColorDisabled, optionTextColorActive: primaryColor, optionOpacityDisabled: opacityDisabled, optionCheckColor: primaryColor, optionColorPending: hoverColor, optionColorActive: 'rgba(0, 0, 0, 0)', optionColorActivePending: hoverColor, actionTextColor: textColor2, loadingColor: primaryColor });
};
const internalSelectMenuLight = createTheme({
    name: 'InternalSelectMenu',
    common: commonLight,
    peers: {
        Scrollbar: scrollbarLight$1,
        Empty: emptyLight$1
    },
    self: self$5
});
const internalSelectMenuLight$1 = internalSelectMenuLight;

function renderCheckMark(show, clsPrefix) {
    return (h(Transition, { name: "fade-in-scale-up-transition" }, {
        default: () => show ? (h(NBaseIcon, { clsPrefix: clsPrefix, class: `${clsPrefix}-base-select-option__check` }, {
            default: () => h(CheckmarkIcon)
        })) : null
    }));
}
const NSelectOption = defineComponent({
    name: 'NBaseSelectOption',
    props: {
        clsPrefix: {
            type: String,
            required: true
        },
        tmNode: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const { valueRef, pendingTmNodeRef, multipleRef, valueSetRef, renderLabelRef, renderOptionRef, labelFieldRef, valueFieldRef, showCheckmarkRef, nodePropsRef, handleOptionClick, handleOptionMouseEnter
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         } = inject(internalSelectionMenuInjectionKey);
        const isPendingRef = useMemo(() => {
            const { value: pendingTmNode } = pendingTmNodeRef;
            if (!pendingTmNode)
                return false;
            return props.tmNode.key === pendingTmNode.key;
        });
        function handleClick(e) {
            const { tmNode } = props;
            if (tmNode.disabled)
                return;
            handleOptionClick(e, tmNode);
        }
        function handleMouseEnter(e) {
            const { tmNode } = props;
            if (tmNode.disabled)
                return;
            handleOptionMouseEnter(e, tmNode);
        }
        function handleMouseMove(e) {
            const { tmNode } = props;
            const { value: isPending } = isPendingRef;
            if (tmNode.disabled || isPending)
                return;
            handleOptionMouseEnter(e, tmNode);
        }
        return {
            multiple: multipleRef,
            isGrouped: useMemo(() => {
                const { tmNode } = props;
                const { parent } = tmNode;
                return parent && parent.rawNode.type === 'group';
            }),
            showCheckmark: showCheckmarkRef,
            nodeProps: nodePropsRef,
            isPending: isPendingRef,
            isSelected: useMemo(() => {
                const { value } = valueRef;
                const { value: multiple } = multipleRef;
                if (value === null)
                    return false;
                const optionValue = props.tmNode.rawNode[valueFieldRef.value];
                if (multiple) {
                    const { value: valueSet } = valueSetRef;
                    return valueSet.has(optionValue);
                }
                else {
                    return value === optionValue;
                }
            }),
            labelField: labelFieldRef,
            renderLabel: renderLabelRef,
            renderOption: renderOptionRef,
            handleMouseMove,
            handleMouseEnter,
            handleClick
        };
    },
    render() {
        const { clsPrefix, tmNode: { rawNode }, isSelected, isPending, isGrouped, showCheckmark, nodeProps, renderOption, renderLabel, handleClick, handleMouseEnter, handleMouseMove } = this;
        const checkmark = renderCheckMark(isSelected, clsPrefix);
        const children = renderLabel
            ? [renderLabel(rawNode, isSelected), showCheckmark && checkmark]
            : [
                render(rawNode[this.labelField], rawNode, isSelected),
                showCheckmark && checkmark
            ];
        const attrs = nodeProps === null || nodeProps === void 0 ? void 0 : nodeProps(rawNode);
        const node = (h("div", Object.assign({}, attrs, { class: [
                `${clsPrefix}-base-select-option`,
                rawNode.class,
                attrs === null || attrs === void 0 ? void 0 : attrs.class,
                {
                    [`${clsPrefix}-base-select-option--disabled`]: rawNode.disabled,
                    [`${clsPrefix}-base-select-option--selected`]: isSelected,
                    [`${clsPrefix}-base-select-option--grouped`]: isGrouped,
                    [`${clsPrefix}-base-select-option--pending`]: isPending,
                    [`${clsPrefix}-base-select-option--show-checkmark`]: showCheckmark
                }
            ], style: [(attrs === null || attrs === void 0 ? void 0 : attrs.style) || '', rawNode.style || ''], onClick: mergeEventHandlers([handleClick, attrs === null || attrs === void 0 ? void 0 : attrs.onClick]), onMouseenter: mergeEventHandlers([
                handleMouseEnter,
                attrs === null || attrs === void 0 ? void 0 : attrs.onMouseenter
            ]), onMousemove: mergeEventHandlers([handleMouseMove, attrs === null || attrs === void 0 ? void 0 : attrs.onMousemove]) }),
            h("div", { class: `${clsPrefix}-base-select-option__content` }, children)));
        return rawNode.render
            ? rawNode.render({ node, option: rawNode, selected: isSelected })
            : renderOption
                ? renderOption({ node, option: rawNode, selected: isSelected })
                : node;
    }
});

const NSelectGroupHeader = defineComponent({
    name: 'NBaseSelectGroupHeader',
    props: {
        clsPrefix: {
            type: String,
            required: true
        },
        tmNode: {
            type: Object,
            required: true
        }
    },
    setup() {
        const { renderLabelRef, renderOptionRef, labelFieldRef, nodePropsRef
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         } = inject(internalSelectionMenuInjectionKey);
        return {
            labelField: labelFieldRef,
            nodeProps: nodePropsRef,
            renderLabel: renderLabelRef,
            renderOption: renderOptionRef
        };
    },
    render() {
        const { clsPrefix, renderLabel, renderOption, nodeProps, tmNode: { rawNode } } = this;
        const attrs = nodeProps === null || nodeProps === void 0 ? void 0 : nodeProps(rawNode);
        const children = renderLabel
            ? renderLabel(rawNode, false)
            : render(rawNode[this.labelField], rawNode, false);
        const node = (h("div", Object.assign({}, attrs, { class: [`${clsPrefix}-base-select-group-header`, attrs === null || attrs === void 0 ? void 0 : attrs.class] }), children));
        return rawNode.render
            ? rawNode.render({ node, option: rawNode })
            : renderOption
                ? renderOption({ node, option: rawNode, selected: false })
                : node;
    }
});

const {
  cubicBezierEaseIn,
  cubicBezierEaseOut
} = commonVariables$4;
function fadeInScaleUpTransition({
  transformOrigin = 'inherit',
  duration = '.2s',
  enterScale = '.9',
  originalTransform = '',
  originalTransition = ''
} = {}) {
  return [c('&.fade-in-scale-up-transition-leave-active', {
    transformOrigin,
    transition: `opacity ${duration} ${cubicBezierEaseIn}, transform ${duration} ${cubicBezierEaseIn} ${originalTransition && ',' + originalTransition}`
  }), c('&.fade-in-scale-up-transition-enter-active', {
    transformOrigin,
    transition: `opacity ${duration} ${cubicBezierEaseOut}, transform ${duration} ${cubicBezierEaseOut} ${originalTransition && ',' + originalTransition}`
  }), c('&.fade-in-scale-up-transition-enter-from, &.fade-in-scale-up-transition-leave-to', {
    opacity: 0,
    transform: `${originalTransform} scale(${enterScale})`
  }), c('&.fade-in-scale-up-transition-leave-from, &.fade-in-scale-up-transition-enter-to', {
    opacity: 1,
    transform: `${originalTransform} scale(1)`
  })];
}

// --n-loading-color
// --n-loading-size
// --n-option-padding-right
const style$7 = cB('base-select-menu', `
 line-height: 1.5;
 outline: none;
 z-index: 0;
 position: relative;
 border-radius: var(--n-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-color);
`, [cB('scrollbar', `
 max-height: var(--n-height);
 `), cB('virtual-list', `
 max-height: var(--n-height);
 `), cB('base-select-option', `
 min-height: var(--n-option-height);
 font-size: var(--n-option-font-size);
 display: flex;
 align-items: center;
 `, [cE('content', `
 z-index: 1;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 `)]), cB('base-select-group-header', `
 min-height: var(--n-option-height);
 font-size: .93em;
 display: flex;
 align-items: center;
 `), cB('base-select-menu-option-wrapper', `
 position: relative;
 width: 100%;
 `), cE('loading, empty', `
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `), cE('loading', `
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `), cE('action', `
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-top: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `), cB('base-select-group-header', `
 position: relative;
 cursor: default;
 padding: var(--n-option-padding);
 color: var(--n-group-header-text-color);
 `), cB('base-select-option', `
 cursor: pointer;
 position: relative;
 padding: var(--n-option-padding);
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 box-sizing: border-box;
 color: var(--n-option-text-color);
 opacity: 1;
 `, [cM('show-checkmark', `
 padding-right: calc(var(--n-option-padding-right) + 20px);
 `), c('&::before', `
 content: "";
 position: absolute;
 left: 4px;
 right: 4px;
 top: 0;
 bottom: 0;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `), c('&:active', `
 color: var(--n-option-text-color-pressed);
 `), cM('grouped', `
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `), cM('pending', [c('&::before', `
 background-color: var(--n-option-color-pending);
 `)]), cM('selected', `
 color: var(--n-option-text-color-active);
 `, [c('&::before', `
 background-color: var(--n-option-color-active);
 `), cM('pending', [c('&::before', `
 background-color: var(--n-option-color-active-pending);
 `)])]), cM('disabled', `
 cursor: not-allowed;
 `, [cNotM('selected', `
 color: var(--n-option-text-color-disabled);
 `), cM('selected', `
 opacity: var(--n-option-opacity-disabled);
 `)]), cE('check', `
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `, [fadeInScaleUpTransition({
  enterScale: '0.5'
})])])]);

const NInternalSelectMenu = defineComponent({
    name: 'InternalSelectMenu',
    props: Object.assign(Object.assign({}, useTheme.props), { clsPrefix: {
            type: String,
            required: true
        }, scrollable: {
            type: Boolean,
            default: true
        }, treeMate: {
            type: Object,
            required: true
        }, multiple: Boolean, size: {
            type: String,
            default: 'medium'
        }, value: {
            type: [String, Number, Array],
            default: null
        }, autoPending: Boolean, virtualScroll: {
            type: Boolean,
            default: true
        }, 
        // show is used to toggle pending state initialization
        show: {
            type: Boolean,
            default: true
        }, labelField: {
            type: String,
            default: 'label'
        }, valueField: {
            type: String,
            default: 'value'
        }, loading: Boolean, focusable: Boolean, renderLabel: Function, renderOption: Function, nodeProps: Function, showCheckmark: { type: Boolean, default: true }, onMousedown: Function, onScroll: Function, onFocus: Function, onBlur: Function, onKeyup: Function, onKeydown: Function, onTabOut: Function, onMouseenter: Function, onMouseleave: Function, onResize: Function, resetMenuOnOptionsChange: {
            type: Boolean,
            default: true
        }, inlineThemeDisabled: Boolean, 
        // deprecated
        onToggle: Function }),
    setup(props) {
        const themeRef = useTheme('InternalSelectMenu', '-internal-select-menu', style$7, internalSelectMenuLight$1, props, toRef(props, 'clsPrefix'));
        const selfRef = ref(null);
        const virtualListRef = ref(null);
        const scrollbarRef = ref(null);
        const flattenedNodesRef = computed(() => props.treeMate.getFlattenedNodes());
        const fIndexGetterRef = computed(() => createIndexGetter(flattenedNodesRef.value));
        const pendingNodeRef = ref(null);
        function initPendingNode() {
            const { treeMate } = props;
            let defaultPendingNode = null;
            const { value } = props;
            if (value === null) {
                defaultPendingNode = treeMate.getFirstAvailableNode();
            }
            else {
                if (props.multiple) {
                    defaultPendingNode = treeMate.getNode((value || [])[(value || []).length - 1]);
                }
                else {
                    defaultPendingNode = treeMate.getNode(value);
                }
                if (!defaultPendingNode || defaultPendingNode.disabled) {
                    defaultPendingNode = treeMate.getFirstAvailableNode();
                }
            }
            if (defaultPendingNode) {
                setPendingTmNode(defaultPendingNode);
            }
            else {
                setPendingTmNode(null);
            }
        }
        function clearPendingNodeIfInvalid() {
            const { value: pendingNode } = pendingNodeRef;
            if (pendingNode && !props.treeMate.getNode(pendingNode.key)) {
                pendingNodeRef.value = null;
            }
        }
        let initPendingNodeWatchStopHandle;
        watch(() => props.show, (show) => {
            if (show) {
                initPendingNodeWatchStopHandle = watch(() => props.treeMate, () => {
                    if (props.resetMenuOnOptionsChange) {
                        if (props.autoPending) {
                            initPendingNode();
                        }
                        else {
                            clearPendingNodeIfInvalid();
                        }
                        void nextTick(scrollToPendingNode);
                    }
                    else {
                        clearPendingNodeIfInvalid();
                    }
                }, {
                    immediate: true
                });
            }
            else {
                initPendingNodeWatchStopHandle === null || initPendingNodeWatchStopHandle === void 0 ? void 0 : initPendingNodeWatchStopHandle();
            }
        }, {
            immediate: true
        });
        onBeforeUnmount(() => {
            initPendingNodeWatchStopHandle === null || initPendingNodeWatchStopHandle === void 0 ? void 0 : initPendingNodeWatchStopHandle();
        });
        const itemSizeRef = computed(() => {
            return depx(themeRef.value.self[createKey('optionHeight', props.size)]);
        });
        const paddingRef = computed(() => {
            return getPadding(themeRef.value.self[createKey('padding', props.size)]);
        });
        const valueSetRef = computed(() => {
            if (props.multiple && Array.isArray(props.value)) {
                return new Set(props.value);
            }
            return new Set();
        });
        const emptyRef = computed(() => {
            const tmNodes = flattenedNodesRef.value;
            return tmNodes && tmNodes.length === 0;
        });
        function doToggle(tmNode) {
            const { onToggle } = props;
            if (onToggle)
                onToggle(tmNode);
        }
        function doScroll(e) {
            const { onScroll } = props;
            if (onScroll)
                onScroll(e);
        }
        // required, scroller sync need to be triggered manually
        function handleVirtualListScroll(e) {
            var _a;
            (_a = scrollbarRef.value) === null || _a === void 0 ? void 0 : _a.sync();
            doScroll(e);
        }
        function handleVirtualListResize() {
            var _a;
            (_a = scrollbarRef.value) === null || _a === void 0 ? void 0 : _a.sync();
        }
        function getPendingTmNode() {
            const { value: pendingTmNode } = pendingNodeRef;
            if (pendingTmNode)
                return pendingTmNode;
            return null;
        }
        function handleOptionMouseEnter(e, tmNode) {
            if (tmNode.disabled)
                return;
            setPendingTmNode(tmNode, false);
        }
        function handleOptionClick(e, tmNode) {
            if (tmNode.disabled)
                return;
            doToggle(tmNode);
        }
        // keyboard related methods
        function handleKeyUp(e) {
            var _a;
            if (happensIn(e, 'action'))
                return;
            (_a = props.onKeyup) === null || _a === void 0 ? void 0 : _a.call(props, e);
        }
        function handleKeyDown(e) {
            var _a;
            if (happensIn(e, 'action'))
                return;
            (_a = props.onKeydown) === null || _a === void 0 ? void 0 : _a.call(props, e);
        }
        function handleMouseDown(e) {
            var _a;
            (_a = props.onMousedown) === null || _a === void 0 ? void 0 : _a.call(props, e);
            if (props.focusable)
                return;
            e.preventDefault();
        }
        function next() {
            const { value: pendingTmNode } = pendingNodeRef;
            if (pendingTmNode) {
                setPendingTmNode(pendingTmNode.getNext({ loop: true }), true);
            }
        }
        function prev() {
            const { value: pendingTmNode } = pendingNodeRef;
            if (pendingTmNode) {
                setPendingTmNode(pendingTmNode.getPrev({ loop: true }), true);
            }
        }
        function setPendingTmNode(tmNode, doScroll = false) {
            pendingNodeRef.value = tmNode;
            if (doScroll)
                scrollToPendingNode();
        }
        function scrollToPendingNode() {
            var _a, _b;
            const tmNode = pendingNodeRef.value;
            if (!tmNode)
                return;
            const fIndex = fIndexGetterRef.value(tmNode.key);
            if (fIndex === null)
                return;
            if (props.virtualScroll) {
                (_a = virtualListRef.value) === null || _a === void 0 ? void 0 : _a.scrollTo({ index: fIndex });
            }
            else {
                (_b = scrollbarRef.value) === null || _b === void 0 ? void 0 : _b.scrollTo({
                    index: fIndex,
                    elSize: itemSizeRef.value
                });
            }
        }
        function handleFocusin(e) {
            var _a, _b;
            if ((_a = selfRef.value) === null || _a === void 0 ? void 0 : _a.contains(e.target)) {
                (_b = props.onFocus) === null || _b === void 0 ? void 0 : _b.call(props, e);
            }
        }
        function handleFocusout(e) {
            var _a, _b;
            if (!((_a = selfRef.value) === null || _a === void 0 ? void 0 : _a.contains(e.relatedTarget))) {
                (_b = props.onBlur) === null || _b === void 0 ? void 0 : _b.call(props, e);
            }
        }
        provide(internalSelectionMenuInjectionKey, {
            handleOptionMouseEnter,
            handleOptionClick,
            valueSetRef,
            pendingTmNodeRef: pendingNodeRef,
            nodePropsRef: toRef(props, 'nodeProps'),
            showCheckmarkRef: toRef(props, 'showCheckmark'),
            multipleRef: toRef(props, 'multiple'),
            valueRef: toRef(props, 'value'),
            renderLabelRef: toRef(props, 'renderLabel'),
            renderOptionRef: toRef(props, 'renderOption'),
            labelFieldRef: toRef(props, 'labelField'),
            valueFieldRef: toRef(props, 'valueField')
        });
        provide(internalSelectionMenuBodyInjectionKey, selfRef);
        onMounted(() => {
            const { value } = scrollbarRef;
            if (value)
                value.sync();
        });
        const cssVarsRef = computed(() => {
            const { size } = props;
            const { common: { cubicBezierEaseInOut }, self: { height, borderRadius, color, groupHeaderTextColor, actionDividerColor, optionTextColorPressed, optionTextColor, optionTextColorDisabled, optionTextColorActive, optionOpacityDisabled, optionCheckColor, actionTextColor, optionColorPending, optionColorActive, loadingColor, loadingSize, optionColorActivePending, [createKey('optionFontSize', size)]: fontSize, [createKey('optionHeight', size)]: optionHeight, [createKey('optionPadding', size)]: optionPadding } } = themeRef.value;
            return {
                '--n-height': height,
                '--n-action-divider-color': actionDividerColor,
                '--n-action-text-color': actionTextColor,
                '--n-bezier': cubicBezierEaseInOut,
                '--n-border-radius': borderRadius,
                '--n-color': color,
                '--n-option-font-size': fontSize,
                '--n-group-header-text-color': groupHeaderTextColor,
                '--n-option-check-color': optionCheckColor,
                '--n-option-color-pending': optionColorPending,
                '--n-option-color-active': optionColorActive,
                '--n-option-color-active-pending': optionColorActivePending,
                '--n-option-height': optionHeight,
                '--n-option-opacity-disabled': optionOpacityDisabled,
                '--n-option-text-color': optionTextColor,
                '--n-option-text-color-active': optionTextColorActive,
                '--n-option-text-color-disabled': optionTextColorDisabled,
                '--n-option-text-color-pressed': optionTextColorPressed,
                '--n-option-padding': optionPadding,
                '--n-option-padding-left': getPadding(optionPadding, 'left'),
                '--n-option-padding-right': getPadding(optionPadding, 'right'),
                '--n-loading-color': loadingColor,
                '--n-loading-size': loadingSize
            };
        });
        const { inlineThemeDisabled } = props;
        const themeClassHandle = inlineThemeDisabled
            ? useThemeClass('internal-select-menu', computed(() => props.size[0]), cssVarsRef, props)
            : undefined;
        const exposedProps = {
            selfRef,
            next,
            prev,
            getPendingTmNode
        };
        useOnResize(selfRef, props.onResize);
        return Object.assign({ mergedTheme: themeRef, virtualListRef,
            scrollbarRef, itemSize: itemSizeRef, padding: paddingRef, flattenedNodes: flattenedNodesRef, empty: emptyRef, virtualListContainer() {
                const { value } = virtualListRef;
                return value === null || value === void 0 ? void 0 : value.listElRef;
            },
            virtualListContent() {
                const { value } = virtualListRef;
                return value === null || value === void 0 ? void 0 : value.itemsElRef;
            },
            doScroll,
            handleFocusin,
            handleFocusout,
            handleKeyUp,
            handleKeyDown,
            handleMouseDown,
            handleVirtualListResize,
            handleVirtualListScroll, cssVars: inlineThemeDisabled ? undefined : cssVarsRef, themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass, onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender }, exposedProps);
    },
    render() {
        const { $slots, virtualScroll, clsPrefix, mergedTheme, themeClass, onRender } = this;
        onRender === null || onRender === void 0 ? void 0 : onRender();
        return (h("div", { ref: "selfRef", tabindex: this.focusable ? 0 : -1, class: [
                `${clsPrefix}-base-select-menu`,
                themeClass,
                this.multiple && `${clsPrefix}-base-select-menu--multiple`
            ], style: this.cssVars, onFocusin: this.handleFocusin, onFocusout: this.handleFocusout, onKeyup: this.handleKeyUp, onKeydown: this.handleKeyDown, onMousedown: this.handleMouseDown, onMouseenter: this.onMouseenter, onMouseleave: this.onMouseleave },
            this.loading ? (h("div", { class: `${clsPrefix}-base-select-menu__loading` },
                h(NBaseLoading, { clsPrefix: clsPrefix, strokeWidth: 20 }))) : !this.empty ? (h(NScrollbar, { ref: "scrollbarRef", theme: mergedTheme.peers.Scrollbar, themeOverrides: mergedTheme.peerOverrides.Scrollbar, scrollable: this.scrollable, container: virtualScroll ? this.virtualListContainer : undefined, content: virtualScroll ? this.virtualListContent : undefined, onScroll: virtualScroll ? undefined : this.doScroll }, {
                default: () => {
                    return virtualScroll ? (h(VirtualList, { ref: "virtualListRef", class: `${clsPrefix}-virtual-list`, items: this.flattenedNodes, itemSize: this.itemSize, showScrollbar: false, paddingTop: this.padding.top, paddingBottom: this.padding.bottom, onResize: this.handleVirtualListResize, onScroll: this.handleVirtualListScroll, itemResizable: true }, {
                        default: ({ item: tmNode }) => {
                            return tmNode.isGroup ? (h(NSelectGroupHeader, { key: tmNode.key, clsPrefix: clsPrefix, tmNode: tmNode })) : tmNode.ignored ? null : (h(NSelectOption, { clsPrefix: clsPrefix, key: tmNode.key, tmNode: tmNode }));
                        }
                    })) : (h("div", { class: `${clsPrefix}-base-select-menu-option-wrapper`, style: {
                            paddingTop: this.padding.top,
                            paddingBottom: this.padding.bottom
                        } }, this.flattenedNodes.map((tmNode) => tmNode.isGroup ? (h(NSelectGroupHeader, { key: tmNode.key, clsPrefix: clsPrefix, tmNode: tmNode })) : (h(NSelectOption, { clsPrefix: clsPrefix, key: tmNode.key, tmNode: tmNode })))));
                }
            })) : (h("div", { class: `${clsPrefix}-base-select-menu__empty`, "data-empty": true }, resolveSlot($slots.empty, () => [
                h(NEmpty, { theme: mergedTheme.peers.Empty, themeOverrides: mergedTheme.peerOverrides.Empty })
            ]))),
            resolveWrappedSlot($slots.action, (children) => children && [
                h("div", { class: `${clsPrefix}-base-select-menu__action`, "data-action": true, key: "action" }, children),
                h(FocusDetector, { onFocus: this.onTabOut, key: "focus-detector" })
            ])));
    }
});

const style$6 = cB('base-wave', `
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
`);

const NBaseWave = defineComponent({
    name: 'BaseWave',
    props: {
        clsPrefix: {
            type: String,
            required: true
        }
    },
    setup(props) {
        useStyle('-base-wave', style$6, toRef(props, 'clsPrefix'));
        const selfRef = ref(null);
        const activeRef = ref(false);
        let animationTimerId = null;
        onBeforeUnmount(() => {
            if (animationTimerId !== null) {
                window.clearTimeout(animationTimerId);
            }
        });
        return {
            active: activeRef,
            selfRef,
            play() {
                if (animationTimerId !== null) {
                    window.clearTimeout(animationTimerId);
                    activeRef.value = false;
                    animationTimerId = null;
                }
                void nextTick(() => {
                    var _a;
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    void ((_a = selfRef.value) === null || _a === void 0 ? void 0 : _a.offsetHeight);
                    activeRef.value = true;
                    animationTimerId = window.setTimeout(() => {
                        activeRef.value = false;
                        animationTimerId = null;
                    }, 1000);
                });
            }
        };
    },
    render() {
        const { clsPrefix } = this;
        return (h("div", { ref: "selfRef", "aria-hidden": true, class: [
                `${clsPrefix}-base-wave`,
                this.active && `${clsPrefix}-base-wave--active`
            ] }));
    }
});

const commonVariables$2 = {
    space: '6px',
    spaceArrow: '10px',
    arrowOffset: '10px',
    arrowOffsetVertical: '10px',
    arrowHeight: '6px',
    padding: '8px 14px'
};

const self$4 = (vars) => {
    const { boxShadow2, popoverColor, textColor2, borderRadius, fontSize, dividerColor } = vars;
    return Object.assign(Object.assign({}, commonVariables$2), { fontSize,
        borderRadius, color: popoverColor, dividerColor, textColor: textColor2, boxShadow: boxShadow2 });
};
const popoverLight = {
    name: 'Popover',
    common: commonLight,
    self: self$4
};
const popoverLight$1 = popoverLight;

const oppositePlacement = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
};
const arrowSize = 'var(--n-arrow-height) * 1.414';
// vars:
// --n-bezier
// --n-bezier-ease-in
// --n-bezier-ease-out
// --n-font-size
// --n-text-color
// --n-color
// --n-border-radius
// --n-arrow-height
// --n-arrow-offset
// --n-arrow-offset-vertical
// --n-padding
// --n-space
// --n-space-arrow
// --n-divider-color
const style$5 = c([cB('popover', `
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 position: relative;
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 box-shadow: var(--n-box-shadow);
 word-break: break-word;
 `, [c('>', [cB('scrollbar', `
 height: inherit;
 max-height: inherit;
 `)]), cNotM('raw', `
 background-color: var(--n-color);
 border-radius: var(--n-border-radius);
 `, [cNotM('scrollable', [cNotM('show-header-or-footer', 'padding: var(--n-padding);')])]), cE('header', `
 padding: var(--n-padding);
 border-bottom: 1px solid var(--n-divider-color);
 transition: border-color .3s var(--n-bezier);
 `), cE('footer', `
 padding: var(--n-padding);
 border-top: 1px solid var(--n-divider-color);
 transition: border-color .3s var(--n-bezier);
 `), cM('scrollable, show-header-or-footer', [cE('content', `
 padding: var(--n-padding);
 `)])]), cB('popover-shared', `
 transform-origin: inherit;
 `, [cB('popover-arrow-wrapper', `
 position: absolute;
 overflow: hidden;
 pointer-events: none;
 `, [cB('popover-arrow', `
 transition: background-color .3s var(--n-bezier);
 position: absolute;
 display: block;
 width: calc(${arrowSize});
 height: calc(${arrowSize});
 box-shadow: 0 0 8px 0 rgba(0, 0, 0, .12);
 transform: rotate(45deg);
 background-color: var(--n-color);
 pointer-events: all;
 `)]),
// body transition
c('&.popover-transition-enter-from, &.popover-transition-leave-to', `
 opacity: 0;
 transform: scale(.85);
 `), c('&.popover-transition-enter-to, &.popover-transition-leave-from', `
 transform: scale(1);
 opacity: 1;
 `), c('&.popover-transition-enter-active', `
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 opacity .15s var(--n-bezier-ease-out),
 transform .15s var(--n-bezier-ease-out);
 `), c('&.popover-transition-leave-active', `
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 opacity .15s var(--n-bezier-ease-in),
 transform .15s var(--n-bezier-ease-in);
 `)]), placementStyle('top-start', `
 top: calc(${arrowSize} / -2);
 left: calc(${getArrowOffset('top-start')} - var(--v-offset-left));
 `), placementStyle('top', `
 top: calc(${arrowSize} / -2);
 transform: translateX(calc(${arrowSize} / -2)) rotate(45deg);
 left: 50%;
 `), placementStyle('top-end', `
 top: calc(${arrowSize} / -2);
 right: calc(${getArrowOffset('top-end')} + var(--v-offset-left));
 `), placementStyle('bottom-start', `
 bottom: calc(${arrowSize} / -2);
 left: calc(${getArrowOffset('bottom-start')} - var(--v-offset-left));
 `), placementStyle('bottom', `
 bottom: calc(${arrowSize} / -2);
 transform: translateX(calc(${arrowSize} / -2)) rotate(45deg);
 left: 50%;
 `), placementStyle('bottom-end', `
 bottom: calc(${arrowSize} / -2);
 right: calc(${getArrowOffset('bottom-end')} + var(--v-offset-left));
 `), placementStyle('left-start', `
 left: calc(${arrowSize} / -2);
 top: calc(${getArrowOffset('left-start')} - var(--v-offset-top));
 `), placementStyle('left', `
 left: calc(${arrowSize} / -2);
 transform: translateY(calc(${arrowSize} / -2)) rotate(45deg);
 top: 50%;
 `), placementStyle('left-end', `
 left: calc(${arrowSize} / -2);
 bottom: calc(${getArrowOffset('left-end')} + var(--v-offset-top));
 `), placementStyle('right-start', `
 right: calc(${arrowSize} / -2);
 top: calc(${getArrowOffset('right-start')} - var(--v-offset-top));
 `), placementStyle('right', `
 right: calc(${arrowSize} / -2);
 transform: translateY(calc(${arrowSize} / -2)) rotate(45deg);
 top: 50%;
 `), placementStyle('right-end', `
 right: calc(${arrowSize} / -2);
 bottom: calc(${getArrowOffset('right-end')} + var(--v-offset-top));
 `), ...map({
  top: ['right-start', 'left-start'],
  right: ['top-end', 'bottom-end'],
  bottom: ['right-end', 'left-end'],
  left: ['top-start', 'bottom-start']
}, (placements, direction) => {
  const isVertical = ['right', 'left'].includes(direction);
  const sizeType = isVertical ? 'width' : 'height';
  return placements.map(placement => {
    const isReverse = placement.split('-')[1] === 'end';
    const targetSize = `var(--v-target-${sizeType}, 0px)`;
    const centerOffset = `calc((${targetSize} - ${arrowSize}) / 2)`;
    const offset = getArrowOffset(placement);
    return c(`[v-placement="${placement}"] >`, [cB('popover-shared', [cM('center-arrow', [cB('popover-arrow', `${direction}: calc(max(${centerOffset}, ${offset}) ${isReverse ? '+' : '-'} var(--v-offset-${isVertical ? 'left' : 'top'}));`)])])]);
  });
})]);
function getArrowOffset(placement) {
  return ['top', 'bottom'].includes(placement.split('-')[0]) ? 'var(--n-arrow-offset)' : 'var(--n-arrow-offset-vertical)';
}
function placementStyle(placement, arrowStyleLiteral) {
  const position = placement.split('-')[0];
  const sizeStyle = ['top', 'bottom'].includes(position) ? 'height: var(--n-space-arrow);' : 'width: var(--n-space-arrow);';
  return c(`[v-placement="${placement}"] >`, [cB('popover-shared', `
 margin-${oppositePlacement[position]}: var(--n-space);
 `, [cM('show-arrow', `
 margin-${oppositePlacement[position]}: var(--n-space-arrow);
 `), cM('overlap', `
 margin: 0;
 `), cCB('popover-arrow-wrapper', `
 right: 0;
 left: 0;
 top: 0;
 bottom: 0;
 ${position}: 100%;
 ${oppositePlacement[position]}: auto;
 ${sizeStyle}
 `, [cB('popover-arrow', arrowStyleLiteral)])])]);
}

const popoverBodyProps = Object.assign(Object.assign({}, useTheme.props), { to: useAdjustedTo.propTo, show: Boolean, trigger: String, showArrow: Boolean, delay: Number, duration: Number, raw: Boolean, arrowPointToCenter: Boolean, arrowStyle: [String, Object], displayDirective: String, x: Number, y: Number, flip: Boolean, overlap: Boolean, placement: String, width: [Number, String], keepAliveOnHover: Boolean, scrollable: Boolean, contentStyle: [Object, String], headerStyle: [Object, String], footerStyle: [Object, String], 
    // private
    internalDeactivateImmediately: Boolean, animated: Boolean, onClickoutside: Function, internalTrapFocus: Boolean, internalOnAfterLeave: Function, 
    // deprecated
    minWidth: Number, maxWidth: Number });
const renderArrow = ({ arrowStyle, clsPrefix }) => {
    return (h("div", { key: "__popover-arrow__", class: `${clsPrefix}-popover-arrow-wrapper` },
        h("div", { class: `${clsPrefix}-popover-arrow`, style: arrowStyle })));
};
const NPopoverBody = defineComponent({
    name: 'PopoverBody',
    inheritAttrs: false,
    props: popoverBodyProps,
    setup(props, { slots, attrs }) {
        const { namespaceRef, mergedClsPrefixRef, inlineThemeDisabled } = useConfig(props);
        const themeRef = useTheme('Popover', '-popover', style$5, popoverLight$1, props, mergedClsPrefixRef);
        const followerRef = ref(null);
        const NPopover = inject('NPopover');
        const bodyRef = ref(null);
        const followerEnabledRef = ref(props.show);
        const displayedRef = ref(false);
        watchEffect(() => {
            const { show } = props;
            if (show && !isJsdom() && !props.internalDeactivateImmediately) {
                displayedRef.value = true;
            }
        });
        const directivesRef = computed(() => {
            const { trigger, onClickoutside } = props;
            const directives = [];
            const { positionManuallyRef: { value: positionManually } } = NPopover;
            if (!positionManually) {
                if (trigger === 'click' && !onClickoutside) {
                    directives.push([
                        clickoutside,
                        handleClickOutside,
                        undefined,
                        { capture: true }
                    ]);
                }
                if (trigger === 'hover') {
                    directives.push([mousemoveoutside, handleMouseMoveOutside]);
                }
            }
            if (onClickoutside) {
                directives.push([
                    clickoutside,
                    handleClickOutside,
                    undefined,
                    { capture: true }
                ]);
            }
            if (props.displayDirective === 'show' ||
                (props.animated && displayedRef.value)) {
                directives.push([vShow, props.show]);
            }
            return directives;
        });
        const styleRef = computed(() => {
            const width = props.width === 'trigger' ? undefined : formatLength(props.width);
            const style = [];
            if (width) {
                style.push({ width });
            }
            const { maxWidth, minWidth } = props;
            if (maxWidth) {
                style.push({ maxWidth: formatLength(maxWidth) });
            }
            if (minWidth) {
                style.push({ maxWidth: formatLength(minWidth) });
            }
            if (!inlineThemeDisabled) {
                style.push(cssVarsRef.value);
            }
            return style;
        });
        const cssVarsRef = computed(() => {
            const { common: { cubicBezierEaseInOut, cubicBezierEaseIn, cubicBezierEaseOut }, self: { space, spaceArrow, padding, fontSize, textColor, dividerColor, color, boxShadow, borderRadius, arrowHeight, arrowOffset, arrowOffsetVertical } } = themeRef.value;
            return {
                '--n-box-shadow': boxShadow,
                '--n-bezier': cubicBezierEaseInOut,
                '--n-bezier-ease-in': cubicBezierEaseIn,
                '--n-bezier-ease-out': cubicBezierEaseOut,
                '--n-font-size': fontSize,
                '--n-text-color': textColor,
                '--n-color': color,
                '--n-divider-color': dividerColor,
                '--n-border-radius': borderRadius,
                '--n-arrow-height': arrowHeight,
                '--n-arrow-offset': arrowOffset,
                '--n-arrow-offset-vertical': arrowOffsetVertical,
                '--n-padding': padding,
                '--n-space': space,
                '--n-space-arrow': spaceArrow
            };
        });
        const themeClassHandle = inlineThemeDisabled
            ? useThemeClass('popover', undefined, cssVarsRef, props)
            : undefined;
        NPopover.setBodyInstance({
            syncPosition
        });
        onBeforeUnmount(() => {
            NPopover.setBodyInstance(null);
        });
        watch(toRef(props, 'show'), (value) => {
            // If no animation, no transition component will be applied to the
            // component. So we need to trigger follower manaully.
            if (props.animated)
                return;
            if (value) {
                followerEnabledRef.value = true;
            }
            else {
                followerEnabledRef.value = false;
            }
        });
        function syncPosition() {
            var _a;
            (_a = followerRef.value) === null || _a === void 0 ? void 0 : _a.syncPosition();
        }
        function handleMouseEnter(e) {
            if (props.trigger === 'hover' && props.keepAliveOnHover && props.show) {
                NPopover.handleMouseEnter(e);
            }
        }
        function handleMouseLeave(e) {
            if (props.trigger === 'hover' && props.keepAliveOnHover) {
                NPopover.handleMouseLeave(e);
            }
        }
        function handleMouseMoveOutside(e) {
            if (props.trigger === 'hover' &&
                !getTriggerElement().contains(getPreciseEventTarget(e))) {
                NPopover.handleMouseMoveOutside(e);
            }
        }
        function handleClickOutside(e) {
            if ((props.trigger === 'click' &&
                !getTriggerElement().contains(getPreciseEventTarget(e))) ||
                props.onClickoutside) {
                NPopover.handleClickOutside(e);
            }
        }
        function getTriggerElement() {
            return NPopover.getTriggerElement();
        }
        provide(popoverBodyInjectionKey, bodyRef);
        provide(drawerBodyInjectionKey, null);
        provide(modalBodyInjectionKey, null);
        function renderContentNode() {
            themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender();
            const shouldRenderDom = props.displayDirective === 'show' ||
                props.show ||
                (props.animated && displayedRef.value);
            if (!shouldRenderDom) {
                return null;
            }
            let contentNode;
            const renderBody = NPopover.internalRenderBodyRef.value;
            const { value: mergedClsPrefix } = mergedClsPrefixRef;
            if (!renderBody) {
                const { value: extraClass } = NPopover.extraClassRef;
                const { internalTrapFocus } = props;
                const hasHeaderOrFooter = !isSlotEmpty(slots.header) || !isSlotEmpty(slots.footer);
                const renderContentInnerNode = () => {
                    var _a;
                    const body = hasHeaderOrFooter ? (h(Fragment, null,
                        resolveWrappedSlot(slots.header, (children) => {
                            return children ? (h("div", { class: `${mergedClsPrefix}-popover__header`, style: props.headerStyle }, children)) : null;
                        }),
                        resolveWrappedSlot(slots.default, (children) => {
                            return children ? (h("div", { class: `${mergedClsPrefix}-popover__content`, style: props.contentStyle }, slots)) : null;
                        }),
                        resolveWrappedSlot(slots.footer, (children) => {
                            return children ? (h("div", { class: `${mergedClsPrefix}-popover__footer`, style: props.footerStyle }, children)) : null;
                        }))) : props.scrollable ? ((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)) : (h("div", { class: `${mergedClsPrefix}-popover__content`, style: props.contentStyle }, slots));
                    const maybeScrollableBody = props.scrollable ? (h(XScrollbar, { contentClass: hasHeaderOrFooter
                            ? undefined
                            : `${mergedClsPrefix}-popover__content`, contentStyle: hasHeaderOrFooter ? undefined : props.contentStyle }, {
                        default: () => body
                    })) : (body);
                    const arrow = props.showArrow
                        ? renderArrow({
                            arrowStyle: props.arrowStyle,
                            clsPrefix: mergedClsPrefix
                        })
                        : null;
                    return [maybeScrollableBody, arrow];
                };
                contentNode = h('div', mergeProps({
                    class: [
                        `${mergedClsPrefix}-popover`,
                        `${mergedClsPrefix}-popover-shared`,
                        themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass.value,
                        extraClass.map((v) => `${mergedClsPrefix}-${v}`),
                        {
                            [`${mergedClsPrefix}-popover--scrollable`]: props.scrollable,
                            [`${mergedClsPrefix}-popover--show-header-or-footer`]: hasHeaderOrFooter,
                            [`${mergedClsPrefix}-popover--raw`]: props.raw,
                            [`${mergedClsPrefix}-popover-shared--overlap`]: props.overlap,
                            [`${mergedClsPrefix}-popover-shared--show-arrow`]: props.showArrow,
                            [`${mergedClsPrefix}-popover-shared--center-arrow`]: props.arrowPointToCenter
                        }
                    ],
                    ref: bodyRef,
                    style: styleRef.value,
                    onKeydown: NPopover.handleKeydown,
                    onMouseenter: handleMouseEnter,
                    onMouseleave: handleMouseLeave
                }, attrs), internalTrapFocus ? (h(VFocusTrap, { active: props.show, autoFocus: true }, { default: renderContentInnerNode })) : (renderContentInnerNode()));
            }
            else {
                contentNode = renderBody(
                // The popover class and overlap class must exists, they will be used
                // to place the body & transition animation.
                // Shadow class exists for reuse box-shadow.
                [
                    `${mergedClsPrefix}-popover-shared`,
                    themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass.value,
                    props.overlap && `${mergedClsPrefix}-popover-shared--overlap`,
                    props.showArrow && `${mergedClsPrefix}-popover-shared--show-arrow`,
                    props.arrowPointToCenter &&
                        `${mergedClsPrefix}-popover-shared--center-arrow`
                ], bodyRef, styleRef.value, handleMouseEnter, handleMouseLeave);
            }
            return withDirectives(contentNode, directivesRef.value);
        }
        return {
            displayed: displayedRef,
            namespace: namespaceRef,
            isMounted: NPopover.isMountedRef,
            zIndex: NPopover.zIndexRef,
            followerRef,
            adjustedTo: useAdjustedTo(props),
            followerEnabled: followerEnabledRef,
            renderContentNode
        };
    },
    render() {
        return (h(VFollower, { ref: "followerRef", zIndex: this.zIndex, show: this.show, enabled: this.followerEnabled, to: this.adjustedTo, x: this.x, y: this.y, flip: this.flip, placement: this.placement, containerClass: this.namespace, overlap: this.overlap, width: this.width === 'trigger' ? 'target' : undefined, teleportDisabled: this.adjustedTo === useAdjustedTo.tdkey }, {
            default: () => {
                return this.animated ? (h(Transition, { name: "popover-transition", appear: this.isMounted, 
                    // Don't use watch to enable follower, since the transition may
                    // make position sync timing very subtle and buggy.
                    onEnter: () => {
                        this.followerEnabled = true;
                    }, onAfterLeave: () => {
                        var _a;
                        (_a = this.internalOnAfterLeave) === null || _a === void 0 ? void 0 : _a.call(this);
                        this.followerEnabled = false;
                        this.displayed = false;
                    } }, {
                    default: this.renderContentNode
                })) : (this.renderContentNode());
            }
        }));
    }
});

const bodyPropKeys = Object.keys(popoverBodyProps);
const triggerEventMap = {
    focus: ['onFocus', 'onBlur'],
    click: ['onClick'],
    hover: ['onMouseenter', 'onMouseleave'],
    manual: [],
    nested: ['onFocus', 'onBlur', 'onMouseenter', 'onMouseleave', 'onClick']
};
function appendEvents(vNode, trigger, events) {
    triggerEventMap[trigger].forEach((eventName) => {
        if (!vNode.props)
            vNode.props = {};
        else {
            vNode.props = Object.assign({}, vNode.props);
        }
        const originalHandler = vNode.props[eventName];
        const handler = events[eventName];
        if (!originalHandler)
            vNode.props[eventName] = handler;
        else {
            vNode.props[eventName] = (...args) => {
                originalHandler(...args);
                handler(...args);
            };
        }
    });
}
const popoverBaseProps = {
    show: {
        type: Boolean,
        default: undefined
    },
    defaultShow: Boolean,
    showArrow: {
        type: Boolean,
        default: true
    },
    trigger: {
        type: String,
        default: 'hover'
    },
    delay: {
        type: Number,
        default: 100
    },
    duration: {
        type: Number,
        default: 100
    },
    raw: Boolean,
    placement: {
        type: String,
        default: 'top'
    },
    x: Number,
    y: Number,
    arrowPointToCenter: Boolean,
    disabled: Boolean,
    getDisabled: Function,
    displayDirective: {
        type: String,
        default: 'if'
    },
    arrowStyle: [String, Object],
    flip: {
        type: Boolean,
        default: true
    },
    animated: {
        type: Boolean,
        default: true
    },
    width: {
        type: [Number, String],
        default: undefined
    },
    overlap: Boolean,
    keepAliveOnHover: {
        type: Boolean,
        default: true
    },
    zIndex: Number,
    to: useAdjustedTo.propTo,
    scrollable: Boolean,
    contentStyle: [Object, String],
    headerStyle: [Object, String],
    footerStyle: [Object, String],
    // events
    onClickoutside: Function,
    'onUpdate:show': [Function, Array],
    onUpdateShow: [Function, Array],
    // internal
    internalDeactivateImmediately: Boolean,
    internalSyncTargetWithParent: Boolean,
    internalInheritedEventHandlers: {
        type: Array,
        default: () => []
    },
    internalTrapFocus: Boolean,
    internalExtraClass: {
        type: Array,
        default: () => []
    },
    // deprecated
    onShow: [Function, Array],
    onHide: [Function, Array],
    arrow: {
        type: Boolean,
        default: undefined
    },
    minWidth: Number,
    maxWidth: Number
};
const popoverProps = Object.assign(Object.assign(Object.assign({}, useTheme.props), popoverBaseProps), { internalOnAfterLeave: Function, internalRenderBody: Function });
const NPopover = defineComponent({
    name: 'Popover',
    inheritAttrs: false,
    props: popoverProps,
    __popover__: true,
    setup(props) {
        const isMountedRef = useIsMounted();
        const binderInstRef = ref(null);
        // setup show
        const controlledShowRef = computed(() => props.show);
        const uncontrolledShowRef = ref(props.defaultShow);
        const mergedShowWithoutDisabledRef = useMergedState(controlledShowRef, uncontrolledShowRef);
        const mergedShowConsideringDisabledPropRef = useMemo(() => {
            if (props.disabled)
                return false;
            return mergedShowWithoutDisabledRef.value;
        });
        const getMergedDisabled = () => {
            if (props.disabled)
                return true;
            const { getDisabled } = props;
            if (getDisabled === null || getDisabled === void 0 ? void 0 : getDisabled())
                return true;
            return false;
        };
        const getMergedShow = () => {
            if (getMergedDisabled())
                return false;
            return mergedShowWithoutDisabledRef.value;
        };
        // setup show-arrow
        const compatibleShowArrowRef = useCompitable(props, ['arrow', 'showArrow']);
        const mergedShowArrowRef = computed(() => {
            if (props.overlap)
                return false;
            return compatibleShowArrowRef.value;
        });
        // bodyInstance
        let bodyInstance = null;
        const showTimerIdRef = ref(null);
        const hideTimerIdRef = ref(null);
        const positionManuallyRef = useMemo(() => {
            return props.x !== undefined && props.y !== undefined;
        });
        // methods
        function doUpdateShow(value) {
            const { 'onUpdate:show': _onUpdateShow, onUpdateShow, onShow, onHide } = props;
            uncontrolledShowRef.value = value;
            if (_onUpdateShow) {
                call(_onUpdateShow, value);
            }
            if (onUpdateShow) {
                call(onUpdateShow, value);
            }
            if (value && onShow) {
                call(onShow, true);
            }
            if (value && onHide) {
                call(onHide, false);
            }
        }
        function syncPosition() {
            if (bodyInstance) {
                bodyInstance.syncPosition();
            }
        }
        function clearShowTimer() {
            const { value: showTimerId } = showTimerIdRef;
            if (showTimerId) {
                window.clearTimeout(showTimerId);
                showTimerIdRef.value = null;
            }
        }
        function clearHideTimer() {
            const { value: hideTimerId } = hideTimerIdRef;
            if (hideTimerId) {
                window.clearTimeout(hideTimerId);
                hideTimerIdRef.value = null;
            }
        }
        function handleFocus() {
            const mergedDisabled = getMergedDisabled();
            if (props.trigger === 'focus' && !mergedDisabled) {
                if (getMergedShow())
                    return;
                doUpdateShow(true);
            }
        }
        function handleBlur() {
            const mergedDisabled = getMergedDisabled();
            if (props.trigger === 'focus' && !mergedDisabled) {
                if (!getMergedShow())
                    return;
                doUpdateShow(false);
            }
        }
        function handleMouseEnter() {
            const mergedDisabled = getMergedDisabled();
            if (props.trigger === 'hover' && !mergedDisabled) {
                clearHideTimer();
                if (showTimerIdRef.value !== null)
                    return;
                if (getMergedShow())
                    return;
                const delayCallback = () => {
                    doUpdateShow(true);
                    showTimerIdRef.value = null;
                };
                const { delay } = props;
                if (delay === 0) {
                    delayCallback();
                }
                else {
                    showTimerIdRef.value = window.setTimeout(delayCallback, delay);
                }
            }
        }
        function handleMouseLeave() {
            const mergedDisabled = getMergedDisabled();
            if (props.trigger === 'hover' && !mergedDisabled) {
                clearShowTimer();
                if (hideTimerIdRef.value !== null)
                    return;
                if (!getMergedShow())
                    return;
                const delayedCallback = () => {
                    doUpdateShow(false);
                    hideTimerIdRef.value = null;
                };
                const { duration } = props;
                if (duration === 0) {
                    delayedCallback();
                }
                else {
                    hideTimerIdRef.value = window.setTimeout(delayedCallback, duration);
                }
            }
        }
        // will be called in popover-content
        function handleMouseMoveOutside() {
            handleMouseLeave();
        }
        // will be called in popover-content
        function handleClickOutside(e) {
            var _a;
            if (!getMergedShow())
                return;
            if (props.trigger === 'click') {
                clearShowTimer();
                clearHideTimer();
                doUpdateShow(false);
            }
            (_a = props.onClickoutside) === null || _a === void 0 ? void 0 : _a.call(props, e);
        }
        function handleClick() {
            if (props.trigger === 'click' && !getMergedDisabled()) {
                clearShowTimer();
                clearHideTimer();
                const nextShow = !getMergedShow();
                doUpdateShow(nextShow);
            }
        }
        function handleKeydown(e) {
            if (!props.internalTrapFocus)
                return;
            if (e.key === 'Escape') {
                clearShowTimer();
                clearHideTimer();
                doUpdateShow(false);
            }
        }
        function setShow(value) {
            uncontrolledShowRef.value = value;
        }
        function getTriggerElement() {
            var _a;
            return (_a = binderInstRef.value) === null || _a === void 0 ? void 0 : _a.targetRef;
        }
        function setBodyInstance(value) {
            bodyInstance = value;
        }
        provide('NPopover', {
            getTriggerElement,
            handleKeydown,
            handleMouseEnter,
            handleMouseLeave,
            handleClickOutside,
            handleMouseMoveOutside,
            setBodyInstance,
            positionManuallyRef,
            isMountedRef,
            zIndexRef: toRef(props, 'zIndex'),
            extraClassRef: toRef(props, 'internalExtraClass'),
            internalRenderBodyRef: toRef(props, 'internalRenderBody')
        });
        watchEffect(() => {
            if (mergedShowWithoutDisabledRef.value && getMergedDisabled()) {
                doUpdateShow(false);
            }
        });
        return {
            binderInstRef,
            positionManually: positionManuallyRef,
            mergedShowConsideringDisabledProp: mergedShowConsideringDisabledPropRef,
            // if to show popover body
            uncontrolledShow: uncontrolledShowRef,
            mergedShowArrow: mergedShowArrowRef,
            getMergedShow,
            setShow,
            handleClick,
            handleMouseEnter,
            handleMouseLeave,
            handleFocus,
            handleBlur,
            syncPosition
        };
    },
    render() {
        var _a;
        const { positionManually, $slots: slots } = this;
        let triggerVNode;
        let popoverInside = false;
        if (!positionManually) {
            if (slots.activator) {
                triggerVNode = getFirstSlotVNode(slots, 'activator');
            }
            else {
                triggerVNode = getFirstSlotVNode(slots, 'trigger');
            }
            if (triggerVNode) {
                triggerVNode = cloneVNode(triggerVNode);
                triggerVNode =
                    triggerVNode.type === Text
                        ? h('span', [triggerVNode])
                        : triggerVNode;
                const handlers = {
                    onClick: this.handleClick,
                    onMouseenter: this.handleMouseEnter,
                    onMouseleave: this.handleMouseLeave,
                    onFocus: this.handleFocus,
                    onBlur: this.handleBlur
                };
                if ((_a = triggerVNode.type) === null || _a === void 0 ? void 0 : _a.__popover__) {
                    popoverInside = true;
                    // We assume that there's no DOM event handlers on popover element
                    if (!triggerVNode.props) {
                        triggerVNode.props = {
                            internalSyncTargetWithParent: true,
                            internalInheritedEventHandlers: []
                        };
                    }
                    triggerVNode.props.internalSyncTargetWithParent = true;
                    if (!triggerVNode.props.internalInheritedEventHandlers) {
                        triggerVNode.props.internalInheritedEventHandlers = [handlers];
                    }
                    else {
                        triggerVNode.props.internalInheritedEventHandlers = [
                            handlers,
                            ...triggerVNode.props.internalInheritedEventHandlers
                        ];
                    }
                }
                else {
                    const { internalInheritedEventHandlers } = this;
                    const ascendantAndCurrentHandlers = [
                        handlers,
                        ...internalInheritedEventHandlers
                    ];
                    const mergedHandlers = {
                        onBlur: (e) => {
                            ascendantAndCurrentHandlers.forEach((_handlers) => {
                                _handlers.onBlur(e);
                            });
                        },
                        onFocus: (e) => {
                            ascendantAndCurrentHandlers.forEach((_handlers) => {
                                _handlers.onFocus(e);
                            });
                        },
                        onClick: (e) => {
                            ascendantAndCurrentHandlers.forEach((_handlers) => {
                                _handlers.onClick(e);
                            });
                        },
                        onMouseenter: (e) => {
                            ascendantAndCurrentHandlers.forEach((_handlers) => {
                                _handlers.onMouseenter(e);
                            });
                        },
                        onMouseleave: (e) => {
                            ascendantAndCurrentHandlers.forEach((_handlers) => {
                                _handlers.onMouseleave(e);
                            });
                        }
                    };
                    appendEvents(triggerVNode, internalInheritedEventHandlers
                        ? 'nested'
                        : positionManually
                            ? 'manual'
                            : this.trigger, mergedHandlers);
                }
            }
        }
        return (h(VBinder, { ref: "binderInstRef", syncTarget: !popoverInside, syncTargetWithParent: this.internalSyncTargetWithParent }, {
            default: () => {
                // We need to subscribe it. Sometimes rerender won't ge triggered.
                // `mergedShowConsideringDisabledProp` is not the final disabled status.
                // In ellpisis it's dynamic.
                void this.mergedShowConsideringDisabledProp;
                const mergedShow = this.getMergedShow();
                return [
                    this.internalTrapFocus && mergedShow
                        ? withDirectives(h("div", { style: { position: 'fixed', inset: 0 } }), [
                            [
                                zindexable,
                                {
                                    enabled: mergedShow,
                                    zIndex: this.zIndex
                                }
                            ]
                        ])
                        : null,
                    positionManually
                        ? null
                        : h(VTarget, null, {
                            default: () => triggerVNode
                        }),
                    h(NPopoverBody, keep(this.$props, bodyPropKeys, Object.assign(Object.assign({}, this.$attrs), { showArrow: this.mergedShowArrow, show: mergedShow })), {
                        default: () => { var _a, _b; return (_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a); },
                        header: () => { var _a, _b; return (_b = (_a = this.$slots).header) === null || _b === void 0 ? void 0 : _b.call(_a); },
                        footer: () => { var _a, _b; return (_b = (_a = this.$slots).footer) === null || _b === void 0 ? void 0 : _b.call(_a); }
                    })
                ];
            }
        }));
    }
});

const commonVariables$1 = {
    closeIconSizeTiny: '12px',
    closeIconSizeSmall: '12px',
    closeIconSizeMedium: '14px',
    closeIconSizeLarge: '14px',
    closeSizeTiny: '16px',
    closeSizeSmall: '16px',
    closeSizeMedium: '18px',
    closeSizeLarge: '18px',
    padding: '0 7px',
    closeMargin: '0 0 0 4px',
    closeMarginRtl: '0 4px 0 0'
};

const self$3 = (vars) => {
    const { textColor2, primaryColorHover, primaryColorPressed, primaryColor, infoColor, successColor, warningColor, errorColor, baseColor, borderColor, opacityDisabled, tagColor, closeIconColor, closeIconColorHover, closeIconColorPressed, borderRadiusSmall: borderRadius, fontSizeMini, fontSizeTiny, fontSizeSmall, fontSizeMedium, heightMini, heightTiny, heightSmall, heightMedium, closeColorHover, closeColorPressed, buttonColor2Hover, buttonColor2Pressed, fontWeightStrong } = vars;
    return Object.assign(Object.assign({}, commonVariables$1), { closeBorderRadius: borderRadius, heightTiny: heightMini, heightSmall: heightTiny, heightMedium: heightSmall, heightLarge: heightMedium, borderRadius,
        opacityDisabled, fontSizeTiny: fontSizeMini, fontSizeSmall: fontSizeTiny, fontSizeMedium: fontSizeSmall, fontSizeLarge: fontSizeMedium, fontWeightStrong, 
        // checked
        textColorCheckable: textColor2, textColorHoverCheckable: textColor2, textColorPressedCheckable: textColor2, textColorChecked: baseColor, colorCheckable: '#0000', colorHoverCheckable: buttonColor2Hover, colorPressedCheckable: buttonColor2Pressed, colorChecked: primaryColor, colorCheckedHover: primaryColorHover, colorCheckedPressed: primaryColorPressed, 
        // default
        border: `1px solid ${borderColor}`, textColor: textColor2, color: tagColor, colorBordered: 'rgb(250, 250, 252)', closeIconColor,
        closeIconColorHover,
        closeIconColorPressed,
        closeColorHover,
        closeColorPressed, borderPrimary: `1px solid ${changeColor(primaryColor, { alpha: 0.3 })}`, textColorPrimary: primaryColor, colorPrimary: changeColor(primaryColor, { alpha: 0.12 }), colorBorderedPrimary: changeColor(primaryColor, { alpha: 0.1 }), closeIconColorPrimary: primaryColor, closeIconColorHoverPrimary: primaryColor, closeIconColorPressedPrimary: primaryColor, closeColorHoverPrimary: changeColor(primaryColor, { alpha: 0.12 }), closeColorPressedPrimary: changeColor(primaryColor, { alpha: 0.18 }), borderInfo: `1px solid ${changeColor(infoColor, { alpha: 0.3 })}`, textColorInfo: infoColor, colorInfo: changeColor(infoColor, { alpha: 0.12 }), colorBorderedInfo: changeColor(infoColor, { alpha: 0.1 }), closeIconColorInfo: infoColor, closeIconColorHoverInfo: infoColor, closeIconColorPressedInfo: infoColor, closeColorHoverInfo: changeColor(infoColor, { alpha: 0.12 }), closeColorPressedInfo: changeColor(infoColor, { alpha: 0.18 }), borderSuccess: `1px solid ${changeColor(successColor, { alpha: 0.3 })}`, textColorSuccess: successColor, colorSuccess: changeColor(successColor, { alpha: 0.12 }), colorBorderedSuccess: changeColor(successColor, { alpha: 0.1 }), closeIconColorSuccess: successColor, closeIconColorHoverSuccess: successColor, closeIconColorPressedSuccess: successColor, closeColorHoverSuccess: changeColor(successColor, { alpha: 0.12 }), closeColorPressedSuccess: changeColor(successColor, { alpha: 0.18 }), borderWarning: `1px solid ${changeColor(warningColor, { alpha: 0.35 })}`, textColorWarning: warningColor, colorWarning: changeColor(warningColor, { alpha: 0.15 }), colorBorderedWarning: changeColor(warningColor, { alpha: 0.12 }), closeIconColorWarning: warningColor, closeIconColorHoverWarning: warningColor, closeIconColorPressedWarning: warningColor, closeColorHoverWarning: changeColor(warningColor, { alpha: 0.12 }), closeColorPressedWarning: changeColor(warningColor, { alpha: 0.18 }), borderError: `1px solid ${changeColor(errorColor, { alpha: 0.23 })}`, textColorError: errorColor, colorError: changeColor(errorColor, { alpha: 0.1 }), colorBorderedError: changeColor(errorColor, { alpha: 0.08 }), closeIconColorError: errorColor, closeIconColorHoverError: errorColor, closeIconColorPressedError: errorColor, closeColorHoverError: changeColor(errorColor, { alpha: 0.12 }), closeColorPressedError: changeColor(errorColor, { alpha: 0.18 }) });
};
const tagLight = {
    name: 'Tag',
    common: commonLight,
    self: self$3
};
const tagLight$1 = tagLight;

const commonProps = {
    color: Object,
    type: {
        type: String,
        default: 'default'
    },
    round: Boolean,
    size: {
        type: String,
        default: 'medium'
    },
    closable: Boolean,
    disabled: {
        type: Boolean,
        default: undefined
    }
};

// vars:
// --n-bezier
// --n-border-radius
// --n-border
// --n-close-icon-color
// --n-close-icon-color-hover
// --n-close-icon-color-pressed
// --n-close-margin
// --n-close-size
// --n-color
// --n-color-checkable
// --n-color-checked
// --n-color-checked-hover
// --n-color-checked-pressed
// --n-color-hover-checkable
// --n-color-pressed-checkable
// --n-font-size
// --n-height
// --n-opacity-disabled
// --n-padding
// --n-text-color
// --n-text-color-checkable
// --n-text-color-checked
// --n-text-color-hover-checkable
// --n-text-color-pressed-checkable
// --n-font-weight-strong
const style$4 = cB('tag', `
 white-space: nowrap;
 position: relative;
 box-sizing: border-box;
 cursor: default;
 display: inline-flex;
 align-items: center;
 flex-wrap: nowrap;
 padding: var(--n-padding);
 border-radius: var(--n-border-radius);
 color: var(--n-text-color);
 background-color: var(--n-color);
 transition: 
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 line-height: 1;
 height: var(--n-height);
 font-size: var(--n-font-size);
`, [cM('strong', `
 font-weight: var(--n-font-weight-strong);
 `), cE('border', `
 pointer-events: none;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 border: var(--n-border);
 transition: border-color .3s var(--n-bezier);
 `), cE('icon', `
 display: flex;
 margin: 0 4px 0 0;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 font-size: var(--n-avatar-size-override);
 `), cE('avatar', `
 display: flex;
 margin: 0 6px 0 0;
 `), cE('close', `
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `), cM('round', `
 padding: 0 calc(var(--n-height) / 3);
 border-radius: calc(var(--n-height) / 2);
 `, [cE('icon', `
 margin: 0 4px 0 calc((var(--n-height) - 8px) / -2);
 `), cE('avatar', `
 margin: 0 6px 0 calc((var(--n-height) - 8px) / -2);
 `), cM('closable', `
 padding: 0 calc(var(--n-height) / 4) 0 calc(var(--n-height) / 3);
 `)]), cM('icon, avatar', [cM('round', `
 padding: 0 calc(var(--n-height) / 3) 0 calc(var(--n-height) / 2);
 `)]), cM('disabled', `
 cursor: not-allowed !important;
 opacity: var(--n-opacity-disabled);
 `), cM('checkable', `
 cursor: pointer;
 box-shadow: none;
 color: var(--n-text-color-checkable);
 background-color: var(--n-color-checkable);
 `, [cNotM('disabled', [c('&:hover', 'background-color: var(--n-color-hover-checkable);', [cNotM('checked', 'color: var(--n-text-color-hover-checkable);')]), c('&:active', 'background-color: var(--n-color-pressed-checkable);', [cNotM('checked', 'color: var(--n-text-color-pressed-checkable);')])]), cM('checked', `
 color: var(--n-text-color-checked);
 background-color: var(--n-color-checked);
 `, [cNotM('disabled', [c('&:hover', 'background-color: var(--n-color-checked-hover);'), c('&:active', 'background-color: var(--n-color-checked-pressed);')])])])]);

const tagProps = Object.assign(Object.assign(Object.assign({}, useTheme.props), commonProps), { bordered: {
        type: Boolean,
        default: undefined
    }, checked: Boolean, checkable: Boolean, strong: Boolean, triggerClickOnClose: Boolean, onClose: [Array, Function], onMouseenter: Function, onMouseleave: Function, 'onUpdate:checked': Function, onUpdateChecked: Function, 
    // private
    internalCloseFocusable: {
        type: Boolean,
        default: true
    }, internalCloseIsButtonTag: {
        type: Boolean,
        default: true
    }, 
    // deprecated
    onCheckedChange: Function });
const tagInjectionKey = createInjectionKey('n-tag');
const NTag = defineComponent({
    name: 'Tag',
    props: tagProps,
    setup(props) {
        const contentRef = ref(null);
        const { mergedBorderedRef, mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } = useConfig(props);
        const themeRef = useTheme('Tag', '-tag', style$4, tagLight$1, props, mergedClsPrefixRef);
        provide(tagInjectionKey, {
            roundRef: toRef(props, 'round')
        });
        function handleClick(e) {
            if (!props.disabled) {
                if (props.checkable) {
                    const { checked, onCheckedChange, onUpdateChecked, 'onUpdate:checked': _onUpdateChecked } = props;
                    if (onUpdateChecked)
                        onUpdateChecked(!checked);
                    if (_onUpdateChecked)
                        _onUpdateChecked(!checked);
                    // deprecated
                    if (onCheckedChange)
                        onCheckedChange(!checked);
                }
            }
        }
        function handleCloseClick(e) {
            if (!props.triggerClickOnClose) {
                e.stopPropagation();
            }
            if (!props.disabled) {
                const { onClose } = props;
                if (onClose)
                    call(onClose, e);
            }
        }
        const tagPublicMethods = {
            setTextContent(textContent) {
                const { value } = contentRef;
                if (value)
                    value.textContent = textContent;
            }
        };
        const rtlEnabledRef = useRtl('Tag', mergedRtlRef, mergedClsPrefixRef);
        const cssVarsRef = computed(() => {
            const { type, size, color: { color, textColor } = {} } = props;
            const { common: { cubicBezierEaseInOut }, self: { padding, closeMargin, closeMarginRtl, borderRadius, opacityDisabled, textColorCheckable, textColorHoverCheckable, textColorPressedCheckable, textColorChecked, colorCheckable, colorHoverCheckable, colorPressedCheckable, colorChecked, colorCheckedHover, colorCheckedPressed, closeBorderRadius, fontWeightStrong, [createKey('colorBordered', type)]: colorBordered, [createKey('closeSize', size)]: closeSize, [createKey('closeIconSize', size)]: closeIconSize, [createKey('fontSize', size)]: fontSize, [createKey('height', size)]: height, [createKey('color', type)]: typedColor, [createKey('textColor', type)]: typeTextColor, [createKey('border', type)]: border, [createKey('closeIconColor', type)]: closeIconColor, [createKey('closeIconColorHover', type)]: closeIconColorHover, [createKey('closeIconColorPressed', type)]: closeIconColorPressed, [createKey('closeColorHover', type)]: closeColorHover, [createKey('closeColorPressed', type)]: closeColorPressed } } = themeRef.value;
            return {
                '--n-font-weight-strong': fontWeightStrong,
                '--n-avatar-size-override': `calc(${height} - 8px)`,
                '--n-bezier': cubicBezierEaseInOut,
                '--n-border-radius': borderRadius,
                '--n-border': border,
                '--n-close-icon-size': closeIconSize,
                '--n-close-color-pressed': closeColorPressed,
                '--n-close-color-hover': closeColorHover,
                '--n-close-border-radius': closeBorderRadius,
                '--n-close-icon-color': closeIconColor,
                '--n-close-icon-color-hover': closeIconColorHover,
                '--n-close-icon-color-pressed': closeIconColorPressed,
                '--n-close-icon-color-disabled': closeIconColor,
                '--n-close-margin': closeMargin,
                '--n-close-margin-rtl': closeMarginRtl,
                '--n-close-size': closeSize,
                '--n-color': color || (mergedBorderedRef.value ? colorBordered : typedColor),
                '--n-color-checkable': colorCheckable,
                '--n-color-checked': colorChecked,
                '--n-color-checked-hover': colorCheckedHover,
                '--n-color-checked-pressed': colorCheckedPressed,
                '--n-color-hover-checkable': colorHoverCheckable,
                '--n-color-pressed-checkable': colorPressedCheckable,
                '--n-font-size': fontSize,
                '--n-height': height,
                '--n-opacity-disabled': opacityDisabled,
                '--n-padding': padding,
                '--n-text-color': textColor || typeTextColor,
                '--n-text-color-checkable': textColorCheckable,
                '--n-text-color-checked': textColorChecked,
                '--n-text-color-hover-checkable': textColorHoverCheckable,
                '--n-text-color-pressed-checkable': textColorPressedCheckable
            };
        });
        const themeClassHandle = inlineThemeDisabled
            ? useThemeClass('tag', computed(() => {
                let hash = '';
                const { type, size, color: { color, textColor } = {} } = props;
                hash += type[0];
                hash += size[0];
                if (color) {
                    hash += `a${color2Class(color)}`;
                }
                if (textColor) {
                    hash += `b${color2Class(textColor)}`;
                }
                if (mergedBorderedRef.value) {
                    hash += 'c';
                }
                return hash;
            }), cssVarsRef, props)
            : undefined;
        return Object.assign(Object.assign({}, tagPublicMethods), { rtlEnabled: rtlEnabledRef, mergedClsPrefix: mergedClsPrefixRef, contentRef, mergedBordered: mergedBorderedRef, handleClick,
            handleCloseClick, cssVars: inlineThemeDisabled ? undefined : cssVarsRef, themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass, onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender });
    },
    render() {
        var _a, _b;
        const { mergedClsPrefix, rtlEnabled, closable, color: { borderColor } = {}, round, onRender, $slots } = this;
        onRender === null || onRender === void 0 ? void 0 : onRender();
        const avatarNode = resolveWrappedSlot($slots.avatar, (children) => children && (h("div", { class: `${mergedClsPrefix}-tag__avatar` }, children)));
        const iconNode = resolveWrappedSlot($slots.icon, (children) => children && h("div", { class: `${mergedClsPrefix}-tag__icon` }, children));
        return (h("div", { class: [
                `${mergedClsPrefix}-tag`,
                this.themeClass,
                {
                    [`${mergedClsPrefix}-tag--rtl`]: rtlEnabled,
                    [`${mergedClsPrefix}-tag--strong`]: this.strong,
                    [`${mergedClsPrefix}-tag--disabled`]: this.disabled,
                    [`${mergedClsPrefix}-tag--checkable`]: this.checkable,
                    [`${mergedClsPrefix}-tag--checked`]: this.checkable && this.checked,
                    [`${mergedClsPrefix}-tag--round`]: round,
                    [`${mergedClsPrefix}-tag--avatar`]: avatarNode,
                    [`${mergedClsPrefix}-tag--icon`]: iconNode,
                    [`${mergedClsPrefix}-tag--closable`]: closable
                }
            ], style: this.cssVars, onClick: this.handleClick, onMouseenter: this.onMouseenter, onMouseleave: this.onMouseleave },
            iconNode || avatarNode,
            h("span", { class: `${mergedClsPrefix}-tag__content`, ref: "contentRef" }, (_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a)),
            !this.checkable && closable ? (h(NBaseClose, { clsPrefix: mergedClsPrefix, class: `${mergedClsPrefix}-tag__close`, disabled: this.disabled, onClick: this.handleCloseClick, focusable: this.internalCloseFocusable, round: round, isButtonTag: this.internalCloseIsButtonTag, absolute: true })) : null,
            !this.checkable && this.mergedBordered ? (h("div", { class: `${mergedClsPrefix}-tag__border`, style: { borderColor } })) : null));
    }
});

// vars:
// --n-bezier
// --n-clear-color
// --n-clear-size
// --n-clear-color-hover
// --n-clear-color-pressed
const style$3 = cB('base-clear', `
 flex-shrink: 0;
 height: 1em;
 width: 1em;
 position: relative;
`, [c('>', [cE('clear', `
 font-size: var(--n-clear-size);
 height: 1em;
 width: 1em;
 cursor: pointer;
 color: var(--n-clear-color);
 transition: color .3s var(--n-bezier);
 display: flex;
 `, [c('&:hover', `
 color: var(--n-clear-color-hover)!important;
 `), c('&:active', `
 color: var(--n-clear-color-pressed)!important;
 `)]), cE('placeholder', `
 display: flex;
 `), cE('clear, placeholder', `
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `, [iconSwitchTransition({
  originalTransform: 'translateX(-50%) translateY(-50%)',
  left: '50%',
  top: '50%'
})])])]);

const NBaseClear = defineComponent({
    name: 'BaseClear',
    props: {
        clsPrefix: {
            type: String,
            required: true
        },
        show: Boolean,
        onClear: Function
    },
    setup(props) {
        useStyle('-base-clear', style$3, toRef(props, 'clsPrefix'));
        return {
            handleMouseDown(e) {
                e.preventDefault();
            }
        };
    },
    render() {
        const { clsPrefix } = this;
        return (h("div", { class: `${clsPrefix}-base-clear` },
            h(NIconSwitchTransition, null, {
                default: () => {
                    var _a, _b;
                    return this.show ? (h("div", { key: "dismiss", class: `${clsPrefix}-base-clear__clear`, onClick: this.onClear, onMousedown: this.handleMouseDown, "data-clear": true }, resolveSlot(this.$slots.icon, () => [
                        h(NBaseIcon, { clsPrefix: clsPrefix }, {
                            default: () => h(ClearIcon, null)
                        })
                    ]))) : (h("div", { key: "icon", class: `${clsPrefix}-base-clear__placeholder` }, (_b = (_a = this.$slots).placeholder) === null || _b === void 0 ? void 0 : _b.call(_a)));
                }
            })));
    }
});

const Suffix = defineComponent({
    name: 'InternalSelectionSuffix',
    props: {
        clsPrefix: {
            type: String,
            required: true
        },
        showArrow: {
            type: Boolean,
            default: undefined
        },
        showClear: {
            type: Boolean,
            default: undefined
        },
        loading: {
            type: Boolean,
            default: false
        },
        onClear: Function
    },
    setup(props, { slots }) {
        return () => {
            const { clsPrefix } = props;
            return (h(NBaseLoading, { clsPrefix: clsPrefix, class: `${clsPrefix}-base-suffix`, strokeWidth: 24, scale: 0.85, show: props.loading }, {
                default: () => props.showArrow ? (h(NBaseClear, { clsPrefix: clsPrefix, show: props.showClear, onClear: props.onClear }, {
                    placeholder: () => (h(NBaseIcon, { clsPrefix: clsPrefix, class: `${clsPrefix}-base-suffix__arrow` }, {
                        default: () => resolveSlot(slots.default, () => [
                            h(ChevronDownIcon, null)
                        ])
                    }))
                })) : null
            }));
        };
    }
});

const commonVars = {
    paddingSingle: '0 26px 0 12px',
    paddingMultiple: '3px 26px 0 12px',
    clearSize: '16px',
    arrowSize: '16px'
};

const self$2 = (vars) => {
    const { borderRadius, textColor2, textColorDisabled, inputColor, inputColorDisabled, primaryColor, primaryColorHover, warningColor, warningColorHover, errorColor, errorColorHover, borderColor, iconColor, iconColorDisabled, clearColor, clearColorHover, clearColorPressed, placeholderColor, placeholderColorDisabled, fontSizeTiny, fontSizeSmall, fontSizeMedium, fontSizeLarge, heightTiny, heightSmall, heightMedium, heightLarge } = vars;
    return Object.assign(Object.assign({}, commonVars), { fontSizeTiny,
        fontSizeSmall,
        fontSizeMedium,
        fontSizeLarge,
        heightTiny,
        heightSmall,
        heightMedium,
        heightLarge,
        borderRadius, 
        // default
        textColor: textColor2, textColorDisabled,
        placeholderColor,
        placeholderColorDisabled, color: inputColor, colorDisabled: inputColorDisabled, colorActive: inputColor, border: `1px solid ${borderColor}`, borderHover: `1px solid ${primaryColorHover}`, borderActive: `1px solid ${primaryColor}`, borderFocus: `1px solid ${primaryColorHover}`, boxShadowHover: 'none', boxShadowActive: `0 0 0 2px ${changeColor(primaryColor, {
            alpha: 0.2
        })}`, boxShadowFocus: `0 0 0 2px ${changeColor(primaryColor, {
            alpha: 0.2
        })}`, caretColor: primaryColor, arrowColor: iconColor, arrowColorDisabled: iconColorDisabled, loadingColor: primaryColor, 
        // warning
        borderWarning: `1px solid ${warningColor}`, borderHoverWarning: `1px solid ${warningColorHover}`, borderActiveWarning: `1px solid ${warningColor}`, borderFocusWarning: `1px solid ${warningColorHover}`, boxShadowHoverWarning: 'none', boxShadowActiveWarning: `0 0 0 2px ${changeColor(warningColor, {
            alpha: 0.2
        })}`, boxShadowFocusWarning: `0 0 0 2px ${changeColor(warningColor, {
            alpha: 0.2
        })}`, colorActiveWarning: inputColor, caretColorWarning: warningColor, 
        // error
        borderError: `1px solid ${errorColor}`, borderHoverError: `1px solid ${errorColorHover}`, borderActiveError: `1px solid ${errorColor}`, borderFocusError: `1px solid ${errorColorHover}`, boxShadowHoverError: 'none', boxShadowActiveError: `0 0 0 2px ${changeColor(errorColor, {
            alpha: 0.2
        })}`, boxShadowFocusError: `0 0 0 2px ${changeColor(errorColor, {
            alpha: 0.2
        })}`, colorActiveError: inputColor, caretColorError: errorColor, clearColor,
        clearColorHover,
        clearColorPressed });
};
const internalSelectionLight = createTheme({
    name: 'InternalSelection',
    common: commonLight,
    peers: {
        Popover: popoverLight$1
    },
    self: self$2
});
const internalSelectionLight$1 = internalSelectionLight;

// vars:
// --n-bezier
// --n-border
// --n-border-active
// --n-border-focus
// --n-border-hover
// --n-border-radius
// --n-box-shadow-active
// --n-box-shadow-focus
// --n-box-shadow-hover
// --n-caret-color
// --n-color
// --n-color-active
// --n-color-disabled
// --n-font-size
// --n-height
// --n-padding-single
// --n-padding-multiple
// --n-placeholder-color
// --n-placeholder-color-disabled
// --n-text-color
// --n-text-color-disabled
// --n-arrow-color
// --n-arrow-size
// --n-loading-color
// ...clear vars
// ...form item vars
const style$2 = c([cB('base-selection', `
 position: relative;
 z-index: auto;
 box-shadow: none;
 width: 100%;
 max-width: 100%;
 display: inline-block;
 vertical-align: bottom;
 border-radius: var(--n-border-radius);
 min-height: var(--n-height);
 line-height: 1.5;
 font-size: var(--n-font-size);
 `, [cB('base-loading', `
 color: var(--n-loading-color);
 `), cB('base-selection-tags', 'min-height: var(--n-height);'), cE('border, state-border', `
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border: var(--n-border);
 border-radius: inherit;
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `), cE('state-border', `
 z-index: 1;
 border-color: #0000;
 `), cB('base-suffix', `
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `, [cE('arrow', `
 font-size: var(--n-arrow-size);
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 `)]), cB('base-selection-overlay', `
 display: flex;
 align-items: center;
 white-space: nowrap;
 pointer-events: none;
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 padding: var(--n-padding-single);
 transition: color .3s var(--n-bezier);
 `, [cE('wrapper', `
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]), cB('base-selection-placeholder', `
 color: var(--n-placeholder-color);
 `, [cE('inner', `
 max-width: 100%;
 overflow: hidden;
 `)]), cB('base-selection-tags', `
 cursor: pointer;
 outline: none;
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 display: flex;
 padding: var(--n-padding-multiple);
 flex-wrap: wrap;
 align-items: center;
 width: 100%;
 vertical-align: bottom;
 background-color: var(--n-color);
 border-radius: inherit;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `), cB('base-selection-label', `
 height: var(--n-height);
 display: inline-flex;
 width: 100%;
 vertical-align: bottom;
 cursor: pointer;
 outline: none;
 z-index: auto;
 box-sizing: border-box;
 position: relative;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: inherit;
 background-color: var(--n-color);
 align-items: center;
 `, [cB('base-selection-input', `
 font-size: inherit;
 line-height: inherit;
 outline: none;
 cursor: pointer;
 box-sizing: border-box;
 border:none;
 width: 100%;
 padding: var(--n-padding-single);
 background-color: #0000;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 caret-color: var(--n-caret-color);
 `, [cE('content', `
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]), cE('render-label', `
 color: var(--n-text-color);
 `)]), cNotM('disabled', [c('&:hover', [cE('state-border', `
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]), cM('focus', [cE('state-border', `
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]), cM('active', [cE('state-border', `
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `), cB('base-selection-label', 'background-color: var(--n-color-active);'), cB('base-selection-tags', 'background-color: var(--n-color-active);')])]), cM('disabled', 'cursor: not-allowed;', [cE('arrow', `
 color: var(--n-arrow-color-disabled);
 `), cB('base-selection-label', `
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `, [cB('base-selection-input', `
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `), cE('render-label', `
 color: var(--n-text-color-disabled);
 `)]), cB('base-selection-tags', `
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `), cB('base-selection-placeholder', `
 cursor: not-allowed;
 color: var(--n-placeholder-color-disabled);
 `)]), cB('base-selection-input-tag', `
 height: calc(var(--n-height) - 6px);
 line-height: calc(var(--n-height) - 6px);
 outline: none;
 display: none;
 position: relative;
 margin-bottom: 3px;
 max-width: 100%;
 vertical-align: bottom;
 `, [cE('input', `
 font-size: inherit;
 font-family: inherit;
 min-width: 1px;
 padding: 0;
 background-color: #0000;
 outline: none;
 border: none;
 max-width: 100%;
 overflow: hidden;
 width: 1em;
 line-height: inherit;
 cursor: pointer;
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 `), cE('mirror', `
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]), ['warning', 'error'].map(status => cM(`${status}-status`, [cE('state-border', `border: var(--n-border-${status});`), cNotM('disabled', [c('&:hover', [cE('state-border', `
 box-shadow: var(--n-box-shadow-hover-${status});
 border: var(--n-border-hover-${status});
 `)]), cM('active', [cE('state-border', `
 box-shadow: var(--n-box-shadow-active-${status});
 border: var(--n-border-active-${status});
 `), cB('base-selection-label', `background-color: var(--n-color-active-${status});`), cB('base-selection-tags', `background-color: var(--n-color-active-${status});`)]), cM('focus', [cE('state-border', `
 box-shadow: var(--n-box-shadow-focus-${status});
 border: var(--n-border-focus-${status});
 `)])])]))]), cB('base-selection-popover', `
 margin-bottom: -3px;
 display: flex;
 flex-wrap: wrap;
 margin-right: -8px;
 `), cB('base-selection-tag-wrapper', `
 max-width: 100%;
 display: inline-flex;
 padding: 0 7px 3px 0;
 `, [c('&:last-child', 'padding-right: 0;'), cB('tag', `
 font-size: 14px;
 max-width: 100%;
 `, [cE('content', `
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]);

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const NInternalSelection = defineComponent({
    name: 'InternalSelection',
    props: Object.assign(Object.assign({}, useTheme.props), { clsPrefix: {
            type: String,
            required: true
        }, bordered: {
            type: Boolean,
            default: undefined
        }, active: Boolean, pattern: {
            type: String,
            default: ''
        }, placeholder: String, selectedOption: {
            type: Object,
            default: null
        }, selectedOptions: {
            type: Array,
            default: null
        }, labelField: { type: String, default: 'label' }, valueField: {
            type: String,
            default: 'value'
        }, multiple: Boolean, filterable: Boolean, clearable: Boolean, disabled: Boolean, size: {
            type: String,
            default: 'medium'
        }, loading: Boolean, autofocus: Boolean, showArrow: {
            type: Boolean,
            default: true
        }, inputProps: Object, focused: Boolean, renderTag: Function, onKeydown: Function, onClick: Function, onBlur: Function, onFocus: Function, onDeleteOption: Function, maxTagCount: [String, Number], onClear: Function, onPatternInput: Function, onPatternFocus: Function, onPatternBlur: Function, renderLabel: Function, status: String, inlineThemeDisabled: Boolean, ignoreComposition: { type: Boolean, default: true }, onResize: Function }),
    setup(props) {
        const patternInputMirrorRef = ref(null);
        const patternInputRef = ref(null);
        const selfRef = ref(null);
        const multipleElRef = ref(null);
        const singleElRef = ref(null);
        const patternInputWrapperRef = ref(null);
        const counterRef = ref(null);
        const counterWrapperRef = ref(null);
        const overflowRef = ref(null);
        const inputTagElRef = ref(null);
        const showTagsPopoverRef = ref(false);
        const patternInputFocusedRef = ref(false);
        const hoverRef = ref(false);
        const themeRef = useTheme('InternalSelection', '-internal-selection', style$2, internalSelectionLight$1, props, toRef(props, 'clsPrefix'));
        const mergedClearableRef = computed(() => {
            return (props.clearable && !props.disabled && (hoverRef.value || props.active));
        });
        const filterablePlaceholderRef = computed(() => {
            return props.selectedOption
                ? props.renderTag
                    ? props.renderTag({
                        option: props.selectedOption,
                        handleClose: () => { }
                    })
                    : props.renderLabel
                        ? props.renderLabel(props.selectedOption, true)
                        : render(props.selectedOption[props.labelField], props.selectedOption, true)
                : props.placeholder;
        });
        const labelRef = computed(() => {
            const option = props.selectedOption;
            if (!option)
                return undefined;
            return option[props.labelField];
        });
        const selectedRef = computed(() => {
            if (props.multiple) {
                return !!(Array.isArray(props.selectedOptions) && props.selectedOptions.length);
            }
            else {
                return props.selectedOption !== null;
            }
        });
        function syncMirrorWidth() {
            var _a;
            const { value: patternInputMirrorEl } = patternInputMirrorRef;
            if (patternInputMirrorEl) {
                const { value: patternInputEl } = patternInputRef;
                if (patternInputEl) {
                    patternInputEl.style.width = `${patternInputMirrorEl.offsetWidth}px`;
                    if (props.maxTagCount !== 'responsive') {
                        (_a = overflowRef.value) === null || _a === void 0 ? void 0 : _a.sync();
                    }
                }
            }
        }
        function hideInputTag() {
            const { value: inputTagEl } = inputTagElRef;
            if (inputTagEl)
                inputTagEl.style.display = 'none';
        }
        function showInputTag() {
            const { value: inputTagEl } = inputTagElRef;
            if (inputTagEl)
                inputTagEl.style.display = 'inline-block';
        }
        watch(toRef(props, 'active'), (value) => {
            if (!value)
                hideInputTag();
        });
        watch(toRef(props, 'pattern'), () => {
            if (props.multiple) {
                void nextTick(syncMirrorWidth);
            }
        });
        function doFocus(e) {
            const { onFocus } = props;
            if (onFocus)
                onFocus(e);
        }
        function doBlur(e) {
            const { onBlur } = props;
            if (onBlur)
                onBlur(e);
        }
        function doDeleteOption(value) {
            const { onDeleteOption } = props;
            if (onDeleteOption)
                onDeleteOption(value);
        }
        function doClear(e) {
            const { onClear } = props;
            if (onClear)
                onClear(e);
        }
        function doPatternInput(value) {
            const { onPatternInput } = props;
            if (onPatternInput)
                onPatternInput(value);
        }
        function handleFocusin(e) {
            var _a;
            if (!e.relatedTarget ||
                !((_a = selfRef.value) === null || _a === void 0 ? void 0 : _a.contains(e.relatedTarget))) {
                doFocus(e);
            }
        }
        function handleFocusout(e) {
            var _a;
            if ((_a = selfRef.value) === null || _a === void 0 ? void 0 : _a.contains(e.relatedTarget))
                return;
            doBlur(e);
        }
        function handleClear(e) {
            doClear(e);
        }
        function handleMouseEnter() {
            hoverRef.value = true;
        }
        function handleMouseLeave() {
            hoverRef.value = false;
        }
        function handleMouseDown(e) {
            if (!props.active || !props.filterable)
                return;
            if (e.target === patternInputRef.value)
                return;
            e.preventDefault();
        }
        function handleDeleteOption(option) {
            doDeleteOption(option);
        }
        function handlePatternKeyDown(e) {
            if (e.key === 'Backspace' && !isComposingRef.value) {
                if (!props.pattern.length) {
                    const { selectedOptions } = props;
                    if (selectedOptions === null || selectedOptions === void 0 ? void 0 : selectedOptions.length) {
                        handleDeleteOption(selectedOptions[selectedOptions.length - 1]);
                    }
                }
            }
        }
        const isComposingRef = ref(false);
        // the composition end is later than its input so we can cached the event
        // and return the input event
        let cachedInputEvent = null;
        function handlePatternInputInput(e) {
            // we should sync mirror width here
            const { value: patternInputMirrorEl } = patternInputMirrorRef;
            if (patternInputMirrorEl) {
                const inputText = e.target.value;
                patternInputMirrorEl.textContent = inputText;
                syncMirrorWidth();
            }
            if (props.ignoreComposition) {
                if (!isComposingRef.value) {
                    doPatternInput(e);
                }
                else {
                    cachedInputEvent = e;
                }
            }
            else {
                doPatternInput(e);
            }
        }
        function handleCompositionStart() {
            isComposingRef.value = true;
        }
        function handleCompositionEnd() {
            isComposingRef.value = false;
            if (props.ignoreComposition) {
                doPatternInput(cachedInputEvent);
            }
            cachedInputEvent = null;
        }
        function handlePatternInputFocus(e) {
            var _a;
            patternInputFocusedRef.value = true;
            (_a = props.onPatternFocus) === null || _a === void 0 ? void 0 : _a.call(props, e);
        }
        function handlePatternInputBlur(e) {
            var _a;
            patternInputFocusedRef.value = false;
            (_a = props.onPatternBlur) === null || _a === void 0 ? void 0 : _a.call(props, e);
        }
        function blur() {
            var _a, _b;
            if (props.filterable) {
                patternInputFocusedRef.value = false;
                (_a = patternInputWrapperRef.value) === null || _a === void 0 ? void 0 : _a.blur();
                (_b = patternInputRef.value) === null || _b === void 0 ? void 0 : _b.blur();
            }
            else if (props.multiple) {
                const { value: multipleEl } = multipleElRef;
                multipleEl === null || multipleEl === void 0 ? void 0 : multipleEl.blur();
            }
            else {
                const { value: singleEl } = singleElRef;
                singleEl === null || singleEl === void 0 ? void 0 : singleEl.blur();
            }
        }
        function focus() {
            var _a, _b, _c;
            if (props.filterable) {
                patternInputFocusedRef.value = false;
                (_a = patternInputWrapperRef.value) === null || _a === void 0 ? void 0 : _a.focus();
            }
            else if (props.multiple) {
                (_b = multipleElRef.value) === null || _b === void 0 ? void 0 : _b.focus();
            }
            else {
                (_c = singleElRef.value) === null || _c === void 0 ? void 0 : _c.focus();
            }
        }
        function focusInput() {
            const { value: patternInputEl } = patternInputRef;
            if (patternInputEl) {
                showInputTag();
                patternInputEl.focus();
            }
        }
        function blurInput() {
            const { value: patternInputEl } = patternInputRef;
            if (patternInputEl) {
                patternInputEl.blur();
            }
        }
        function updateCounter(count) {
            const { value } = counterRef;
            if (value) {
                value.setTextContent(`+${count}`);
            }
        }
        function getCounter() {
            const { value } = counterWrapperRef;
            return value;
        }
        function getTail() {
            return patternInputRef.value;
        }
        let enterTimerId = null;
        function clearEnterTimer() {
            if (enterTimerId !== null)
                window.clearTimeout(enterTimerId);
        }
        function handleMouseEnterCounter() {
            if (props.disabled || props.active)
                return;
            clearEnterTimer();
            enterTimerId = window.setTimeout(() => {
                if (selectedRef.value) {
                    showTagsPopoverRef.value = true;
                }
            }, 100);
        }
        function handleMouseLeaveCounter() {
            clearEnterTimer();
        }
        function onPopoverUpdateShow(show) {
            if (!show) {
                clearEnterTimer();
                showTagsPopoverRef.value = false;
            }
        }
        watch(selectedRef, (value) => {
            if (!value) {
                showTagsPopoverRef.value = false;
            }
        });
        onMounted(() => {
            watchEffect(() => {
                const patternInputWrapperEl = patternInputWrapperRef.value;
                if (!patternInputWrapperEl)
                    return;
                patternInputWrapperEl.tabIndex =
                    props.disabled || patternInputFocusedRef.value ? -1 : 0;
            });
        });
        useOnResize(selfRef, props.onResize);
        const { inlineThemeDisabled } = props;
        const cssVarsRef = computed(() => {
            const { size } = props;
            const { common: { cubicBezierEaseInOut }, self: { borderRadius, color, placeholderColor, textColor, paddingSingle, paddingMultiple, caretColor, colorDisabled, textColorDisabled, placeholderColorDisabled, colorActive, boxShadowFocus, boxShadowActive, boxShadowHover, border, borderFocus, borderHover, borderActive, arrowColor, arrowColorDisabled, loadingColor, 
            // form warning
            colorActiveWarning, boxShadowFocusWarning, boxShadowActiveWarning, boxShadowHoverWarning, borderWarning, borderFocusWarning, borderHoverWarning, borderActiveWarning, 
            // form error
            colorActiveError, boxShadowFocusError, boxShadowActiveError, boxShadowHoverError, borderError, borderFocusError, borderHoverError, borderActiveError, 
            // clear
            clearColor, clearColorHover, clearColorPressed, clearSize, 
            // arrow
            arrowSize, [createKey('height', size)]: height, [createKey('fontSize', size)]: fontSize } } = themeRef.value;
            return {
                '--n-bezier': cubicBezierEaseInOut,
                '--n-border': border,
                '--n-border-active': borderActive,
                '--n-border-focus': borderFocus,
                '--n-border-hover': borderHover,
                '--n-border-radius': borderRadius,
                '--n-box-shadow-active': boxShadowActive,
                '--n-box-shadow-focus': boxShadowFocus,
                '--n-box-shadow-hover': boxShadowHover,
                '--n-caret-color': caretColor,
                '--n-color': color,
                '--n-color-active': colorActive,
                '--n-color-disabled': colorDisabled,
                '--n-font-size': fontSize,
                '--n-height': height,
                '--n-padding-single': paddingSingle,
                '--n-padding-multiple': paddingMultiple,
                '--n-placeholder-color': placeholderColor,
                '--n-placeholder-color-disabled': placeholderColorDisabled,
                '--n-text-color': textColor,
                '--n-text-color-disabled': textColorDisabled,
                '--n-arrow-color': arrowColor,
                '--n-arrow-color-disabled': arrowColorDisabled,
                '--n-loading-color': loadingColor,
                // form warning
                '--n-color-active-warning': colorActiveWarning,
                '--n-box-shadow-focus-warning': boxShadowFocusWarning,
                '--n-box-shadow-active-warning': boxShadowActiveWarning,
                '--n-box-shadow-hover-warning': boxShadowHoverWarning,
                '--n-border-warning': borderWarning,
                '--n-border-focus-warning': borderFocusWarning,
                '--n-border-hover-warning': borderHoverWarning,
                '--n-border-active-warning': borderActiveWarning,
                // form error
                '--n-color-active-error': colorActiveError,
                '--n-box-shadow-focus-error': boxShadowFocusError,
                '--n-box-shadow-active-error': boxShadowActiveError,
                '--n-box-shadow-hover-error': boxShadowHoverError,
                '--n-border-error': borderError,
                '--n-border-focus-error': borderFocusError,
                '--n-border-hover-error': borderHoverError,
                '--n-border-active-error': borderActiveError,
                // clear
                '--n-clear-size': clearSize,
                '--n-clear-color': clearColor,
                '--n-clear-color-hover': clearColorHover,
                '--n-clear-color-pressed': clearColorPressed,
                // arrow-size
                '--n-arrow-size': arrowSize
            };
        });
        const themeClassHandle = inlineThemeDisabled
            ? useThemeClass('internal-selection', computed(() => {
                return props.size[0];
            }), cssVarsRef, props)
            : undefined;
        return {
            mergedTheme: themeRef,
            mergedClearable: mergedClearableRef,
            patternInputFocused: patternInputFocusedRef,
            filterablePlaceholder: filterablePlaceholderRef,
            label: labelRef,
            selected: selectedRef,
            showTagsPanel: showTagsPopoverRef,
            isComposing: isComposingRef,
            // dom ref
            counterRef,
            counterWrapperRef,
            patternInputMirrorRef,
            patternInputRef,
            selfRef,
            multipleElRef,
            singleElRef,
            patternInputWrapperRef,
            overflowRef,
            inputTagElRef,
            handleMouseDown,
            handleFocusin,
            handleClear,
            handleMouseEnter,
            handleMouseLeave,
            handleDeleteOption,
            handlePatternKeyDown,
            handlePatternInputInput,
            handlePatternInputBlur,
            handlePatternInputFocus,
            handleMouseEnterCounter,
            handleMouseLeaveCounter,
            handleFocusout,
            handleCompositionEnd,
            handleCompositionStart,
            onPopoverUpdateShow,
            focus,
            focusInput,
            blur,
            blurInput,
            updateCounter,
            getCounter,
            getTail,
            renderLabel: props.renderLabel,
            cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
            themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass,
            onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender
        };
    },
    render() {
        const { status, multiple, size, disabled, filterable, maxTagCount, bordered, clsPrefix, onRender, renderTag, renderLabel } = this;
        onRender === null || onRender === void 0 ? void 0 : onRender();
        const maxTagCountResponsive = maxTagCount === 'responsive';
        const maxTagCountNumeric = typeof maxTagCount === 'number';
        const useMaxTagCount = maxTagCountResponsive || maxTagCountNumeric;
        const suffix = (h(Wrapper, null, {
            default: () => (h(Suffix, { clsPrefix: clsPrefix, loading: this.loading, showArrow: this.showArrow, showClear: this.mergedClearable && this.selected, onClear: this.handleClear }, {
                default: () => { var _a, _b; return (_b = (_a = this.$slots).arrow) === null || _b === void 0 ? void 0 : _b.call(_a); }
            }))
        }));
        let body;
        if (multiple) {
            const { labelField } = this;
            const createTag = (option) => (h("div", { class: `${clsPrefix}-base-selection-tag-wrapper`, key: option.value }, renderTag ? (renderTag({
                option,
                handleClose: () => { this.handleDeleteOption(option); }
            })) : (h(NTag, { size: size, closable: !option.disabled, disabled: disabled, onClose: () => { this.handleDeleteOption(option); }, internalCloseIsButtonTag: false, internalCloseFocusable: false }, {
                default: () => renderLabel
                    ? renderLabel(option, true)
                    : render(option[labelField], option, true)
            }))));
            const createOriginalTagNodes = () => (maxTagCountNumeric
                ? this.selectedOptions.slice(0, maxTagCount)
                : this.selectedOptions).map(createTag);
            const input = filterable ? (h("div", { class: `${clsPrefix}-base-selection-input-tag`, ref: "inputTagElRef", key: "__input-tag__" },
                h("input", Object.assign({}, this.inputProps, { ref: "patternInputRef", tabindex: -1, disabled: disabled, value: this.pattern, autofocus: this.autofocus, class: `${clsPrefix}-base-selection-input-tag__input`, onBlur: this.handlePatternInputBlur, onFocus: this.handlePatternInputFocus, onKeydown: this.handlePatternKeyDown, onInput: this.handlePatternInputInput, onCompositionstart: this.handleCompositionStart, onCompositionend: this.handleCompositionEnd })),
                h("span", { ref: "patternInputMirrorRef", class: `${clsPrefix}-base-selection-input-tag__mirror` }, this.pattern))) : null;
            // May Overflow
            const renderCounter = maxTagCountResponsive
                ? () => (h("div", { class: `${clsPrefix}-base-selection-tag-wrapper`, ref: "counterWrapperRef" },
                    h(NTag, { size: size, ref: "counterRef", onMouseenter: this.handleMouseEnterCounter, onMouseleave: this.handleMouseLeaveCounter, disabled: disabled })))
                : undefined;
            let counter;
            if (maxTagCountNumeric) {
                const rest = this.selectedOptions.length - maxTagCount;
                if (rest > 0) {
                    counter = (h("div", { class: `${clsPrefix}-base-selection-tag-wrapper`, key: "__counter__" },
                        h(NTag, { size: size, ref: "counterRef", onMouseenter: this.handleMouseEnterCounter, disabled: disabled }, {
                            default: () => `+${rest}`
                        })));
                }
            }
            const tags = maxTagCountResponsive ? (filterable ? (h(VOverflow, { ref: "overflowRef", updateCounter: this.updateCounter, getCounter: this.getCounter, getTail: this.getTail, style: {
                    width: '100%',
                    display: 'flex',
                    overflow: 'hidden'
                } }, {
                default: createOriginalTagNodes,
                counter: renderCounter,
                tail: () => input
            })) : (h(VOverflow, { ref: "overflowRef", updateCounter: this.updateCounter, getCounter: this.getCounter, style: {
                    width: '100%',
                    display: 'flex',
                    overflow: 'hidden'
                } }, {
                default: createOriginalTagNodes,
                counter: renderCounter
            }))) : maxTagCountNumeric ? (createOriginalTagNodes().concat(counter)) : (createOriginalTagNodes());
            const renderPopover = useMaxTagCount
                ? () => (h("div", { class: `${clsPrefix}-base-selection-popover` }, maxTagCountResponsive
                    ? createOriginalTagNodes()
                    : this.selectedOptions.map(createTag)))
                : undefined;
            const popoverProps = useMaxTagCount
                ? {
                    show: this.showTagsPanel,
                    trigger: 'hover',
                    overlap: true,
                    placement: 'top',
                    width: 'trigger',
                    onUpdateShow: this.onPopoverUpdateShow,
                    theme: this.mergedTheme.peers.Popover,
                    themeOverrides: this.mergedTheme.peerOverrides.Popover
                }
                : null;
            const showPlaceholder = this.selected
                ? false
                : this.active
                    ? !this.pattern && !this.isComposing
                    : true;
            const placeholder = showPlaceholder ? (h("div", { class: `${clsPrefix}-base-selection-placeholder ${clsPrefix}-base-selection-overlay` },
                h("div", { class: `${clsPrefix}-base-selection-placeholder__inner` }, this.placeholder))) : null;
            const popoverTrigger = filterable ? (h("div", { ref: "patternInputWrapperRef", class: `${clsPrefix}-base-selection-tags` },
                tags,
                maxTagCountResponsive ? null : input,
                suffix)) : (h("div", { ref: "multipleElRef", class: `${clsPrefix}-base-selection-tags`, tabindex: disabled ? undefined : 0 },
                tags,
                suffix));
            body = (h(Fragment, null,
                useMaxTagCount ? (h(NPopover, Object.assign({}, popoverProps, { scrollable: true, style: "max-height: calc(var(--v-target-height) * 6.6);" }), {
                    trigger: () => popoverTrigger,
                    default: renderPopover
                })) : (popoverTrigger),
                placeholder));
        }
        else {
            if (filterable) {
                const hasInput = this.pattern || this.isComposing;
                const showPlaceholder = this.active ? !hasInput : !this.selected;
                const showSelectedLabel = this.active ? false : this.selected;
                body = (h("div", { ref: "patternInputWrapperRef", class: `${clsPrefix}-base-selection-label` },
                    h("input", Object.assign({}, this.inputProps, { ref: "patternInputRef", class: `${clsPrefix}-base-selection-input`, value: this.active ? this.pattern : '', placeholder: "", readonly: disabled, disabled: disabled, tabindex: -1, autofocus: this.autofocus, onFocus: this.handlePatternInputFocus, onBlur: this.handlePatternInputBlur, onInput: this.handlePatternInputInput, onCompositionstart: this.handleCompositionStart, onCompositionend: this.handleCompositionEnd })),
                    showSelectedLabel ? (h("div", { class: `${clsPrefix}-base-selection-label__render-label ${clsPrefix}-base-selection-overlay`, key: "input" },
                        h("div", { class: `${clsPrefix}-base-selection-overlay__wrapper` }, renderTag
                            ? renderTag({
                                option: this.selectedOption,
                                handleClose: () => { }
                            })
                            : renderLabel
                                ? renderLabel(this.selectedOption, true)
                                : render(this.label, this.selectedOption, true)))) : null,
                    showPlaceholder ? (h("div", { class: `${clsPrefix}-base-selection-placeholder ${clsPrefix}-base-selection-overlay`, key: "placeholder" },
                        h("div", { class: `${clsPrefix}-base-selection-overlay__wrapper` }, this.filterablePlaceholder))) : null,
                    suffix));
            }
            else {
                body = (h("div", { ref: "singleElRef", class: `${clsPrefix}-base-selection-label`, tabindex: this.disabled ? undefined : 0 },
                    this.label !== undefined ? (h("div", { class: `${clsPrefix}-base-selection-input`, title: getTitleAttribute(this.label), key: "input" },
                        h("div", { class: `${clsPrefix}-base-selection-input__content` }, renderTag
                            ? renderTag({
                                option: this.selectedOption,
                                handleClose: () => { }
                            })
                            : renderLabel
                                ? renderLabel(this.selectedOption, true)
                                : render(this.label, this.selectedOption, true)))) : (h("div", { class: `${clsPrefix}-base-selection-placeholder ${clsPrefix}-base-selection-overlay`, key: "placeholder" },
                        h("div", { class: `${clsPrefix}-base-selection-placeholder__inner` }, this.placeholder))),
                    suffix));
            }
        }
        return (h("div", { ref: "selfRef", class: [
                `${clsPrefix}-base-selection`,
                this.themeClass,
                status && `${clsPrefix}-base-selection--${status}-status`,
                {
                    [`${clsPrefix}-base-selection--active`]: this.active,
                    [`${clsPrefix}-base-selection--selected`]: this.selected || (this.active && this.pattern),
                    [`${clsPrefix}-base-selection--disabled`]: this.disabled,
                    [`${clsPrefix}-base-selection--multiple`]: this.multiple,
                    // focus is not controlled by selection itself since it always need
                    // to be managed together with menu. provide :focus style will cause
                    // many redundant codes.
                    [`${clsPrefix}-base-selection--focus`]: this.focused
                }
            ], style: this.cssVars, onClick: this.onClick, onMouseenter: this.handleMouseEnter, onMouseleave: this.handleMouseLeave, onKeydown: this.onKeydown, onFocusin: this.handleFocusin, onFocusout: this.handleFocusout, onMousedown: this.handleMouseDown },
            body,
            bordered ? (h("div", { class: `${clsPrefix}-base-selection__border` })) : null,
            bordered ? (h("div", { class: `${clsPrefix}-base-selection__state-border` })) : null));
    }
});

const {
  cubicBezierEaseInOut
} = commonVariables$4;
function fadeInWidthExpandTransition({
  duration = '.2s',
  delay = '.1s'
} = {}) {
  return [c('&.fade-in-width-expand-transition-leave-from, &.fade-in-width-expand-transition-enter-to', {
    opacity: 1
  }), c('&.fade-in-width-expand-transition-leave-to, &.fade-in-width-expand-transition-enter-from', `
 opacity: 0!important;
 margin-left: 0!important;
 margin-right: 0!important;
 `), c('&.fade-in-width-expand-transition-leave-active', `
 overflow: hidden;
 transition:
 opacity ${duration} ${cubicBezierEaseInOut},
 max-width ${duration} ${cubicBezierEaseInOut} ${delay},
 margin-left ${duration} ${cubicBezierEaseInOut} ${delay},
 margin-right ${duration} ${cubicBezierEaseInOut} ${delay};
 `), c('&.fade-in-width-expand-transition-enter-active', `
 overflow: hidden;
 transition:
 opacity ${duration} ${cubicBezierEaseInOut} ${delay},
 max-width ${duration} ${cubicBezierEaseInOut},
 margin-left ${duration} ${cubicBezierEaseInOut},
 margin-right ${duration} ${cubicBezierEaseInOut};
 `)];
}

function self$1(vars) {
    const { boxShadow2 } = vars;
    return {
        menuBoxShadow: boxShadow2
    };
}
const selectLight = createTheme({
    name: 'Select',
    common: commonLight,
    peers: {
        InternalSelection: internalSelectionLight$1,
        InternalSelectMenu: internalSelectMenuLight$1
    },
    self: self$1
});
const selectLight$1 = selectLight;

function getIsGroup(option) {
    return option.type === 'group';
}
function getIgnored(option) {
    return option.type === 'ignored';
}
function patternMatched(pattern, value) {
    try {
        return !!(1 + value.toString().toLowerCase().indexOf(pattern.trim().toLowerCase()));
    }
    catch (err) {
        return false;
    }
}
function createTmOptions(valueField, childrenField) {
    const options = {
        getIsGroup,
        getIgnored,
        getKey(option) {
            if (getIsGroup(option)) {
                return (option.name ||
                    option.key ||
                    'key-required');
            }
            // Required for non-custom label & value field
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return option[valueField];
        },
        getChildren(option) {
            return option[childrenField];
        }
    };
    return options;
}
function filterOptions(originalOpts, filter, pattern, childrenField) {
    if (!filter)
        return originalOpts;
    function traverse(options) {
        if (!Array.isArray(options))
            return [];
        const filteredOptions = [];
        for (const option of options) {
            if (getIsGroup(option)) {
                const children = traverse(option[childrenField]);
                if (children.length) {
                    filteredOptions.push(Object.assign({}, option, {
                        [childrenField]: children
                    }));
                }
            }
            else if (getIgnored(option)) {
                continue;
            }
            else if (filter(pattern, option)) {
                filteredOptions.push(option);
            }
        }
        return filteredOptions;
    }
    return traverse(originalOpts);
}
function createValOptMap(options, valueField, childrenField) {
    const valOptMap = new Map();
    options.forEach((option) => {
        if (getIsGroup(option)) {
            option[childrenField].forEach((selectGroupOption) => {
                valOptMap.set(selectGroupOption[valueField], selectGroupOption);
            });
        }
        else {
            valOptMap.set(option[valueField], option);
        }
    });
    return valOptMap;
}

// --n-menu-box-shadow
const style$1 = c([cB('select', `
 z-index: auto;
 outline: none;
 width: 100%;
 position: relative;
 `), cB('select-menu', `
 margin: 4px 0;
 box-shadow: var(--n-menu-box-shadow);
 `, [fadeInScaleUpTransition({
  originalTransition: 'background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)'
})])]);

const selectProps = Object.assign(Object.assign({}, useTheme.props), { to: useAdjustedTo.propTo, bordered: {
        type: Boolean,
        default: undefined
    }, clearable: Boolean, clearFilterAfterSelect: {
        type: Boolean,
        default: true
    }, options: {
        type: Array,
        default: () => []
    }, defaultValue: {
        type: [String, Number, Array],
        default: null
    }, keyboard: {
        type: Boolean,
        default: true
    }, value: [String, Number, Array], placeholder: String, menuProps: Object, multiple: Boolean, size: String, filterable: Boolean, disabled: {
        type: Boolean,
        default: undefined
    }, remote: Boolean, loading: Boolean, filter: Function, placement: {
        type: String,
        default: 'bottom-start'
    }, widthMode: {
        type: String,
        default: 'trigger'
    }, tag: Boolean, onCreate: Function, fallbackOption: {
        type: [Function, Boolean],
        default: undefined
    }, show: {
        type: Boolean,
        default: undefined
    }, showArrow: {
        type: Boolean,
        default: true
    }, maxTagCount: [Number, String], consistentMenuWidth: {
        type: Boolean,
        default: true
    }, virtualScroll: {
        type: Boolean,
        default: true
    }, labelField: {
        type: String,
        default: 'label'
    }, valueField: {
        type: String,
        default: 'value'
    }, childrenField: {
        type: String,
        default: 'children'
    }, renderLabel: Function, renderOption: Function, renderTag: Function, 'onUpdate:value': [Function, Array], inputProps: Object, nodeProps: Function, ignoreComposition: { type: Boolean, default: true }, showOnFocus: Boolean, 
    // for jsx
    onUpdateValue: [Function, Array], onBlur: [Function, Array], onClear: [Function, Array], onFocus: [Function, Array], onScroll: [Function, Array], onSearch: [Function, Array], onUpdateShow: [Function, Array], 'onUpdate:show': [Function, Array], displayDirective: {
        type: String,
        default: 'show'
    }, resetMenuOnOptionsChange: {
        type: Boolean,
        default: true
    }, status: String, showCheckmark: {
        type: Boolean,
        default: true
    }, 
    /** deprecated */
    onChange: [Function, Array], items: Array });
const NSelect = defineComponent({
    name: 'Select',
    props: selectProps,
    setup(props) {
        const { mergedClsPrefixRef, mergedBorderedRef, namespaceRef, inlineThemeDisabled } = useConfig(props);
        const themeRef = useTheme('Select', '-select', style$1, selectLight$1, props, mergedClsPrefixRef);
        const uncontrolledValueRef = ref(props.defaultValue);
        const controlledValueRef = toRef(props, 'value');
        const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
        const focusedRef = ref(false);
        const patternRef = ref('');
        const treeMateRef = computed(() => {
            const { valueField, childrenField } = props;
            const options = createTmOptions(valueField, childrenField);
            return createTreeMate(filteredOptionsRef.value, options);
        });
        const valOptMapRef = computed(() => createValOptMap(localOptionsRef.value, props.valueField, props.childrenField));
        const uncontrolledShowRef = ref(false);
        const mergedShowRef = useMergedState(toRef(props, 'show'), uncontrolledShowRef);
        const triggerRef = ref(null);
        const followerRef = ref(null);
        const menuRef = ref(null);
        const { localeRef } = useLocale('Select');
        const localizedPlaceholderRef = computed(() => {
            var _a;
            return (_a = props.placeholder) !== null && _a !== void 0 ? _a : localeRef.value.placeholder;
        });
        const compitableOptionsRef = useCompitable(props, ['items', 'options']);
        const emptyArray = [];
        const createdOptionsRef = ref([]);
        const beingCreatedOptionsRef = ref([]);
        const memoValOptMapRef = ref(new Map());
        const wrappedFallbackOptionRef = computed(() => {
            const { fallbackOption } = props;
            if (fallbackOption === undefined) {
                const { labelField, valueField } = props;
                return (value) => ({
                    [labelField]: String(value),
                    [valueField]: value
                });
            }
            if (fallbackOption === false)
                return false;
            return (value) => {
                return Object.assign(fallbackOption(value), {
                    value
                });
            };
        });
        const localOptionsRef = computed(() => {
            return beingCreatedOptionsRef.value.concat(createdOptionsRef.value).concat(compitableOptionsRef.value);
        });
        const resolvedFilterRef = computed(() => {
            const { filter } = props;
            if (filter)
                return filter;
            const { labelField, valueField } = props;
            return (pattern, option) => {
                if (!option)
                    return false;
                const label = option[labelField];
                if (typeof label === 'string') {
                    return patternMatched(pattern, label);
                }
                const value = option[valueField];
                if (typeof value === 'string') {
                    return patternMatched(pattern, value);
                }
                if (typeof value === 'number') {
                    return patternMatched(pattern, String(value));
                }
                return false;
            };
        });
        const filteredOptionsRef = computed(() => {
            if (props.remote) {
                return compitableOptionsRef.value;
            }
            else {
                const { value: localOptions } = localOptionsRef;
                const { value: pattern } = patternRef;
                if (!pattern.length || !props.filterable) {
                    return localOptions;
                }
                else {
                    return filterOptions(localOptions, resolvedFilterRef.value, pattern, props.childrenField);
                }
            }
        });
        function getMergedOptions(values) {
            const remote = props.remote;
            const { value: memoValOptMap } = memoValOptMapRef;
            const { value: valOptMap } = valOptMapRef;
            const { value: wrappedFallbackOption } = wrappedFallbackOptionRef;
            const options = [];
            values.forEach((value) => {
                if (valOptMap.has(value)) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    options.push(valOptMap.get(value));
                }
                else if (remote && memoValOptMap.has(value)) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    options.push(memoValOptMap.get(value));
                }
                else if (wrappedFallbackOption) {
                    const option = wrappedFallbackOption(value);
                    if (option) {
                        options.push(option);
                    }
                }
            });
            return options;
        }
        const selectedOptionsRef = computed(() => {
            if (props.multiple) {
                const { value: values } = mergedValueRef;
                if (!Array.isArray(values))
                    return [];
                return getMergedOptions(values);
            }
            return null;
        });
        const selectedOptionRef = computed(() => {
            const { value: mergedValue } = mergedValueRef;
            if (!props.multiple && !Array.isArray(mergedValue)) {
                if (mergedValue === null)
                    return null;
                return getMergedOptions([mergedValue])[0] || null;
            }
            return null;
        });
        const formItem = useFormItem(props);
        const { mergedSizeRef, mergedDisabledRef, mergedStatusRef } = formItem;
        function doUpdateValue(value, option) {
            const { onChange, 'onUpdate:value': _onUpdateValue, onUpdateValue } = props;
            const { nTriggerFormChange, nTriggerFormInput } = formItem;
            if (onChange)
                call(onChange, value, option);
            if (onUpdateValue)
                call(onUpdateValue, value, option);
            if (_onUpdateValue) {
                call(_onUpdateValue, value, option);
            }
            uncontrolledValueRef.value = value;
            nTriggerFormChange();
            nTriggerFormInput();
        }
        function doBlur(e) {
            const { onBlur } = props;
            const { nTriggerFormBlur } = formItem;
            if (onBlur)
                call(onBlur, e);
            nTriggerFormBlur();
        }
        function doClear() {
            const { onClear } = props;
            if (onClear)
                call(onClear);
        }
        function doFocus(e) {
            const { onFocus, showOnFocus } = props;
            const { nTriggerFormFocus } = formItem;
            if (onFocus)
                call(onFocus, e);
            nTriggerFormFocus();
            if (showOnFocus) {
                openMenu();
            }
        }
        function doSearch(value) {
            const { onSearch } = props;
            if (onSearch)
                call(onSearch, value);
        }
        function doScroll(e) {
            const { onScroll } = props;
            if (onScroll)
                call(onScroll, e);
        }
        // remote related methods
        function updateMemorizedOptions() {
            var _a;
            const { remote, multiple } = props;
            if (remote) {
                const { value: memoValOptMap } = memoValOptMapRef;
                if (multiple) {
                    const { valueField } = props;
                    (_a = selectedOptionsRef.value) === null || _a === void 0 ? void 0 : _a.forEach((option) => {
                        memoValOptMap.set(option[valueField], option);
                    });
                }
                else {
                    const option = selectedOptionRef.value;
                    if (option) {
                        memoValOptMap.set(option[props.valueField], option);
                    }
                }
            }
        }
        // menu related methods
        function doUpdateShow(value) {
            const { onUpdateShow, 'onUpdate:show': _onUpdateShow } = props;
            if (onUpdateShow)
                call(onUpdateShow, value);
            if (_onUpdateShow)
                call(_onUpdateShow, value);
            uncontrolledShowRef.value = value;
        }
        function openMenu() {
            if (!mergedDisabledRef.value) {
                doUpdateShow(true);
                uncontrolledShowRef.value = true;
                if (props.filterable) {
                    focusSelectionInput();
                }
            }
        }
        function closeMenu() {
            doUpdateShow(false);
        }
        function handleMenuAfterLeave() {
            patternRef.value = '';
            beingCreatedOptionsRef.value = emptyArray;
        }
        const activeWithoutMenuOpenRef = ref(false);
        function onTriggerInputFocus() {
            if (props.filterable) {
                activeWithoutMenuOpenRef.value = true;
            }
        }
        function onTriggerInputBlur() {
            if (props.filterable) {
                activeWithoutMenuOpenRef.value = false;
                if (!mergedShowRef.value) {
                    handleMenuAfterLeave();
                }
            }
        }
        function handleTriggerClick() {
            if (mergedDisabledRef.value)
                return;
            if (!mergedShowRef.value) {
                openMenu();
            }
            else {
                if (!props.filterable) {
                    // already focused, don't need to return focus
                    closeMenu();
                }
                else {
                    focusSelectionInput();
                }
            }
        }
        function handleTriggerBlur(e) {
            var _a, _b;
            if ((_b = (_a = menuRef.value) === null || _a === void 0 ? void 0 : _a.selfRef) === null || _b === void 0 ? void 0 : _b.contains(e.relatedTarget)) {
                return;
            }
            focusedRef.value = false;
            doBlur(e);
            // outside select, don't need to return focus
            closeMenu();
        }
        function handleTriggerFocus(e) {
            doFocus(e);
            focusedRef.value = true;
        }
        function handleMenuFocus(e) {
            focusedRef.value = true;
        }
        function handleMenuBlur(e) {
            var _a;
            if ((_a = triggerRef.value) === null || _a === void 0 ? void 0 : _a.$el.contains(e.relatedTarget))
                return;
            focusedRef.value = false;
            doBlur(e);
            // outside select, don't need to return focus
            closeMenu();
        }
        function handleMenuTabOut() {
            var _a;
            (_a = triggerRef.value) === null || _a === void 0 ? void 0 : _a.focus();
            closeMenu();
        }
        function handleMenuClickOutside(e) {
            var _a;
            if (mergedShowRef.value) {
                if (!((_a = triggerRef.value) === null || _a === void 0 ? void 0 : _a.$el.contains(getPreciseEventTarget(e)))) {
                    // outside select, don't need to return focus
                    closeMenu();
                }
            }
        }
        function createClearedMultipleSelectValue(value) {
            if (!Array.isArray(value))
                return [];
            if (wrappedFallbackOptionRef.value) {
                // if option has a fallback, I can't help user to clear some unknown value
                return Array.from(value);
            }
            else {
                // if there's no option fallback, unappeared options are treated as invalid
                const { remote } = props;
                const { value: valOptMap } = valOptMapRef;
                if (remote) {
                    const { value: memoValOptMap } = memoValOptMapRef;
                    return value.filter((v) => valOptMap.has(v) || memoValOptMap.has(v));
                }
                else {
                    return value.filter((v) => valOptMap.has(v));
                }
            }
        }
        function handleToggleByTmNode(tmNode) {
            handleToggleByOption(tmNode.rawNode);
        }
        function handleToggleByOption(option) {
            if (mergedDisabledRef.value)
                return;
            const { tag, remote, clearFilterAfterSelect, valueField } = props;
            if (tag && !remote) {
                const { value: beingCreatedOptions } = beingCreatedOptionsRef;
                const beingCreatedOption = beingCreatedOptions[0] || null;
                if (beingCreatedOption) {
                    const createdOptions = createdOptionsRef.value;
                    if (!createdOptions.length) {
                        createdOptionsRef.value = [beingCreatedOption];
                    }
                    else {
                        createdOptions.push(beingCreatedOption);
                    }
                    beingCreatedOptionsRef.value = emptyArray;
                }
            }
            if (remote) {
                memoValOptMapRef.value.set(option[valueField], option);
            }
            if (props.multiple) {
                const changedValue = createClearedMultipleSelectValue(mergedValueRef.value);
                const index = changedValue.findIndex((value) => value === option[valueField]);
                if (~index) {
                    changedValue.splice(index, 1);
                    if (tag && !remote) {
                        const createdOptionIndex = getCreatedOptionIndex(option[valueField]);
                        if (~createdOptionIndex) {
                            createdOptionsRef.value.splice(createdOptionIndex, 1);
                            if (clearFilterAfterSelect)
                                patternRef.value = '';
                        }
                    }
                }
                else {
                    changedValue.push(option[valueField]);
                    if (clearFilterAfterSelect)
                        patternRef.value = '';
                }
                doUpdateValue(changedValue, getMergedOptions(changedValue));
            }
            else {
                if (tag && !remote) {
                    const createdOptionIndex = getCreatedOptionIndex(option[valueField]);
                    if (~createdOptionIndex) {
                        createdOptionsRef.value = [
                            createdOptionsRef.value[createdOptionIndex]
                        ];
                    }
                    else {
                        createdOptionsRef.value = emptyArray;
                    }
                }
                focusSelection();
                closeMenu();
                doUpdateValue(option[valueField], option);
            }
        }
        function getCreatedOptionIndex(optionValue) {
            const createdOptions = createdOptionsRef.value;
            return createdOptions.findIndex((createdOption) => createdOption[props.valueField] === optionValue);
        }
        function handlePatternInput(e) {
            if (!mergedShowRef.value) {
                openMenu();
            }
            const { value } = e.target;
            patternRef.value = value;
            const { tag, remote } = props;
            doSearch(value);
            if (tag && !remote) {
                if (!value) {
                    beingCreatedOptionsRef.value = emptyArray;
                    return;
                }
                const { onCreate } = props;
                const optionBeingCreated = onCreate
                    ? onCreate(value)
                    : { [props.labelField]: value, [props.valueField]: value };
                const { valueField } = props;
                if (compitableOptionsRef.value.some((option) => option[valueField] === optionBeingCreated[valueField]) ||
                    createdOptionsRef.value.some((option) => option[valueField] === optionBeingCreated[valueField])) {
                    beingCreatedOptionsRef.value = emptyArray;
                }
                else {
                    beingCreatedOptionsRef.value = [optionBeingCreated];
                }
            }
        }
        function handleClear(e) {
            e.stopPropagation();
            const { multiple } = props;
            if (!multiple && props.filterable) {
                closeMenu();
            }
            doClear();
            if (multiple) {
                doUpdateValue([], []);
            }
            else {
                doUpdateValue(null, null);
            }
        }
        function handleMenuMousedown(e) {
            if (!happensIn(e, 'action') && !happensIn(e, 'empty'))
                e.preventDefault();
        }
        // scroll events on menu
        function handleMenuScroll(e) {
            doScroll(e);
        }
        // keyboard events
        // also for menu keydown
        function handleKeydown(e) {
            var _a, _b, _c, _d, _e;
            if (!props.keyboard) {
                e.preventDefault();
                return;
            }
            switch (e.key) {
                case ' ':
                    if (props.filterable)
                        break;
                    else {
                        e.preventDefault();
                    }
                // eslint-disable-next-line no-fallthrough
                case 'Enter':
                    if (!((_a = triggerRef.value) === null || _a === void 0 ? void 0 : _a.isComposing)) {
                        if (mergedShowRef.value) {
                            const pendingTmNode = (_b = menuRef.value) === null || _b === void 0 ? void 0 : _b.getPendingTmNode();
                            if (pendingTmNode) {
                                handleToggleByTmNode(pendingTmNode);
                            }
                            else if (!props.filterable) {
                                closeMenu();
                                focusSelection();
                            }
                        }
                        else {
                            openMenu();
                            if (props.tag && activeWithoutMenuOpenRef.value) {
                                const beingCreatedOption = beingCreatedOptionsRef.value[0];
                                if (beingCreatedOption) {
                                    const optionValue = beingCreatedOption[props.valueField];
                                    const { value: mergedValue } = mergedValueRef;
                                    if (props.multiple) {
                                        if (Array.isArray(mergedValue) &&
                                            mergedValue.some((value) => value === optionValue)) ;
                                        else {
                                            handleToggleByOption(beingCreatedOption);
                                        }
                                    }
                                    else {
                                        handleToggleByOption(beingCreatedOption);
                                    }
                                }
                            }
                        }
                    }
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (props.loading)
                        return;
                    if (mergedShowRef.value) {
                        (_c = menuRef.value) === null || _c === void 0 ? void 0 : _c.prev();
                    }
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (props.loading)
                        return;
                    if (mergedShowRef.value) {
                        (_d = menuRef.value) === null || _d === void 0 ? void 0 : _d.next();
                    }
                    else {
                        openMenu();
                    }
                    break;
                case 'Escape':
                    if (mergedShowRef.value) {
                        markEventEffectPerformed(e);
                        closeMenu();
                    }
                    (_e = triggerRef.value) === null || _e === void 0 ? void 0 : _e.focus();
                    break;
            }
        }
        function focusSelection() {
            var _a;
            (_a = triggerRef.value) === null || _a === void 0 ? void 0 : _a.focus();
        }
        function focusSelectionInput() {
            var _a;
            (_a = triggerRef.value) === null || _a === void 0 ? void 0 : _a.focusInput();
        }
        function handleTriggerOrMenuResize() {
            var _a;
            if (!mergedShowRef.value)
                return;
            (_a = followerRef.value) === null || _a === void 0 ? void 0 : _a.syncPosition();
        }
        updateMemorizedOptions();
        watch(toRef(props, 'options'), updateMemorizedOptions);
        const exposedMethods = {
            focus: () => {
                var _a;
                (_a = triggerRef.value) === null || _a === void 0 ? void 0 : _a.focus();
            },
            blur: () => {
                var _a;
                (_a = triggerRef.value) === null || _a === void 0 ? void 0 : _a.blur();
            }
        };
        const cssVarsRef = computed(() => {
            const { self: { menuBoxShadow } } = themeRef.value;
            return {
                '--n-menu-box-shadow': menuBoxShadow
            };
        });
        const themeClassHandle = inlineThemeDisabled
            ? useThemeClass('select', undefined, cssVarsRef, props)
            : undefined;
        return Object.assign(Object.assign({}, exposedMethods), { mergedStatus: mergedStatusRef, mergedClsPrefix: mergedClsPrefixRef, mergedBordered: mergedBorderedRef, namespace: namespaceRef, treeMate: treeMateRef, isMounted: useIsMounted(), triggerRef,
            menuRef, pattern: patternRef, uncontrolledShow: uncontrolledShowRef, mergedShow: mergedShowRef, adjustedTo: useAdjustedTo(props), uncontrolledValue: uncontrolledValueRef, mergedValue: mergedValueRef, followerRef, localizedPlaceholder: localizedPlaceholderRef, selectedOption: selectedOptionRef, selectedOptions: selectedOptionsRef, mergedSize: mergedSizeRef, mergedDisabled: mergedDisabledRef, focused: focusedRef, activeWithoutMenuOpen: activeWithoutMenuOpenRef, inlineThemeDisabled,
            onTriggerInputFocus,
            onTriggerInputBlur,
            handleTriggerOrMenuResize,
            handleMenuFocus,
            handleMenuBlur,
            handleMenuTabOut,
            handleTriggerClick, handleToggle: handleToggleByTmNode, handleDeleteOption: handleToggleByOption, handlePatternInput,
            handleClear,
            handleTriggerBlur,
            handleTriggerFocus,
            handleKeydown,
            handleMenuAfterLeave,
            handleMenuClickOutside,
            handleMenuScroll, handleMenuKeydown: handleKeydown, handleMenuMousedown, mergedTheme: themeRef, cssVars: inlineThemeDisabled ? undefined : cssVarsRef, themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass, onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender });
    },
    render() {
        return (h("div", { class: `${this.mergedClsPrefix}-select` },
            h(VBinder, null, {
                default: () => [
                    h(VTarget, null, {
                        default: () => (h(NInternalSelection, { ref: "triggerRef", inlineThemeDisabled: this.inlineThemeDisabled, status: this.mergedStatus, inputProps: this.inputProps, clsPrefix: this.mergedClsPrefix, showArrow: this.showArrow, maxTagCount: this.maxTagCount, bordered: this.mergedBordered, active: this.activeWithoutMenuOpen || this.mergedShow, pattern: this.pattern, placeholder: this.localizedPlaceholder, selectedOption: this.selectedOption, selectedOptions: this.selectedOptions, multiple: this.multiple, renderTag: this.renderTag, renderLabel: this.renderLabel, filterable: this.filterable, clearable: this.clearable, disabled: this.mergedDisabled, size: this.mergedSize, theme: this.mergedTheme.peers.InternalSelection, labelField: this.labelField, valueField: this.valueField, themeOverrides: this.mergedTheme.peerOverrides.InternalSelection, loading: this.loading, focused: this.focused, onClick: this.handleTriggerClick, onDeleteOption: this.handleDeleteOption, onPatternInput: this.handlePatternInput, onClear: this.handleClear, onBlur: this.handleTriggerBlur, onFocus: this.handleTriggerFocus, onKeydown: this.handleKeydown, onPatternBlur: this.onTriggerInputBlur, onPatternFocus: this.onTriggerInputFocus, onResize: this.handleTriggerOrMenuResize, ignoreComposition: this.ignoreComposition }, {
                            arrow: () => { var _a, _b; return [(_b = (_a = this.$slots).arrow) === null || _b === void 0 ? void 0 : _b.call(_a)]; }
                        }))
                    }),
                    h(VFollower, { ref: "followerRef", show: this.mergedShow, to: this.adjustedTo, teleportDisabled: this.adjustedTo === useAdjustedTo.tdkey, containerClass: this.namespace, width: this.consistentMenuWidth ? 'target' : undefined, minWidth: "target", placement: this.placement }, {
                        default: () => (h(Transition, { name: "fade-in-scale-up-transition", appear: this.isMounted, onAfterLeave: this.handleMenuAfterLeave }, {
                            default: () => {
                                var _a, _b, _c;
                                if (!(this.mergedShow ||
                                    this.displayDirective === 'show')) {
                                    return null;
                                }
                                (_a = this.onRender) === null || _a === void 0 ? void 0 : _a.call(this);
                                return withDirectives(h(NInternalSelectMenu, Object.assign({}, this.menuProps, { ref: "menuRef", onResize: this.handleTriggerOrMenuResize, inlineThemeDisabled: this.inlineThemeDisabled, virtualScroll: this.consistentMenuWidth && this.virtualScroll, class: [
                                        `${this.mergedClsPrefix}-select-menu`,
                                        this.themeClass,
                                        (_b = this.menuProps) === null || _b === void 0 ? void 0 : _b.class
                                    ], clsPrefix: this.mergedClsPrefix, focusable: true, labelField: this.labelField, valueField: this.valueField, autoPending: true, nodeProps: this.nodeProps, theme: this.mergedTheme.peers.InternalSelectMenu, themeOverrides: this.mergedTheme.peerOverrides
                                        .InternalSelectMenu, treeMate: this.treeMate, multiple: this.multiple, size: "medium", renderOption: this.renderOption, renderLabel: this.renderLabel, value: this.mergedValue, style: [(_c = this.menuProps) === null || _c === void 0 ? void 0 : _c.style, this.cssVars], onToggle: this.handleToggle, onScroll: this.handleMenuScroll, onFocus: this.handleMenuFocus, onBlur: this.handleMenuBlur, onKeydown: this.handleMenuKeydown, onTabOut: this.handleMenuTabOut, onMousedown: this.handleMenuMousedown, show: this.mergedShow, showCheckmark: this.showCheckmark, resetMenuOnOptionsChange: this.resetMenuOnOptionsChange }), {
                                    empty: () => { var _a, _b; return [(_b = (_a = this.$slots).empty) === null || _b === void 0 ? void 0 : _b.call(_a)]; },
                                    action: () => { var _a, _b; return [(_b = (_a = this.$slots).action) === null || _b === void 0 ? void 0 : _b.call(_a)]; }
                                }), this.displayDirective === 'show'
                                    ? [
                                        [vShow, this.mergedShow],
                                        [
                                            clickoutside,
                                            this.handleMenuClickOutside,
                                            undefined,
                                            { capture: true }
                                        ]
                                    ]
                                    : [
                                        [
                                            clickoutside,
                                            this.handleMenuClickOutside,
                                            undefined,
                                            { capture: true }
                                        ]
                                    ]);
                            }
                        }))
                    })
                ]
            })));
    }
});

function createHoverColor(rgb) {
    return composite(rgb, [255, 255, 255, 0.16]);
}
function createPressedColor(rgb) {
    return composite(rgb, [0, 0, 0, 0.12]);
}

const buttonGroupInjectionKey = createInjectionKey('n-button-group');

const isChrome = isBrowser && 'chrome' in window;
isBrowser && navigator.userAgent.includes('Firefox');
const isSafari = isBrowser && navigator.userAgent.includes('Safari') && !isChrome;

const commonVariables = {
    paddingTiny: '0 6px',
    paddingSmall: '0 10px',
    paddingMedium: '0 14px',
    paddingLarge: '0 18px',
    paddingRoundTiny: '0 10px',
    paddingRoundSmall: '0 14px',
    paddingRoundMedium: '0 18px',
    paddingRoundLarge: '0 22px',
    iconMarginTiny: '6px',
    iconMarginSmall: '6px',
    iconMarginMedium: '6px',
    iconMarginLarge: '6px',
    iconSizeTiny: '14px',
    iconSizeSmall: '18px',
    iconSizeMedium: '18px',
    iconSizeLarge: '20px',
    rippleDuration: '.6s'
};

const self = (vars) => {
    const { heightTiny, heightSmall, heightMedium, heightLarge, borderRadius, fontSizeTiny, fontSizeSmall, fontSizeMedium, fontSizeLarge, opacityDisabled, textColor2, textColor3, primaryColorHover, primaryColorPressed, borderColor, primaryColor, baseColor, infoColor, infoColorHover, infoColorPressed, successColor, successColorHover, successColorPressed, warningColor, warningColorHover, warningColorPressed, errorColor, errorColorHover, errorColorPressed, fontWeight, buttonColor2, buttonColor2Hover, buttonColor2Pressed, fontWeightStrong } = vars;
    return Object.assign(Object.assign({}, commonVariables), { heightTiny,
        heightSmall,
        heightMedium,
        heightLarge, borderRadiusTiny: borderRadius, borderRadiusSmall: borderRadius, borderRadiusMedium: borderRadius, borderRadiusLarge: borderRadius, fontSizeTiny,
        fontSizeSmall,
        fontSizeMedium,
        fontSizeLarge,
        opacityDisabled, 
        // secondary
        colorOpacitySecondary: '0.16', colorOpacitySecondaryHover: '0.22', colorOpacitySecondaryPressed: '0.28', colorSecondary: buttonColor2, colorSecondaryHover: buttonColor2Hover, colorSecondaryPressed: buttonColor2Pressed, 
        // tertiary
        colorTertiary: buttonColor2, colorTertiaryHover: buttonColor2Hover, colorTertiaryPressed: buttonColor2Pressed, 
        // quaternary
        colorQuaternary: '#0000', colorQuaternaryHover: buttonColor2Hover, colorQuaternaryPressed: buttonColor2Pressed, 
        // default type
        color: '#0000', colorHover: '#0000', colorPressed: '#0000', colorFocus: '#0000', colorDisabled: '#0000', textColor: textColor2, textColorTertiary: textColor3, textColorHover: primaryColorHover, textColorPressed: primaryColorPressed, textColorFocus: primaryColorHover, textColorDisabled: textColor2, textColorText: textColor2, textColorTextHover: primaryColorHover, textColorTextPressed: primaryColorPressed, textColorTextFocus: primaryColorHover, textColorTextDisabled: textColor2, textColorGhost: textColor2, textColorGhostHover: primaryColorHover, textColorGhostPressed: primaryColorPressed, textColorGhostFocus: primaryColorHover, textColorGhostDisabled: textColor2, border: `1px solid ${borderColor}`, borderHover: `1px solid ${primaryColorHover}`, borderPressed: `1px solid ${primaryColorPressed}`, borderFocus: `1px solid ${primaryColorHover}`, borderDisabled: `1px solid ${borderColor}`, rippleColor: primaryColor, 
        // primary
        colorPrimary: primaryColor, colorHoverPrimary: primaryColorHover, colorPressedPrimary: primaryColorPressed, colorFocusPrimary: primaryColorHover, colorDisabledPrimary: primaryColor, textColorPrimary: baseColor, textColorHoverPrimary: baseColor, textColorPressedPrimary: baseColor, textColorFocusPrimary: baseColor, textColorDisabledPrimary: baseColor, textColorTextPrimary: primaryColor, textColorTextHoverPrimary: primaryColorHover, textColorTextPressedPrimary: primaryColorPressed, textColorTextFocusPrimary: primaryColorHover, textColorTextDisabledPrimary: textColor2, textColorGhostPrimary: primaryColor, textColorGhostHoverPrimary: primaryColorHover, textColorGhostPressedPrimary: primaryColorPressed, textColorGhostFocusPrimary: primaryColorHover, textColorGhostDisabledPrimary: primaryColor, borderPrimary: `1px solid ${primaryColor}`, borderHoverPrimary: `1px solid ${primaryColorHover}`, borderPressedPrimary: `1px solid ${primaryColorPressed}`, borderFocusPrimary: `1px solid ${primaryColorHover}`, borderDisabledPrimary: `1px solid ${primaryColor}`, rippleColorPrimary: primaryColor, 
        // info
        colorInfo: infoColor, colorHoverInfo: infoColorHover, colorPressedInfo: infoColorPressed, colorFocusInfo: infoColorHover, colorDisabledInfo: infoColor, textColorInfo: baseColor, textColorHoverInfo: baseColor, textColorPressedInfo: baseColor, textColorFocusInfo: baseColor, textColorDisabledInfo: baseColor, textColorTextInfo: infoColor, textColorTextHoverInfo: infoColorHover, textColorTextPressedInfo: infoColorPressed, textColorTextFocusInfo: infoColorHover, textColorTextDisabledInfo: textColor2, textColorGhostInfo: infoColor, textColorGhostHoverInfo: infoColorHover, textColorGhostPressedInfo: infoColorPressed, textColorGhostFocusInfo: infoColorHover, textColorGhostDisabledInfo: infoColor, borderInfo: `1px solid ${infoColor}`, borderHoverInfo: `1px solid ${infoColorHover}`, borderPressedInfo: `1px solid ${infoColorPressed}`, borderFocusInfo: `1px solid ${infoColorHover}`, borderDisabledInfo: `1px solid ${infoColor}`, rippleColorInfo: infoColor, 
        // success
        colorSuccess: successColor, colorHoverSuccess: successColorHover, colorPressedSuccess: successColorPressed, colorFocusSuccess: successColorHover, colorDisabledSuccess: successColor, textColorSuccess: baseColor, textColorHoverSuccess: baseColor, textColorPressedSuccess: baseColor, textColorFocusSuccess: baseColor, textColorDisabledSuccess: baseColor, textColorTextSuccess: successColor, textColorTextHoverSuccess: successColorHover, textColorTextPressedSuccess: successColorPressed, textColorTextFocusSuccess: successColorHover, textColorTextDisabledSuccess: textColor2, textColorGhostSuccess: successColor, textColorGhostHoverSuccess: successColorHover, textColorGhostPressedSuccess: successColorPressed, textColorGhostFocusSuccess: successColorHover, textColorGhostDisabledSuccess: successColor, borderSuccess: `1px solid ${successColor}`, borderHoverSuccess: `1px solid ${successColorHover}`, borderPressedSuccess: `1px solid ${successColorPressed}`, borderFocusSuccess: `1px solid ${successColorHover}`, borderDisabledSuccess: `1px solid ${successColor}`, rippleColorSuccess: successColor, 
        // warning
        colorWarning: warningColor, colorHoverWarning: warningColorHover, colorPressedWarning: warningColorPressed, colorFocusWarning: warningColorHover, colorDisabledWarning: warningColor, textColorWarning: baseColor, textColorHoverWarning: baseColor, textColorPressedWarning: baseColor, textColorFocusWarning: baseColor, textColorDisabledWarning: baseColor, textColorTextWarning: warningColor, textColorTextHoverWarning: warningColorHover, textColorTextPressedWarning: warningColorPressed, textColorTextFocusWarning: warningColorHover, textColorTextDisabledWarning: textColor2, textColorGhostWarning: warningColor, textColorGhostHoverWarning: warningColorHover, textColorGhostPressedWarning: warningColorPressed, textColorGhostFocusWarning: warningColorHover, textColorGhostDisabledWarning: warningColor, borderWarning: `1px solid ${warningColor}`, borderHoverWarning: `1px solid ${warningColorHover}`, borderPressedWarning: `1px solid ${warningColorPressed}`, borderFocusWarning: `1px solid ${warningColorHover}`, borderDisabledWarning: `1px solid ${warningColor}`, rippleColorWarning: warningColor, 
        // error
        colorError: errorColor, colorHoverError: errorColorHover, colorPressedError: errorColorPressed, colorFocusError: errorColorHover, colorDisabledError: errorColor, textColorError: baseColor, textColorHoverError: baseColor, textColorPressedError: baseColor, textColorFocusError: baseColor, textColorDisabledError: baseColor, textColorTextError: errorColor, textColorTextHoverError: errorColorHover, textColorTextPressedError: errorColorPressed, textColorTextFocusError: errorColorHover, textColorTextDisabledError: textColor2, textColorGhostError: errorColor, textColorGhostHoverError: errorColorHover, textColorGhostPressedError: errorColorPressed, textColorGhostFocusError: errorColorHover, textColorGhostDisabledError: errorColor, borderError: `1px solid ${errorColor}`, borderHoverError: `1px solid ${errorColorHover}`, borderPressedError: `1px solid ${errorColorPressed}`, borderFocusError: `1px solid ${errorColorHover}`, borderDisabledError: `1px solid ${errorColor}`, rippleColorError: errorColor, waveOpacity: '0.6', fontWeight,
        fontWeightStrong });
};
const buttonLight = {
    name: 'Button',
    common: commonLight,
    self
};
const buttonLight$1 = buttonLight;

// vars:
// --n-bezier
// --n-bezier-ease-out
// --n-ripple-duration
// --n-opacity-disabled
// --n-text-color
// --n-text-color-hover
// --n-text-color-pressed
// --n-text-color-focus
// --n-text-color-disabled
// --n-color
// --n-color-hover
// --n-color-pressed
// --n-color-focus
// --n-color-disabled
// --n-border
// --n-border-hover
// --n-border-pressed
// --n-border-focus
// --n-border-disabled
// --n-ripple-color
// --n-border-radius
// --n-height
// --n-width
// --n-font-size
// --n-padding
// --n-icon-size
// --n-icon-margin
// --n-wave-opacity
// --n-font-weight
//
// private-vars:
// --n-border-color-xxx, used for custom color
const style = c([cB('button', `
 margin: 0;
 font-weight: var(--n-font-weight);
 line-height: 1;
 font-family: inherit;
 padding: var(--n-padding);
 height: var(--n-height);
 font-size: var(--n-font-size);
 border-radius: var(--n-border-radius);
 color: var(--n-text-color);
 background-color: var(--n-color);
 width: var(--n-width);
 white-space: nowrap;
 outline: none;
 position: relative;
 z-index: auto;
 border: none;
 display: inline-flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 align-items: center;
 justify-content: center;
 user-select: none;
 -webkit-user-select: none;
 text-align: center;
 cursor: pointer;
 text-decoration: none;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `, [cM('color', [cE('border', {
  borderColor: 'var(--n-border-color)'
}), cM('disabled', [cE('border', {
  borderColor: 'var(--n-border-color-disabled)'
})]), cNotM('disabled', [c('&:focus', [cE('state-border', {
  borderColor: 'var(--n-border-color-focus)'
})]), c('&:hover', [cE('state-border', {
  borderColor: 'var(--n-border-color-hover)'
})]), c('&:active', [cE('state-border', {
  borderColor: 'var(--n-border-color-pressed)'
})]), cM('pressed', [cE('state-border', {
  borderColor: 'var(--n-border-color-pressed)'
})])])]), cM('disabled', {
  backgroundColor: 'var(--n-color-disabled)',
  color: 'var(--n-text-color-disabled)'
}, [cE('border', {
  border: 'var(--n-border-disabled)'
})]), cNotM('disabled', [c('&:focus', {
  backgroundColor: 'var(--n-color-focus)',
  color: 'var(--n-text-color-focus)'
}, [cE('state-border', {
  border: 'var(--n-border-focus)'
})]), c('&:hover', {
  backgroundColor: 'var(--n-color-hover)',
  color: 'var(--n-text-color-hover)'
}, [cE('state-border', {
  border: 'var(--n-border-hover)'
})]), c('&:active', {
  backgroundColor: 'var(--n-color-pressed)',
  color: 'var(--n-text-color-pressed)'
}, [cE('state-border', {
  border: 'var(--n-border-pressed)'
})]), cM('pressed', {
  backgroundColor: 'var(--n-color-pressed)',
  color: 'var(--n-text-color-pressed)'
}, [cE('state-border', {
  border: 'var(--n-border-pressed)'
})])]), cM('loading', 'cursor: wait;'), cB('base-wave', `
 pointer-events: none;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 animation-iteration-count: 1;
 animation-duration: var(--n-ripple-duration);
 animation-timing-function: var(--n-bezier-ease-out), var(--n-bezier-ease-out);
 `, [cM('active', {
  zIndex: 1,
  animationName: 'button-wave-spread, button-wave-opacity'
})]), isBrowser && 'MozBoxSizing' in document.createElement('div').style ? c('&::moz-focus-inner', {
  border: 0
}) : null, cE('border, state-border', `
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 border-radius: inherit;
 transition: border-color .3s var(--n-bezier);
 pointer-events: none;
 `), cE('border', {
  border: 'var(--n-border)'
}), cE('state-border', {
  border: 'var(--n-border)',
  borderColor: '#0000',
  zIndex: 1
}), cE('icon', `
 margin: var(--n-icon-margin);
 margin-left: 0;
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 max-width: var(--n-icon-size);
 font-size: var(--n-icon-size);
 position: relative;
 flex-shrink: 0;
 `, [cB('icon-slot', `
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 position: absolute;
 left: 0;
 top: 50%;
 transform: translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 `, [iconSwitchTransition({
  top: '50%',
  originalTransform: 'translateY(-50%)'
})]), fadeInWidthExpandTransition()]), cE('content', `
 display: flex;
 align-items: center;
 flex-wrap: nowrap;
 min-width: 0;
 `, [c('~', [cE('icon', {
  margin: 'var(--n-icon-margin)',
  marginRight: 0
})])]), cM('block', `
 display: flex;
 width: 100%;
 `), cM('dashed', [cE('border, state-border', {
  borderStyle: 'dashed !important'
})]), cM('disabled', {
  cursor: 'not-allowed',
  opacity: 'var(--n-opacity-disabled)'
})]), c('@keyframes button-wave-spread', {
  from: {
    boxShadow: '0 0 0.5px 0 var(--n-ripple-color)'
  },
  to: {
    // don't use exact 5px since chrome will display the animation with glitches
    boxShadow: '0 0 0.5px 4.5px var(--n-ripple-color)'
  }
}), c('@keyframes button-wave-opacity', {
  from: {
    opacity: 'var(--n-wave-opacity)'
  },
  to: {
    opacity: 0
  }
})]);

const buttonProps = Object.assign(Object.assign({}, useTheme.props), { color: String, textColor: String, text: Boolean, block: Boolean, loading: Boolean, disabled: Boolean, circle: Boolean, size: String, ghost: Boolean, round: Boolean, secondary: Boolean, tertiary: Boolean, quaternary: Boolean, strong: Boolean, focusable: {
        type: Boolean,
        default: true
    }, keyboard: {
        type: Boolean,
        default: true
    }, tag: {
        type: String,
        default: 'button'
    }, type: {
        type: String,
        default: 'default'
    }, dashed: Boolean, renderIcon: Function, iconPlacement: {
        type: String,
        default: 'left'
    }, attrType: {
        type: String,
        default: 'button'
    }, bordered: {
        type: Boolean,
        default: true
    }, onClick: [Function, Array], nativeFocusBehavior: {
        type: Boolean,
        default: !isSafari
    } });
const Button = defineComponent({
    name: 'Button',
    props: buttonProps,
    setup(props) {
        const selfElRef = ref(null);
        const waveElRef = ref(null);
        const enterPressedRef = ref(false);
        const showBorderRef = useMemo(() => {
            return (!props.quaternary &&
                !props.tertiary &&
                !props.secondary &&
                !props.text &&
                (!props.color || props.ghost || props.dashed) &&
                props.bordered);
        });
        const NButtonGroup = inject(buttonGroupInjectionKey, {});
        const { mergedSizeRef } = useFormItem({}, {
            defaultSize: 'medium',
            mergedSize: (NFormItem) => {
                const { size } = props;
                if (size)
                    return size;
                const { size: buttonGroupSize } = NButtonGroup;
                if (buttonGroupSize)
                    return buttonGroupSize;
                const { mergedSize: formItemSize } = NFormItem || {};
                if (formItemSize) {
                    return formItemSize.value;
                }
                return 'medium';
            }
        });
        const mergedFocusableRef = computed(() => {
            return props.focusable && !props.disabled;
        });
        const handleMousedown = (e) => {
            var _a;
            if (!mergedFocusableRef.value) {
                e.preventDefault();
            }
            if (props.nativeFocusBehavior) {
                return;
            }
            e.preventDefault();
            // normally this won't be called if disabled (when tag is button)
            // if not, we try to make it behave like a button
            if (props.disabled) {
                return;
            }
            if (mergedFocusableRef.value) {
                (_a = selfElRef.value) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
            }
        };
        const handleClick = (e) => {
            var _a;
            if (!props.disabled && !props.loading) {
                const { onClick } = props;
                if (onClick)
                    call(onClick, e);
                if (!props.text) {
                    (_a = waveElRef.value) === null || _a === void 0 ? void 0 : _a.play();
                }
            }
        };
        const handleKeyup = (e) => {
            switch (e.key) {
                case 'Enter':
                    if (!props.keyboard) {
                        return;
                    }
                    enterPressedRef.value = false;
            }
        };
        const handleKeydown = (e) => {
            switch (e.key) {
                case 'Enter':
                    if (!props.keyboard || props.loading) {
                        e.preventDefault();
                        return;
                    }
                    enterPressedRef.value = true;
            }
        };
        const handleBlur = () => {
            enterPressedRef.value = false;
        };
        const { inlineThemeDisabled, mergedClsPrefixRef, mergedRtlRef } = useConfig(props);
        const themeRef = useTheme('Button', '-button', style, buttonLight$1, props, mergedClsPrefixRef);
        const rtlEnabledRef = useRtl('Button', mergedRtlRef, mergedClsPrefixRef);
        const cssVarsRef = computed(() => {
            const theme = themeRef.value;
            const { common: { cubicBezierEaseInOut, cubicBezierEaseOut }, self } = theme;
            const { rippleDuration, opacityDisabled, fontWeight, fontWeightStrong } = self;
            const size = mergedSizeRef.value;
            const { dashed, type, ghost, text, color, round, circle, textColor, secondary, tertiary, quaternary, strong } = props;
            // font
            const fontProps = {
                'font-weight': strong ? fontWeightStrong : fontWeight
            };
            // color
            let colorProps = {
                '--n-color': 'initial',
                '--n-color-hover': 'initial',
                '--n-color-pressed': 'initial',
                '--n-color-focus': 'initial',
                '--n-color-disabled': 'initial',
                '--n-ripple-color': 'initial',
                '--n-text-color': 'initial',
                '--n-text-color-hover': 'initial',
                '--n-text-color-pressed': 'initial',
                '--n-text-color-focus': 'initial',
                '--n-text-color-disabled': 'initial'
            };
            const typeIsTertiary = type === 'tertiary';
            const typeIsDefault = type === 'default';
            const mergedType = typeIsTertiary ? 'default' : type;
            if (text) {
                const propTextColor = textColor || color;
                const mergedTextColor = propTextColor || self[createKey('textColorText', mergedType)];
                colorProps = {
                    '--n-color': '#0000',
                    '--n-color-hover': '#0000',
                    '--n-color-pressed': '#0000',
                    '--n-color-focus': '#0000',
                    '--n-color-disabled': '#0000',
                    '--n-ripple-color': '#0000',
                    '--n-text-color': mergedTextColor,
                    '--n-text-color-hover': propTextColor
                        ? createHoverColor(propTextColor)
                        : self[createKey('textColorTextHover', mergedType)],
                    '--n-text-color-pressed': propTextColor
                        ? createPressedColor(propTextColor)
                        : self[createKey('textColorTextPressed', mergedType)],
                    '--n-text-color-focus': propTextColor
                        ? createHoverColor(propTextColor)
                        : self[createKey('textColorTextHover', mergedType)],
                    '--n-text-color-disabled': propTextColor ||
                        self[createKey('textColorTextDisabled', mergedType)]
                };
            }
            else if (ghost || dashed) {
                const mergedTextColor = textColor || color;
                colorProps = {
                    '--n-color': '#0000',
                    '--n-color-hover': '#0000',
                    '--n-color-pressed': '#0000',
                    '--n-color-focus': '#0000',
                    '--n-color-disabled': '#0000',
                    '--n-ripple-color': color || self[createKey('rippleColor', mergedType)],
                    '--n-text-color': mergedTextColor || self[createKey('textColorGhost', mergedType)],
                    '--n-text-color-hover': mergedTextColor
                        ? createHoverColor(mergedTextColor)
                        : self[createKey('textColorGhostHover', mergedType)],
                    '--n-text-color-pressed': mergedTextColor
                        ? createPressedColor(mergedTextColor)
                        : self[createKey('textColorGhostPressed', mergedType)],
                    '--n-text-color-focus': mergedTextColor
                        ? createHoverColor(mergedTextColor)
                        : self[createKey('textColorGhostHover', mergedType)],
                    '--n-text-color-disabled': mergedTextColor ||
                        self[createKey('textColorGhostDisabled', mergedType)]
                };
            }
            else if (secondary) {
                const typeTextColor = typeIsDefault
                    ? self.textColor
                    : typeIsTertiary
                        ? self.textColorTertiary
                        : self[createKey('color', mergedType)];
                const mergedTextColor = color || typeTextColor;
                const isColoredType = type !== 'default' && type !== 'tertiary';
                colorProps = {
                    '--n-color': isColoredType
                        ? changeColor(mergedTextColor, {
                            alpha: Number(self.colorOpacitySecondary)
                        })
                        : self.colorSecondary,
                    '--n-color-hover': isColoredType
                        ? changeColor(mergedTextColor, {
                            alpha: Number(self.colorOpacitySecondaryHover)
                        })
                        : self.colorSecondaryHover,
                    '--n-color-pressed': isColoredType
                        ? changeColor(mergedTextColor, {
                            alpha: Number(self.colorOpacitySecondaryPressed)
                        })
                        : self.colorSecondaryPressed,
                    '--n-color-focus': isColoredType
                        ? changeColor(mergedTextColor, {
                            alpha: Number(self.colorOpacitySecondaryHover)
                        })
                        : self.colorSecondaryHover,
                    '--n-color-disabled': self.colorSecondary,
                    '--n-ripple-color': '#0000',
                    '--n-text-color': mergedTextColor,
                    '--n-text-color-hover': mergedTextColor,
                    '--n-text-color-pressed': mergedTextColor,
                    '--n-text-color-focus': mergedTextColor,
                    '--n-text-color-disabled': mergedTextColor
                };
            }
            else if (tertiary || quaternary) {
                const typeColor = typeIsDefault
                    ? self.textColor
                    : typeIsTertiary
                        ? self.textColorTertiary
                        : self[createKey('color', mergedType)];
                const mergedColor = color || typeColor;
                if (tertiary) {
                    colorProps['--n-color'] = self.colorTertiary;
                    colorProps['--n-color-hover'] = self.colorTertiaryHover;
                    colorProps['--n-color-pressed'] = self.colorTertiaryPressed;
                    colorProps['--n-color-focus'] = self.colorSecondaryHover;
                    colorProps['--n-color-disabled'] = self.colorTertiary;
                }
                else {
                    colorProps['--n-color'] = self.colorQuaternary;
                    colorProps['--n-color-hover'] = self.colorQuaternaryHover;
                    colorProps['--n-color-pressed'] = self.colorQuaternaryPressed;
                    colorProps['--n-color-focus'] = self.colorQuaternaryHover;
                    colorProps['--n-color-disabled'] = self.colorQuaternary;
                }
                colorProps['--n-ripple-color'] = '#0000';
                colorProps['--n-text-color'] = mergedColor;
                colorProps['--n-text-color-hover'] = mergedColor;
                colorProps['--n-text-color-pressed'] = mergedColor;
                colorProps['--n-text-color-focus'] = mergedColor;
                colorProps['--n-text-color-disabled'] = mergedColor;
            }
            else {
                colorProps = {
                    '--n-color': color || self[createKey('color', mergedType)],
                    '--n-color-hover': color
                        ? createHoverColor(color)
                        : self[createKey('colorHover', mergedType)],
                    '--n-color-pressed': color
                        ? createPressedColor(color)
                        : self[createKey('colorPressed', mergedType)],
                    '--n-color-focus': color
                        ? createHoverColor(color)
                        : self[createKey('colorFocus', mergedType)],
                    '--n-color-disabled': color || self[createKey('colorDisabled', mergedType)],
                    '--n-ripple-color': color || self[createKey('rippleColor', mergedType)],
                    '--n-text-color': textColor ||
                        (color
                            ? self.textColorPrimary
                            : typeIsTertiary
                                ? self.textColorTertiary
                                : self[createKey('textColor', mergedType)]),
                    '--n-text-color-hover': textColor ||
                        (color
                            ? self.textColorHoverPrimary
                            : self[createKey('textColorHover', mergedType)]),
                    '--n-text-color-pressed': textColor ||
                        (color
                            ? self.textColorPressedPrimary
                            : self[createKey('textColorPressed', mergedType)]),
                    '--n-text-color-focus': textColor ||
                        (color
                            ? self.textColorFocusPrimary
                            : self[createKey('textColorFocus', mergedType)]),
                    '--n-text-color-disabled': textColor ||
                        (color
                            ? self.textColorDisabledPrimary
                            : self[createKey('textColorDisabled', mergedType)])
                };
            }
            // border
            let borderProps = {
                '--n-border': 'initial',
                '--n-border-hover': 'initial',
                '--n-border-pressed': 'initial',
                '--n-border-focus': 'initial',
                '--n-border-disabled': 'initial'
            };
            if (text) {
                borderProps = {
                    '--n-border': 'none',
                    '--n-border-hover': 'none',
                    '--n-border-pressed': 'none',
                    '--n-border-focus': 'none',
                    '--n-border-disabled': 'none'
                };
            }
            else {
                borderProps = {
                    '--n-border': self[createKey('border', mergedType)],
                    '--n-border-hover': self[createKey('borderHover', mergedType)],
                    '--n-border-pressed': self[createKey('borderPressed', mergedType)],
                    '--n-border-focus': self[createKey('borderFocus', mergedType)],
                    '--n-border-disabled': self[createKey('borderDisabled', mergedType)]
                };
            }
            // size
            const { [createKey('height', size)]: height, [createKey('fontSize', size)]: fontSize, [createKey('padding', size)]: padding, [createKey('paddingRound', size)]: paddingRound, [createKey('iconSize', size)]: iconSize, [createKey('borderRadius', size)]: borderRadius, [createKey('iconMargin', size)]: iconMargin, waveOpacity } = self;
            const sizeProps = {
                '--n-width': circle && !text ? height : 'initial',
                '--n-height': text ? 'initial' : height,
                '--n-font-size': fontSize,
                '--n-padding': circle
                    ? 'initial'
                    : text
                        ? 'initial'
                        : round
                            ? paddingRound
                            : padding,
                '--n-icon-size': iconSize,
                '--n-icon-margin': iconMargin,
                '--n-border-radius': text
                    ? 'initial'
                    : circle || round
                        ? height
                        : borderRadius
            };
            return Object.assign(Object.assign(Object.assign(Object.assign({ '--n-bezier': cubicBezierEaseInOut, '--n-bezier-ease-out': cubicBezierEaseOut, '--n-ripple-duration': rippleDuration, '--n-opacity-disabled': opacityDisabled, '--n-wave-opacity': waveOpacity }, fontProps), colorProps), borderProps), sizeProps);
        });
        const themeClassHandle = inlineThemeDisabled
            ? useThemeClass('button', computed(() => {
                let hash = '';
                const { dashed, type, ghost, text, color, round, circle, textColor, secondary, tertiary, quaternary, strong } = props;
                if (dashed)
                    hash += 'a';
                if (ghost)
                    hash += 'b';
                if (text)
                    hash += 'c';
                if (round)
                    hash += 'd';
                if (circle)
                    hash += 'e';
                if (secondary)
                    hash += 'f';
                if (tertiary)
                    hash += 'g';
                if (quaternary)
                    hash += 'h';
                if (strong)
                    hash += 'i';
                if (color)
                    hash += 'j' + color2Class(color);
                if (textColor)
                    hash += 'k' + color2Class(textColor);
                const { value: size } = mergedSizeRef;
                hash += 'l' + size[0];
                hash += 'm' + type[0];
                return hash;
            }), cssVarsRef, props)
            : undefined;
        return {
            selfElRef,
            waveElRef,
            mergedClsPrefix: mergedClsPrefixRef,
            mergedFocusable: mergedFocusableRef,
            mergedSize: mergedSizeRef,
            showBorder: showBorderRef,
            enterPressed: enterPressedRef,
            rtlEnabled: rtlEnabledRef,
            handleMousedown,
            handleKeydown,
            handleBlur,
            handleKeyup,
            handleClick,
            customColorCssVars: computed(() => {
                const { color } = props;
                if (!color)
                    return null;
                const hoverColor = createHoverColor(color);
                return {
                    '--n-border-color': color,
                    '--n-border-color-hover': hoverColor,
                    '--n-border-color-pressed': createPressedColor(color),
                    '--n-border-color-focus': hoverColor,
                    '--n-border-color-disabled': color
                };
            }),
            cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
            themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass,
            onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender
        };
    },
    render() {
        const { mergedClsPrefix, tag: Component, onRender } = this;
        onRender === null || onRender === void 0 ? void 0 : onRender();
        const children = resolveWrappedSlot(this.$slots.default, (children) => children && (h("span", { class: `${mergedClsPrefix}-button__content` }, children)));
        return (h(Component, { ref: "selfElRef", class: [
                this.themeClass,
                `${mergedClsPrefix}-button`,
                `${mergedClsPrefix}-button--${this.type}-type`,
                `${mergedClsPrefix}-button--${this.mergedSize}-type`,
                this.rtlEnabled && `${mergedClsPrefix}-button--rtl`,
                this.disabled && `${mergedClsPrefix}-button--disabled`,
                this.block && `${mergedClsPrefix}-button--block`,
                this.enterPressed && `${mergedClsPrefix}-button--pressed`,
                !this.text && this.dashed && `${mergedClsPrefix}-button--dashed`,
                this.color && `${mergedClsPrefix}-button--color`,
                this.secondary && `${mergedClsPrefix}-button--secondary`,
                this.loading && `${mergedClsPrefix}-button--loading`,
                this.ghost && `${mergedClsPrefix}-button--ghost` // required for button group border collapse
            ], tabindex: this.mergedFocusable ? 0 : -1, type: this.attrType, style: this.cssVars, disabled: this.disabled, onClick: this.handleClick, onBlur: this.handleBlur, onMousedown: this.handleMousedown, onKeyup: this.handleKeyup, onKeydown: this.handleKeydown },
            this.iconPlacement === 'right' && children,
            h(NFadeInExpandTransition, { width: true }, {
                default: () => resolveWrappedSlot(this.$slots.icon, (children) => (this.loading || this.renderIcon || children) && (h("span", { class: `${mergedClsPrefix}-button__icon`, style: {
                        margin: isSlotEmpty(this.$slots.default) ? '0' : ''
                    } },
                    h(NIconSwitchTransition, null, {
                        default: () => this.loading ? (h(NBaseLoading, { clsPrefix: mergedClsPrefix, key: "loading", class: `${mergedClsPrefix}-icon-slot`, strokeWidth: 20 })) : (h("div", { key: "icon", class: `${mergedClsPrefix}-icon-slot`, role: "none" }, this.renderIcon ? this.renderIcon() : children))
                    }))))
            }),
            this.iconPlacement === 'left' && children,
            !this.text ? (h(NBaseWave, { ref: "waveElRef", clsPrefix: mergedClsPrefix })) : null,
            this.showBorder ? (h("div", { "aria-hidden": true, class: `${mergedClsPrefix}-button__border`, style: this.customColorCssVars })) : null,
            this.showBorder ? (h("div", { "aria-hidden": true, class: `${mergedClsPrefix}-button__state-border`, style: this.customColorCssVars })) : null));
    }
});
const NButton$1 = Button;
// Also, we may make XButton a generic type which support `tag` prop
// but currently vue doesn't export IntrinsicElementAttributes from runtime-dom
// so we can't easily make an attr map by hand
// just leave it for later

const _sfc_main$8 = {
  props: {
    title: {
      type: String,
      required: true
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-2 rounded-xl bg-white/10 border-2 border-white/10 m-4 min-h-[250px]" }, _attrs))}><h3 class="font-bold italic text-xl m-2 text-center">${ssrInterpolate($props.title)}</h3>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/reusable/cards/SectionCard.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const SectionCard = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender]]);
const getDefault = () => null;
function useAsyncData(...args) {
  var _a, _b, _c, _d, _e;
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  let [key, handler, options = {}] = args;
  if (typeof key !== "string") {
    throw new TypeError("[nuxt] [asyncData] key must be a string.");
  }
  if (typeof handler !== "function") {
    throw new TypeError("[nuxt] [asyncData] handler must be a function.");
  }
  options.server = (_a = options.server) != null ? _a : true;
  options.default = (_b = options.default) != null ? _b : getDefault;
  options.lazy = (_c = options.lazy) != null ? _c : false;
  options.immediate = (_d = options.immediate) != null ? _d : true;
  const nuxt = useNuxtApp();
  const getCachedData = () => nuxt.isHydrating ? nuxt.payload.data[key] : nuxt.static.data[key];
  const hasCachedData = () => getCachedData() !== void 0;
  if (!nuxt._asyncData[key]) {
    nuxt._asyncData[key] = {
      data: ref((_e = getCachedData()) != null ? _e : options.default()),
      pending: ref(!hasCachedData()),
      error: toRef(nuxt.payload._errors, key),
      status: ref("idle")
    };
  }
  const asyncData = { ...nuxt._asyncData[key] };
  asyncData.refresh = asyncData.execute = (opts = {}) => {
    if (nuxt._asyncDataPromises[key]) {
      if (opts.dedupe === false) {
        return nuxt._asyncDataPromises[key];
      }
      nuxt._asyncDataPromises[key].cancelled = true;
    }
    if ((opts._initial || nuxt.isHydrating && opts._initial !== false) && hasCachedData()) {
      return getCachedData();
    }
    asyncData.pending.value = true;
    asyncData.status.value = "pending";
    const promise = new Promise(
      (resolve, reject) => {
        try {
          resolve(handler(nuxt));
        } catch (err) {
          reject(err);
        }
      }
    ).then((_result) => {
      if (promise.cancelled) {
        return nuxt._asyncDataPromises[key];
      }
      let result = _result;
      if (options.transform) {
        result = options.transform(_result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      asyncData.data.value = result;
      asyncData.error.value = null;
      asyncData.status.value = "success";
    }).catch((error) => {
      if (promise.cancelled) {
        return nuxt._asyncDataPromises[key];
      }
      asyncData.error.value = error;
      asyncData.data.value = unref(options.default());
      asyncData.status.value = "error";
    }).finally(() => {
      if (promise.cancelled) {
        return;
      }
      asyncData.pending.value = false;
      nuxt.payload.data[key] = asyncData.data.value;
      if (asyncData.error.value) {
        nuxt.payload._errors[key] = createError(asyncData.error.value);
      }
      delete nuxt._asyncDataPromises[key];
    });
    nuxt._asyncDataPromises[key] = promise;
    return nuxt._asyncDataPromises[key];
  };
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxt.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxt.hook("app:created", () => promise);
    }
  }
  const asyncDataPromise = Promise.resolve(nuxt._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function useRequestFetch() {
  var _a;
  const event = (_a = useNuxtApp().ssrContext) == null ? void 0 : _a.event;
  return (event == null ? void 0 : event.$fetch) || globalThis.$fetch;
}
function useFetch(request, arg1, arg2) {
  const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
  const _key = opts.key || hash$1([autoKey, unref(opts.baseURL), typeof request === "string" ? request : "", unref(opts.params || opts.query)]);
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useFetch] key must be a string: " + _key);
  }
  if (!request) {
    throw new Error("[nuxt] [useFetch] request is missing.");
  }
  const key = _key === autoKey ? "$f" + _key : _key;
  const _request = computed(() => {
    let r = request;
    if (typeof r === "function") {
      r = r();
    }
    return unref(r);
  });
  if (!opts.baseURL && typeof _request.value === "string" && _request.value.startsWith("//")) {
    throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');
  }
  const {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    watch: watch2,
    immediate,
    ...fetchOptions
  } = opts;
  const _fetchOptions = reactive({
    ...fetchOptions,
    cache: typeof opts.cache === "boolean" ? void 0 : opts.cache
  });
  const _asyncDataOptions = {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    immediate,
    watch: watch2 === false ? [] : [_fetchOptions, _request, ...watch2 || []]
  };
  let controller;
  const asyncData = useAsyncData(key, () => {
    var _a;
    (_a = controller == null ? void 0 : controller.abort) == null ? void 0 : _a.call(controller);
    controller = typeof AbortController !== "undefined" ? new AbortController() : {};
    const isLocalFetch = typeof _request.value === "string" && _request.value.startsWith("/");
    let _$fetch = opts.$fetch || globalThis.$fetch;
    if (!opts.$fetch && isLocalFetch) {
      _$fetch = useRequestFetch();
    }
    return _$fetch(_request.value, { signal: controller.signal, ..._fetchOptions });
  }, _asyncDataOptions);
  return asyncData;
}
const _sfc_main$7 = {
  __name: "ModalButtonShowCard",
  __ssrInlineRender: true,
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const id = toRef(props, "id");
    const showModal = ref(false);
    let showData = ref(null);
    let fetchError = ref(null);
    watch(showModal, async (newValue) => {
      if (newValue === true) {
        try {
          showData.value = await fetchData();
        } catch (error) {
          fetchError.value = error;
          console.error("Error fetching data in modal:", error);
        }
      }
    });
    async function fetchData() {
      const response = await fetch(`http://api.tvmaze.com/shows/${id.value}`);
      if (!response.ok) {
        throw new Error(`error! status: ${response.status}`);
      }
      return await response.json();
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(unref(Info), {
        onClick: ($event) => showModal.value = true
      }, null, _parent));
      _push(ssrRenderComponent(unref(NModal), {
        show: showModal.value,
        "onUpdate:show": ($event) => showModal.value = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(showData)) {
              _push2(ssrRenderComponent(unref(NCard), {
                style: { width: "1000px" },
                title: unref(showData).name,
                bordered: false,
                size: "huge",
                role: "dialog",
                "aria-modal": "true"
              }, {
                "header-extra": withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(X), null, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", {
                        onClick: ($event) => showModal.value = false
                      }, [
                        createVNode(unref(X))
                      ], 8, ["onClick"])
                    ];
                  }
                }),
                footer: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (unref(showData) && unref(showData).officialSite) {
                      _push3(`<div class="flex justify-center"${_scopeId2}><a${ssrRenderAttr("href", unref(showData).officialSite)} target="_blank" class="btn btn-primary"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(NButton), null, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`Link to Official Website`);
                          } else {
                            return [
                              createTextVNode("Link to Official Website")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`</a></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      unref(showData) && unref(showData).officialSite ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex justify-center"
                      }, [
                        createVNode("a", {
                          href: unref(showData).officialSite,
                          target: "_blank",
                          class: "btn btn-primary"
                        }, [
                          createVNode(unref(NButton), null, {
                            default: withCtx(() => [
                              createTextVNode("Link to Official Website")
                            ]),
                            _: 1
                          })
                        ], 8, ["href"])
                      ])) : createCommentVNode("", true)
                    ];
                  }
                }),
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (unref(showData)) {
                      _push3(`<div${_scopeId2}><div class="flex flex-col md:flex-row overflow-y-scroll"${_scopeId2}><div class="md:w-1/3"${_scopeId2}>`);
                      if (unref(showData).image) {
                        _push3(`<img${ssrRenderAttr("src", unref(showData).image.original)} class="rounded-lg aspect-auto w-full h-auto"${ssrRenderAttr("alt", _ctx.title)}${_scopeId2}>`);
                      } else {
                        _push3(`<div class=""${_scopeId2}>No image</div>`);
                      }
                      _push3(`</div><div class="mt-4 md:w-2/3 md:ml-2 md:mt-0"${_scopeId2}><div${_scopeId2}><div class="inline-flex space-x-2 mb-4"${_scopeId2}><div class="rounded text-base bg-slate-400/70 inline-block text-white p-2"${_scopeId2}>`);
                      if (unref(showData) && unref(showData).rating.average) {
                        _push3(`<div class="flex items-center"${_scopeId2}>${ssrInterpolate(unref(showData).rating.average)}`);
                        _push3(ssrRenderComponent(unref(Star), {
                          class: "ml-1",
                          size: 18
                        }, null, _parent3, _scopeId2));
                        _push3(`</div>`);
                      } else {
                        _push3(`<div${_scopeId2}>no rating</div>`);
                      }
                      _push3(`</div><div class="rounded text-base bg-slate-400/70 inline-block text-white p-2"${_scopeId2}>`);
                      if (unref(showData).averageRuntime) {
                        _push3(`<div${_scopeId2}>${ssrInterpolate(unref(showData).averageRuntime)} min </div>`);
                      } else {
                        _push3(`<div${_scopeId2}>unknown runtime</div>`);
                      }
                      _push3(`</div><div${_scopeId2}>`);
                      if (unref(showData).premiered || unref(showData).ended) {
                        _push3(`<div class="flex rounded text-base bg-slate-400/70 text-white p-2"${_scopeId2}><div class=""${_scopeId2}>`);
                        if (unref(showData).premiered) {
                          _push3(`<div${_scopeId2}>${ssrInterpolate(unref(showData).premiered.slice(0, 4))}</div>`);
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`</div><div${_scopeId2}>-</div><div class=""${_scopeId2}>`);
                        if (unref(showData).ended) {
                          _push3(`<div${_scopeId2}>${ssrInterpolate(unref(showData).ended.slice(0, 4))}</div>`);
                        } else {
                          _push3(`<div${_scopeId2}>ongoing</div>`);
                        }
                        _push3(`</div></div>`);
                      } else {
                        _push3(`<div class=""${_scopeId2}>unknown date</div>`);
                      }
                      _push3(`</div></div></div>`);
                      if (unref(showData).genres && unref(showData).genres.length > 0) {
                        _push3(`<div${_scopeId2}> Genre(s) : <!--[-->`);
                        ssrRenderList(unref(showData).genres, (genre, index) => {
                          _push3(`<span${_scopeId2}>${ssrInterpolate(genre)}`);
                          if (index < unref(showData).genres.length - 1) {
                            _push3(`<span${_scopeId2}>, </span>`);
                          } else {
                            _push3(`<!---->`);
                          }
                          _push3(`</span>`);
                        });
                        _push3(`<!--]--></div>`);
                      } else {
                        _push3(`<div${_scopeId2}>No genres</div>`);
                      }
                      _push3(`<div${_scopeId2}><div${_scopeId2}>Status: ${ssrInterpolate(unref(showData).status)}</div><div${_scopeId2}> Airing: `);
                      if (unref(showData).schedule && unref(showData).schedule.days.length > 0 && unref(showData).schedule.time) {
                        _push3(`<span${_scopeId2}>${ssrInterpolate(unref(showData).schedule.days.join(", "))} at ${ssrInterpolate(unref(showData).schedule.time)}</span>`);
                      } else {
                        _push3(`<span${_scopeId2}>unknown schedule</span>`);
                      }
                      _push3(`</div><div${_scopeId2}> Network: ${ssrInterpolate(unref(showData).network ? unref(showData).network.name : "Unknown")}</div><div class="mt-4"${_scopeId2}> Summary: <span${_scopeId2}>${unref(showData).summary || "No summary available"}</span></div></div></div></div></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      unref(showData) ? (openBlock(), createBlock("div", { key: 0 }, [
                        createVNode("div", { class: "flex flex-col md:flex-row overflow-y-scroll" }, [
                          createVNode("div", { class: "md:w-1/3" }, [
                            unref(showData).image ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: unref(showData).image.original,
                              class: "rounded-lg aspect-auto w-full h-auto",
                              alt: _ctx.title
                            }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: ""
                            }, "No image"))
                          ]),
                          createVNode("div", { class: "mt-4 md:w-2/3 md:ml-2 md:mt-0" }, [
                            createVNode("div", null, [
                              createVNode("div", { class: "inline-flex space-x-2 mb-4" }, [
                                createVNode("div", { class: "rounded text-base bg-slate-400/70 inline-block text-white p-2" }, [
                                  unref(showData) && unref(showData).rating.average ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "flex items-center"
                                  }, [
                                    createTextVNode(toDisplayString(unref(showData).rating.average), 1),
                                    createVNode(unref(Star), {
                                      class: "ml-1",
                                      size: 18
                                    })
                                  ])) : (openBlock(), createBlock("div", { key: 1 }, "no rating"))
                                ]),
                                createVNode("div", { class: "rounded text-base bg-slate-400/70 inline-block text-white p-2" }, [
                                  unref(showData).averageRuntime ? (openBlock(), createBlock("div", { key: 0 }, toDisplayString(unref(showData).averageRuntime) + " min ", 1)) : (openBlock(), createBlock("div", { key: 1 }, "unknown runtime"))
                                ]),
                                createVNode("div", null, [
                                  unref(showData).premiered || unref(showData).ended ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "flex rounded text-base bg-slate-400/70 text-white p-2"
                                  }, [
                                    createVNode("div", { class: "" }, [
                                      unref(showData).premiered ? (openBlock(), createBlock("div", { key: 0 }, toDisplayString(unref(showData).premiered.slice(0, 4)), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, "-"),
                                    createVNode("div", { class: "" }, [
                                      unref(showData).ended ? (openBlock(), createBlock("div", { key: 0 }, toDisplayString(unref(showData).ended.slice(0, 4)), 1)) : (openBlock(), createBlock("div", { key: 1 }, "ongoing"))
                                    ])
                                  ])) : (openBlock(), createBlock("div", {
                                    key: 1,
                                    class: ""
                                  }, "unknown date"))
                                ])
                              ])
                            ]),
                            unref(showData).genres && unref(showData).genres.length > 0 ? (openBlock(), createBlock("div", { key: 0 }, [
                              createTextVNode(" Genre(s) : "),
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(showData).genres, (genre, index) => {
                                return openBlock(), createBlock("span", { key: index }, [
                                  createTextVNode(toDisplayString(genre), 1),
                                  index < unref(showData).genres.length - 1 ? (openBlock(), createBlock("span", { key: 0 }, ", ")) : createCommentVNode("", true)
                                ]);
                              }), 128))
                            ])) : (openBlock(), createBlock("div", { key: 1 }, "No genres")),
                            createVNode("div", null, [
                              createVNode("div", null, "Status: " + toDisplayString(unref(showData).status), 1),
                              createVNode("div", null, [
                                createTextVNode(" Airing: "),
                                unref(showData).schedule && unref(showData).schedule.days.length > 0 && unref(showData).schedule.time ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(unref(showData).schedule.days.join(", ")) + " at " + toDisplayString(unref(showData).schedule.time), 1)) : (openBlock(), createBlock("span", { key: 1 }, "unknown schedule"))
                              ]),
                              createVNode("div", null, " Network: " + toDisplayString(unref(showData).network ? unref(showData).network.name : "Unknown"), 1),
                              createVNode("div", { class: "mt-4" }, [
                                createTextVNode(" Summary: "),
                                createVNode("span", {
                                  innerHTML: unref(showData).summary || "No summary available"
                                }, null, 8, ["innerHTML"])
                              ])
                            ])
                          ])
                        ])
                      ])) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(showData) ? (openBlock(), createBlock(unref(NCard), {
                key: 0,
                style: { width: "1000px" },
                title: unref(showData).name,
                bordered: false,
                size: "huge",
                role: "dialog",
                "aria-modal": "true"
              }, {
                "header-extra": withCtx(() => [
                  createVNode("div", {
                    onClick: ($event) => showModal.value = false
                  }, [
                    createVNode(unref(X))
                  ], 8, ["onClick"])
                ]),
                footer: withCtx(() => [
                  unref(showData) && unref(showData).officialSite ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex justify-center"
                  }, [
                    createVNode("a", {
                      href: unref(showData).officialSite,
                      target: "_blank",
                      class: "btn btn-primary"
                    }, [
                      createVNode(unref(NButton), null, {
                        default: withCtx(() => [
                          createTextVNode("Link to Official Website")
                        ]),
                        _: 1
                      })
                    ], 8, ["href"])
                  ])) : createCommentVNode("", true)
                ]),
                default: withCtx(() => [
                  unref(showData) ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode("div", { class: "flex flex-col md:flex-row overflow-y-scroll" }, [
                      createVNode("div", { class: "md:w-1/3" }, [
                        unref(showData).image ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: unref(showData).image.original,
                          class: "rounded-lg aspect-auto w-full h-auto",
                          alt: _ctx.title
                        }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: ""
                        }, "No image"))
                      ]),
                      createVNode("div", { class: "mt-4 md:w-2/3 md:ml-2 md:mt-0" }, [
                        createVNode("div", null, [
                          createVNode("div", { class: "inline-flex space-x-2 mb-4" }, [
                            createVNode("div", { class: "rounded text-base bg-slate-400/70 inline-block text-white p-2" }, [
                              unref(showData) && unref(showData).rating.average ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "flex items-center"
                              }, [
                                createTextVNode(toDisplayString(unref(showData).rating.average), 1),
                                createVNode(unref(Star), {
                                  class: "ml-1",
                                  size: 18
                                })
                              ])) : (openBlock(), createBlock("div", { key: 1 }, "no rating"))
                            ]),
                            createVNode("div", { class: "rounded text-base bg-slate-400/70 inline-block text-white p-2" }, [
                              unref(showData).averageRuntime ? (openBlock(), createBlock("div", { key: 0 }, toDisplayString(unref(showData).averageRuntime) + " min ", 1)) : (openBlock(), createBlock("div", { key: 1 }, "unknown runtime"))
                            ]),
                            createVNode("div", null, [
                              unref(showData).premiered || unref(showData).ended ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "flex rounded text-base bg-slate-400/70 text-white p-2"
                              }, [
                                createVNode("div", { class: "" }, [
                                  unref(showData).premiered ? (openBlock(), createBlock("div", { key: 0 }, toDisplayString(unref(showData).premiered.slice(0, 4)), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, "-"),
                                createVNode("div", { class: "" }, [
                                  unref(showData).ended ? (openBlock(), createBlock("div", { key: 0 }, toDisplayString(unref(showData).ended.slice(0, 4)), 1)) : (openBlock(), createBlock("div", { key: 1 }, "ongoing"))
                                ])
                              ])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: ""
                              }, "unknown date"))
                            ])
                          ])
                        ]),
                        unref(showData).genres && unref(showData).genres.length > 0 ? (openBlock(), createBlock("div", { key: 0 }, [
                          createTextVNode(" Genre(s) : "),
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(showData).genres, (genre, index) => {
                            return openBlock(), createBlock("span", { key: index }, [
                              createTextVNode(toDisplayString(genre), 1),
                              index < unref(showData).genres.length - 1 ? (openBlock(), createBlock("span", { key: 0 }, ", ")) : createCommentVNode("", true)
                            ]);
                          }), 128))
                        ])) : (openBlock(), createBlock("div", { key: 1 }, "No genres")),
                        createVNode("div", null, [
                          createVNode("div", null, "Status: " + toDisplayString(unref(showData).status), 1),
                          createVNode("div", null, [
                            createTextVNode(" Airing: "),
                            unref(showData).schedule && unref(showData).schedule.days.length > 0 && unref(showData).schedule.time ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(unref(showData).schedule.days.join(", ")) + " at " + toDisplayString(unref(showData).schedule.time), 1)) : (openBlock(), createBlock("span", { key: 1 }, "unknown schedule"))
                          ]),
                          createVNode("div", null, " Network: " + toDisplayString(unref(showData).network ? unref(showData).network.name : "Unknown"), 1),
                          createVNode("div", { class: "mt-4" }, [
                            createTextVNode(" Summary: "),
                            createVNode("span", {
                              innerHTML: unref(showData).summary || "No summary available"
                            }, null, 8, ["innerHTML"])
                          ])
                        ])
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              }, 8, ["title"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/reusable/cards/show-card/button-show-card/ModalButtonShowCard.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const Modal = _sfc_main$7;
const _sfc_main$6 = {
  __name: "ButtonShowCard",
  __ssrInlineRender: true,
  props: {
    id: {
      type: Number,
      required: true
    },
    rating: {
      type: [Number, Object],
      required: true
    },
    showCardVersion: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const { id, rating } = toRefs(props);
    const watchlist = inject("watchlist");
    const addToWatchlist = inject("addToWatchlist");
    const removeFromWatchlist = inject("removeFromWatchlist");
    const selectedWatchlistShows = inject("selectedWatchlistShows");
    const addToSelectedWatchlistShows = (id2, rating2) => {
      rating2 = rating2.average || 5;
      selectedWatchlistShows.value.push({ id: id2, rating: rating2 });
      console.log("selectedWatchlistShows", selectedWatchlistShows.value);
    };
    const removeFromSelectedWatchlistShows = (id2) => {
      const index = selectedWatchlistShows.value.findIndex(
        (show) => show.id === id2
      );
      if (index !== -1) {
        selectedWatchlistShows.value.splice(index, 1);
      }
    };
    const isInWatchlist = computed(() => {
      return watchlist.value.includes(id.value);
    });
    const handleCheckboxChange = (checked) => {
      console.log("Checkbox change:", {
        checked,
        id: id.value,
        rating: rating.value
      });
      if (checked) {
        addToSelectedWatchlistShows(id.value, rating.value);
      } else {
        removeFromSelectedWatchlistShows(id.value);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-full flex items-center pr-2" }, _attrs))}>`);
      if (__props.showCardVersion === "search") {
        _push(`<div class="flex items-center">`);
        _push(ssrRenderComponent(Modal, { id: unref(id) }, null, _parent));
        if (!isInWatchlist.value) {
          _push(ssrRenderComponent(unref(NButton), {
            class: "text-xl",
            strong: "",
            secondary: "",
            type: "primary",
            onClick: ($event) => unref(addToWatchlist)(unref(id))
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Add`);
              } else {
                return [
                  createTextVNode("Add")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.showCardVersion === "mylist") {
        _push(`<div><div class="flex items-center">`);
        _push(ssrRenderComponent(unref(NSpace), {
          "item-style": "display: flex;",
          align: "center",
          class: "mr-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(NCheckbox), {
                size: "large",
                "onUpdate:checked": handleCheckboxChange
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(NCheckbox), {
                  size: "large",
                  "onUpdate:checked": handleCheckboxChange
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(Modal, { id: unref(id) }, null, _parent));
        _push(ssrRenderComponent(unref(NButton), {
          class: "text-xl",
          strong: "",
          secondary: "",
          type: "error",
          onClick: ($event) => unref(removeFromWatchlist)(unref(id))
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Delete`);
            } else {
              return [
                createTextVNode("Delete")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.showCardVersion === "randomizer") {
        _push(`<div>`);
        _push(ssrRenderComponent(Modal, { id: unref(id) }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/reusable/cards/show-card/button-show-card/ButtonShowCard.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const ButtonShowCard = _sfc_main$6;
const _sfc_main$5 = {
  __name: "ShowCard",
  __ssrInlineRender: true,
  props: {
    id: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    image: Object,
    links: String,
    premiered: String,
    ended: String,
    rating: [Number, Object],
    averageRuntime: Number,
    showCardVersion: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-36 mb-2 justify-between select-none hover:bg-black/20" }, _attrs))}><div class="flex items-center"><div class="flex-shrink-0 w-24">`);
      if (__props.image) {
        _push(`<img${ssrRenderAttr("src", __props.image.medium)} class="rounded-lg aspect-auto"${ssrRenderAttr("alt", __props.title)}>`);
      } else {
        _push(`<div class="">No image</div>`);
      }
      _push(`</div><div class="md:ml-4 ml-2 space-y-2"><div class="font-black text-sm md:text-base line-clamp-1">${ssrInterpolate(__props.title)}</div><div class="inline-flex lg:flex-row flex-col lg:space-x-1 space-y-1 lg:space-y-0"><div class="rounded text-sm bg-slate-400/70 inline-block text-white px-1">`);
      if (__props.rating && __props.rating.average) {
        _push(`<div class="flex items-center">${ssrInterpolate(__props.rating.average)}`);
        _push(ssrRenderComponent(unref(Star), {
          class: "ml-1",
          size: 14
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div>no rating</div>`);
      }
      _push(`</div><div class="rounded text-sm bg-slate-400/70 inline-block text-white px-1">`);
      if (__props.averageRuntime) {
        _push(`<div>${ssrInterpolate(__props.averageRuntime)} min</div>`);
      } else {
        _push(`<div>unknown runtime</div>`);
      }
      _push(`</div></div>`);
      if (__props.premiered) {
        _push(`<div class="flex"><div class="">`);
        if (__props.premiered) {
          _push(`<div>${ssrInterpolate(__props.premiered.slice(0, 4))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div>-</div><div class="">`);
        if (__props.ended) {
          _push(`<div>${ssrInterpolate(__props.ended.slice(0, 4))}</div>`);
        } else {
          _push(`<div>ongoing</div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<div class="">unknown date</div>`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(ButtonShowCard, {
        id: __props.id,
        rating: __props.rating,
        showCardVersion: __props.showCardVersion
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/reusable/cards/show-card/ShowCard.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const ShowCard = _sfc_main$5;
const _sfc_main$4 = {
  __name: "SearchSection",
  __ssrInlineRender: true,
  setup(__props) {
    const searchInput = ref("");
    let fetchResults = ref([]);
    watchEffect(async () => {
      if (searchInput.value.length > 3) {
        const { data, error, isFetching } = await useFetch(
          `https://api.tvmaze.com/search/shows?q=${searchInput.value}`,
          "$eYKWNqD7W2"
        );
        if (error.value) {
          console.log("error", error.value);
          return;
        }
        if (isFetching) {
          console.log("fetching data...");
          return;
        }
        fetchResults.value = data.value;
        console.log("fetch result", fetchResults.value);
        return;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(SectionCard, mergeProps({ title: "Search" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col"${_scopeId}><input${ssrRenderAttr("value", searchInput.value)} class="w-full rounded text-white border-white/10 p-2 bg-white/10 mb-2" placeholder="search for a show"${_scopeId}><div class="overflow-y-auto h-96"${_scopeId}><!--[-->`);
            ssrRenderList(unref(fetchResults), (show, index) => {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(ShowCard, {
                id: show.show.id,
                title: show.show.name,
                image: show.show.image,
                premiered: show.show.premiered,
                ended: show.show.ended,
                rating: show.show.rating,
                averageRuntime: show.show.averageRuntime,
                showCardVersion: "search"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col" }, [
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => searchInput.value = $event,
                  class: "w-full rounded text-white border-white/10 p-2 bg-white/10 mb-2",
                  placeholder: "search for a show"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, searchInput.value]
                ]),
                createVNode("div", { class: "overflow-y-auto h-96" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(fetchResults), (show, index) => {
                    return openBlock(), createBlock("div", { key: index }, [
                      createVNode(ShowCard, {
                        id: show.show.id,
                        title: show.show.name,
                        image: show.show.image,
                        premiered: show.show.premiered,
                        ended: show.show.ended,
                        rating: show.show.rating,
                        averageRuntime: show.show.averageRuntime,
                        showCardVersion: "search"
                      }, null, 8, ["id", "title", "image", "premiered", "ended", "rating", "averageRuntime"])
                    ]);
                  }), 128))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/search-section/SearchSection.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const SearchSection = _sfc_main$4;
const __nuxt_component_0 = /* @__PURE__ */ defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  // eslint-disable-next-line vue/require-prop-types
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_, { slots, attrs }) {
    const mounted = ref(false);
    return (props) => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? void 0 : _a.call(slots);
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const _sfc_main$3 = {
  __name: "MyListSection",
  __ssrInlineRender: true,
  setup(__props) {
    inject("watchlist");
    const showsInWatchlist = ref([]);
    const sortOptions = [
      { value: "name", label: "Alphabetical Order" },
      { value: "rating", label: "Rating" },
      { value: "year", label: "Year" },
      { value: "isEnded", label: "Ended yet", disabled: true }
    ];
    const selectedSort = ref(sortOptions[0].value);
    const runtimeOptions = [
      { value: "all", label: "All runtimes" },
      { value: "short", label: "Short (< 25min)" },
      { value: "medium", label: "Medium (25-50min)" },
      { value: "long", label: "Long (> 50min)" }
    ];
    const selectedRuntime = ref(runtimeOptions[0].value);
    const sortedShowsInWatchlist = computed(() => {
      return [...showsInWatchlist.value].sort((a, b) => {
        if (selectedSort.value === "year") {
          return new Date(a.premiered) - new Date(b.premiered);
        } else if (selectedSort.value === "rating") {
          return b.rating.average - a.rating.average;
        } else {
          return a.name.localeCompare(b.name);
        }
      });
    });
    const filteredAndSortedShowsInWatchlist = computed(() => {
      return sortedShowsInWatchlist.value.filter((show) => {
        if (!show.averageRuntime) {
          return selectedRuntime.value === "all";
        }
        if (selectedRuntime.value === "short") {
          return show.averageRuntime < 25;
        } else if (selectedRuntime.value === "medium") {
          return show.averageRuntime >= 25 && show.averageRuntime <= 50;
        } else if (selectedRuntime.value === "long") {
          return show.averageRuntime > 50;
        } else {
          return true;
        }
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(ssrRenderComponent(SectionCard, mergeProps({ title: "My list" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_ClientOnly, null, {}, _parent2, _scopeId));
            _push2(`</div><div class="overflow-y-auto max-h-[400px]"${_scopeId}>`);
            if (showsInWatchlist.value.length > 0) {
              _push2(`<div${_scopeId}><!--[-->`);
              ssrRenderList(filteredAndSortedShowsInWatchlist.value, (show) => {
                _push2(`<div${_scopeId}>`);
                _push2(ssrRenderComponent(ShowCard, {
                  id: show.id,
                  title: show.name,
                  image: show.image,
                  premiered: show.premiered,
                  ended: show.ended,
                  rating: show.rating,
                  averageRuntime: show.averageRuntime,
                  showCardVersion: "mylist"
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              });
              _push2(`<!--]-->`);
              if (filteredAndSortedShowsInWatchlist.value.length === 0) {
                _push2(`<div class="text-center"${_scopeId}> No shows found for the selected runtime. </div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<div class="text-center"${_scopeId}> Your watchlist is empty. Start adding some shows! </div>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex" }, [
                createVNode(_component_ClientOnly, null, {
                  default: withCtx(() => [
                    createVNode(unref(NSelect), {
                      value: selectedSort.value,
                      "onUpdate:value": ($event) => selectedSort.value = $event,
                      size: "tiny",
                      options: sortOptions,
                      placeholder: "Sort by"
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(unref(NSelect), {
                      value: selectedRuntime.value,
                      "onUpdate:value": ($event) => selectedRuntime.value = $event,
                      size: "tiny",
                      options: runtimeOptions,
                      placeholder: "Runtime"
                    }, null, 8, ["value", "onUpdate:value"])
                  ]),
                  _: 1
                })
              ]),
              createVNode("div", { class: "overflow-y-auto max-h-[400px]" }, [
                showsInWatchlist.value.length > 0 ? (openBlock(), createBlock("div", { key: 0 }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(filteredAndSortedShowsInWatchlist.value, (show) => {
                    return openBlock(), createBlock("div", {
                      key: show.id
                    }, [
                      createVNode(ShowCard, {
                        id: show.id,
                        title: show.name,
                        image: show.image,
                        premiered: show.premiered,
                        ended: show.ended,
                        rating: show.rating,
                        averageRuntime: show.averageRuntime,
                        showCardVersion: "mylist"
                      }, null, 8, ["id", "title", "image", "premiered", "ended", "rating", "averageRuntime"])
                    ]);
                  }), 128)),
                  filteredAndSortedShowsInWatchlist.value.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-center"
                  }, " No shows found for the selected runtime. ")) : createCommentVNode("", true)
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "text-center"
                }, " Your watchlist is empty. Start adding some shows! "))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/my-list-section/MyListSection.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const MyListSection = _sfc_main$3;
const _sfc_main$2 = {
  __name: "DisplaySelectedRandomShowSection",
  __ssrInlineRender: true,
  props: {
    selectedShowData: {
      type: Object,
      default: () => ({})
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col" }, _attrs))}><div class="md:border-2 p-2 border-white/20 rounded-lg">`);
      if (__props.selectedShowData) {
        _push(ssrRenderComponent(ShowCard, {
          id: __props.selectedShowData.id,
          title: __props.selectedShowData.name,
          image: __props.selectedShowData.image,
          premiered: __props.selectedShowData.premiered,
          ended: __props.selectedShowData.ended,
          rating: __props.selectedShowData.rating,
          averageRuntime: __props.selectedShowData.averageRuntime,
          summary: __props.selectedShowData.summary,
          showCardVersion: "randomizer"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="">${__props.selectedShowData.summary}</div></div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/random-show-section/DisplaySelectedRandomShowSection.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const DisplaySelectedRandomShowSection = _sfc_main$2;
const _sfc_main$1 = {
  __name: "RandomShowSection",
  __ssrInlineRender: true,
  setup(__props) {
    const toast = useToast();
    const selectedWatchlistShows = inject("selectedWatchlistShows");
    const isPending = ref(true);
    let selectedShow = ref(null);
    let alreadySelectedShows = ref([]);
    const handleRandomizer = async () => {
      if (selectedWatchlistShows.value.length > 0) {
        let weightedShows = [];
        selectedWatchlistShows.value.forEach((show) => {
          const count = Math.floor(show.rating);
          for (let i = 0; i < count; i++) {
            weightedShows.push(show);
          }
        });
        weightedShows = weightedShows.filter(
          (show) => !alreadySelectedShows.value.includes(show.id)
        );
        if (weightedShows.length > 0) {
          const randomIndex = Math.floor(Math.random() * weightedShows.length);
          selectedShow.value = weightedShows[randomIndex];
          alreadySelectedShows.value.push(selectedShow.value.id);
          const { data, error, pending } = await useFetch(
            `https://api.tvmaze.com/shows/${selectedShow.value.id}`,
            "$LrrWeAxHDE"
          );
          if (error.value) {
            console.log("error", error.value);
            return;
          }
          isPending.value = pending.value;
          selectedShow.value = data.value;
          console.log("selected show : ", selectedShow.value);
          isPending.value = pending.value;
          console.log("isPending : ", isPending.value);
        } else {
          console.log("All shows have been selected");
          toast.value.create({
            type: "error",
            title: "No more shows to view",
            description: "All shows selected from your list have already been viewed",
            placement: "bottom-right"
          });
        }
      } else {
        console.log("No shows selected");
        toast.value.create({
          type: "error",
          title: "No show selected",
          description: "Please select some shows from your list first",
          placement: "bottom-right"
        });
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(SectionCard, mergeProps({ title: "What should we watch tonight ?" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-full flex flex-col md:flex-row"${_scopeId}><div class="items-center justify-center flex w-full"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(NButton$1), {
              strong: "",
              type: "tertiary",
              onClick: handleRandomizer
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Select a random show `);
                } else {
                  return [
                    createTextVNode(" Select a random show ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (unref(selectedShow)) {
              _push2(`<div class="md:w-full"${_scopeId}>`);
              if (!isPending.value) {
                _push2(ssrRenderComponent(DisplaySelectedRandomShowSection, {
                  selectedShowData: unref(selectedShow),
                  isPending: isPending.value
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "w-full flex flex-col md:flex-row" }, [
                createVNode("div", { class: "items-center justify-center flex w-full" }, [
                  createVNode(unref(NButton$1), {
                    strong: "",
                    type: "tertiary",
                    onClick: handleRandomizer
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Select a random show ")
                    ]),
                    _: 1
                  })
                ]),
                unref(selectedShow) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "md:w-full"
                }, [
                  !isPending.value ? (openBlock(), createBlock(DisplaySelectedRandomShowSection, {
                    key: 0,
                    selectedShowData: unref(selectedShow),
                    isPending: isPending.value
                  }, null, 8, ["selectedShowData", "isPending"])) : createCommentVNode("", true)
                ])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/random-show-section/RandomShowSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const SelectRandomShowSection = _sfc_main$1;
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const watchlist = ref([]);
    const selectedWatchlistShows = ref([]);
    watch(watchlist, (newWatchlist) => {
      console.log("localStorage :", newWatchlist);
      localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
    });
    const addToWatchlist = (id) => {
      watchlist.value = [...watchlist.value, id];
    };
    const removeFromWatchlist = (id) => {
      const newWatchlist = watchlist.value.filter((showId) => showId !== id);
      watchlist.value = newWatchlist;
      const selectedIndex = selectedWatchlistShows.value.findIndex(
        (show) => show.id === id
      );
      if (selectedIndex !== -1) {
        const newSelectedWatchlistShows = selectedWatchlistShows.value.filter(
          (show) => show.id !== id
        );
        selectedWatchlistShows.value = newSelectedWatchlistShows;
      }
    };
    provide("watchlist", watchlist);
    provide("addToWatchlist", addToWatchlist);
    provide("removeFromWatchlist", removeFromWatchlist);
    provide("selectedWatchlistShows", selectedWatchlistShows);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="md:flex w-full">`);
      _push(ssrRenderComponent(SearchSection, { class: "md:w-[50%]" }, null, _parent));
      _push(ssrRenderComponent(MyListSection, {
        class: "md:w-[50%]",
        watchlist: watchlist.value.value
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(SelectRandomShowSection, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-e0d7a1be.mjs.map
