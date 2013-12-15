
/**
 * Timeago is a javascript module plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * Adapted to AMD and without the jQuery dependency by @xdamman
 * Original jQuery plugin by Ryan McGeary http://timeago.yarp.com
 *
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 */


define("timeago", function() {
  var self = this;

  this.settings = {
            refreshMillis: 60000,
            allowFuture: false,
            localeTitle: false,
            cutoff: 6*30*24*60*60*1000,
            strings: {
                prefixAgo: null,
                prefixFromNow: null,
                suffixAgo: "ago",
                suffixFromNow: "from now",
                seconds: "less than a minute",
                minute: "a minute",
                minutes: "%d minutes",
                hour: "an hour",
                hours: "%d hours",
                day: "a day",
                days: "%d days",
                month: "a month",
                months: "%d months",
                year: "a year",
                years: "%d years",
                wordSeparator: " ",
                numbers: [],
                fullmonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            }
        };

  function distance(date) {
      return (new Date().getTime() - date.getTime());
  }

  var inWords = function(distanceMillis) {
            var $l = self.settings.strings;
            var prefix = $l.prefixAgo;
            var suffix = $l.suffixAgo;
            if (self.settings.allowFuture) {
                if (distanceMillis < 0) {
                    prefix = $l.prefixFromNow;
                    suffix = $l.suffixFromNow;
                }
            }

            var seconds = Math.abs(distanceMillis) / 1000;
            var minutes = seconds / 60;
            var hours = minutes / 60;
            var days = hours / 24;
            var years = days / 365;

            function substitute(stringOrFunction, number) {
                var string = (typeof stringOrFunction == 'function') ? stringOrFunction(number, distanceMillis) : stringOrFunction;
                var value = ($l.numbers && $l.numbers[number]) || number;
                return string.replace(/%d/i, value);
            }

            var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) || seconds < 90 && substitute($l.minute, 1) || minutes < 45 && substitute($l.minutes, Math.round(minutes)) || minutes < 90 && substitute($l.hour, 1) || hours < 24 && substitute($l.hours, Math.round(hours)) || hours < 42 && substitute($l.day, 1) || days < 30 && substitute($l.days, Math.round(days)) || days < 45 && substitute($l.month, 1) || days < 365 && substitute($l.months, Math.round(days / 30)) || years < 1.5 && substitute($l.year, 1) || substitute($l.years, Math.round(years));

            var separator = $l.wordSeparator || "";
            if ($l.wordSeparator === undefined) {
                separator = " ";
            }
            return ([prefix, words, suffix].join(separator)).trim();
        };


  var formatDate = function(date) {
    var str = self.settings.strings.fullmonths[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    return str;
  };

  var fn = function(options) {};

  fn.render = function(options) {
    var options = options || {};
    options.class = options.class || "timeago";
    options.context = options.context || window.document;
    this.els = options.context.getElementsByClassName(options.class);

    for(var i=0; i<this.els.length;i++) {
      var el = this.els[i];
      if(!el.dataset.date) return;
      var date = new Date(el.dataset.date);
      if(isNaN(date.getDate())) return;
      el.innerText = fn.fromNow(date);
    }

  };

  // So that you can load the module and execute it straight away with require(['timeago!']);
  fn.load = function (name, req, onLoad, config) {
    fn.render();
    if(typeof onLoad == 'function') return onLoad();
  };

  fn.fromNow = function(date) { 
      var distMilli = distance(date);
      if(self.settings.cutoff == 0 || distMilli < self.settings.cutoff)
        return inWords(distance(date));
      else
        return formatDate(date);
  };

  return fn;

});
