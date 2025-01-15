import {
  secondsToString as t,
  getTimeLeft,
  TimeFormatOptions,
  ONE_DAY,
  ONE_HR,
  ONE_MIN,
  ONE_SEC,
  getRelativeTime,
  getTimeUntil,
  getShortRelativeTime,
} from "./time";

describe("time", () => {
  describe("secondsToString", () => {
    it("should return correct string, short length, normal unit format, not removing trailing zeros", () => {
      const options: TimeFormatOptions = {
        length: "short",
        isShortFormat: false,
        removeTrailingZeros: false,
      };
      expect(
        t(-(3 * ONE_DAY + 0 * ONE_HR + 6 * ONE_MIN + 9 * ONE_SEC), options),
      ).toBe("-3days");
      expect(
        t(-(0 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC), options),
      ).toBe("-2hrs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 5 * ONE_MIN + 8 * ONE_SEC), options),
      ).toBe("-5mins");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 59 * ONE_SEC), options),
      ).toBe("-59secs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 2.1 * ONE_SEC), options),
      ).toBe("-2secs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 1 * ONE_SEC), options),
      ).toBe("-1secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("0secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 1 * ONE_SEC, options),
      ).toBe("1sec");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 2 * ONE_SEC, options),
      ).toBe("2secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1min");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 30 * ONE_SEC, options),
      ).toBe("1min");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 59.99 * ONE_SEC, options),
      ).toBe("1min");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 2 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2mins");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 59 * ONE_MIN + 59 * ONE_SEC, options),
      ).toBe("59mins");
      expect(
        t(0 * ONE_DAY + 1 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1hr");
      expect(
        t(0 * ONE_DAY + 1 * ONE_HR + 0 * ONE_MIN + 42 * ONE_SEC, options),
      ).toBe("1hr");
      expect(
        t(0 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2hrs");
      expect(
        t(0 * ONE_DAY + 2 * ONE_HR + 11 * ONE_MIN + 50 * ONE_SEC, options),
      ).toBe("2hrs");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 3 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 3 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 3 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 3 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day");
      expect(
        t(2 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2days");
      expect(
        t(42 * ONE_DAY + 0 * ONE_HR + 6 * ONE_MIN + 8 * ONE_SEC, options),
      ).toBe("42days");
    });
    it("should return correct string, short length, short unit format, removing trailing zeros", () => {
      const options: TimeFormatOptions = {
        length: "short",
        isShortFormat: true,
        removeTrailingZeros: true,
      };
      expect(
        t(-(3 * ONE_DAY + 0 * ONE_HR + 6 * ONE_MIN + 9 * ONE_SEC), options),
      ).toBe("-3d");
      expect(
        t(-(0 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC), options),
      ).toBe("-2h");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 5 * ONE_MIN + 8 * ONE_SEC), options),
      ).toBe("-5m");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 59 * ONE_SEC), options),
      ).toBe("-59s");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 2.1 * ONE_SEC), options),
      ).toBe("-2s");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 1 * ONE_SEC), options),
      ).toBe("-1s");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("0s");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 1 * ONE_SEC, options),
      ).toBe("1s");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 2 * ONE_SEC, options),
      ).toBe("2s");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1m");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 30 * ONE_SEC, options),
      ).toBe("1m");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 59.99 * ONE_SEC, options),
      ).toBe("1m");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 2 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2m");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 59 * ONE_MIN + 59 * ONE_SEC, options),
      ).toBe("59m");
      expect(
        t(0 * ONE_DAY + 1 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1h");
      expect(
        t(0 * ONE_DAY + 1 * ONE_HR + 0 * ONE_MIN + 42 * ONE_SEC, options),
      ).toBe("1h");
      expect(
        t(0 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2h");
      expect(
        t(0 * ONE_DAY + 2 * ONE_HR + 11 * ONE_MIN + 50 * ONE_SEC, options),
      ).toBe("2h");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1d");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1d");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 3 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1d");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 3 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1d");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1d");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1d");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 3 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1d");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 3 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1d");
      expect(
        t(2 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2d");
      expect(
        t(42 * ONE_DAY + 0 * ONE_HR + 6 * ONE_MIN + 8 * ONE_SEC, options),
      ).toBe("42d");
    });
    it("should return correct string, medium length, normal unit format, not removing trailing zeros", () => {
      const options: TimeFormatOptions = {
        length: "medium",
        isShortFormat: false,
        removeTrailingZeros: false,
      };
      expect(
        t(-(3 * ONE_DAY + 0 * ONE_HR + 6 * ONE_MIN + 9 * ONE_SEC), options),
      ).toBe("-3days\u00A00hrs");
      expect(
        t(-(0 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC), options),
      ).toBe("-2hrs\u00A00mins");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 5 * ONE_MIN + 8 * ONE_SEC), options),
      ).toBe("-5mins\u00A0-8secs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 59 * ONE_SEC), options),
      ).toBe("-59secs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 2.1 * ONE_SEC), options),
      ).toBe("-2secs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 1 * ONE_SEC), options),
      ).toBe("-1secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("0secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 1 * ONE_SEC, options),
      ).toBe("1sec");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 2 * ONE_SEC, options),
      ).toBe("2secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1min\u00A00secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 30 * ONE_SEC, options),
      ).toBe("1min\u00A030secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 59.99 * ONE_SEC, options),
      ).toBe("1min\u00A059secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 2 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2mins\u00A00secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 59 * ONE_MIN + 59 * ONE_SEC, options),
      ).toBe("59mins\u00A059secs");
      expect(
        t(0 * ONE_DAY + 1 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1hr\u00A00mins");
      expect(
        t(0 * ONE_DAY + 1 * ONE_HR + 0 * ONE_MIN + 42 * ONE_SEC, options),
      ).toBe("1hr\u00A00mins");
      expect(
        t(0 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2hrs\u00A00mins");
      expect(
        t(0 * ONE_DAY + 2 * ONE_HR + 11 * ONE_MIN + 50 * ONE_SEC, options),
      ).toBe("2hrs\u00A011mins");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day\u00A00hrs");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day\u00A00hrs");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 3 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day\u00A00hrs");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 3 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day\u00A00hrs");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day\u00A02hrs");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day\u00A02hrs");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 3 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day\u00A02hrs");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 3 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day\u00A02hrs");
      expect(
        t(2 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2days\u00A00hrs");
      expect(
        t(42 * ONE_DAY + 0 * ONE_HR + 6 * ONE_MIN + 8 * ONE_SEC, options),
      ).toBe("42days\u00A00hrs");
    });
    it("should return correct string, medium length, normal unit format, remove trailing zeros", () => {
      const options: TimeFormatOptions = {
        length: "medium",
        isShortFormat: false,
        removeTrailingZeros: true,
      };
      expect(
        t(-(3 * ONE_DAY + 0 * ONE_HR + 6 * ONE_MIN + 9 * ONE_SEC), options),
      ).toBe("-3days");
      expect(
        t(-(0 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC), options),
      ).toBe("-2hrs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 5 * ONE_MIN + 8 * ONE_SEC), options),
      ).toBe("-5mins\u00A0-8secs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 59 * ONE_SEC), options),
      ).toBe("-59secs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 2.1 * ONE_SEC), options),
      ).toBe("-2secs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 1 * ONE_SEC), options),
      ).toBe("-1secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("0secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 1 * ONE_SEC, options),
      ).toBe("1sec");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 2 * ONE_SEC, options),
      ).toBe("2secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1min");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 30 * ONE_SEC, options),
      ).toBe("1min\u00A030secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 59.99 * ONE_SEC, options),
      ).toBe("1min\u00A059secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 2 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2mins");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 59 * ONE_MIN + 59 * ONE_SEC, options),
      ).toBe("59mins\u00A059secs");
      expect(
        t(0 * ONE_DAY + 1 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1hr");
      expect(
        t(0 * ONE_DAY + 1 * ONE_HR + 0 * ONE_MIN + 42 * ONE_SEC, options),
      ).toBe("1hr");
      expect(
        t(0 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2hrs");
      expect(
        t(0 * ONE_DAY + 2 * ONE_HR + 11 * ONE_MIN + 50 * ONE_SEC, options),
      ).toBe("2hrs\u00A011mins");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 3 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 3 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day\u00A02hrs");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day\u00A02hrs");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 3 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day\u00A02hrs");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 3 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day\u00A02hrs");
      expect(
        t(2 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2days");
      expect(
        t(42 * ONE_DAY + 0 * ONE_HR + 6 * ONE_MIN + 8 * ONE_SEC, options),
      ).toBe("42days");
    });
    it("should return correct string, full length, normal unit format, not removing trailing zeros", () => {
      const options: TimeFormatOptions = {
        length: "full",
        isShortFormat: false,
        removeTrailingZeros: false,
      };
      expect(
        t(-(3 * ONE_DAY + 0 * ONE_HR + 6 * ONE_MIN + 9 * ONE_SEC), options),
      ).toBe("-3days\u00A00hrs\u00A0-6mins\u00A0-9secs");
      expect(
        t(-(0 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC), options),
      ).toBe("-2hrs\u00A00mins\u00A0-4secs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 5 * ONE_MIN + 8 * ONE_SEC), options),
      ).toBe("-5mins\u00A0-8secs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 59 * ONE_SEC), options),
      ).toBe("-59secs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 2.1 * ONE_SEC), options),
      ).toBe("-2secs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 1 * ONE_SEC), options),
      ).toBe("-1secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("0secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 1 * ONE_SEC, options),
      ).toBe("1sec");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 2 * ONE_SEC, options),
      ).toBe("2secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1min\u00A00secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 30 * ONE_SEC, options),
      ).toBe("1min\u00A030secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 59.99 * ONE_SEC, options),
      ).toBe("1min\u00A059secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 2 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2mins\u00A00secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 59 * ONE_MIN + 59 * ONE_SEC, options),
      ).toBe("59mins\u00A059secs");
      expect(
        t(0 * ONE_DAY + 1 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1hr\u00A00mins\u00A00secs");
      expect(
        t(0 * ONE_DAY + 1 * ONE_HR + 0 * ONE_MIN + 42 * ONE_SEC, options),
      ).toBe("1hr\u00A00mins\u00A042secs");
      expect(
        t(0 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2hrs\u00A00mins\u00A00secs");
      expect(
        t(0 * ONE_DAY + 2 * ONE_HR + 11 * ONE_MIN + 50 * ONE_SEC, options),
      ).toBe("2hrs\u00A011mins\u00A050secs");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day\u00A00hrs\u00A00mins\u00A00secs");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day\u00A00hrs\u00A00mins\u00A04secs");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 3 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day\u00A00hrs\u00A03mins\u00A00secs");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 3 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day\u00A00hrs\u00A03mins\u00A04secs");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day\u00A02hrs\u00A00mins\u00A00secs");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day\u00A02hrs\u00A00mins\u00A04secs");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 3 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day\u00A02hrs\u00A03mins\u00A00secs");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 3 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day\u00A02hrs\u00A03mins\u00A04secs");
      expect(
        t(2 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2days\u00A00hrs\u00A00mins\u00A00secs");
      expect(
        t(42 * ONE_DAY + 0 * ONE_HR + 6 * ONE_MIN + 8 * ONE_SEC, options),
      ).toBe("42days\u00A00hrs\u00A06mins\u00A08secs");
    });
    it("should return correct string, full length, normal unit format, remove trailing zeros", () => {
      const options: TimeFormatOptions = {
        length: "full",
        isShortFormat: false,
        removeTrailingZeros: true,
      };
      expect(
        t(-(3 * ONE_DAY + 0 * ONE_HR + 6 * ONE_MIN + 9 * ONE_SEC), options),
      ).toBe("-3days\u00A00hrs\u00A0-6mins\u00A0-9secs");
      expect(
        t(-(0 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC), options),
      ).toBe("-2hrs\u00A00mins\u00A0-4secs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 5 * ONE_MIN + 8 * ONE_SEC), options),
      ).toBe("-5mins\u00A0-8secs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 59 * ONE_SEC), options),
      ).toBe("-59secs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 2.1 * ONE_SEC), options),
      ).toBe("-2secs");
      expect(
        t(-(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 1 * ONE_SEC), options),
      ).toBe("-1secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("0secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 1 * ONE_SEC, options),
      ).toBe("1sec");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 2 * ONE_SEC, options),
      ).toBe("2secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1min");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 30 * ONE_SEC, options),
      ).toBe("1min\u00A030secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 1 * ONE_MIN + 59.99 * ONE_SEC, options),
      ).toBe("1min\u00A059secs");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 2 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2mins");
      expect(
        t(0 * ONE_DAY + 0 * ONE_HR + 59 * ONE_MIN + 59 * ONE_SEC, options),
      ).toBe("59mins\u00A059secs");
      expect(
        t(0 * ONE_DAY + 1 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1hr");
      expect(
        t(0 * ONE_DAY + 1 * ONE_HR + 0 * ONE_MIN + 42 * ONE_SEC, options),
      ).toBe("1hr\u00A00mins\u00A042secs");
      expect(
        t(0 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2hrs");
      expect(
        t(0 * ONE_DAY + 2 * ONE_HR + 11 * ONE_MIN + 50 * ONE_SEC, options),
      ).toBe("2hrs\u00A011mins\u00A050secs");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day\u00A00hrs\u00A00mins\u00A04secs");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 3 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day\u00A00hrs\u00A03mins");
      expect(
        t(1 * ONE_DAY + 0 * ONE_HR + 3 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day\u00A00hrs\u00A03mins\u00A04secs");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day\u00A02hrs");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 0 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day\u00A02hrs\u00A00mins\u00A04secs");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 3 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("1day\u00A02hrs\u00A03mins");
      expect(
        t(1 * ONE_DAY + 2 * ONE_HR + 3 * ONE_MIN + 4 * ONE_SEC, options),
      ).toBe("1day\u00A02hrs\u00A03mins\u00A04secs");
      expect(
        t(2 * ONE_DAY + 0 * ONE_HR + 0 * ONE_MIN + 0 * ONE_SEC, options),
      ).toBe("2days");
      expect(
        t(42 * ONE_DAY + 0 * ONE_HR + 6 * ONE_MIN + 8 * ONE_SEC, options),
      ).toBe("42days\u00A00hrs\u00A06mins\u00A08secs");
    });
  });

  describe("getTimeLeft", () => {
    const RealDate = Date;

    const getTimestamp = (datetime: string) => new Date(datetime).getTime();

    beforeAll(() => {
      global.Date.now = jest.fn(() => getTimestamp("2022-04-17T00:00:00"));
    });

    it("should return 0 if elapsed", () => {
      expect(getTimeLeft(getTimestamp("2022-04-15T11:00:00"), ONE_DAY)).toBe(0);
      expect(getTimeLeft(getTimestamp("2022-04-16T00:00:00"), ONE_DAY)).toBe(0);
    });

    it("should return correct time left", () => {
      expect(getTimeLeft(getTimestamp("2022-04-16T01:00:00"), ONE_DAY)).toBe(
        ONE_HR,
      );
      expect(getTimeLeft(getTimestamp("2022-04-16T23:59:30"), ONE_MIN)).toBe(
        30 * ONE_SEC,
      );
      expect(getTimeLeft(getTimestamp("2022-04-16T23:30:00"), ONE_HR)).toBe(
        30 * ONE_MIN,
      );
    });

    afterAll(() => {
      global.Date = RealDate;
    });
  });

  describe("getRelativeTime", () => {
    it('returns "now" for the current timestamp', () => {
      const now = new Date();
      const result = getRelativeTime(now.getTime());
      expect(result).toEqual("now");
    });

    it("returns a string indicating the number of seconds ago for timestamps within the past minute", () => {
      const now = new Date();
      const pastTimestamp = now.getTime() - 5000; // 5 seconds ago
      const result = getRelativeTime(pastTimestamp);
      expect(result).toMatch("5 seconds ago");
    });

    it("returns a string indicating the number of minutes ago for timestamps within the past hour", () => {
      const now = new Date();
      const pastTimestamp = now.getTime() - 300000; // 5 minutes ago
      const result = getRelativeTime(pastTimestamp);
      expect(result).toMatch("5 minutes ago");
    });

    it("returns a string indicating the number of hours ago for timestamps within the past day", () => {
      const now = new Date();
      const pastTimestamp = now.getTime() - 7200000; // 2 hours ago
      const result = getRelativeTime(pastTimestamp);
      expect(result).toMatch("2 hours ago");
    });

    it("returns a string indicating the number of days ago for timestamps older than a day", () => {
      const now = new Date();
      const pastTimestamp = now.getTime() - 604800000; // 7 days ago
      const result = getRelativeTime(pastTimestamp);
      expect(result).toMatch("7 days ago");
    });
  });

  describe("getTimeUntil", () => {
    it("should return now if the target time has already passed", () => {
      const now = new Date();
      const target = new Date(now.getTime() - 2000);

      expect(getTimeUntil(target, now)).toBe("now");
    });

    it("should return 2 days if the target time is 2 days away", () => {
      const now = new Date();
      const twoDays = 2 * ONE_DAY * 1000;
      const target = new Date(now.getTime() + twoDays);

      expect(getTimeUntil(target, now)).toBe("2 days");
    });

    it("should return 1 day if the target time is 1 day away", () => {
      const now = new Date();
      const oneDay = ONE_DAY * 1000;
      const target = new Date(now.getTime() + oneDay);

      expect(getTimeUntil(target, now)).toBe("1 day");
    });

    it("should return 3 minutes if the target time is 3 minutes away", () => {
      const now = new Date();
      const threeMinutes = 3 * ONE_MIN * 1000;
      const target = new Date(now.getTime() + threeMinutes);

      expect(getTimeUntil(target, now)).toBe("3 minutes");
    });

    it("should return 1 minute if the target time is 1 minute away", () => {
      const now = new Date();
      const oneMinute = ONE_MIN * 1000;
      const target = new Date(now.getTime() + oneMinute);

      expect(getTimeUntil(target, now)).toBe("1 minute");
    });

    it("should return 5 seconds if the target time is 5 seconds away", () => {
      const now = new Date();
      const fiveSeconds = 5 * ONE_SEC * 1000;
      const target = new Date(now.getTime() + fiveSeconds);

      expect(getTimeUntil(target, now)).toBe("5 seconds");
    });

    it("should return 1 second if the target time is 1 second away", () => {
      const now = new Date();
      const oneSecond = ONE_SEC * 1000;
      const target = new Date(now.getTime() + oneSecond);

      expect(getTimeUntil(target, now)).toBe("1 second");
    });
  });

  describe("getShortRelativeTime", () => {
    it('returns "now" for the current timestamp', () => {
      const now = new Date();
      const result = getShortRelativeTime(now.getTime());
      expect(result).toEqual("now");
    });

    it("returns seconds in short format for timestamps within the past minute", () => {
      const now = new Date();
      const pastTimestamp = now.getTime() - 5000; // 5 seconds ago
      const result = getShortRelativeTime(pastTimestamp);
      expect(result).toBe("5s ago");
    });

    it("returns minutes in short format for timestamps within the past hour", () => {
      const now = new Date();
      const pastTimestamp = now.getTime() - 300000; // 5 minutes ago
      const result = getShortRelativeTime(pastTimestamp);
      expect(result).toBe("5m ago");
    });

    it("returns hours in short format for timestamps within the past day", () => {
      const now = new Date();
      const pastTimestamp = now.getTime() - 7200000; // 2 hours ago
      const result = getShortRelativeTime(pastTimestamp);
      expect(result).toBe("2h ago");
    });

    it("returns days in short format for timestamps older than a day", () => {
      const now = new Date();
      const pastTimestamp = now.getTime() - 604800000; // 7 days ago
      const result = getShortRelativeTime(pastTimestamp);
      expect(result).toBe("7d ago");
    });

    it("handles singular units correctly", () => {
      const now = new Date();
      expect(getShortRelativeTime(now.getTime() - 1000)).toBe("1s ago");
      expect(getShortRelativeTime(now.getTime() - 60000)).toBe("1m ago");
      expect(getShortRelativeTime(now.getTime() - 3600000)).toBe("1h ago");
      expect(getShortRelativeTime(now.getTime() - 86400000)).toBe("1d ago");
    });

    // New tests for future times
    it('returns "now" for the current timestamp', () => {
      const now = new Date();
      const result = getRelativeTime(now.getTime());
      expect(result).toEqual("now");
    });

    it("returns a string indicating the number of seconds in the future", () => {
      const now = new Date();
      const futureTimestamp = now.getTime() + 5000; // 5 seconds in future
      const result = getRelativeTime(futureTimestamp);
      expect(result).toMatch("in 5 seconds");
    });

    it("returns a string indicating the number of minutes in the future", () => {
      const now = new Date();
      const futureTimestamp = now.getTime() + 300000; // 5 minutes in future
      const result = getRelativeTime(futureTimestamp);
      expect(result).toMatch("in 5 minutes");
    });

    it("returns a string indicating the number of hours in the future", () => {
      const now = new Date();
      const futureTimestamp = now.getTime() + 7200000; // 2 hours in future
      const result = getRelativeTime(futureTimestamp);
      expect(result).toMatch("in 2 hours");
    });

    it("returns a string indicating the number of days in the future", () => {
      const now = new Date();
      const futureTimestamp = now.getTime() + 604800000; // 7 days in future
      const result = getRelativeTime(futureTimestamp);
      expect(result).toMatch("in 7 days");
    });

    it("handles singular units correctly for future times", () => {
      const now = new Date();
      expect(getRelativeTime(now.getTime() + 1000)).toMatch("in 1 second");
      expect(getRelativeTime(now.getTime() + 60000)).toMatch("in 1 minute");
      expect(getRelativeTime(now.getTime() + 3600000)).toMatch("in 1 hour");
      expect(getRelativeTime(now.getTime() + 86400000)).toMatch("in 1 day");
    });

    // Test both past and future in same test suite
    it("correctly distinguishes between past and future times", () => {
      const now = new Date();

      // Past times
      expect(getRelativeTime(now.getTime() - 5000)).toMatch("5 seconds ago");
      expect(getRelativeTime(now.getTime() - 120000)).toMatch("2 minutes ago");

      // Future times
      expect(getRelativeTime(now.getTime() + 5000)).toMatch("in 5 seconds");
      expect(getRelativeTime(now.getTime() + 120000)).toMatch("in 2 minutes");
    });

    // Edge cases
    it("handles edge cases correctly", () => {
      const now = new Date();

      // Very small differences (less than a second)
      expect(getRelativeTime(now.getTime() + 100)).toBe("now");
      expect(getRelativeTime(now.getTime() - 100)).toBe("now");

      // Exactly one unit
      expect(getRelativeTime(now.getTime() + 60000)).toMatch("in 1 minute");
      expect(getRelativeTime(now.getTime() - 60000)).toMatch("1 minute ago");
    });
  });
});
