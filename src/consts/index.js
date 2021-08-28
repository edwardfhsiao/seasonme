const PREFIX = '__temp__seasonme__';
const SHOWS = ['the office (us)', 'westworld', 'Westworld', 'How I Met Your Mother', 'how i met you mother', 'the office us', 'two and a half men', 'Two and a Half Men'];
const SEPARATORS = ['.', ' '];
const POSTFIXES = ['WEB-DL.DD5.1.H264-dummy', 'WEB DL DD5 1 H264-dummy', 'WEB-DL DD5.1.H264-dummy'];
const AUTO_GENERATED_DUMMY_FOLDER_NAME = 'AUTO_GENERATED_DUMMY_FILES';
const X_REGEX = /([0-9]{1}?)+[x]+([0-9]{1}?)+(([x]?)+([0-9]{1}?)?)+/gi;
const S_REGEX = /[s]+([0-9]{1}?)+/gi;
const E_REGEX = /[e]+([0-9]{0}?)+([0-9]{0}?)+([e]?)+([0-9]{1}?)+/gi;
const SEASON_REGEX = /season\.+([0-9]{1}?)+/gi;
const EPISODE_REGEX = /\.?episode\.+([0-9]{1}?)+([0-9]{0}?)+/gi;
const SYMBOL_AND_REGEX = /\.+\&+\.+[E]+([0-9]{1}?)+/gi;
const SYMBOL_DOT_REGEX = /([0-9]{1}?)+\.+([E])+([0-9]{1}?)+/gi;
const VIDEO_EXTS = ['.mkv', '.flv', '.webm', '.mp4', '.mov', '.avi', '.avchd', '.rm', '.rmvb'];
const SUB_EXTS = ['.srt', '.ass', '.ttml', '.sbv', '.dfxp', '.vtt', '.txt'];
// x: 1x1 abbr: s01e01 full: Season 1 Episode 1
const CASES = ['x', 'abbr', 'full'];
module.exports = {
  PREFIX,
  SHOWS,
  SEPARATORS,
  POSTFIXES,
  AUTO_GENERATED_DUMMY_FOLDER_NAME,
  X_REGEX,
  S_REGEX,
  E_REGEX,
  SEASON_REGEX,
  EPISODE_REGEX,
  SYMBOL_AND_REGEX,
  SYMBOL_DOT_REGEX,
  VIDEO_EXTS,
  SUB_EXTS,
  CASES,
};
