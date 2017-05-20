/* @flow */

'use strict';

// using react fiber API

/*::

type Container = {rootID: string, children: Array<Instance | TextInstance>};
type Props = {prop: any, hidden?: boolean};
type Instance = {|
  type: string,
  id: number,
  children: Array<Instance | TextInstance>,
  prop: any,
|};
type TextInstance = {|text: string, id: number|};

*/

var ReactFiberReconciler = require('react-dom/lib/ReactFiberReconciler');
var emptyObject = {};
var instanceCounter = 0;
var UPDATE_SIGNAL = {};
var scheduledAnimationCallback = null;
var scheduledDeferredCallback = null;
var failInBeginPhase = false;

var Renderer = ReactFiberReconciler({

    getRootHostContext: function () {
        return emptyObject;
    },

    getChildHostContext: function () {
        return emptyObject;
    },

    getPublicInstance: function (instance) {
        return instance;
    },

    createInstance: function (
        type /*: string */,
        props /*: Props */
    ) /*: Instance */ {
        return {
            id: instanceCounter++,
            type: type,
            children: [],
            prop: props.prop
        };
    },

    appendInitialChild: function (
        parentInstance /*: Instance */,
        child /*: Instance | TextInstance */
    ) /*: void */ {
        parentInstance.children.push(child);
    },

    finalizeInitialChildren: function (
        domElement /*: Instance */,
        type /*: string */,
        props /*: Props */
    ) /*: boolean */ {
        return false;
    },

    prepareUpdate: function (
        instance /*: Instance */,
        type /*: string */,
        oldProps /*: Props */,
        newProps /*: Props */
    ) /*: null | {} */ {
        return UPDATE_SIGNAL;
    },

    commitMount: function (
        instance /*: Instance */,
        type /*: string */,
        newProps /*: Props */
    ) /*: void */ {
    },

    commitUpdate: function (
        instance /*: Instance */,
        updatePayload /*: Object */,
        type /*: string */,
        oldProps /*: Props */,
        newProps /*: Props */
    ) /*: void */ {
        instance.prop = newProps.prop;
    },

    shouldSetTextContent: function (props /*: Props */) /*: boolean */ {
        return (
            typeof props.children === 'string' ||
            typeof props.children === 'number'
        );
    },

    resetTextContent: function (instance /*: Instance */) /*: void */ {},

    shouldDeprioritizeSubtree: function (
        type /*: string */,
        props /*: Props */
    ) /*: boolean */ {
        return !!props.hidden;
    },

    createTextInstance: function (
        text /*: string */,
        rootContainerInstance /*: Container */,
        hostContext /*: Object */,
        internalInstanceHandle /*: Object */
    ) /*: TextInstance */ {
        return {
            text: text,
            id: instanceCounter++
        };
    },

    commitTextUpdate: function (
        textInstance /*: TextInstance */,
        oldText /*: string */,
        newText /*: string */
    ) /*: void */ {
        textInstance.text = newText;
    },

    appendChild: function (
        parentInstance /*: Instance | Container */,
        child /*: Instance | TextInstance */
    ) /*: void */ {
        var index = parentInstance.children.indexOf(child);
        if (index !== -1) {
            parentInstance.children.splice(index, 1);
        }
        parentInstance.children.push(child);
    },

    insertBefore: function (
        parentInstance /*: Instance | Container */,
        child /*: Instance | TextInstance */,
        beforeChild /*: Instance | TextInstance */
    ) /*: void */ {
        var index = parentInstance.children.indexOf(child);
        if (index !== -1) {
            parentInstance.children.splice(index, 1);
        }
        var beforeIndex = parentInstance.children.indexOf(beforeChild);
        if (beforeIndex === -1) {
            throw new Error('This child does not exist.');
        }
        parentInstance.children.splice(beforeIndex, 0, child);
    },

    removeChild: function (
        parentInstance /*: Instance | Container */,
        child /*: Instance | TextInstance */
    ) /*: void */ {
        var index = parentInstance.children.indexOf(child);
        if (index === -1) {
            throw new Error('This child does not exist.');
        }
        parentInstance.children.splice(index, 1);
    },

    scheduleAnimationCallback: function (callback) {
        if (scheduledAnimationCallback) {
            throw new Error('Scheduling an animation callback twice is excessive.');
        }
        scheduledAnimationCallback = callback;
    },

    scheduleDeferredCallback: function (callback) {
        if (scheduledDeferredCallback) {
            throw new Error('Scheduling deferred callback twice is excessive.');
        }
        scheduledDeferredCallback = callback;
    },

    prepareForCommit: function () /*: void */ {},

    resetAfterCommit: function () /*: void */ {}
});

var rootContainers = {};
var roots = {};
var DEFAULT_ROOT_ID = '<default>';

var ReactOnml = {

    getChildren: function(rootID /*: string = DEFAULT_ROOT_ID */) {
        var container = rootContainers.rootID;
        if (container) {
            return container.children;
        } else {
            return null;
        }
    },

    render: function (
        element /*: Object */ /* ReactElement<any> */,
        callback /*: ?Function */,
        container /*: Object */
    ) {
        ReactOnml.renderToRootWithID(element, DEFAULT_ROOT_ID, callback);
    },

    renderToRootWithID: function (
        element /*: Object */ /* ReactElement<any> */,
        rootID /*: string */,
        callback /*: ?Function */
    ) {
        var root = roots.rootID;
        if (!root) {
            var container = {
                rootID: rootID,
                children: []
            };
            rootContainers.rootID = container;
            root = Renderer.createContainer(container);
            roots.rootID = root;
        }
        Renderer.updateContainer(element, root, null, callback);
    },

    unmountRootWithID: function (rootID /*: string */) {
        var root = roots.rootID;
        if (root) {
            Renderer.updateContainer(null, root, null, function () {
                delete roots.rootID;
                delete rootContainers.rootID;
            });
        }
    },

    findInstance: function (
        componentOrElement /*: any */ /* Element | ?ReactComponent<any, any, any> */
    ) /*: null | Instance | TextInstance */ {
        return null;
    },

    flushAnimationPri: function () {
        var cb = scheduledAnimationCallback;
        if (cb === null) {
            return;
        }
        scheduledAnimationCallback = null;
        cb();
    },

    flushDeferredPri: function (timeout /*: number = Infinity */) {
        var cb = scheduledDeferredCallback;
        if (cb === null) {
            return;
        }
        scheduledDeferredCallback = null;
        var timeRemaining = timeout;
        cb({
            timeRemaining: function () {
                // Simulate a fix amount of time progressing between each call.
                timeRemaining -= 5;
                if (timeRemaining < 0) {
                    timeRemaining = 0;
                }
                return timeRemaining;
            }
        });
    },

    flush: function () {
        ReactOnml.flushAnimationPri();
        ReactOnml.flushDeferredPri();
    },

    performAnimationWork: function (fn /*: Function */) {
        // Renderer.performWithPriority(AnimationPriority, fn);
    },

    batchedUpdates: Renderer.batchedUpdates,

    unbatchedUpdates: Renderer.unbatchedUpdates,

    syncUpdates: Renderer.syncUpdates,

    dumpTree: function (rootID /*: string = DEFAULT_ROOT_ID */) {

    },

    simulateErrorInHostConfig: function (fn /*: () => void */) {
        failInBeginPhase = true;
        try {
            fn();
        } finally {
            failInBeginPhase = false;
        }
    },

    ReactFiberInstrumentation: function () {}

};

module.exports = ReactOnml;

/* eslint no-console: 1, no-unused-vars: 1 */
