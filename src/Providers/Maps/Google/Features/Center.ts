// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Provider.Maps.Google.Feature {
	export class Center implements OSFramework.Maps.Feature.ICenter, OSFramework.Maps.Interface.IBuilder {
		/** Current center position of the Map that changes whenever a marker is added or by enabling the Autofit on Zoom feature */
		private _currentCenter: OSFramework.Maps.OSStructures.OSMap.Coordinates;
		/** Center position of the Map defined by the configuration
		 * (can be changed after running the changeParameter method or is set by initializing the Map)
		 */
		private _initialCenter: OSFramework.Maps.OSStructures.OSMap.Coordinates;
		private _map: OSMap.IMapGoogle;

		constructor(map: OSMap.IMapGoogle, center: OSFramework.Maps.OSStructures.OSMap.Coordinates) {
			this._map = map;
			this._initialCenter = center;
		}

		// eslint-disable-next-line @typescript-eslint/no-empty-function
		public build(): void {}

		public getCenter(): OSFramework.Maps.OSStructures.OSMap.Coordinates {
			return this._initialCenter;
		}

		public getCurrentCenter(): OSFramework.Maps.OSStructures.OSMap.Coordinates {
			return this._currentCenter;
		}

		public getMapCenter(): OSFramework.Maps.OSStructures.ReturnMessage {
			// Set the default return message
			const responseObj = {
				isSuccess: true,
				message: OSFramework.Maps.Enum.Success.message,
				code: OSFramework.Maps.Enum.Success.code,
			};

			try {
				// Set the message structure, to pass the center coordinates on message
				const messageInfo = {
					message: OSFramework.Maps.Enum.Success.message,
					lat: this._map.provider.getCenter().lat(),
					lng: this._map.provider.getCenter().lng(),
				};

				// Set the coordinates to expose on return message
				responseObj.message = JSON.stringify(messageInfo);
			} catch (error) {
				responseObj.isSuccess = false;
				responseObj.message = error.message;
				responseObj.code = OSFramework.Maps.Enum.ErrorCodes.API_FailedGettingCenterCoordinates;
			}

			return responseObj;
		}

		public refreshCenter(value: OSFramework.Maps.OSStructures.OSMap.Coordinates): void {
			const coordinates = new google.maps.LatLng(value.lat as number, value.lng as number);
			this._map.provider.setCenter(coordinates);
			this._currentCenter = coordinates.toJSON();
		}

		public setCurrentCenter(value: OSFramework.Maps.OSStructures.OSMap.Coordinates): void {
			this._currentCenter = value;
		}

		public updateCenter(location: string): void {
			Helper.Conversions.ConvertToCoordinates(location)
				.then((response) => {
					this._map.config.center = response;
					this._initialCenter = response;
					this._map.refresh(true);
				})
				.catch((error) => {
					this._map.mapEvents.trigger(
						OSFramework.Maps.Event.OSMap.MapEventType.OnError,
						this._map,
						OSFramework.Maps.Enum.ErrorCodes.LIB_FailedGeocodingMap,
						`${error}`
					);
				});
		}
	}
}
