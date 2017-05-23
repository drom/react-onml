/* @flow */

'use strict';

// using react fiber API

/*::

type Container = Array<any>;

type Props = {
    prop: any,
    hidden?: boolean
};

type Instance = Array<any>;
type TextInstance = string;

*/

var ReactFiberReconciler = require('react-dom/lib/ReactFiberReconciler');
var emptyObject = {};
var instanceCounter = 0;
var UPDATE_SIGNAL = {};
var scheduledAnimationCallback = null;
var scheduledDeferredCallback = null;
var failInBeginPhase = false;
var log = console.log;

var Renderer = ReactFiberReconciler({

    getRootHostContext: function () {
        // log('getRootHostContext');
        return emptyObject;
    },

    getChildHostContext: function () {
        // log('getChildHostContext');
        return emptyObject;
    },

    getPublicInstance: function (instance) {
        // log('getPublicInstance');
        return instance;
    },

    createInstance: function (
        type /*: string */,
        props /*: Props */
    ) /*: Instance */ {
        // log('createInstance');
        var attr = Object.keys(props).reduce(function (res, key) {
            if (key !== 'children') {
                res[key] = props[key];
            }
            return res;
        }, {});
        var res = [type, attr];
        // var res = {
        //     id: instanceCounter++,
        //     type: type,
        //     children: [],
        //     prop: props.prop
        // };
        // log(type, props, res);
        return res;
    },

    appendInitialChild: function (
        parentInstance /*: Instance */,
        child /*: Instance | TextInstance */
    ) /*: void */ {
        // log('appendInitialChild');
        parentInstance.push(child);
        // log(parentInstance);
    },

    finalizeInitialChildren: function (
        domElement /*: Instance */,
        type /*: string */,
        props /*: Props */
    ) /*: boolean */ {
        // log('finalizeInitialChildren');
        return false;
    },

    prepareUpdate: function (
        instance /*: Instance */,
        type /*: string */,
        oldProps /*: Props */,
        newProps /*: Props */
    ) /*: null | {} */ {
        // log('prepareUpdate');
        return UPDATE_SIGNAL;
    },

    commitMount: function (
        instance /*: Instance */,
        type /*: string */,
        newProps /*: Props */
    ) /*: void */ {
        // log('commitUpdate');
    },

    commitUpdate: function (
        instance /*: Instance */,
        updatePayload /*: Object */,
        type /*: string */,
        oldProps /*: Props */,
        newProps /*: Props */
    ) /*: void */ {
        // log('commitUpdate');
        instance[1] = newProps.prop;
    },

    shouldSetTextContent: function (props /*: Props */) /*: boolean */ {
        // log('shouldSetTextContent');
        // log(props);
        return (
            typeof props.children === 'string' ||
            typeof props.children === 'number'
        );
    },

    resetTextContent: function (instance /*: Instance */) /*: void */ {
        // log('resetTextContent');
    },

    shouldDeprioritizeSubtree: function (
        type /*: string */,
        props /*: Props */
    ) /*: boolean */ {
        // log('shouldDeprioritizeSubtree');
        return !!props.hidden;
    },

    createTextInstance: function (
        text /*: string */,
        rootContainerInstance /*: Container */,
        hostContext /*: Object */,
        internalInstanceHandle /*: Object */
    ) /*: TextInstance */ {
        // log('createTextInstance');
        return text;
    },

    commitTextUpdate: function (
        textInstance /*: TextInstance */,
        oldText /*: string */,
        newText /*: string */
    ) /*: void */ {
        // log('commitTextUpdate');
        textInstance.text = newText;
    },

    appendChild: function (
        parentInstance /*: Instance | Container */,
        child /*: Instance | TextInstance */
    ) /*: void */ {
        // log('appendChild');
        var index = parentInstance.indexOf(child);
        if (index !== -1) {
            parentInstance.splice(index, 1);
        }
        parentInstance.push(child);
        // log(JSON.stringify(parentInstance, null, 4));
    },

    insertBefore: function (
        parentInstance /*: Instance | Container */,
        child /*: Instance | TextInstance */,
        beforeChild /*: Instance | TextInstance */
    ) /*: void */ {
        // log('insertBefore');
        var index = parentInstance.indexOf(child);
        if (index !== -1) {
            parentInstance.splice(index, 1);
        }
        var beforeIndex = parentInstance.indexOf(beforeChild);
        if (beforeIndex === -1) {
            throw new Error('This child does not exist.');
        }
        parentInstance.splice(beforeIndex, 0, child);
    },

    removeChild: function (
        parentInstance /*: Instance | Container */,
        child /*: Instance | TextInstance */
    ) /*: void */ {
        // log('removeChild');
        var index = parentInstance.indexOf(child);
        if (index === -1) {
            throw new Error('This child does not exist.');
        }
        parentInstance.splice(index, 1);
    },

    scheduleAnimationCallback: function (callback) {
        // log('scheduleAnimationCallback');
        if (scheduledAnimationCallback) {
            throw new Error('Scheduling an animation callback twice is excessive.');
        }
        scheduledAnimationCallback = callback;
    },

    scheduleDeferredCallback: function (callback) {
        // log('scheduleDeferredCallback');
        if (scheduledDeferredCallback) {
            throw new Error('Scheduling deferred callback twice is excessive.');
        }
        scheduledDeferredCallback = callback;
    },

    prepareForCommit: function () /*: void */ {
        // log('prepareForCommit');
    },

    resetAfterCommit: function () /*: void */ {
        // log('resetAfterCommit');
    }
});

var rootContainers = {};
var roots = {};
var DEFAULT_ROOT_ID = '<default>';

var ReactOnml = {

    getChildren: function(rootID /*: string = DEFAULT_ROOT_ID */) {
        rootID = rootID || DEFAULT_ROOT_ID;
        // log('getChildren');
        var container = rootContainers.rootID;
        if (container) {
            return container.children;
        } else {
            return null;
        }
    },

    render: function (
        element /*: Object */ /* ReactElement<any> */,
        callback /*: ?Function */
    ) {
        // log('render');
        ReactOnml.renderToRootWithID(element, DEFAULT_ROOT_ID, callback);
    },

    renderToRootWithID: function (
        element /*: Object */ /* ReactElement<any> */,
        rootID /*: string */,
        callback /*: ?Function */
    ) {
        // log('renderToRootWithID');
        var root = roots.rootID;
        if (!root) {
            // var container = {
            //     rootID: rootID,
            //     children: []
            // };
            var container = ['root', {}];
            rootContainers.rootID = container;
            root = Renderer.createContainer(container);
            roots.rootID = root;
        }
        Renderer.updateContainer(element, root, null, callback);
    },

    unmountRootWithID: function (rootID /*: string */) {
        // log('unmountRootWithID');
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
        // log('findInstance');
        return null;
    },

    flushAnimationPri: function () {
        // log('flushAnimationPri');
        var cb = scheduledAnimationCallback;
        if (cb === null) {
            return;
        }
        scheduledAnimationCallback = null;
        cb('rootContainers');
    },

    flushDeferredPri: function (timeout /*: number = Infinity */) {
        // log('flushDeferredPri');
        timeout = timeout || Infinity;
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
        // log('flushDeferredPri');
    },

    flush: function () {
        // log('flush');
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
        rootID = rootID || DEFAULT_ROOT_ID;
        log('dumpTree');
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
