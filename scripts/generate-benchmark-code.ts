import fs from 'fs';
import path from 'path';

const BENCHMARK_DIR = path.join(process.cwd(), 'components', 'benchmark');
const GENERATED_DIR = path.join(BENCHMARK_DIR, 'generated');
const NUM_FILES = 150; // Generate 150 files (reduced from 400 for buildability)
const LINES_PER_FILE = 3000; // ~3000 lines per file

// List of all large dependencies we'll import
const LARGE_DEPS = [
  'lodash',
  'ramda',
  'underscore',
  'rxjs',
  'date-fns',
  'moment',
  'dayjs',
  'luxon',
  'mathjs',
  'd3',
  'three',
  'chart.js',
  'echarts',
  'immutable',
  'axios',
  'gsap',
  'animejs',
];

function generateTypeScriptInterfaces(count: number): string {
  let code = '';
  for (let i = 0; i < count; i++) {
    code += `
export interface DataModel${i} {
  id: string;
  name: string;
  value: number;
  timestamp: Date;
  metadata: Record<string, any>;
  nested: {
    level1: {
      level2: {
        level3: {
          data: string[];
          values: number[];
          mapping: Map<string, any>;
        };
      };
    };
  };
  computedField${i}: string;
  derivedValue${i}: number;
  transformedData${i}: any[];
}
`;
  }
  return code;
}

function generateUtilityFunctions(fileIndex: number): string {
  let code = '';
  
  // Generate functions using various libraries
  for (let i = 0; i < 35; i++) {
    code += `
export function utilityFunction${fileIndex}_${i}(input: any): any {
  const _ = require('lodash');
  const R = require('ramda');
  const moment = require('moment');
  const { map, filter, reduce } = require('rxjs/operators');
  const math = require('mathjs');
  
  const step1 = _.cloneDeep(input);
  const step2 = _.merge(step1, { additional: 'data', index: ${i} });
  const step3 = R.map(x => x * 2, step2.values || []);
  const step4 = moment().add(${i}, 'days').format('YYYY-MM-DD');
  const step5 = math.sqrt(${i + 1});
  
  return {
    ...step2,
    transformed: step3,
    date: step4,
    computed: step5,
    fileIndex: ${fileIndex},
    funcIndex: ${i},
  };
}
`;
  }
  
  return code;
}

function generateReactComponents(fileIndex: number): string {
  let code = '';
  
  for (let i = 0; i < 18; i++) {
    code += `
export const BenchmarkComponent${fileIndex}_${i}: React.FC<{data: any}> = ({ data }) => {
  const [state${i}, setState${i}] = React.useState<any>(null);
  const [loading${i}, setLoading${i}] = React.useState(false);
  const [error${i}, setError${i}] = React.useState<Error | null>(null);
  
  React.useEffect(() => {
    const _ = require('lodash');
    const processed = _.chain(data)
      .map((item: any) => ({ ...item, processed: true }))
      .filter((item: any) => item.value > 0)
      .sortBy('timestamp')
      .value();
    setState${i}(processed);
  }, [data]);
  
  const handleTransform${i} = React.useCallback(() => {
    const result = utilityFunction${fileIndex}_${i}(state${i});
    setState${i}(result);
  }, [state${i}]);
  
  const memoizedValue${i} = React.useMemo(() => {
    if (!state${i}) return null;
    const _ = require('lodash');
    return _.reduce(state${i}, (acc: number, val: any) => acc + (val.value || 0), 0);
  }, [state${i}]);
  
  if (loading${i}) return <div>Loading component ${fileIndex}_${i}...</div>;
  if (error${i}) return <div>Error in component ${fileIndex}_${i}: {error${i}.message}</div>;
  
  return (
    <div className="benchmark-component-${fileIndex}-${i}">
      <h3>Benchmark Component ${fileIndex}_${i}</h3>
      <div>State: {JSON.stringify(state${i})}</div>
      <div>Memoized Value: {memoizedValue${i}}</div>
      <button onClick={handleTransform${i}}>Transform Data</button>
    </div>
  );
};
`;
  }
  
  return code;
}

function generateConstants(fileIndex: number): string {
  let code = '';
  
  code += `
export const LARGE_CONSTANT_ARRAY_${fileIndex} = [
`;
  
  for (let i = 0; i < 100; i++) {
    code += `  { id: ${i}, value: ${Math.random()}, label: "Item ${i}", metadata: { fileIndex: ${fileIndex}, itemIndex: ${i} } },\n`;
  }
  
  code += `];

export const TRANSFORMATION_MAP_${fileIndex} = new Map([
`;
  
  for (let i = 0; i < 50; i++) {
    code += `  ['key${i}', { transform: (x: any) => x * ${i}, validate: (x: any) => typeof x === 'number' }],\n`;
  }
  
  code += `]);

export const VALIDATION_RULES_${fileIndex} = {
`;
  
  for (let i = 0; i < 40; i++) {
    code += `  rule${i}: {
    required: true,
    min: ${i},
    max: ${i * 100},
    pattern: /^[a-zA-Z0-9]{${i},}$/,
    validator: (value: any) => {
      const _ = require('lodash');
      return _.isString(value) && value.length >= ${i};
    },
  },\n`;
  }
  
  code += `};
`;
  
  return code;
}

function generateStateMachines(fileIndex: number): string {
  let code = '';
  
  for (let i = 0; i < 8; i++) {
    code += `
export class StateMachine${fileIndex}_${i} {
  private state: string = 'initial';
  private data: Map<string, any> = new Map();
  private history: any[] = [];
  
  constructor() {
    const _ = require('lodash');
    this.data.set('initialized', _.now());
    this.data.set('fileIndex', ${fileIndex});
    this.data.set('machineIndex', ${i});
  }
  
  public transition(action: string, payload?: any): void {
    const _ = require('lodash');
    const moment = require('moment');
    
    this.history.push({
      from: this.state,
      action,
      payload: _.cloneDeep(payload),
      timestamp: moment().toISOString(),
    });
    
    switch (this.state) {
      case 'initial':
        if (action === 'START') this.state = 'processing';
        break;
      case 'processing':
        if (action === 'COMPLETE') this.state = 'completed';
        if (action === 'ERROR') this.state = 'error';
        break;
      case 'completed':
        if (action === 'RESET') this.state = 'initial';
        break;
      case 'error':
        if (action === 'RETRY') this.state = 'processing';
        if (action === 'RESET') this.state = 'initial';
        break;
    }
    
    this.data.set('lastTransition', action);
    this.data.set('currentState', this.state);
  }
  
  public getState(): string {
    return this.state;
  }
  
  public getData(): Map<string, any> {
    return this.data;
  }
  
  public getHistory(): any[] {
    const _ = require('lodash');
    return _.cloneDeep(this.history);
  }
}
`;
  }
  
  return code;
}

function generateDataTransformers(fileIndex: number): string {
  let code = '';
  
  for (let i = 0; i < 15; i++) {
    code += `
export class DataTransformer${fileIndex}_${i} {
  private transformations: any[] = [];
  
  constructor() {
    const _ = require('lodash');
    const R = require('ramda');
    
    this.transformations = [
      { name: 'normalize', fn: (data: any) => _.map(data, item => _.mapValues(item, val => typeof val === 'number' ? val / 100 : val)) },
      { name: 'filter', fn: (data: any) => _.filter(data, item => item.value > ${i}) },
      { name: 'sort', fn: (data: any) => _.sortBy(data, 'timestamp') },
      { name: 'group', fn: (data: any) => _.groupBy(data, 'category') },
      { name: 'map', fn: (data: any) => R.map((item: any) => ({ ...item, transformed: true }), data) },
    ];
  }
  
  public transform(data: any): any {
    const _ = require('lodash');
    let result = _.cloneDeep(data);
    
    for (const transformation of this.transformations) {
      result = transformation.fn(result);
    }
    
    return result;
  }
  
  public addTransformation(name: string, fn: (data: any) => any): void {
    this.transformations.push({ name, fn });
  }
}
`;
  }
  
  return code;
}

function generateFileContent(fileIndex: number): string {
  const content = `// Auto-generated benchmark file ${fileIndex}
// This file is generated for sourcemap benchmarking purposes
import React from 'react';

${generateTypeScriptInterfaces(50)}

${generateConstants(fileIndex)}

${generateUtilityFunctions(fileIndex)}

${generateStateMachines(fileIndex)}

${generateDataTransformers(fileIndex)}

${generateReactComponents(fileIndex)}

// Export all for tree-shaking prevention
export const BENCHMARK_FILE_${fileIndex}_METADATA = {
  fileIndex: ${fileIndex},
  generatedAt: new Date().toISOString(),
  version: '1.0.0',
  components: ${18},
  utilities: ${35},
  stateMachines: ${8},
  transformers: ${15},
};
`;
  
  return content;
}

function generateIndexFiles(): void {
  // Create main index file
  let mainIndexContent = `// Auto-generated main benchmark index
// This file imports all benchmark components

`;
  
  // Generate 10 intermediate index files
  const filesPerIndex = Math.ceil(NUM_FILES / 10);
  
  for (let batch = 0; batch < 10; batch++) {
    let batchIndexContent = `// Benchmark batch ${batch} index\n\n`;
    const startFile = batch * filesPerIndex;
    const endFile = Math.min((batch + 1) * filesPerIndex, NUM_FILES);
    
    for (let i = startFile; i < endFile; i++) {
      batchIndexContent += `export * from './generated/benchmark-${i}';\n`;
    }
    
    const batchPath = path.join(BENCHMARK_DIR, `batch-${batch}.ts`);
    fs.writeFileSync(batchPath, batchIndexContent, 'utf8');
    console.log(`Generated batch index: batch-${batch}.ts`);
    
    mainIndexContent += `export * from './batch-${batch}';\n`;
  }
  
  // Add summary export
  mainIndexContent += `\n// Summary\nexport const BENCHMARK_SUMMARY = {\n  totalFiles: ${NUM_FILES},\n  batches: 10,\n  generatedAt: '${new Date().toISOString()}',\n};\n`;
  
  const mainIndexPath = path.join(BENCHMARK_DIR, 'index.ts');
  fs.writeFileSync(mainIndexPath, mainIndexContent, 'utf8');
  console.log('Generated main index.ts');
}

async function main() {
  console.log('🚀 Starting benchmark code generation...');
  console.log(`📁 Target directory: ${BENCHMARK_DIR}`);
  console.log(`📊 Generating ${NUM_FILES} files with ~${LINES_PER_FILE} lines each`);
  
  // Create directories
  if (!fs.existsSync(BENCHMARK_DIR)) {
    fs.mkdirSync(BENCHMARK_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }
  
  // Generate files
  for (let i = 0; i < NUM_FILES; i++) {
    const fileName = `benchmark-${i}.tsx`;
    const filePath = path.join(GENERATED_DIR, fileName);
    const content = generateFileContent(i);
    
    fs.writeFileSync(filePath, content, 'utf8');
    
    if ((i + 1) % 50 === 0) {
      console.log(`✅ Generated ${i + 1}/${NUM_FILES} files...`);
    }
  }
  
  console.log(`✅ Generated all ${NUM_FILES} benchmark files`);
  
  // Generate index files
  console.log('📝 Generating index files...');
  generateIndexFiles();
  
  console.log('✨ Benchmark code generation complete!');
  console.log(`📦 Total generated files: ${NUM_FILES + 11} (${NUM_FILES} components + 10 batch indices + 1 main index)`);
}

main().catch(console.error);

