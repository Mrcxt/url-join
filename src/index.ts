/**
 * URL segment type that can be joined
 */
export type UrlSegment = string | number | null | undefined

/**
 * Options for URL joining
 */
export interface UrlJoinOptions {
  /** Whether to add a trailing slash to the result */
  trailingSlash?: boolean
  /** Whether to normalize multiple slashes to single slash */
  normalize?: boolean
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
  
  // Join segments with '/'
  let result = validSegments.join('/')
  
  // Handle protocol preservation and leading slash
  const firstSegment = String(segments.find(isValidSegment) || '')
  if (firstSegment.includes('://')) {
    // Find the protocol part
    const protocolMatch = firstSegment.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//)
    if (protocolMatch) {
      const protocol = protocolMatch[0]
      const restOfFirst = firstSegment.slice(protocol.length)
      const normalizedFirst = normalizeSegment(restOfFirst)
      result = protocol + [normalizedFirst, ...validSegments.slice(1)].join('/')
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
  
  return result
}

/**
 * Default export for convenience
 */
export default urlJoin