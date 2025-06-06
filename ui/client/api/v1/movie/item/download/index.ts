/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { createDownloadFromDiscriminatorValue, createProblemDetailsFromDiscriminatorValue, type Download, type ProblemDetails } from '../../../../../models/index';
// @ts-ignore
import { type BaseRequestBuilder, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';

/**
 * Builds and executes requests for operations under /api/v1/movie/{id}/download
 */
export interface DownloadRequestBuilder extends BaseRequestBuilder<DownloadRequestBuilder> {
    /**
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<Download>}
     * @throws {ProblemDetails} error when the service returns a 400 status code
     * @throws {ProblemDetails} error when the service returns a 404 status code
     */
     post(requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<Download | undefined>;
    /**
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toPostRequestInformation(requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;
}
/**
 * Uri template for the request builder.
 */
export const DownloadRequestBuilderUriTemplate = "{+baseurl}/api/v1/movie/{id}/download";
/**
 * Metadata for all the requests in the request builder.
 */
export const DownloadRequestBuilderRequestsMetadata: RequestsMetadata = {
    post: {
        uriTemplate: DownloadRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            400: createProblemDetailsFromDiscriminatorValue as ParsableFactory<Parsable>,
            404: createProblemDetailsFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createDownloadFromDiscriminatorValue,
    },
};
/* tslint:enable */
/* eslint-enable */
