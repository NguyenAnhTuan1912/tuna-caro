const SuffixRegs = {
  Month: /(\d+)[\s](m|M|month)$/,
  Day: /(\d+)[\s](d|D|day)$/,
  Hour: /(\d+)[\s](h|H|hour)$/,
  Minute: /(\d+)[\s](mm|MM|minute)$/,
  All: /(\d+)[\s](m|M|month|d|D|day|h|H|hour|mm|MM|minute)$/
}

/**
 * Use to convert time string to number (in milisecond). Can convert the string that has suffix of:
 * - `Month`: are `m | M | month`, convert to month.
 * - `Day`: are `d | D | day`, convert to day.
 * - `Hour`: are `h | H | Hour`, convert to hour.
 * - `Minute`: are `mm | MM | minute`, convert to minute.
 * @param time 
 */
function toNumber(time: string) {
  try {
    const matches = time.match(SuffixRegs.All);
    if(!matches) throw new Error("The string of time should contain time suffix.");
    const suffix = matches[2];
    let n = parseInt(matches[1]);
    let s = 1000;

    switch(suffix) {
      case "m":
      case "M":
      case "month": {
        n *= (30 * 24 * 60 * 60 * s);
        break;
      };

      case "d":
      case "D":
      case "day": {
        n *= (24 * 60 * 60 * s);
        break;
      };

      case "h":
      case "H":
      case "hour": {
        n *= (60 * 60 * s);
        break;
      };

      case "mm":
      case "MM":
      case "minute": {
        n *= (60 * s);
        break;
      };
    }

    return n;
  } catch (error) {
    return -1;
  }
}

export const Time = {
  toNumber
}