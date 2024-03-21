// <auto-generated/>
using Microsoft.Kiota.Abstractions.Serialization;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System;
namespace MakeMovies.Api.Meta.Tmdb.Three.Configuration {
    public class ConfigurationGetResponse_images : IAdditionalDataHolder, IParsable {
        /// <summary>Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.</summary>
        public IDictionary<string, object> AdditionalData { get; set; }
        /// <summary>The backdrop_sizes property</summary>
#if NETSTANDARD2_1_OR_GREATER || NETCOREAPP3_1_OR_GREATER
#nullable enable
        public List<string>? BackdropSizes { get; set; }
#nullable restore
#else
        public List<string> BackdropSizes { get; set; }
#endif
        /// <summary>The base_url property</summary>
#if NETSTANDARD2_1_OR_GREATER || NETCOREAPP3_1_OR_GREATER
#nullable enable
        public string? BaseUrl { get; set; }
#nullable restore
#else
        public string BaseUrl { get; set; }
#endif
        /// <summary>The logo_sizes property</summary>
#if NETSTANDARD2_1_OR_GREATER || NETCOREAPP3_1_OR_GREATER
#nullable enable
        public List<string>? LogoSizes { get; set; }
#nullable restore
#else
        public List<string> LogoSizes { get; set; }
#endif
        /// <summary>The poster_sizes property</summary>
#if NETSTANDARD2_1_OR_GREATER || NETCOREAPP3_1_OR_GREATER
#nullable enable
        public List<string>? PosterSizes { get; set; }
#nullable restore
#else
        public List<string> PosterSizes { get; set; }
#endif
        /// <summary>The profile_sizes property</summary>
#if NETSTANDARD2_1_OR_GREATER || NETCOREAPP3_1_OR_GREATER
#nullable enable
        public List<string>? ProfileSizes { get; set; }
#nullable restore
#else
        public List<string> ProfileSizes { get; set; }
#endif
        /// <summary>The secure_base_url property</summary>
#if NETSTANDARD2_1_OR_GREATER || NETCOREAPP3_1_OR_GREATER
#nullable enable
        public string? SecureBaseUrl { get; set; }
#nullable restore
#else
        public string SecureBaseUrl { get; set; }
#endif
        /// <summary>The still_sizes property</summary>
#if NETSTANDARD2_1_OR_GREATER || NETCOREAPP3_1_OR_GREATER
#nullable enable
        public List<string>? StillSizes { get; set; }
#nullable restore
#else
        public List<string> StillSizes { get; set; }
#endif
        /// <summary>
        /// Instantiates a new configurationGetResponse_images and sets the default values.
        /// </summary>
        public ConfigurationGetResponse_images() {
            AdditionalData = new Dictionary<string, object>();
        }
        /// <summary>
        /// Creates a new instance of the appropriate class based on discriminator value
        /// </summary>
        /// <param name="parseNode">The parse node to use to read the discriminator value and create the object</param>
        public static ConfigurationGetResponse_images CreateFromDiscriminatorValue(IParseNode parseNode) {
            _ = parseNode ?? throw new ArgumentNullException(nameof(parseNode));
            return new ConfigurationGetResponse_images();
        }
        /// <summary>
        /// The deserialization information for the current model
        /// </summary>
        public virtual IDictionary<string, Action<IParseNode>> GetFieldDeserializers() {
            return new Dictionary<string, Action<IParseNode>> {
                {"backdrop_sizes", n => { BackdropSizes = n.GetCollectionOfPrimitiveValues<string>()?.ToList(); } },
                {"base_url", n => { BaseUrl = n.GetStringValue(); } },
                {"logo_sizes", n => { LogoSizes = n.GetCollectionOfPrimitiveValues<string>()?.ToList(); } },
                {"poster_sizes", n => { PosterSizes = n.GetCollectionOfPrimitiveValues<string>()?.ToList(); } },
                {"profile_sizes", n => { ProfileSizes = n.GetCollectionOfPrimitiveValues<string>()?.ToList(); } },
                {"secure_base_url", n => { SecureBaseUrl = n.GetStringValue(); } },
                {"still_sizes", n => { StillSizes = n.GetCollectionOfPrimitiveValues<string>()?.ToList(); } },
            };
        }
        /// <summary>
        /// Serializes information the current object
        /// </summary>
        /// <param name="writer">Serialization writer to use to serialize this model</param>
        public virtual void Serialize(ISerializationWriter writer) {
            _ = writer ?? throw new ArgumentNullException(nameof(writer));
            writer.WriteCollectionOfPrimitiveValues<string>("backdrop_sizes", BackdropSizes);
            writer.WriteStringValue("base_url", BaseUrl);
            writer.WriteCollectionOfPrimitiveValues<string>("logo_sizes", LogoSizes);
            writer.WriteCollectionOfPrimitiveValues<string>("poster_sizes", PosterSizes);
            writer.WriteCollectionOfPrimitiveValues<string>("profile_sizes", ProfileSizes);
            writer.WriteStringValue("secure_base_url", SecureBaseUrl);
            writer.WriteCollectionOfPrimitiveValues<string>("still_sizes", StillSizes);
            writer.WriteAdditionalData(AdditionalData);
        }
    }
}