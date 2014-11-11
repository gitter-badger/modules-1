// cookie.js
var hAzzle = window.hAzzle || (window.hAzzle = {});

hAzzle.define('Cookie', function() {

    var _util = hAzzle.require('Util'),
        _types = hAzzle.require('Types'),

        pluses = /\+/g,

        encode = function(s) {
            return config.raw ? s : encodeURIComponent(s);
        },

        decode = function(s) {
            return config.raw ? s : decodeURIComponent(s);
        },

        stringifyCookieValue = function(value) {
            return encode(config.json ? JSON.stringify(value) : String(value));
        },

        parseCookieValue = function(s) {
            if (s.indexOf('"') === 0) {
                // This is a quoted cookie as according to RFC2068, unescape...
                s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            }

            try {
                // Replace server-side written pluses with spaces.
                // If we can't decode the cookie, ignore it, it's unusable.
                // If we can't parse the cookie, ignore it, it's unusable.
                s = decodeURIComponent(s.replace(pluses, ' '));
                return config.json ? JSON.parse(s) : s;
            } catch (e) {}
        },

        read = function(s, converter) {
            var value = config.raw ? s : parseCookieValue(s);
            return _types.isType('Function')(converter) ? converter(value) : value;
        },

        config = function(key, value, options) {

            // Write

            if (arguments.length > 1 && !_types.isType('Function')(value)) {
                options = _util.mixin({}, config.defaults, options);

                if (typeof options.expires === 'number') {
                    var days = options.expires,
                        t = options.expires = new Date();
                    t.setTime(+t + days * 864e+5);
                }

                return (document.cookie = [
                    encode(key), '=', stringifyCookieValue(value),
                    options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                    options.path ? '; path=' + options.path : '',
                    options.domain ? '; domain=' + options.domain : '',
                    options.secure ? '; secure' : ''
                ].join(''));
            }

            // Read

            var result = key ? undefined : {};

            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling $.cookie().
            var cookies = document.cookie ? document.cookie.split('; ') : [];

            for (var i = 0, l = cookies.length; i < l; i++) {
              var  parts = cookies[i].split('='),
                    name = decode(parts.shift()),
                    cookie = parts.join('=');

                if (key && key === name) {
                    // If second argument (value) is a function it's a converter...
                    result = read(cookie, value);
                    break;
                }

                // Prevent storing a cookie that we couldn't decode.
                if (!key && (cookie = read(cookie)) !== undefined) {
                    result[name] = cookie;
                }
            }

            return result;
        },
        removeCookie = function(key, options) {
            if (config(key) === undefined) {
                return false;
            }

            // Must not alter options, thus extending a fresh object...
            config(key, '', _util.mixin({}, options, {
                expires: -1
            }));
            return !config(key);
        };
    config.defaults = {};

    return {
        cookie: config,
        removeCookie: removeCookie
    };
});