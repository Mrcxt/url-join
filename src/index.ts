/**
 * URL segment type that can be joined
 */
export type UrlSegment = string | number | null | undefined

/**
 * Query parameter value type
 */
export type QueryValue = string | number | boolean | null | undefined

/**
 * Query parameters object
 */
export type QueryParams = Record<string, QueryValue | QueryValue[]>

/**
 * Options for URL joining
 */
export interface UrlJoinOptions {
  /** Whether to add a trailing slash to the result */
  trailingSlash?: boolean
  /** Whether to normalize multiple slashes to single slash */
  normalize?: boolean
  /** Query parameters to append to the URL */
  query?: QueryParams
}

/**
 * Checks if a value is a valid URL segment
 */
function isValidSegment(segment: UrlSegment): segment is string | number {
  return segment !== null && segment !== undefined && segment !== ''
}

/**
 * Normalizes a URL segment by converting to string and cleaning up
 */
function normalizeSegment(segment: string | number): string {
  let str = String(segment)
  
  // Remove leading and trailing slashes
  str = str.replace(/^\/+|\/+$/g, '')
  
  return str
}

/**
 * Normalizes multiple consecutive slashes to a single slash
 */
function normalizeSlashes(url: string): string {
  // Preserve protocol slashes (http://, https://, ftp://, etc.)
  return url.replace(/([^:])\/\/+/g, '$1/')
}

/**
 * Converts query parameters to URL search string
 */
function stringifyQuery(query: QueryParams): string {
  const params: string[] = []
  
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined) {
      continue
    }
    
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== null && item !== undefined) {
          params.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`)
        }
      }
    } else {
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    }
  }
  
  return params.length > 0 ? `?${params.join('&')}` : ''
}

/**
 * Extracts existing query string from URL
 */
function extractQuery(url: string): { path: string; query: string } {
  const queryIndex = url.indexOf('?')
  if (queryIndex === -1) {
    return { path: url, query: '' }
  }
  
  return {
    path: url.slice(0, queryIndex),
    query: url.slice(queryIndex)
  }
}

/**
 * Joins URL segments together, filtering out null/undefined values
 * 
 * @param segments - URL segments to join
 * @param options - Options for joining
 * @returns Joined URL string
 * 
 * @example
 * ```typescript
 * urlJoin('https://api.example.com', 'v1', 'users', 123)
 * // => 'https://api.example.com/v1/users/123'
 * 
 * urlJoin('api', null, 'users', undefined, 'profile')
 * // => 'api/users/profile'
 * 
 * urlJoin('/api/', '/users/', { trailingSlash: true })
 * // => '/api/users/'
 * 
 * urlJoin('api', 'users', { query: { page: 1, limit: 10 } })
 * // => 'api/users?page=1&limit=10'
 * 
 * urlJoin('api/users?sort=name', { query: { page: 1 } })
 * // => 'api/users?sort=name&page=1'
 * ```
 */
export function urlJoin(...args: UrlSegment[]): string
export function urlJoin(...args: [...UrlSegment[], UrlJoinOptions]): string
export function urlJoin(...args: UrlSegment[] | [...UrlSegment[], UrlJoinOptions]): string {
  // Check if last argument is options
  const lastArg = args[args.length - 1]
  const hasOptions = typeof lastArg === 'object' && lastArg !== null && !Array.isArray(lastArg)
  
  const options: UrlJoinOptions = hasOptions ? lastArg as UrlJoinOptions : {}
  const segments = hasOptions ? args.slice(0, -1) as UrlSegment[] : args as UrlSegment[]
  
  // Handle special case of single '/'
  if (segments.length === 1 && segments[0] === '/') {
    if (options.trailingSlash === false) {
      return ''
    }
    return '/'
  }
  
  // Filter out invalid segments and normalize
  const validSegments = segments
    .filter(isValidSegment)
    .map(normalizeSegment)
    .filter(segment => segment.length > 0)
  
  if (validSegments.length === 0) {
    return ''
  }
  
  // Extract query strings from segments and clean them
  let existingQuery = ''
  const cleanedSegments = validSegments.map((segment) => {
    const { path, query } = extractQuery(segment)
    if (query && !existingQuery) {
      existingQuery = query
    }
    return path
  })
  
  // Join segments with '/'
  let result = cleanedSegments.join('/')
  
  // Handle protocol preservation and leading slash
  const firstSegment = String(segments.find(isValidSegment) || '')
  if (firstSegment.includes('://')) {
    // Find the protocol part
    const protocolMatch = firstSegment.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//)
    if (protocolMatch) {
      const protocol = protocolMatch[0]
      const restOfFirst = firstSegment.slice(protocol.length)
      const { path: cleanPath } = extractQuery(restOfFirst)
      const normalizedFirst = normalizeSegment(cleanPath)
      result = protocol + [normalizedFirst, ...cleanedSegments.slice(1)].join('/')
    }
  } else if (firstSegment.startsWith('/')) {
    result = '/' + result
  }
  
  // Normalize multiple slashes if requested
  if (options.normalize !== false) {
    result = normalizeSlashes(result)
  }
  
  // Handle trailing slash
  if (options.trailingSlash && !result.endsWith('/')) {
    result += '/'
  } else if (options.trailingSlash === false && result.endsWith('/') && result.length > 1) {
    result = result.slice(0, -1)
  }
  
  // Handle query parameters
  let finalQuery = existingQuery
  if (options.query) {
    const newQuery = stringifyQuery(options.query)
    if (newQuery) {
      if (existingQuery) {
        // Merge existing query with new query
        finalQuery = existingQuery + '&' + newQuery.slice(1)
      } else {
        finalQuery = newQuery
      }
    }
  }
  
  return result + finalQuery
}

/**
 * Default export for convenience
 */
export default urlJoin