// Text parsing utilities for natural language map descriptions

export const parseLocationText = (text) => {
  // Common words to exclude from being treated as locations
  const excludeWords = new Set([
    'the', 'and', 'is', 'of', 'to', 'in', 'at', 'on', 'a', 'an', 'it', 'with', 'for', 'as', 'by', 'from',
    'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among',
    'lies', 'sits', 'stands', 'located', 'found', 'near', 'nearby', 'close', 'next', 'miles', 'km', 
    'kilometers', 'north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest',
    'that', 'this', 'these', 'those', 'there', 'here', 'where', 'when', 'why', 'how', 'what', 'which',
    'can', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'road', 'path', 'trail',
    'highway', 'route', 'connects', 'leads', 'runs', 'goes', 'river', 'stream', 'creek', 'brook', 'flows'
  ]);

  const relationships = [];
  const pathRelationships = [];
  const waterwayRelationships = [];
  
  // Helper function to clean and validate location names
  const cleanLocationName = (name) => {
    let cleaned = name.trim().replace(/^(the\s+|a\s+|an\s+)/i, '');
    
    if (cleaned.length < 2 || excludeWords.has(cleaned.toLowerCase())) {
      return null;
    }
    
    if (/^\d+$/.test(cleaned)) {
      return null;
    }
    
    return cleaned;
  };

  // Helper function to find all matches for a pattern
  const findMatches = (pattern, text) => {
    const matches = [];
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(text)) !== null) {
      matches.push(match);
    }
    return matches;
  };
  
  // Define patterns for locations and paths
  const locationPatterns = [
    {
      regex: /(\w+(?:\s+\w+)*)\s+is\s+(\d+)?\s*(?:miles?|km|kilometers?)?\s*(north|south|east|west|northeast|northwest|southeast|southwest)\s+of\s+(\w+(?:\s+\w+)*)/gi,
      type: 'directional'
    },
    {
      regex: /(\w+(?:\s+\w+)*)\s+(?:lies|sits|stands)\s+(\d+)?\s*(?:miles?|km|kilometers?)?\s*(north|south|east|west|northeast|northwest|southeast|southwest)\s+of\s+(\w+(?:\s+\w+)*)/gi,
      type: 'directional'
    },
    {
      regex: /(\w+(?:\s+\w+)*)\s+is\s+(?:near|nearby|close to|next to)\s+(\w+(?:\s+\w+)*)/gi,
      type: 'nearby'
    },
    {
      regex: /(\w+(?:\s+\w+)*)\s+is\s+between\s+(\w+(?:\s+\w+)*)\s+and\s+(\w+(?:\s+\w+)*)/gi,
      type: 'between'
    }
  ];

  // Define patterns for paths/roads
  const pathPatterns = [
    {
      regex: /(?:a\s+)?(?:road|path|trail|highway|route)\s+(?:connects|links|runs\s+between|goes\s+from)\s+(\w+(?:\s+\w+)*)\s+(?:and|to|with)\s+(\w+(?:\s+\w+)*)/gi,
      type: 'road'
    },
    {
      regex: /(\w+(?:\s+\w+)*)\s+is\s+connected\s+(?:to|with)\s+(\w+(?:\s+\w+)*)\s+by\s+(?:a\s+)?(?:road|path|trail|highway|route)/gi,
      type: 'road'
    },
    {
      regex: /(?:there\s+is\s+)?(?:a\s+)?(?:road|path|trail|highway|route)\s+from\s+(\w+(?:\s+\w+)*)\s+to\s+(\w+(?:\s+\w+)*)/gi,
      type: 'road'
    }
  ];

  // Define patterns for naming paths
  const pathNamingPatterns = [
    {
      regex: /(?:the\s+)?(road|path|trail|highway|route)\s+between\s+(\w+(?:\s+\w+)*)\s+and\s+(\w+(?:\s+\w+)*)\s+is\s+(?:called\s+)?([A-Za-z0-9\s]+)/gi,
      type: 'naming'
    },
    {
      regex: /(?:the\s+)?(road|path|trail|highway|route)\s+from\s+(\w+(?:\s+\w+)*)\s+to\s+(\w+(?:\s+\w+)*)\s+is\s+(?:called\s+)?([A-Za-z0-9\s]+)/gi,
      type: 'naming'
    },
    {
      regex: /(?:the\s+)?(road|path|trail|highway|route)\s+connecting\s+(\w+(?:\s+\w+)*)\s+(?:and|with)\s+(\w+(?:\s+\w+)*)\s+is\s+(?:called\s+)?([A-Za-z0-9\s]+)/gi,
      type: 'naming'
    }
  ];

  // Define patterns for waterways
  const waterwayPatterns = [
    {
      regex: /(?:a\s+)?(river|stream|creek|brook)\s+flows\s+from\s+(\w+(?:\s+\w+)*)\s+to\s+(\w+(?:\s+\w+)*)/gi,
      type: 'waterway'
    },
    {
      regex: /(?:the\s+)?(river|stream|creek|brook)\s+runs\s+from\s+(\w+(?:\s+\w+)*)\s+to\s+(\w+(?:\s+\w+)*)/gi,
      type: 'waterway'
    },
    {
      regex: /(\w+(?:\s+\w+)*)\s+is\s+connected\s+to\s+(\w+(?:\s+\w+)*)\s+by\s+(?:a\s+)?(river|stream|creek|brook)/gi,
      type: 'waterway'
    }
  ];

  // Define patterns for naming waterways
  const waterwayNamingPatterns = [
    {
      regex: /(?:the\s+)?(river|stream|creek|brook)\s+(?:flowing\s+)?(?:from\s+)?(?:between\s+)?(\w+(?:\s+\w+)*)\s+(?:and|to)\s+(\w+(?:\s+\w+)*)\s+is\s+(?:called\s+)?([A-Za-z0-9\s]+)/gi,
      type: 'naming'
    },
    {
      regex: /(?:the\s+)?(river|stream|creek|brook)\s+connecting\s+(\w+(?:\s+\w+)*)\s+(?:and|with)\s+(\w+(?:\s+\w+)*)\s+is\s+(?:called\s+)?([A-Za-z0-9\s]+)/gi,
      type: 'naming'
    }
  ];

  // Define patterns for renaming existing locations
  const locationNamingPatterns = [
    {
      regex: /(?:the\s+)?(\w+(?:\s+\w+)*)\s+is\s+(?:called|named)\s+([A-Za-z0-9\s]+)/gi,
      type: 'renaming'
    },
    {
      regex: /(\w+(?:\s+\w+)*)\s+is\s+(?:called|named)\s+([A-Za-z0-9\s]+)/gi,
      type: 'renaming'
    }
  ];

  // Process location patterns
  locationPatterns.forEach(patternObj => {
    const matches = findMatches(patternObj.regex, text);
    
    matches.forEach(match => {
      if (patternObj.type === 'between') {
        const location = cleanLocationName(match[1]);
        const reference1 = cleanLocationName(match[2]);
        const reference2 = cleanLocationName(match[3]);
        
        if (location && reference1 && reference2) {
          relationships.push({
            type: 'between',
            location,
            reference1,
            reference2
          });
        }
      } else if (patternObj.type === 'directional') {
        const location = cleanLocationName(match[1]);
        const reference = cleanLocationName(match[4]);
        
        if (location && reference) {
          relationships.push({
            type: 'directional',
            location,
            direction: match[3].toLowerCase(),
            distance: match[2] ? parseInt(match[2]) : 1,
            reference
          });
        }
      } else if (patternObj.type === 'nearby') {
        const location = cleanLocationName(match[1]);
        const reference = cleanLocationName(match[2]);
        
        if (location && reference) {
          relationships.push({
            type: 'nearby',
            location,
            reference
          });
        }
      }
    });
  });

  // Process path patterns
  pathPatterns.forEach(patternObj => {
    const matches = findMatches(patternObj.regex, text);
    
    matches.forEach(match => {
      const location1 = cleanLocationName(match[1]);
      const location2 = cleanLocationName(match[2]);
      
      if (location1 && location2) {
        pathRelationships.push({
          type: 'path',
          from: location1,
          to: location2,
          pathType: 'road'
        });
      }
    });
  });

  // Process path naming patterns
  pathNamingPatterns.forEach(patternObj => {
    const matches = findMatches(patternObj.regex, text);
    
    matches.forEach(match => {
      const pathType = match[1].toLowerCase();
      const location1 = cleanLocationName(match[2]);
      const location2 = cleanLocationName(match[3]);
      const pathName = match[4].trim();
      
      if (location1 && location2 && pathName) {
        pathRelationships.push({
          type: 'naming',
          from: location1,
          to: location2,
          pathType: pathType,
          name: pathName
        });
      }
    });
  });

  // Process waterway patterns
  waterwayPatterns.forEach(patternObj => {
    const matches = findMatches(patternObj.regex, text);
    
    matches.forEach(match => {
      if (patternObj.regex.source.includes('connected')) {
        const location1 = cleanLocationName(match[1]);
        const location2 = cleanLocationName(match[2]);
        const waterwayType = match[3].toLowerCase();
        
        if (location1 && location2) {
          waterwayRelationships.push({
            type: 'waterway',
            from: location1,
            to: location2,
            waterwayType: waterwayType
          });
        }
      } else {
        const waterwayType = match[1].toLowerCase();
        const location1 = cleanLocationName(match[2]);
        const location2 = cleanLocationName(match[3]);
        
        if (location1 && location2) {
          waterwayRelationships.push({
            type: 'waterway',
            from: location1,
            to: location2,
            waterwayType: waterwayType
          });
        }
      }
    });
  });

  // Process waterway naming patterns
  waterwayNamingPatterns.forEach(patternObj => {
    const matches = findMatches(patternObj.regex, text);
    
    matches.forEach(match => {
      const waterwayType = match[1].toLowerCase();
      const location1 = cleanLocationName(match[2]);
      const location2 = cleanLocationName(match[3]);
      const waterwayName = match[4].trim();
      
      if (location1 && location2 && waterwayName) {
        waterwayRelationships.push({
          type: 'naming',
          from: location1,
          to: location2,
          waterwayType: waterwayType,
          name: waterwayName
        });
      }
    });
  });

  // Process location naming patterns
  const locationRenamings = [];
  locationNamingPatterns.forEach(patternObj => {
    const matches = findMatches(patternObj.regex, text);
    
    matches.forEach(match => {
      const oldName = match[1].trim().replace(/^(the\s+|a\s+|an\s+)/i, '');
      const newName = match[2].trim();
      
      if (oldName.length >= 1 && newName.length >= 1) {
        locationRenamings.push({
          type: 'renaming',
          oldName: oldName,
          newName: newName
        });
      }
    });
  });

  return { relationships, pathRelationships, waterwayRelationships, locationRenamings };
};
