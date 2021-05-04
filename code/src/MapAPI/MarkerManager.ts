// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace MapAPI.MarkerManager {
    const markerMap = new Map<string, string>(); //marker.uniqueId -> map.uniqueId
    const markerArr = new Array<OSFramework.Marker.IMarker>();

    /**
     * Function that creates an instance of Map object with the configurations passed
     *
     * @export
     * @param {string} mapId Id of the Map where the change will occur
     * @param {string} configs configurations for the Map in JSON format
     * @returns {*}  {OSMap.IMap} instance of the Map
     */
    export function CreateMarker(
        map: OSFramework.OSMap.IMap,
        markerId: string,
        configs: string
    ): OSFramework.Marker.IMarker {
        if (!map.hasMarker(markerId)) {
            const _marker = GoogleProvider.Marker.MarkerFactory.MakeMarker(
                map,
                markerId,
                JSON.parse(configs)
            );
            markerArr.push(_marker);
            markerMap.set(markerId, map.uniqueId);
            map.addMarker(_marker);
            return _marker;
        } else {
            throw new Error(
                `There is already a Marker registered on the specified Map under id:${markerId}`
            );
        }
    }

    /**
     * Gets the Map to which the Marker belongs to
     *
     * @param {string} markerId Id of the Marker that exists on the Map
     * @returns {*}  {MarkerMapper} this structure has the id of Map, and the reference to the instance of the Map
     */
    function GetMapByMarkerId(markerId: string): OSFramework.OSMap.IMap {
        let map: OSFramework.OSMap.IMap;

        //markerId is the UniqueId
        if (markerMap.has(markerId)) {
            map = MapManager.GetMapById(markerMap.get(markerId), false);
        }
        //UniqueID not found
        else {
            // Try to find its reference on DOM
            const elem = OSFramework.Helper.GetElementByUniqueId(
                markerId,
                false
            );

            // If element is found, means that the DOM was rendered
            if (elem !== undefined) {
                //Find the closest Map
                map = OSFramework.Helper.GetClosestMap(elem);
            }
        }

        return map;
    }

    /**
     * Returns a Marker based on ID
     * @param markerID Id of the Marker
     */
    export function GetMarkerById(
        markerID: string
    ): OSFramework.Marker.IMarker {
        return markerArr.find((p) => p && p.equalsToID(markerID));
    }

    /**
     * Changes the property of a given Marker.
     *
     * @export
     * @param {string} markerID Id of the Marker to be changed
     * @param {string} propertyName name of the property to be changed - some properties of the provider might not work out of be box
     * @param {*} propertyValue value to which the property should be changed to.
     */
    export function ChangeProperty(
        markerID: string,
        propertyName: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
        propertyValue: any
    ): void {
        const map = GetMapByMarkerId(markerID);

        if (map !== undefined) {
            map.changeMarkerProperty(markerID, propertyName, propertyValue);
        }
    }

    /**
     * Removes the Marker
     *
     * @export
     * @param {string} markerID id of the Marker that is about to be removed
     */
    export function RemoveMarker(markerId: string): void {
        const grid = GetMapByMarkerId(markerId);

        grid && grid.removeMarker(markerId);
        markerMap.delete(markerId);
        markerArr.splice(
            markerArr.findIndex((p) => {
                return p && p.equalsToID(markerId);
            }),
            1
        );
    }
}
