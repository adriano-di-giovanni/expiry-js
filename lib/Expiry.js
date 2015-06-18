  var
    Expiry = (function () {

      var
        millisecond = 1,
        second = millisecond * 1000,
        minute = second * 60,
        hour = 60 * minute,
        day = 24 * hour,

        unitToMilliseconds = {
          'millisecond': millisecond,
          'second': second,
          'minute': minute,
          'hour': hour,
          'day': day,
          'month': function (months, days) {

            var
              start = new Date(),
              end = new Date(start);

            end.setMonth(end.getMonth() + months);
            end.setDate(end.getDate() + days);

            return end - start;
          }
        },

        unitToUnit = {
          'milliseconds': 'millisecond', 'millisecond': 'millisecond', 'ms': 'millisecond',
          'seconds': 'second', 'second': 'second', 's': 'second',
          'minutes': 'minute', 'minute': 'minute', 'm': 'minute',
          'hours': 'hour', 'hour': 'hour', 'h': 'hour',
          'days': 'day', 'day': 'day', 'D': 'day',
          'weeks': 'week', 'week': 'week', 'W': 'week',
          'months': 'month', 'month': 'month', 'M': 'month',
          'years': 'year', 'year': 'year', 'Y': 'year'
        },

        typeOf = function typeOf(value) {
          return toString.call(value).match(/\[object (\S+)\]/).pop();
        },

        Internal = function Internal(milliseconds, days, months) {
          this.milliseconds = milliseconds || 0;
          this.days = days || 0;
          this.months = months || 0;
        },

        round = Math.round;


      function Expiry(value) {

        value = value || 0;

        var
          type = typeOf(value),
          internal;

        if (type === 'Number') {
          internal = new Internal(value);
        } else if (type === 'String') {
          internal = Expiry.parse(value);
        } else {
          throw new Error('Wrong type for argument 1, value. Expected '+value+
            ' to be a number, string, or expiry.');
        }

        this._internal = internal;
      }

      Expiry.forge = function (value) {
        return new this(value);
      };

      Expiry.parse = function (value) {

        if (typeOf(value) !== 'String') {
          throw new Error('Wrong type for argument 1, value. String expected.');
        }

        var
          re = /([\d\.]+)\s*([a-zA-Z]+)/g,
          result,

          maybeValue,
          maybeUnit,
          unit,

          milliseconds = 0,
          days = 0,
          months = 0;

        while ((result = re.exec(value)) !== null) {

          maybeValue = parseFloat(result[1]);
          maybeUnit = result[2];
          unit = unitToUnit[maybeUnit];

          switch(unit) {
            case 'year':
              months += maybeValue * 12;
              break;
            case 'month':
              months += maybeValue;
              break;
            case 'week':
              days += maybeValue * 7;
              break;
            case 'day':
              days += maybeValue;
              break;
            case 'hour':
            case 'minute':
            case 'second':
            case 'millisecond':
              milliseconds += maybeValue * unitToMilliseconds[unit];
              break;
            default:
              throw new Error('Unexpected unit '+maybeUnit);
          }
        }

        return new Internal(milliseconds, days, months);
      };

      Expiry.prototype.valueOf = function () {

        var
          internal = this._internal,

          milliseconds = internal.milliseconds,
          days = internal.days,
          months = internal.months;

        return milliseconds + unitToMilliseconds.month(months, days);
      };

      Expiry.prototype.asMilliseconds = function () {
        return this.valueOf();
      };

      Expiry.prototype.asSeconds = function () {
        return round(this.valueOf() / second);
      };

      return Expiry;
    }());

  void Expiry;
