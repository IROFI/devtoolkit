declare module 'zxcvbn' {
  interface MatchSequence {
    pattern: string;
    token: string;
    i: number;
    j: number;
    matched_word?: string;
  }

  interface ZxcvbnFeedback {
    warning: string;
    suggestions: string[];
  }

  interface ZxcvbnCrackTimesDisplay {
    online_throttling_100_per_hour: string;
    online_no_throttling_10_per_second: string;
    offline_slow_hashing_1e4_per_second: string;
    offline_fast_hashing_1e10_per_second: string;
  }

  interface ZxcvbnResult {
    password: string;
    guesses: number;
    guesses_log10: number;
    sequence: MatchSequence[];
    crack_times_seconds: Record<string, number>;
    crack_times_display: ZxcvbnCrackTimesDisplay;
    score: number;
    feedback: ZxcvbnFeedback;
  }

  function zxcvbn(password: string): ZxcvbnResult;

  export = zxcvbn;
}
