/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
import { createMovieSummaryPaginatedDataFromDiscriminatorValue, SourceMovieField, type MovieSummaryPaginatedData } from '../../../models/';
import { MovieItemRequestBuilderNavigationMetadata, MovieItemRequestBuilderRequestsMetadata, type MovieItemRequestBuilder } from './item/';
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';

/**
 * Builds and executes requests for operations under /api/v1/movie
 */
export interface MovieRequestBuilder extends BaseRequestBuilder<MovieRequestBuilder> {
    /**
     * Gets an item from the ApiSdk.api.v1.movie.item collection
     * @param id Unique identifier of the item
     * @returns {MovieItemRequestBuilder}
     */
     byId(id: string) : MovieItemRequestBuilder;
    /**
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<MovieSummaryPaginatedData>}
     */
     get(requestConfiguration?: RequestConfiguration<MovieRequestBuilderGetQueryParameters> | undefined) : Promise<MovieSummaryPaginatedData | undefined>;
    /**
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<MovieRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
}
export interface MovieRequestBuilderGetQueryParameters {
    descending?: boolean;
    limit?: number;
    orderBy?: SourceMovieField;
    page?: number;
    search?: string;
}
/**
 * Uri template for the request builder.
 */
export const MovieRequestBuilderUriTemplate = "{+baseurl}/api/v1/movie{?descending*,limit*,orderBy*,page*,search*}";
/**
 * Metadata for all the navigation properties in the request builder.
 */
export const MovieRequestBuilderNavigationMetadata: Record<Exclude<keyof MovieRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    byId: {
        requestsMetadata: MovieItemRequestBuilderRequestsMetadata,
        navigationMetadata: MovieItemRequestBuilderNavigationMetadata,
        pathParametersMappings: ["id"],
    },
};
/**
 * Metadata for all the requests in the request builder.
 */
export const MovieRequestBuilderRequestsMetadata: RequestsMetadata = {
    get: {
        uriTemplate: MovieRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        adapterMethodName: "send",
        responseBodyFactory:  createMovieSummaryPaginatedDataFromDiscriminatorValue,
    },
};
/* tslint:enable */
/* eslint-enable */
