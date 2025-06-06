/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { createDownloadPaginatedDataFromDiscriminatorValue, DownloadField, type DownloadPaginatedData } from '../../../models/index';
// @ts-ignore
import { type BaseRequestBuilder, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';

/**
 * Builds and executes requests for operations under /api/v1/download
 */
export interface DownloadRequestBuilder extends BaseRequestBuilder<DownloadRequestBuilder> {
    /**
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<DownloadPaginatedData>}
     */
     get(requestConfiguration?: RequestConfiguration<DownloadRequestBuilderGetQueryParameters> | undefined) : Promise<DownloadPaginatedData | undefined>;
    /**
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<DownloadRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
}
export interface DownloadRequestBuilderGetQueryParameters {
    descending?: boolean;
    limit?: number;
    orderBy?: DownloadField;
    page?: number;
    search?: string;
}
/**
 * Uri template for the request builder.
 */
export const DownloadRequestBuilderUriTemplate = "{+baseurl}/api/v1/download{?descending*,limit*,orderBy*,page*,search*}";
/**
 * Metadata for all the requests in the request builder.
 */
export const DownloadRequestBuilderRequestsMetadata: RequestsMetadata = {
    get: {
        uriTemplate: DownloadRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        adapterMethodName: "send",
        responseBodyFactory:  createDownloadPaginatedDataFromDiscriminatorValue,
    },
};
/* tslint:enable */
/* eslint-enable */
