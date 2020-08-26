export const APP_CONFIG = {
  appName: 'Magicly',
  devUrl: 'http://localhost:3000/',
  prodUrl: 'https://magiclyapp.herokuapp.com/',
}

export const HOME_STRINGS = {

}

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

export const PROTECTED_ROUTES = [
  '/main',
  '/productivity',
  '/productivity/*',
  '/finance',
  '/finance/*',
  '/home',
  '/home/*',
  '/settings',
];
