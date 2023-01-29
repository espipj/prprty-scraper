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

// Search results

export interface SearchResult {
  properties: PropertyListing[];
  resultCount: string;
  searchParametersDescription: string;
  radiusOptions: Option[];
  priceOptions: Option[];
  bedroomOptions: Option[];
  addedToSiteOptions: Option[];
  mustHaveOptions: Option[];
  dontShowOptions: Option[];
  furnishOptions: any[];
  letTypeOptions: any[];
  sortOptions: Option[];
  staticMapUrl: string;
  shortLocationDescription: string;
  timestamp: number;
  bot: boolean;
  deviceType: string;
  propertySchema: PropertyListing;
  sidebarModel: SidebarModel;
  seoModel: SEOModel;
  mapViewUrl: string;
  legacyUrl: string;
  listViewUrl: string;
  pageTitle: string;
  metaDescription: string;
  recentSearchModel: RecentSearchModel;
  maxCardsPerPage: number;
  countryCode: string;
  countryId: number;
  currencyCodeOptions: Option[];
  areaSizeUnitOptions: AreaSizeUnitOptionElement[];
  sizeOptions: AreaSizeUnitOptionElement[];
  priceTypeOptions: AreaSizeUnitOptionElement[];
  showFeaturedAgent: boolean;
  showNewDrawASearch: boolean;
  commercialChannel: boolean;
  disambiguationPagePath: string;
  dfpModel: DfpModel;
  noResultsModel: NoResultsModel;
  urlPath: string;
  tileGeometry: null;
  comscore: string;
  cookiePolicies: CookiePolicies;
  formattedExchangeRateDate: string;
  authenticated: boolean;
  applicationProperties: ApplicationProperties;
  termsOfUse: string;
  location: SearchResultLocation;
  featureSwitchStateForUser: FeatureSwitchStateForUser;
  searchParameters: SearchParameters;
  pagination: Pagination;
  locationBranchSearchPath: null;
}

export interface Option {
  value: null | string;
  description: string;
}

export interface ApplicationProperties {
  "media.server.host": string;
  "location.product.web.server.host": string;
  "location.product.web.server.port": string;
  "publicsite.server.host": string;
  "publicsite.server.port": string;
  "location.search.server.host": string;
  "location.search.server.port": string;
  "my.rightmove.web.server.host": string;
  "my.rightmove.web.server.port": string;
  "analytics.typeform.url": string;
  "clickstream.enabled": boolean;
  "gtm.enabled": boolean;
  "gtm.id": string;
  "gtm.auth": string;
  "gtm.preview": string;
  "comscore.enabled": boolean;
  "info.build.version": string;
  "metadata.service.url": string;
  "sidebar.mpu.adUnitTimeout": string;
  "sidebar.mpu.adUnitPath": string;
  "dfp.interstitial1.adUnitPath": string;
  "dfp.interstitial2.adUnitPath": string;
  "dfp.interstitial3.adUnitPath": string;
  "dfp.overseas.interstitial1.adUnitPath": string;
  "dfp.overseas.interstitial2.adUnitPath": string;
  "dfp.overseas.interstitial3.adUnitPath": string;
  "dfp.sold-by-me.interstitial.adUnitPath": string;
  "dfp.sold-by-me.interstitial.commercial-sales.adUnitPath": string;
  "dfp.sold-by-me.interstitial.commercial-lettings.adUnitPath": string;
  "dfp.sidebar.uk-credit-check-sponsorship.adUnitPath": string;
  "optimize.map.pins": boolean;
  rightmovePlusLandingPageUrl: string;
  "seo.global.consumerFooter.url": string;
  "seo.global.consumerHeader.url": string;
  recaptchaEnabled: boolean;
  recaptchaSiteKey: string;
  labsHostname: string;
}

export interface AreaSizeUnitOptionElement {
  value: string;
  description: string;
  abbreviation: string;
}

export interface CookiePolicies {
  functional: boolean;
  targeting: boolean;
  "strictly necessary": boolean;
}

export interface DfpModel {
  sidebarSlots: SidebarSlot[];
  targeting: Targeting[];
}

export interface SidebarSlot {
  id: string;
  adUnitPath: string;
  sizes: Array<number[]>;
  mappings: any[];
}

export interface Targeting {
  key: string;
  value: string;
}

export interface FeatureSwitchStateForUser {
  individualFeatureSwitchStates: IndividualFeatureSwitchState[];
  featureUser: FeatureUser;
}

export interface FeatureUser {
  uniqueIdentifier: string;
}

export interface IndividualFeatureSwitchState {
  label: string;
  state: string;
  shouldLog: boolean;
}

export interface SearchResultLocation {
  id: number;
  displayName: string;
  shortDisplayName: string;
  locationType: string;
  listingCurrency: string;
}

export interface NoResultsModel {
  suggestionPods: any[];
  intelligentSuggestion: null;
}

export interface Pagination {
  total: number;
  options: Option[];
  first: string;
  last: string;
  next: string;
  page: string;
}

export interface PropertyListing {
  id: number;
  bedrooms: number;
  bathrooms: number;
  numberOfImages: number;
  numberOfFloorplans: number;
  numberOfVirtualTours: number;
  summary: null | string;
  displayAddress: null | string;
  countryCode: null | string;
  location: PropertySchemaLocation;
  propertyImages: PropertyImages;
  propertySubType: null | string;
  listingUpdate: ListingUpdate;
  premiumListing: boolean;
  featuredProperty: boolean;
  price: Price;
  customer: Customer;
  distance: null;
  transactionType: null | string;
  productLabel: ProductLabel;
  commercial: boolean;
  development: boolean;
  residential: boolean;
  students: boolean;
  auction: boolean;
  feesApply: boolean;
  feesApplyText: null | string;
  displaySize: string;
  showOnMap: boolean;
  propertyUrl: string;
  contactUrl: string;
  staticMapUrl: null | string;
  channel: string;
  firstVisibleDate: Date;
  keywords: any[];
  keywordMatchType: string;
  saved: boolean;
  hidden: boolean;
  onlineViewingsAvailable: boolean;
  lozengeModel: LozengeModel;
  hasBrandPlus: boolean;
  displayStatus: string;
  enquiredTimestamp: null;
  propertyTypeFullDescription: string;
  isRecent: boolean;
  enhancedListing: boolean;
  heading: string;
  formattedBranchName: string;
  formattedDistance: string;
  addedOrReduced: string;
}

export interface Customer {
  branchId: number | null;
  brandPlusLogoURI: null | string;
  contactTelephone: null | string;
  branchDisplayName: null | string;
  branchName: null | string;
  brandTradingName: null | string;
  branchLandingPageUrl: null | string;
  development: boolean;
  showReducedProperties: boolean;
  commercial: boolean;
  showOnMap: boolean;
  enhancedListing: boolean;
  developmentContent: null;
  buildToRent: boolean;
  buildToRentBenefits: any[] | null;
  brandPlusLogoUrl: string;
}

export interface ListingUpdate {
  listingUpdateReason: null | string;
  listingUpdateDate: Date;
}

export interface PropertySchemaLocation {
  latitude: number | null;
  longitude: number | null;
}

export interface LozengeModel {
  matchingLozenges: MatchingLozenge[];
}

export interface MatchingLozenge {
  type: string;
  priority: number;
}

export interface Price {
  amount: number;
  frequency: string;
  currencyCode: string;
  displayPrices: DisplayPrice[];
}

export interface DisplayPrice {
  displayPrice: string;
  displayPriceQualifier: string;
}

export interface ProductLabel {
  productLabelText: null | string;
  spotlightLabel: boolean;
}

export interface PropertyImages {
  images: Image[];
  mainImageSrc: string;
  mainMapImageSrc: string;
}

export interface Image {
  srcUrl: string;
  url: string;
  caption: null | string;
}

export interface RecentSearchModel {
  linkDisplayText: string;
  titleDisplayText: string;
  searchCriteriaMobile: string;
  createDate: number;
  locationIdentifierAndSearchType: string;
}

export interface SearchParameters {
  locationIdentifier: string;
  minBedrooms: string;
  maxPrice: string;
  numberOfPropertiesPerPage: string;
  radius: string;
  sortType: string;
  index: string;
  propertyTypes: any[];
  viewType: string;
  mustHave: any[];
  dontShow: any[];
  furnishTypes: any[];
  channel: string;
  areaSizeUnit: string;
  currencyCode: string;
  keywords: any[];
}

export interface SEOModel {
  canonicalUrl: string;
  metaRobots: string;
}

export interface SidebarModel {
  soldHousePricesLinks: null;
  relatedHouseSearches: null;
  relatedFlatSearches: null;
  relatedPopularSearches: null;
  relatedRegionsSearches: null;
  channelSwitchLink: null;
  relatedStudentLinks: null;
  branchMPU: null;
  countryGuideMPU: null;
  suggestedLinks: null;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toSearchResult(json: string): SearchResult {
    return JSON.parse(json);
  }

  public static searchResultToJson(value: SearchResult): string {
    return JSON.stringify(value);
  }
}
