// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GoogleProvider.Feature {
    export class TrafficLayer
        implements
            OSFramework.Feature.ITrafficLayer,
            OSFramework.Interface.IBuilder {
        private _map: GoogleProvider.Map.IMapGoogle;
        private _enabled: boolean;
        private _trafficLayer: google.maps.TrafficLayer;

        constructor(map: GoogleProvider.Map.IMapGoogle, enabled: boolean) {
            this._map = map;
            this._enabled = enabled;
        }

        public get isEnabled(): boolean {
            return this._enabled;
        }
        public build(): void {
            this._trafficLayer = new google.maps.TrafficLayer(); 
            this.setState(this._enabled);
        }
        public setState(value: boolean): void {
            this._trafficLayer.setMap( value === true ? this._map.provider : null ); 
            this._enabled = value;
        }
    }
}
