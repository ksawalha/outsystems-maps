// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Provider.Maps.Google.Feature {
	export class Zoom implements OSFramework.Maps.Feature.IZoom, OSFramework.Maps.Interface.IBuilder {
		/** Boolean that indicates whether the Map is using Autofit (Zoom = Auto) or not */
		private _autofitEnabled: boolean;
		/** Current Zoom level of the Map that changes whenever a marker is added or by enabling the Autofit on Zoom feature */
		private _level: OSFramework.Maps.Enum.OSMap.Zoom;
		private _map: OSMap.IMapGoogle;

		constructor(map: OSMap.IMapGoogle, level: OSFramework.Maps.Enum.OSMap.Zoom) {
			this._map = map;
			this._level = level;
		}

		/** Set as autofit if Zoom's level is Auto */
		private _setAutofit(value: boolean): void {
			this._autofitEnabled = value;
		}

		private _setBounds(useShapes: boolean) {
			const bounds = new google.maps.LatLngBounds();
			this._map.markers.forEach(function (item) {
				if (item.provider === undefined) return;
				// The TS definitions appear to be outdated.
				if (Helper.TypeChecker.IsAdvancedMarker(item.provider)) {
					bounds.extend(
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						((item.provider as google.maps.marker.AdvancedMarkerElement).position as any).toJSON()
					);
				} else {
					bounds.extend((item.provider as google.maps.Marker).getPosition().toJSON());
				}
			});

			if (useShapes) {
				this._map.shapes.forEach(function (item) {
					if (item.provider === undefined) return;
					bounds.union(item.providerBounds as google.maps.LatLngBounds);
				});
			}

			this._map.provider.fitBounds(bounds);
			this._map.provider.panToBounds(bounds);
			this._map.features.center.setCurrentCenter(this._map.provider.getCenter());
		}

		public build(): void {
			this._setAutofit(this._level === OSFramework.Maps.Enum.OSMap.Zoom.Auto);
		}

		public get isAutofit(): boolean {
			return this._autofitEnabled;
		}

		public get level(): OSFramework.Maps.Enum.OSMap.Zoom {
			return this._level;
		}

		public refreshZoom(): void {
			if (this._map.features.zoom.isAutofit) {
				if (
					this._map.markers.length > 1 ||
					(this._map.shapes.length > 0 && this._map.config.autoZoomOnShapes === true)
				) {
					this._setBounds(this._map.config.autoZoomOnShapes);
				} else {
					this._map.provider.setZoom(OSFramework.Maps.Helper.Constants.zoomAutofit);
				}
			} else {
				this._map.provider.setZoom(this._map.features.zoom.level);
			}
		}

		public setLevel(value: OSFramework.Maps.Enum.OSMap.Zoom): void {
			this._level = value;
			this._setAutofit(value === OSFramework.Maps.Enum.OSMap.Zoom.Auto);
			this._map.refresh();
		}
	}
}
