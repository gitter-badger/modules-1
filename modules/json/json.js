// json.js
// Module for hAzzle created after ideas from https://github.com/rmm5t/jquery-timeago
var hAzzle = window.hAzzle || (window.hAzzle = {});

hAzzle.define('json', function() {

    var  // Dependencies
    
         types = hAzzle.require('Types'),

        wrapper = /["\\\x00-\x1f\x7f-\x9f]/g,
        meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        hasOwn = Object.prototype.hasOwnProperty,

        toJSON = types.isType('Object')(JSON) && JSON.stringify ? JSON.stringify : function(o) {
            if (o === null) {
                return 'null';
            }

            var pairs, k, name, val;

            if (typeof o === 'undefined') {
                return undefined;
            }

            if (typeof o === 'number' || typeof o === 'boolean') {
                return String(o);
            }
            if (typeof o === 'string') {
                return quoteString(o);
            }
            if (types.isType('Function')(o.toJSON)) {
                return toJSON(o.toJSON());
            }
            if (types.isType('Date')(o)) {
                var month = o.getUTCMonth() + 1,
                    day = o.getUTCDate(),
                    year = o.getUTCFullYear(),
                    hours = o.getUTCHours(),
                    minutes = o.getUTCMinutes(),
                    seconds = o.getUTCSeconds(),
                    milli = o.getUTCMilliseconds();

                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                if (hours < 10) {
                    hours = '0' + hours;
                }
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }
                if (milli < 100) {
                    milli = '0' + milli;
                }
                if (milli < 10) {
                    milli = '0' + milli;
                }
                return '"' + year + '-' + month + '-' + day + 'T' +
                    hours + ':' + minutes + ':' + seconds +
                    '.' + milli + 'Z"';
            }

            pairs = [];

            if (types.isArray(o)) {
                for (k = 0; k < o.length; k++) {
                    pairs.push(toJSON(o[k]) || 'null');
                }
                return '[' + pairs.join(',') + ']';
            }

            if (types.isType('Object')(o)) {
                for (k in o) {
                    // Only include own properties,
                    // Filter out inherited prototypes
                    if (hasOwn.call(o, k)) {
                        // Keys must be numerical or string. Skip others
                        if (typeof k === 'number') {
                            name = '"' + k + '"';
                        } else if (typeof k === 'string') {
                            name = quoteString(k);
                        } else {
                            continue;
                        }
           
                        // Invalid values like these return undefined
                        // from toJSON, however those object members
                        // shouldn't be included in the JSON string at all.
                        if (typeof o[k] !== 'function' && typeof o[k] !== 'undefined') {
                            val = toJSON(o[k]);
                            pairs.push(name + ':' + val);
                        }
                    }
                }
                return '{' + pairs.join(',') + '}';
            }
        },

        evalJSON = types.isType('Object')(JSON) && JSON.parse ? JSON.parse : function(str) {
            /*jshint evil: true */
            return eval('(' + str + ')');
        },

         secureEvalJSON = types.isType('Object')(JSON) && JSON.parse ? JSON.parse : function(str) {
            var filtered =
                str
                .replace(/\\["\\\/bfnrtu]/g, '@')
                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                .replace(/(?:^|:|,)(?:\s*\[)+/g, '');

            if (/^[\],:{}\s]*$/.test(filtered)) {
                /*jshint evil: true */
                return eval('(' + str + ')');
            }
            hAzzle.err(true, 222, 'Error parsing JSON, source is not valid.');
        },

        quoteString = function(str) {
            if (str.match(wrapper)) {
                return '"' + str.replace(wrapper, function(a) {
                    var c = meta[a];
                    if (typeof c === 'string') {
                        return c;
                    }
                    c = a.charCodeAt();
                    return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                }) + '"';
            }
            return '"' + str + '"';
        };


    return {
        toJSON: toJSON,
        evalJSON: evalJSON,
        secureEvalJSON: secureEvalJSON,
        quoteString: quoteString

    };
});