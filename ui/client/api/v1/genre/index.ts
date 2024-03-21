/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
import { type BaseRequestBuilder, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';

/**
 * Builds and executes requests for operations under /api/v1/genre
 */
export interface GenreRequestBuilder extends BaseRequestBuilder<GenreRequestBuilder> {
    /**
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<string[]>}
     */
     get(requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<string[] | undefined>;
    /**
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;
}
/**
 * Uri template for the request builder.
 */
export const GenreRequestBuilderUriTemplate = "{+baseurl}/api/v1/genre";
/**
 * Metadata for all the requests in the request builder.
 */
export const GenreRequestBuilderRequestsMetadata: RequestsMetadata = {
    get: {
        uriTemplate: GenreRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        adapterMethodName: "sendCollectionOfPrimitive",
        responseBodyFactory:  "string",
    },
};
/* tslint:enable */
/* eslint-enable */