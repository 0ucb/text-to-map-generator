// Shared constants for the map application

export const LOCATION_COLORS = {
  reference: '#ef4444',
  positioned: '#3b82f6',
  nearby: '#10b981',
  between: '#f59e0b',
  manual: '#8b5cf6',
  unknown: '#6b7280'
};

export const PATH_STYLES = {
  road: { stroke: '#6b7280', strokeWidth: 3, strokeDasharray: 'none' },
  highway: { stroke: '#374151', strokeWidth: 4, strokeDasharray: 'none' },
  path: { stroke: '#9ca3af', strokeWidth: 2, strokeDasharray: '5,5' },
  trail: { stroke: '#d1d5db', strokeWidth: 1.5, strokeDasharray: '3,3' }
};

export const WATERWAY_STYLES = {
  river: { stroke: '#3b82f6', strokeWidth: 4 },
  stream: { stroke: '#60a5fa', strokeWidth: 3 },
  creek: { stroke: '#93c5fd', strokeWidth: 2 },
  brook: { stroke: '#dbeafe', strokeWidth: 2 }
};

export const DEFAULT_INPUT_TEXT = 'Washington DC is the reference point. New York City is 3 miles north of Washington DC. Los Angeles is 15 miles west of Washington DC. Chicago is 8 miles northwest of Washington DC. Miami is 6 miles south of Washington DC. Seattle is 12 miles northwest of Washington DC. Denver is 10 miles west of Washington DC. Boston is 4 miles northeast of Washington DC. New Orleans is 8 miles southwest of Washington DC. Detroit is 3 miles north of Chicago. The Mississippi River flows from Chicago to New Orleans. Interstate 95 runs from Miami to Boston. Interstate 10 connects Los Angeles and New Orleans. The Rocky Mountains are near Denver. The Great Lakes are near Detroit.';

export const EXAMPLE_TEXTS = [
  "The castle is north of the village. The forest lies 2 miles east of the castle. A road connects the village and the castle. A river flows from the forest to the village. The road between the village and castle is Castle Road. The castle is named Bronze Castle. The forest is called Dark Forest. The village is named Riverside.",
  "The market is between the church and the tavern. The well is nearby the market. There is a path from the church to the tavern. A stream runs from the well to the market. The path from church to tavern is called Market Street. The market is named Central Market.",
  "Dragon's Peak stands 5 miles northeast of Riverside. The old mill is west of the village. A highway runs from Riverside to the mill. A river flows from Dragon's Peak to Riverside. The highway connecting Riverside and the mill is Route 66. The river from Dragon's Peak to Riverside is called Dragon River. The mill is named Old Windmill."
];
