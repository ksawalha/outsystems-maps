/// <reference path="../../../../OSFramework/Maps/HeatmapLayer/AbstractHeatmapLayer.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Provider.Maps.Google.HeatmapLayer {
	export type data = {
		location: google.maps.LatLng;
		weight: number;
	};
	export class HeatmapLayer extends OSFramework.Maps.HeatmapLayer.AbstractHeatmapLayer<
		google.maps.visualization.HeatmapLayer,
		OSFramework.Maps.Configuration.IConfigurationHeatmapLayer
	> {
		constructor(map: OSFramework.Maps.OSMap.IMap, HeatmapLayerId: string, configs: JSON) {
			super(map, HeatmapLayerId, new Configuration.HeatmapLayer.HeatmapLayerConfig(configs));
		}

		/** In case the gradient is not defined, use the default from GoogleProvider */
		private _gradientColors(gradient: string[]) {
			if (gradient.length === 0) {
				return Constants.gradientHeatmapColors;
			}
			return gradient;
		}

		/** Convert array of points from OS format into the data points from GoogleProvider */
		private _pointsToData(points: Array<OSFramework.Maps.OSStructures.HeatmapLayer.Points>) {
			const data: Array<HeatmapLayer.data | google.maps.LatLng> = points.map((point) => {
				if (point.Weight === undefined) {
					return new google.maps.LatLng(point.Lat, point.Lng);
				}
				return {
					location: new google.maps.LatLng(point.Lat, point.Lng),
					weight: point.Weight,
				};
			});
			return data;
		}

		public build(): void {
			super.build();

			const configs = this.getProviderConfig();

			// Creates the provider HeatmapLayer
			this._provider = new google.maps.visualization.HeatmapLayer({
				...configs,
				// first we need to convert the points from OS format to data GoogleProvider format
				data: this._pointsToData(configs.points),
				// then, we need to make sure if the gradient is empty, we set it with the GoogleProvider default values
				gradient: this._gradientColors(configs.gradient),
				map: this.map.provider,
			});

			this.finishBuild();
		}

		public changeProperty(propertyName: string, value: unknown): void {
			const propValue = OSFramework.Maps.Enum.OS_Config_HeatmapLayer[propertyName];
			super.changeProperty(propertyName, value);
			if (this.isReady) {
				switch (propValue) {
					case OSFramework.Maps.Enum.OS_Config_HeatmapLayer.points:
						return this.provider.setData(this._pointsToData(JSON.parse(value as string)));
					case OSFramework.Maps.Enum.OS_Config_HeatmapLayer.dissipateOnZoom:
						return this.provider.setOptions({
							dissipating: value as boolean,
						});
					case OSFramework.Maps.Enum.OS_Config_HeatmapLayer.gradient:
						return this.provider.setOptions({
							gradient: this._gradientColors(JSON.parse(value as string)),
						});
					case OSFramework.Maps.Enum.OS_Config_HeatmapLayer.maxIntensity:
						return this.provider.setOptions({
							maxIntensity: value as number,
						});
					case OSFramework.Maps.Enum.OS_Config_HeatmapLayer.opacity:
						return this.provider.setOptions({
							opacity: value as number,
						});
					case OSFramework.Maps.Enum.OS_Config_HeatmapLayer.radius:
						return this.provider.setOptions({
							radius: value as number,
						});
				}
			}
		}

		public dispose(): void {
			if (this.isReady) {
				this.provider.set('map', null);
			}
			this._provider = undefined;
			super.dispose();
		}
	}
}
