// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Maps.DrawingTools {
	export interface IDrawingTools extends Interface.IBuilder, Interface.ISearchById, Interface.IDisposable {
		config: Configuration.IConfigurationDrawingTools; //IConfigurationDrawingTools
		createdElements: Array<unknown>;
		/** Events from the DrawingTools */
		drawingToolsEvents: Event.DrawingTools.DrawingToolsEventsManager;
		isReady: boolean;
		map: OSMap.IMap; //IMap
		provider: IDrawingToolsProvider;
		/** Events from the DrawingTools provider */
		providerEvents: unknown;
		tools: Array<ITool>;
		uniqueId: string;
		widgetId: string;

		/** Adds a Tool into the DrawingTools element */
		addTool(tool: ITool): ITool;
		changeProperty(propertyName: string, propertyValue: unknown): void;
		/**
		 * Change property of a Tool from the DrawingTools by specifying the property name and the new value
		 * @param toolId id of the Tool
		 * @param propertyName name of the property
		 * @param propertyValue new value of the property
		 */
		changeToolProperty(toolId: string, propertyName: string, propertyValue: unknown): void;
		/**
		 * Boolean that indicates whether the DrawingTools element has a tool with the same uniqueId or not
		 * @param toolId id of the Tool
		 */
		hasTool(toolId: string): boolean;
		/**
		 * Refreshes the Events of the DrawingTools Provider after Subscribing/Unsubscribing events
		 */
		refreshProviderEvents(): void;
		/**
		 * Removes all Tools from the DrawingTools
		 */
		removeAllTools(): void;
		/**
		 * Remove a Tool from the DrawingTools by giving a toolId
		 * @param toolId id of the tool to be removed from the DrawingTools
		 */
		removeTool(toolId: string): void;
		/** Boolean that indicates whether the DrawingTools element has a tool with the same type or not
		 * (There should not be 2 tools with the same type on the DrawingTools element)
		 */
		toolAlreadyExists(toolType: OSFramework.Maps.Enum.DrawingToolsTypes): boolean;
		/**
		 * Check if the event name is valid for the provider events
		 * @param eventName name of the event from provider
		 */
		validateProviderEvent(eventName: string): boolean;
	}
}
