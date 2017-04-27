/**
 * This file is a set of functions commonly used in Webiny.
 * It is created to reduce lodash build size as much as possible.
 */
const assign = require('lodash/assign');
const clone = require('lodash/clone');
const cloneDeep = require('lodash/cloneDeep');
const cloneDeepWith = require('lodash/cloneDeepWith');
const each = require('lodash/each');
const endsWith = require('lodash/endsWith');
const filter = require('lodash/filter');
const find = require('lodash/find');
const findIndex = require('lodash/findIndex');
const findLastIndex = require('lodash/findLastIndex');
const forEach = require('lodash/forEach');
const forIn = require('lodash/forIn');
const get = require('lodash/get');
const has = require('lodash/has');
const includes = require('lodash/includes');
const indexOf = require('lodash/indexOf');
const isArray = require('lodash/isArray');
const isEmpty = require('lodash/isEmpty');
const isEqual = require('lodash/isEqual');
const isFunction = require('lodash/isFunction');
const isNil = require('lodash/isNil');
const isNull = require('lodash/isNull');
const isNumber = require('lodash/isNumber');
const isObject = require('lodash/isObject');
const isPlainObject = require('lodash/isPlainObject');
const isString = require('lodash/isString');
const isUndefined = require('lodash/isUndefined');
const keys = require('lodash/keys');
const last = require('lodash/last');
const lowerCase = require('lodash/lowerCase');
const map = require('lodash/map');
const mapValues = require('lodash/mapValues');
const merge = require('lodash/merge');
const noop = require('lodash/noop');
const now = require('lodash/now');
const omit = require('lodash/omit');
const omitBy = require('lodash/omitBy');
const orderBy = require('lodash/orderBy');
const pick = require('lodash/pick');
const pickBy = require('lodash/pickBy');
const range = require('lodash/range');
const round = require('lodash/round');
const set = require('lodash/set');
const size = require('lodash/size');
const sortBy = require('lodash/sortBy');
const startsWith = require('lodash/startsWith');
const toPairs = require('lodash/toPairs');
const trim = require('lodash/trim');
const trimEnd = require('lodash/trimEnd');
const trimStart = require('lodash/trimStart');
const union = require('lodash/union');
const uniqueId = require('lodash/uniqueId');
const values = require('lodash/values');
const without = require('lodash/without');

module.exports = {
    assign,
    clone,
    cloneDeep,
    cloneDeepWith,
    each,
    endsWith,
    filter,
    find,
    findIndex,
    findLastIndex,
    forEach,
    forIn,
    get,
    has,
    includes,
    indexOf,
    isArray,
    isEmpty,
    isEqual,
    isFunction,
    isNil,
    isNull,
    isNumber,
    isObject,
    isPlainObject,
    isString,
    isUndefined,
    keys,
    last,
    lowerCase,
    map,
    mapValues,
    merge,
    noop,
    now,
    omit,
    omitBy,
    orderBy,
    pick,
    pickBy,
    range,
    round,
    set,
    size,
    sortBy,
    startsWith,
    toPairs,
    trim,
    trimEnd,
    trimStart,
    union,
    uniqueId,
    values,
    without
};