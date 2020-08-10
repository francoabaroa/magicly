import { gql } from 'apollo-server-express';

const enums = gql`
  enum SocialAuth {
    FACEBOOK
    GMAIL
    GOOGLE
    GITHUB
    TWITTER
    LINKEDIN
  }

  enum HomeworkType {
    MAINTENANCE
    REPAIR
    INSTALLATION
    CLEANING
    OTHER
  }

  enum Status {
    UPCOMING
    PAST
  }

  enum CostCurrency {
    USD
    MXN
  }

  enum ListType {
    WATCH
    LATER
    TODO
    ANTI
    RECOMMENDATION
    GROCERY
    SHOPPING
    PRODUCT
    SERVICE
  }

  enum ItemType {
    TODO
    MOVIE
    TV
    FOOD
    MUSIC
    TRAVEL
    PRODUCT
    SERVICE
    PERSONAL
    WORK
    FAMILY
    HEALTH
    SHOPPING
    GIFT
  }

  enum DocType {
    IMAGE
    RECEIPT
    MANUAL
    WARRANTY
    TAX
    PROPERTY
    INSURANCE
    CERTIFICATE
    FAMILY
    OTHER
  }

  enum DocTag {
    HOME
    TRANSPORTATION
    FOOD
    UTILITY
    MEDICAL
    TRAVEL
    GIFT
    SERVICE
    PRODUCT
    RECREATION
  }

  enum QuestionType {
    TECH
    HOME
    FINANCE
    SCAM
    SERVICE
    PRODUCT
    APP
    OTHER
  }

  enum QuestionStatus {
    PENDING
    SOLVED
    UNSOLVED
    CANCELLED
  }

  enum ProductType {
    BEAUTY
    HEALTH
    TRANSPORTATION
    SPORT
    BOOK
  }

  enum ServiceType {
    HOME
    PERSONAL
  }

  enum NotificationType {
    EMAIL
    SMS
    WHATSAPP
    CALL
  }

  enum DefaultNotificationType {
    EMAIL
    SMS
    WHATSAPP
    CALL
  }

  enum LanguageIso2 {
    EN
    ES
  }
`;

export default enums