export interface Property {
  propertyData: PropertyData;
  metadata: Metadata;
  isAuthenticated: boolean;
  analyticsInfo: AnalyticsInfo;
}

export interface AnalyticsInfo {
  analyticsBranch: AnalyticsBranch;
  analyticsProperty: AnalyticsProperty;
}

export interface AnalyticsBranch {
  agentType: string;
  branchId: number;
  branchName: string;
  branchPostcode: null;
  brandName: string;
  companyName: string;
  companyTradingName: null;
  companyType: string;
  displayAddress: string;
  pageType: string;
}

export interface AnalyticsProperty {
  added: string;
  auctionOnly: boolean;
  beds: number;
  businessForSale: boolean;
  country: string;
  currency: string;
  floorplanCount: number;
  furnishedType: string;
  hasOnlineViewing: boolean;
  imageCount: number;
  latitude: number;
  longitude: number;
  letAgreed: boolean;
  lettingType: string;
  maxSizeAc: null;
  maxSizeFt: null;
  minSizeAc: null;
  minSizeFt: null;
  ownership: string;
  postcode: string;
  preOwned: string;
  price: number;
  priceQualifier: string;
  propertyId: number;
  propertySubType: string;
  propertyType: string;
  retirement: boolean;
  selectedCurrency: null;
  selectedPrice: null;
  soldSTC: boolean;
  videoProvider: string;
  viewType: string;
  customUri: string;
}

export interface Metadata {
  publicsiteUrl: string;
  cookieDomain: string;
  currencyCode: string;
  emailAgentUrl: string;
  facebookShareUrl: string;
  twitterShareUrl: string;
  emailShareUrl: string;
  copyLinkUrl: string;
  whatsAppShareUrl: string;
  linkedInShareUrl: string;
  myRightmoveUrl: string;
  mediaServerUrl: string;
  serverTimestamp: number;
  deviceType: string;
  deviceTypeForLazyLoad: string;
  deviceOS: string;
  mvtInfo: MvtInfo[];
  featureSwitches: { [key: string]: boolean };
  adUnitPath: AdUnitPath;
  backLink: BackLink;
  shouldTrackGTMSuccessTracker: boolean;
  emailPreferences: EmailPreferences;
  staticAssetsPath: string;
  staticImagesAndFontsPath: string;
  correlationId: string;
  locationSearchUrl: string;
  marketTrendsExperimentId: string;
  serveEs6Bundles: boolean;
}

export interface AdUnitPath {
  mpu1: string;
  trackingPixel: string;
  ukCreditCheckSponsorship: string;
}

export interface BackLink {
  url: string;
  text: string;
  operation: number;
}

export interface EmailPreferences {
  preferencesUrl: string;
  showModal: boolean;
  source: string;
}

export interface MvtInfo {
  label: string;
  state: string;
  shouldLog: boolean;
}

export interface PropertyData {
  id: string;
  status: Status;
  text: Text;
  prices: Prices;
  address: Address;
  keyFeatures: string[];
  images: Image[];
  floorplans: Floorplan[];
  virtualTours: VirtualTour[];
  customer: Customer;
  industryAffiliations: IndustryAffiliation[];
  rooms: any[];
  location: Location;
  streetView: StreetView;
  nearestAirports: any[];
  nearestStations: NearestStation[];
  showSchoolInfo: boolean;
  countryGuide: null;
  channel: string;
  propertyUrls: PropertyUrls;
  sizings: any[];
  brochures: Brochure[];
  epcGraphs: Brochure[];
  bedrooms: number;
  bathrooms: number;
  transactionType: string;
  tags: any[];
  misInfo: MISInfo;
  dfpAdInfo: DfpAdInfo;
  staticMapImgUrls: StaticMapImgUrls;
  listingHistory: ListingHistory;
  feesApply: null;
  broadband: Broadband;
  contactInfo: ContactInfo;
  lettings: null;
  infoReelItems: InfoReelItem[];
  mortgageCalculator: MortgageCalculator;
  tenure: Tenure;
  soldPropertyType: string;
  auctionProvider: null;
  propertySubType: string;
  businessForSale: boolean;
  commercial: boolean;
  commercialUseClasses: any[];
  affordableBuyingScheme: boolean;
  sharedOwnership: SharedOwnership;
  livingCosts: LivingCosts;
  termsOfUse: string;
}

export interface Address {
  displayAddress: string;
  countryCode: string;
  deliveryPointId: number;
  ukCountry: string;
  outcode: string;
  incode: string;
}

export interface Broadband {
  disclaimer: string;
  broadbandCheckerUrl: string;
}

export interface Brochure {
  url: string;
  caption: string;
}

export interface ContactInfo {
  contactMethod: string;
  telephoneNumbers: TelephoneNumbers;
}

export interface TelephoneNumbers {
  localNumber: string;
  internationalNumber: null;
  disclaimerText: null;
  disclaimerTitle: null;
  disclaimerDescription: null;
}

export interface Customer {
  branchId: number;
  branchName: string;
  branchDisplayName: string;
  companyName: string;
  companyTradingName: null;
  displayAddress: string;
  logoPath: string;
  customerDescription: CustomerDescription;
  bannerAd: null;
  mpuAd: null;
  customerProfileUrl: string;
  customerBannerAdProfileUrl: string;
  customerMpuAdProfileUrl: string;
  customerPropertiesUrl: string;
  isNewHomeDeveloper: boolean;
  spotlight: null;
  showBrochureLeadModal: boolean;
  developmentInfo: DevelopmentInfo;
  buildToRent: boolean;
  commercial: boolean;
  buildToRentBenefits: any[];
}

export interface CustomerDescription {
  truncatedDescriptionHTML: string;
  isTruncated: boolean;
}

export interface DevelopmentInfo {
  sitePlanUri: null;
  micrositeFeatures: any[];
}

export interface DfpAdInfo {
  channel: string;
  targeting: Targeting[];
}

export interface Targeting {
  key: string;
  value: string[];
}

export interface Floorplan {
  url: string;
  caption: string;
  type: string;
  resizedFloorplanUrls: ResizedFloorplanUrls;
}

export interface ResizedFloorplanUrls {
  size296x197: string;
}

export interface Image {
  url: string;
  caption: string;
  resizedImageUrls: ResizedImageUrls;
}

export interface ResizedImageUrls {
  size135x100: string;
  size476x317: string;
  size656x437: string;
}

export interface IndustryAffiliation {
  name: string;
  imagePath: string;
}

export interface InfoReelItem {
  title: string;
  type: string;
  primaryText: string;
  secondaryText: string;
  tooltipText: string;
}

export interface ListingHistory {
  listingUpdateReason: string;
}

export interface LivingCosts {
  councilTaxExempt: boolean;
  councilTaxIncluded: boolean;
  annualGroundRent: null;
  groundRentReviewPeriodInYears: null;
  groundRentPercentageIncrease: null;
  annualServiceCharge: null;
  councilTaxBand: null;
  domesticRates: null;
}

export interface Location {
  latitude: number;
  longitude: number;
  circleRadiusOnMap: number;
  zoomLevel: number;
  pinType: string;
  showMap: boolean;
}

export interface MISInfo {
  branchId: number;
  offerAdvertStampTypeId: null;
  premiumDisplay: boolean;
  premiumDisplayStampId: null;
  brandPlus: boolean;
  featuredProperty: boolean;
}

export interface MortgageCalculator {
  price: number;
  propertyTypeAlias: string;
}

export interface NearestStation {
  name: string;
  types: string[];
  distance: number;
  unit: string;
}

export interface Prices {
  primaryPrice: string;
  secondaryPrice: null;
  displayPriceQualifier: string;
  pricePerSqFt: null;
  message: null;
  exchangeRate: null;
}

export interface PropertyUrls {
  similarPropertiesUrl: string;
  nearbySoldPropertiesUrl: string;
}

export interface SharedOwnership {
  sharedOwnership: boolean;
  ownershipPercentage: null;
  rentPrice: null;
  rentFrequency: string;
}

export interface StaticMapImgUrls {
  staticMapImgUrlMobile: string;
  staticMapImgUrlTablet: string;
  staticMapImgUrlDesktopSmall: string;
  staticMapImgUrlDesktopLarge: string;
}

export interface Status {
  published: boolean;
  archived: boolean;
}

export interface StreetView {
  heading: null;
  pitch: null;
  zoom: null;
  latitude: number;
  longitude: number;
}

export interface Tenure {
  tenureType: string;
  yearsRemainingOnLease: null;
  message: null;
}

export interface Text {
  description: string;
  propertyPhrase: string;
  disclaimer: string;
  auctionFeesDisclaimer: null;
  guidePriceDisclaimer: null;
  reservePriceDisclaimer: null;
  staticMapDisclaimerText: string;
  newHomesBrochureDisclaimer: string;
  shareText: string;
  shareDescription: string;
  pageTitle: string;
  shortDescription: string;
}

export interface VirtualTour {
  url: string;
  caption: string;
  videoId: null;
  provider: string;
}
