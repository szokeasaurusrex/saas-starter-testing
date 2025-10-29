# Sourcemap Benchmarking Setup

This project has been configured to generate very large sourcemaps for benchmarking purposes.

## 📊 Current Setup

### Generated Code

- **400 benchmark files** in `components/benchmark/generated/`
- **~2,500 lines per file** (total: ~1.47 million lines)
- **41MB of source code** in benchmark directory
- **10 batch index files** + 1 main index

### Dependencies

- **52 large npm packages** added (3D libraries, UI frameworks, utilities, etc.)
- **1.8GB in node_modules**
- **672 total packages** installed

### Key Libraries Added

- **3D/Graphics**: three, babylonjs, d3, echarts, plotly.js, vis-network
- **UI Libraries**: @mui/material, antd, semantic-ui-react, @chakra-ui/react, @blueprintjs/core
- **Utilities**: lodash, ramda, rxjs, moment, date-fns, mathjs, immutable
- **Editors**: monaco-editor, draft-js, quill, tinymce, codemirror
- **Others**: chart.js, leaflet, framer-motion, gsap, formik, yup

## 🚀 Building for Sourcemaps

To generate the sourcemaps, run a production build:

\`\`\`bash
pnpm build
\`\`\`

This will:

1. Bundle all the benchmark code and dependencies
2. Generate production sourcemaps (enabled via \`productionBrowserSourceMaps: true\`)
3. Create large chunks in \`.next/static/chunks/\`
4. Generate corresponding \`.map\` files

## 📈 Expected Output

After building, you should see:

### Sourcemap Files

Located in \`.next/static/chunks/\`:

- \`vendors.js\` + \`vendors.js.map\` - Large vendor bundle from node_modules
- \`benchmark.js\` + \`benchmark.js.map\` - All generated benchmark code
- Additional app chunks with their sourcemaps

### Estimated Sizes

- **Minified JS bundles**: 100-200MB (estimated)
- **Sourcemap files**: 300-800MB (estimated)
- **Total combined**: 400MB-1GB+ (depending on actual bundling)

The exact size will vary based on:

- Webpack's optimization and tree-shaking
- How much of each library gets bundled
- Source map format and detail level

## 🔧 Configuration

### Next.js Config (`next.config.ts`)

- \`productionBrowserSourceMaps: true\` - Enables sourcemap generation
- Custom webpack config with:
  - Increased chunk size limits (100MB max)
  - Reduced code splitting to create larger bundles
  - Separate cache groups for vendors and benchmark code

### Integration

The benchmark code is loaded via \`BenchmarkLoader\` component in the main page:

- Only loads in production builds
- Uses dynamic imports to ensure bundling
- Doesn't affect development mode

## 📦 File Structure

\`\`\`
components/benchmark/
├── generated/
│ ├── benchmark-0.tsx (2500+ lines)
│ ├── benchmark-1.tsx (2500+ lines)
│ ├── ...
│ └── benchmark-399.tsx (2500+ lines)
├── batch-0.ts (exports benchmarks 0-39)
├── batch-1.ts (exports benchmarks 40-79)
├── ...
├── batch-9.ts (exports benchmarks 360-399)
└── index.ts (main export)
\`\`\`

## 🧪 Regenerating Benchmark Code

To regenerate the benchmark files with different parameters:

1. Edit \`scripts/generate-benchmark-code.ts\`
2. Modify constants:
   - \`NUM_FILES\` - Number of files to generate
   - \`LINES_PER_FILE\` - Target lines per file
3. Run: \`pnpm run generate:benchmark\`

## 🗑️ Cleanup

To remove all benchmark code and dependencies:

\`\`\`bash

# Remove benchmark directory

rm -rf components/benchmark

# Remove benchmark loader

rm components/benchmark-loader.tsx

# Remove dependencies from package.json (revert to original)

# Then run:

pnpm install
\`\`\`

## 💡 Tips for Benchmarking

1. **Build Time**: The first build will take significantly longer due to the large amount of code
2. **Memory Usage**: Webpack may consume significant memory during the build
3. **Sourcemap Format**: Next.js uses \`source-map\` by default - adjust if needed
4. **Incremental Testing**: Start with fewer files if you encounter memory issues

## 📝 Notes

- The benchmark code is valid TypeScript/React but designed for size, not runtime performance
- All code imports actual dependencies to ensure they're included in the bundle
- Tree-shaking is minimized through strategic code patterns
- The code doesn't affect development mode builds
