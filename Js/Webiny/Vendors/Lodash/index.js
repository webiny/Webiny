/**
 * This file is a set of functions commonly used in Webiny.
 * It is created to reduce lodash build size as much as possible but it still contains some functions not found in lodash core.
 */
const lodash = require('lodash/core');

const assign = require('lodash/assign');
const camelCase = require('lodash/camelCase');
const cloneDeep = require('lodash/cloneDeep');
const cloneDeepWith = require('lodash/cloneDeepWith');
const endsWith = require('lodash/endsWith');
const findIndex = require('lodash/findIndex');
const findLastIndex = require('lodash/findLastIndex');
const forIn = require('lodash/forIn');
const get = require('lodash/get');
const includes = require('lodash/includes');
const isNil = require('lodash/isNil');
const isPlainObject = require('lodash/isPlainObject');
const lowerCase = require('lodash/lowerCase');
const mapValues = require('lodash/mapValues');
const merge = require('lodash/merge');
const noop = require('lodash/noop');
const now = require('lodash/now');
const omit = require('lodash/omit');
const omitBy = require('lodash/omitBy');
const orderBy = require('lodash/orderBy');
const pickBy = require('lodash/pickBy');
const range = require('lodash/range');
const round = require('lodash/round');
const set = require('lodash/set');
const sortBy = require('lodash/sortBy');
const startsWith = require('lodash/startsWith');
const toPairs = require('lodash/toPairs');
const trim = require('lodash/trim');
const trimEnd = require('lodash/trimEnd');
const trimStart = require('lodash/trimStart');
const union = require('lodash/union');
const without = require('lodash/without');

lodash.mixin({
    assign,
    camelCase,
    cloneDeep,
    cloneDeepWith,
    endsWith,
    findIndex,
    findLastIndex,
    forIn,
    get,
    includes,
    isNil,
    isPlainObject,
    lowerCase,
    mapValues,
    merge,
    noop,
    now,
    omit,
    omitBy,
    orderBy,
    pickBy,
    range,
    round,
    set,
    sortBy,
    startsWith,
    toPairs,
    trim,
    trimEnd,
    trimStart,
    union,
    without
});

module.exports = lodash;