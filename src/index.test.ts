import { describe, it, expect } from 'vitest'
import { urlJoin } from './index'

describe('urlJoin', () => {
  it('should join basic URL segments', () => {
    expect(urlJoin('api', 'v1', 'users')).toBe('api/v1/users')
    expect(urlJoin('https://api.example.com', 'v1', 'users')).toBe('https://api.example.com/v1/users')
  })

  it('should filter out null and undefined values', () => {
    expect(urlJoin('api', null, 'users', undefined, 'profile')).toBe('api/users/profile')
    expect(urlJoin(null, 'api', undefined, 'users')).toBe('api/users')
    expect(urlJoin(null, undefined)).toBe('')
  })

  it('should filter out empty strings', () => {
    expect(urlJoin('api', '', 'users')).toBe('api/users')
    expect(urlJoin('', 'api', 'users', '')).toBe('api/users')
  })

  it('should handle numbers', () => {
    expect(urlJoin('api', 'users', 123)).toBe('api/users/123')
    expect(urlJoin('api', 'v', 1, 'users')).toBe('api/v/1/users')
  })

  it('should handle leading and trailing slashes', () => {
    expect(urlJoin('/api/', '/users/', '/profile/')).toBe('/api/users/profile')
    expect(urlJoin('api/', 'users/', 'profile')).toBe('api/users/profile')
    expect(urlJoin('/api', 'users', 'profile')).toBe('/api/users/profile')
  })

  it('should preserve protocol', () => {
    expect(urlJoin('https://example.com', 'api', 'v1')).toBe('https://example.com/api/v1')
    expect(urlJoin('http://localhost:3000', 'api')).toBe('http://localhost:3000/api')
    expect(urlJoin('ftp://files.example.com', 'folder', 'file.txt')).toBe('ftp://files.example.com/folder/file.txt')
  })

  it('should handle trailing slash option', () => {
    expect(urlJoin('api', 'users', { trailingSlash: true })).toBe('api/users/')
    expect(urlJoin('api', 'users/', { trailingSlash: true })).toBe('api/users/')
    expect(urlJoin('api', 'users/', { trailingSlash: false })).toBe('api/users')
  })

  it('should normalize multiple slashes', () => {
    expect(urlJoin('api//users///profile')).toBe('api/users/profile')
    expect(urlJoin('https://example.com//api///v1')).toBe('https://example.com/api/v1')
  })

  it('should handle normalize option', () => {
    expect(urlJoin('api//users', { normalize: false })).toBe('api//users')
    expect(urlJoin('api//users', { normalize: true })).toBe('api/users')
  })

  it('should handle complex scenarios', () => {
    expect(urlJoin(
      'https://api.example.com/',
      '/v1/',
      null,
      'users/',
      123,
      undefined,
      '/profile',
      { trailingSlash: true }
    )).toBe('https://api.example.com/v1/users/123/profile/')
  })

  it('should handle edge cases', () => {
    expect(urlJoin()).toBe('')
    expect(urlJoin('')).toBe('')
    expect(urlJoin('/')).toBe('/')
    expect(urlJoin('/', { trailingSlash: false })).toBe('')
  })

  it('should handle query parameters and fragments', () => {
    expect(urlJoin('api', 'users?page=1')).toBe('api/users?page=1')
    expect(urlJoin('api', 'users#section')).toBe('api/users#section')
    expect(urlJoin('https://example.com', 'api', 'users?id=123&sort=name')).toBe('https://example.com/api/users?id=123&sort=name')
  })

  it('should work with default export', async () => {
    const { default: defaultUrlJoin } = await import('./index')
    expect(defaultUrlJoin('api', 'users')).toBe('api/users')
  })
})