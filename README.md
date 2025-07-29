# @anys/url-join

A TypeScript utility for joining URL segments with automatic filtering of null/undefined values.

## Features

- 🚀 **TypeScript First**: Written in TypeScript with full type support
- 🧹 **Auto Filtering**: Automatically filters out `null`, `undefined`, and empty string values
- 🔧 **Flexible**: Supports strings, numbers, and mixed types
- ⚙️ **Configurable**: Options for trailing slashes and normalization
- 🛡️ **Protocol Safe**: Preserves URL protocols (http://, https://, etc.)
- 📦 **Zero Dependencies**: No external dependencies
- 🌳 **Tree Shakable**: ESM and CJS builds with tree shaking support

## Installation

```bash
# Using pnpm
pnpm add @anys/url-join

# Using npm
npm install @anys/url-join

# Using yarn
yarn add @anys/url-join
```

## Usage

### Basic Usage

```typescript
import { urlJoin } from '@anys/url-join'

// Basic joining
urlJoin('api', 'v1', 'users')
// => 'api/v1/users'

// With protocol
urlJoin('https://api.example.com', 'v1', 'users')
// => 'https://api.example.com/v1/users'

// Auto filtering null/undefined
urlJoin('api', null, 'users', undefined, 'profile')
// => 'api/users/profile'

// With numbers
urlJoin('api', 'users', 123)
// => 'api/users/123'
```

### Advanced Usage

```typescript
// With options
urlJoin('api', 'users', { trailingSlash: true })
// => 'api/users/'

// Disable normalization
urlJoin('api//users', { normalize: false })
// => 'api//users'

// Complex example
urlJoin(
  'https://api.example.com/',
  '/v1/',
  null,
  'users/',
  123,
  undefined,
  '/profile',
  { trailingSlash: true }
)
// => 'https://api.example.com/v1/users/123/profile/'
```

### Default Export

```typescript
import urlJoin from '@anys/url-join'

urlJoin('api', 'users')
// => 'api/users'
```

## API

### `urlJoin(...segments, options?)`

Joins URL segments together, filtering out null/undefined values.

#### Parameters

- `segments`: `UrlSegment[]` - URL segments to join (string, number, null, or undefined)
- `options`: `UrlJoinOptions` - Optional configuration

#### Options

```typescript
interface UrlJoinOptions {
  /** Whether to add a trailing slash to the result */
  trailingSlash?: boolean
  /** Whether to normalize multiple slashes to single slash (default: true) */
  normalize?: boolean
}
```

#### Returns

`string` - The joined URL

## Examples

### API Endpoints

```typescript
const baseUrl = 'https://api.example.com'
const version = 'v1'
const userId = 123

const endpoint = urlJoin(baseUrl, version, 'users', userId, 'profile')
// => 'https://api.example.com/v1/users/123/profile'
```

### Conditional Segments

```typescript
const buildUrl = (base: string, path: string, id?: number) => {
  return urlJoin(base, path, id) // id will be filtered if undefined
}

buildUrl('api', 'users') // => 'api/users'
buildUrl('api', 'users', 123) // => 'api/users/123'
```

### File Paths

```typescript
const filePath = urlJoin('assets', 'images', 'avatar.png')
// => 'assets/images/avatar.png'

const absolutePath = urlJoin('/var', 'www', 'html', 'index.html')
// => '/var/www/html/index.html'
```

## Comparison with Other Libraries

| Feature | @anys/url-join | url-join | proper-url-join |
|---------|----------------|----------|------------------|
| TypeScript | ✅ | ❌ | ❌ |
| Auto filter null/undefined | ✅ | ❌ | ✅ |
| Protocol preservation | ✅ | ✅ | ✅ |
| Configurable options | ✅ | ❌ | ✅ |
| Zero dependencies | ✅ | ✅ | ✅ |
| Tree shakable | ✅ | ❌ | ✅ |

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Build
pnpm build

# Lint
pnpm lint

# Type check
pnpm type-check
```

## License

MIT © [anys](https://github.com/anys)