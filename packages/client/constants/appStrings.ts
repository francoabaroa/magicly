// TODO: either export this one to @magicly/server or import from @magicly/server so we dont have to keep updating two files
export const APP_CONFIG = {
  appName: 'Magicly',
  devUrl: 'http://localhost:3000/',
  prodUrl: 'https://magiclyapp.herokuapp.com/',
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

export enum PRODUCT_OR_SERVICE {
  SERVICE = "SERVICE",
  PRODUCT = "PRODUCT",
}

export enum DOC_TYPE {
  IMAGE = "IMAGE",
  RECEIPT = "RECEIPT",
  MANUAL = "MANUAL",
  WARRANTY = "WARRANTY",
  TAX = "TAX",
  PROPERTY = "PROPERTY",
  INSURANCE = "INSURANCE",
  CERTIFICATE = "CERTIFICATE",
  FAMILY = "FAMILY",
  OTHER = "OTHER",
  EXPENSE = "EXPENSE",
  INVESTMENT = "INVESTMENT"
}

