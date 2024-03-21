/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
import { createScrapeFromDiscriminatorValue, createScrapePaginatedDataFromDiscriminatorValue, ScrapeField, type Scrape, type ScrapePaginatedData } from '../../../models/';
import { type BaseRequestBuilder, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';

/**
 * Builds and executes requests for operations under /api/v1/scrape
 */
export interface ScrapeRequestBuilder extends BaseRequestBuilder<ScrapeRequestBuilder> {
    /**
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<ScrapePaginatedData>}
     */
     get(requestConfiguration?: RequestConfiguration<ScrapeRequestBuilderGetQueryParameters> | undefined) : Promise<ScrapePaginatedData | undefined>;
    /**
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<Scrape>}
     */
     post(requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<Scrape | undefined>;
    /**
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<ScrapeRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
    /**
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toPostRequestInformation(requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;
}
export interface ScrapeRequestBuilderGetQueryParameters {
    descending?: boolean;
    limit?: number;
    orderBy?: ScrapeField;
    page?: number;
    search?: string;
}
/**
 * Uri template for the request builder.
 */
export const ScrapeRequestBuilderUriTemplate = "{+baseurl}/api/v1/scrape{?descending*,limit*,orderBy*,page*,search*}";
/**
 * Metadata for all the requests in the request builder.
 */
export const ScrapeRequestBuilderRequestsMetadata: RequestsMetadata = {
    get: {
        uriTemplate: ScrapeRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        adapterMethodName: "send",
        responseBodyFactory:  createScrapePaginatedDataFromDiscriminatorValue,
    },
    post: {
        uriTemplate: ScrapeRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        adapterMethodName: "send",
        responseBodyFactory:  createScrapeFromDiscriminatorValue,
    },
};
/* tslint:enable */
/* eslint-enable */
