// timeago.js
// Module for hAzzle created after ideas from https://github.com/rmm5t/jquery-timeago
var hAzzle = window.hAzzle || (window.hAzzle = {});

hAzzle.define('timeago', function() {

    var _util = hAzzle.require('Util'),
        _core = hAzzle.require('Core'),
        _strings = hAzzle.require('Strings'),
        _types = hAzzle.require('Types'),

        settings = {
            refreshMillis: 60000,
            allowPast: true,
            allowFuture: false,
            localeTitle: false,
            cutoff: 0,
            strings: {
                prefixAgo: null,
                prefixFromNow: null,
                suffixAgo: 'ago',
                suffixFromNow: 'from now',
                inPast: 'any moment now',
                seconds: 'less than a minute',
                minute: 'about a minute',
                minutes: '%d minutes',
                hour: 'about an hour',
                hours: 'about %d hours',
                day: 'a day',
                days: '%d days',
                month: 'about a month',
                months: '%d months',
                year: 'about a year',
                years: '%d years',
                wordSeparator: ' ',
                numbers: []
            }
        },

        timeago = function(timestamp) {

            if (_types.isType('Date')(timestamp)) {
                return inWords(timestamp);
            }

            if (typeof timestamp === 'string') {
                return inWords(convert(timestamp));
            }

            if (typeof timestamp === 'number') {
                return inWords(new Date(timestamp));
            }
            return inWords(datetime(timestamp));
        },

        humanable = function(distanceMillis) {
            hAzzle.err(!settings.allowPast && !settings.allowFuture, 344, 'timeago allowPast and allowFuture settings can not both be set to false.');

            var ss = settings.strings,
                prefix = ss.prefixAgo,
                suffix = ss.suffixAgo;

            if (settings.allowFuture) {
                if (distanceMillis < 0) {
                    prefix = ss.prefixFromNow;
                    suffix = ss.suffixFromNow;
                }
            }

            if (!settings.allowPast && distanceMillis >= 0) {
                return settings.strings.inPast;
            }

            var seconds = Math.abs(distanceMillis) / 1000,
                minutes = seconds / 60,
                hours = minutes / 60,
                days = hours / 24,
                years = days / 365;

            function substitute(stringOrFunction, number) {
                var string = _types.isType('Function')(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction,
                    value = (ss.numbers && ss.numbers[number]) || number;
                return string.replace(/%d/i, value);
            }

            var words = seconds < 45 && substitute(ss.seconds, Math.round(seconds)) ||
                seconds < 90 && substitute(ss.minute, 1) ||
                minutes < 45 && substitute(ss.minutes, Math.round(minutes)) ||
                minutes < 90 && substitute(ss.hour, 1) ||
                hours < 24 && substitute(ss.hours, Math.round(hours)) ||
                hours < 42 && substitute(ss.day, 1) ||
                days < 30 && substitute(ss.days, Math.round(days)) ||
                days < 45 && substitute(ss.month, 1) ||
                days < 365 && substitute(ss.months, Math.round(days / 30)) ||
                years < 1.5 && substitute(ss.year, 1) ||
                substitute(ss.years, Math.round(years));

            var separator = ss.wordSeparator || '';
            if (ss.wordSeparator === undefined) {
                separator = ' ';
            }
            return _strings.trim([prefix, words, suffix].join(separator));
        },

        convert = function(iso8601) {
            var s = _strings.trim(iso8601);
            s = s.replace(/\.\d+/, ""); // remove milliseconds
            s = s.replace(/-/, "/").replace(/-/, "/");
            s = s.replace(/T/, " ").replace(/Z/, " UTC");
            s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
            s = s.replace(/([\+\-]\d\d)$/, " $100"); // +09 -> +0900
            return new Date(s);
        },

        datetime = function(elem) {
            var iso8601 = isTime(elem) ? hAzzle(elem).attr('datetime') : hAzzle(elem).attr('title');
            if (iso8601)
                return convert(iso8601);
        },

        isTime = function(elem) {
            return hAzzle(elem).get(0).tagName.toLowerCase() === 'time'; // $(elem).is('time');
        },

        // functions that can be called via $(el).timeago('action')
        // init is default when no action is given
        // functions are called with context of a single element
        functions = {
            init: function() {
                var refresh_el = _util.bind(refresh, this);
                refresh_el();
                if (settings.refreshMillis > 0) {
                    this._timeagoInterval = setInterval(refresh_el, settings.refreshMillis);
                }
            },
            update: function(time) {
                var parsedTime = convert(time);
                hAzzle(this).data('timeago', {
                    datetime: parsedTime
                });
                if (settings.localeTitle) hAzzle(this).attr('title', parsedTime.toLocaleString());
                refresh.apply(this);
            },
            updateFromDOM: function() {
                hAzzle(this).data('timeago', {
                    datetime: convert(isTime(this) ? hAzzle(this).attr('datetime') : hAzzle(this).attr('title'))
                });
                refresh.apply(this);
            },
            dispose: function() {
                if (this._timeagoInterval) {
                    window.clearInterval(this._timeagoInterval);
                    this._timeagoInterval = null;
                }
            }
        },

        refresh = function() {

            if (!_core.contains(document.documentElement, this)) {
                //stop if it has been removed
                hAzzle(this).timeago('dispose');
                return this;
            }

            var data = prepareData(this);

            if (!isNaN(data.datetime)) {
                if (settings.cutoff == 0 || Math.abs(distance(data.datetime)) < settings.cutoff) {
                    hAzzle(this).text(inWords(data.datetime));
                }
            }
            return this;
        },

        prepareData = function(element) {
            element = hAzzle(element);
            if (!element.data('timeago')) {
                element.data('timeago', {
                    datetime: datetime(element)
                });
                var text = _strings.trim(element.text());
                if (settings.localeTitle) {
                    element.attr('title', element.data('timeago').datetime.toLocaleString());
                } else if (text.length > 0 && !(isTime(element) && element.attr('title'))) {
                    element.attr('title', text);
                }
            }
            return element.data('timeago');
        },

        inWords = function(date) {
            return humanable(distance(date));
        },

        distance = function(date) {
            return (new Date().getTime() - date.getTime());
        };

    this.timeago = function(action, options) {
        var fn = action ? functions[action] : functions.init;

        hAzzle.err(!fn, 333, "Unknown function name '" + action + "' for timeago");

        // each over objects here and call the requested function
        this.each(function() {
            fn.call(this, options);
        });
        return this;
    };

    return {
        timeago: timeago
    };
});