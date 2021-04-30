/// <reference path="../OSFramework/OSMap/AbstractMap.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GoogleProvider.Map {
    export class Map
        extends OSFramework.OSMap.AbstractMap<
            google.maps.Map,
            OSFramework.Configuration.OSMap.GoogleMapConfig
        >
        implements IMapGoogle {
        private _fBuilder: GoogleProvider.Feature.FeatureBuilder;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        constructor(mapId: string, configs: any) {
            super(
                mapId,
                new OSFramework.Configuration.OSMap.GoogleMapConfig(configs)
                // new WijmoProvider.Column.ColumnGenerator()
            );
        }

        // eslint-disable-next-line @typescript-eslint/member-ordering
        private _buildMarkers(): void {
            // this.getMarkers().forEach((marker) => marker.build());
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _getProviderConfig(): any {
            return this.config.getProviderConfig();
        }

        public addMarker(marker: OSFramework.Marker.IMarker): OSFramework.Marker.IMarker {
            super.addMarker(marker);

            if (this.isReady) {
                //OS takes a while to set the WidgetId
                setTimeout(() => {
                    marker.build();
                }, 0);
            }

            return marker;
        }

        public build(): void {
            super.build();

            this._provider = new google.maps.Map(
                document.querySelector("#" + this.uniqueId),
                this._getProviderConfig()
            );

            this.buildFeatures();

            this._buildMarkers();

            this.finishBuild();
        }

        public buildFeatures(): void {
            this._fBuilder = new GoogleProvider.Feature.FeatureBuilder(this);

            this._features = this._fBuilder.features;

            this._fBuilder.build();
        }

        public changeMarkerProperty(
            markerId: string,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void {
            const marker = this.getMarker(markerId);

            if (!marker) {
                console.error(
                    `changeMarkerProperty - marker id:${markerId} not found.`
                );
            } else {
                marker.changeProperty(propertyName, propertyValue);
            }
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public changeProperty(propertyName: string, value: any): void {
            const propValue = OSFramework.Enum.OS_Config_Map[propertyName];

            switch (propValue) {
                case OSFramework.Enum.OS_Config_Map.center:
                    const coordinates = new google.maps.LatLng(
                        value.lat,
                        value.lng
                    );
                    return this._provider.setCenter(coordinates);
                case OSFramework.Enum.OS_Config_Map.zoom:
                    return this._provider.setZoom(value);
                case OSFramework.Enum.OS_Config_Map.mapTypeId:
                    return this._provider.setMapTypeId(value);
                case OSFramework.Enum.OS_Config_Map.styles:
                    return this._provider.setOptions({styles: value});
                case OSFramework.Enum.OS_Config_Map.advancedFormat:
                    return this._provider.setOptions(value);
                case OSFramework.Enum.OS_Config_Map.showTraffic:
                    return this.features.trafficLayer.setState(value);
                case OSFramework.Enum.OS_Config_Map.staticMap:
                    return this.features.staticMap.setState(value);
                default:
                    throw Error(
                        `changeProperty - Property '${propertyName}' can't be changed.`
                    );
            }
        }

        public dispose(): void {
            super.dispose();

            this._fBuilder.dispose();

            this._provider = undefined;
        }
    }
}
