// TODO: either export this one to @magicly/client or import from @magicly/client so we dont have to keep updating two files
export const APP_CONFIG = {
  appName: 'Magicly',
  devUrl: 'http://localhost:3000/',
  prodUrl: 'https://www.magicly.app/',
};

export const HOME_STRINGS = {

};

export enum HOME_WORK_STATUS {
  PAST = "PAST",
  UPCOMING = "UPCOMING"
}

export enum LIST_TYPE {
  WATCH = "WATCH",
  LATER = "LATER",
  TODO = "TODO",
  ANTI = "ANTI",
  RECOMMENDATION = "RECOMMENDATION",
  GROCERY = "GROCERY",
  SHOPPING = "SHOPPING",
  PRODUCT = "PRODUCT",
  SERVICE = "SERVICE"
}

export enum ITEM_TYPE {
  TODO = "TODO",
  MOVIE = "MOVIE",
  TV = "TV",
  FOOD = "FOOD",
  RESTAURANT = "RESTAURANT",
  MUSIC = "MUSIC",
  TRAVEL = "TRAVEL",
  ACCOMODATION = "ACCOMODATION",
  HOME = "HOME",
  FINANCE = "FINANCE",
  BOOK = "BOOK",
  PODCAST = "PODCAST",
  PRODUCT = "PRODUCT",
  SERVICE = "SERVICE",
  PERSONAL = "PERSONAL",
  WORK = "WORK",
  FAMILY = "FAMILY",
  HEALTH = "HEALTH",
  SHOPPING = "SHOPPING",
  GIFT = "GIFT",
  OTHER = "OTHER"
}

export enum QUESTION_TYPE {
  TECH = "TECH",
  HOME = "HOME",
  FINANCE = "FINANCE",
  SCAM = "SCAM",
  SERVICE = "SERVICE",
  PRODUCT = "PRODUCT",
  APP = "APP",
  OTHER = "OTHER",
}

export enum LANGUAGE_ISO_2 {
  EN = "EN",
  ES = "ES",
}

export enum DEFAULT_NOTIFICATION_TYPE {
  EMAIL = "EMAIL",
  SMS = "SMS",
  WHATSAPP = "WHATSAPP",
  CALL = "CALL",
  NONE = "NONE"
}

export const PROTECTED_ROUTES = [
  '/main',
  '/qportal',
  '/qportal/*',
  '/productivity',
  '/productivity/*',
  '/finance',
  '/finance/*',
  '/home',
  '/home/*',
  '/home/documents',
  '/home/documents/*',
  '/home/documents/add',
  '/settings',
  '/settings/*',
  '/find',
  '/find/*',
];

