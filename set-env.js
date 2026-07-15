const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { resolve, dirname } = require('path');
const YAML = require('yaml');

const DEFAULT_CONFIG_PATH = 'config/environment.yaml';
const DEFAULT_CLOUD_BUILD_PATH = 'deploy/google/cloudbuild.yaml';
const DEFAULT_CLOUD_BUILD_STEP_ID = 'Install dependencies and build';
const DEFAULT_CLOUD_BUILD_ENV_PROPERTY = 'env';
const SUPPORTED_CLOUD_BUILD_MODES = new Set(['replace', 'docker-build-args']);
const DEFAULT_DOCKERFILE_PATH = 'Dockerfile';
const DEFAULT_DOCKERFILE_MARKERS = {
  args: {
    start: '# set-env:args:start',
    end: '# set-env:args:end',
  },
  env: {
    start: '# set-env:env:start',
    end: '# set-env:env:end',
  },
};

function parseArgs(argv) {
  const result = {};

  argv.forEach((arg, index) => {
    if (arg.startsWith('--')) {
      const [key, inlineValue] = arg.split('=');
      const nextValue =
        argv[index + 1] && !argv[index + 1].startsWith('--')
          ? argv[index + 1]
          : true;

      result[key] = inlineValue !== undefined ? inlineValue : nextValue;
    }
  });

  return result;
}

function getBooleanFlag(args, key, defaultValue = false) {
  if (!(key in args)) return defaultValue;
  const raw = args[key];

  if (typeof raw === 'boolean') return raw;

  if (typeof raw === 'string') {
    const normalised = raw.trim().toLowerCase();
    if (['true', '1', 'yes'].includes(normalised)) return true;
    if (['false', '0', 'no'].includes(normalised)) return false;
  }

  return true;
}

function loadConfiguration(configPath) {
  const absolutePath = resolve(process.cwd(), configPath);
  let fileContents;

  try {
    fileContents = readFileSync(absolutePath, 'utf8');
  } catch (error) {
    throw new Error(
      `Failed to read configuration file "${configPath}": ${error.message}`
    );
  }

  let parsed;
  try {
    parsed = YAML.parse(fileContents);
  } catch (error) {
    throw new Error(`Invalid YAML in "${configPath}": ${error.message}`);
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Environment configuration must be an object.');
  }

  const environments = parsed.environments || {};
  const cloudBuildConfig = parsed.cloudBuild || {};
  const variables = Array.isArray(parsed.variables) ? parsed.variables : null;

  if (!variables) {
    throw new Error(
      'Environment configuration must include a "variables" array.'
    );
  }

  const normalisedVariables = variables.map((entry, index) =>
    normaliseVariable(entry, index)
  );

  detectDuplicateTsKeys(normalisedVariables);

  const cloudBuildMode = cloudBuildConfig.mode
    ? String(cloudBuildConfig.mode).trim().toLowerCase()
    : 'replace';

  if (!SUPPORTED_CLOUD_BUILD_MODES.has(cloudBuildMode)) {
    const supported = Array.from(SUPPORTED_CLOUD_BUILD_MODES)
      .map((mode) => `"${mode}"`)
      .join(', ');
    throw new Error(
      `Unsupported cloudBuild.mode "${cloudBuildConfig.mode}". Supported values: ${supported}.`
    );
  }

  const dockerfile = normaliseDockerfileConfig(
    parsed.dockerfile || parsed.docker || {}
  );

  return {
    environments,
    variables: normalisedVariables,
    cloudBuild: {
      path: cloudBuildConfig.path || DEFAULT_CLOUD_BUILD_PATH,
      stepId: cloudBuildConfig.stepId || DEFAULT_CLOUD_BUILD_STEP_ID,
      envProperty:
        cloudBuildConfig.envProperty || DEFAULT_CLOUD_BUILD_ENV_PROPERTY,
      staticEnv: Array.isArray(cloudBuildConfig.staticEnv)
        ? cloudBuildConfig.staticEnv
        : [],
      mode: cloudBuildMode,
    },
    dockerfile,
  };
}

function normaliseVariable(entry, index) {
  if (!entry || typeof entry !== 'object') {
    throw new Error(`Variable entry at index ${index} is not an object.`);
  }

  const id = String(entry.id || '').trim();
  const ts = String(entry.ts || '').trim();

  if (!id) {
    throw new Error(`Variable entry at index ${index} is missing "id".`);
  }

  if (!ts) {
    throw new Error(
      `Variable "${id}" is missing the "ts" property (target key in environment file).`
    );
  }

  const type = (entry.type || 'string').toString().toLowerCase();
  if (!['string', 'boolean', 'number'].includes(type)) {
    throw new Error(
      `Variable "${id}" uses unsupported type "${entry.type}". Use string, boolean, or number.`
    );
  }

  const required =
    entry.required === undefined ? true : Boolean(entry.required);
  const sanitize =
    entry.sanitize === undefined ? true : Boolean(entry.sanitize);

  return {
    id,
    ts,
    type,
    required,
    sanitize,
    cloudbuild: entry.cloudbuild ? String(entry.cloudbuild).trim() : null,
    default: entry.default,
    description: entry.description ? String(entry.description) : null,
  };
}

function detectDuplicateTsKeys(variables) {
  const seen = new Map();
  variables.forEach((variable) => {
    if (seen.has(variable.ts)) {
      throw new Error(
        `Duplicate "ts" key detected in variables: "${variable.ts}".`
      );
    }
    seen.set(variable.ts, true);
  });
}

function normaliseDockerfileConfig(entry) {
  const config = entry && typeof entry === 'object' ? entry : {};

  const rawPath = Object.prototype.hasOwnProperty.call(config, 'path')
    ? config.path
    : DEFAULT_DOCKERFILE_PATH;
  const path =
    rawPath === null || rawPath === false
      ? null
      : String(rawPath || '').trim() || DEFAULT_DOCKERFILE_PATH;

  const markersInput =
    config.markers && typeof config.markers === 'object'
      ? config.markers
      : {};

  const argsMarkersInput =
    markersInput.args && typeof markersInput.args === 'object'
      ? markersInput.args
      : {};
  const envMarkersInput =
    markersInput.env && typeof markersInput.env === 'object'
      ? markersInput.env
      : {};

  const markers = {
    args: {
      start:
        argsMarkersInput.start && String(argsMarkersInput.start).trim()
          ? String(argsMarkersInput.start).trim()
          : DEFAULT_DOCKERFILE_MARKERS.args.start,
      end:
        argsMarkersInput.end && String(argsMarkersInput.end).trim()
          ? String(argsMarkersInput.end).trim()
          : DEFAULT_DOCKERFILE_MARKERS.args.end,
    },
    env: {
      start:
        envMarkersInput.start && String(envMarkersInput.start).trim()
          ? String(envMarkersInput.start).trim()
          : DEFAULT_DOCKERFILE_MARKERS.env.start,
      end:
        envMarkersInput.end && String(envMarkersInput.end).trim()
          ? String(envMarkersInput.end).trim()
          : DEFAULT_DOCKERFILE_MARKERS.env.end,
    },
  };

  return {
    path,
    markers,
    staticArgs: toStringArray(config.staticArgs),
    staticEnv: toStringArray(config.staticEnv),
  };
}

function selectEnvironmentConfig(config, environmentName) {
  const envConfig = config.environments[environmentName];

  if (!envConfig) {
    const available = Object.keys(config.environments).join(', ') || '(none)';
    throw new Error(
      `Unknown environment "${environmentName}". Available environments: ${available}.`
    );
  }

  const target = envConfig.target ? String(envConfig.target).trim() : null;

  if (!target) {
    throw new Error(
      `Environment "${environmentName}" configuration must define "target".`
    );
  }

  const dotenvDirective = envConfig.dotenv;
  let useDotenv = false;
  let dotenvPath = null;

  if (typeof dotenvDirective === 'string' && dotenvDirective.trim() !== '') {
    useDotenv = true;
    dotenvPath = dotenvDirective.trim();
  } else if (dotenvDirective === true) {
    useDotenv = true;
    dotenvPath = '.env';
  } else {
    useDotenv = false;
    dotenvPath = null;
  }

  return { target, useDotenv, dotenvPath };
}

function loadDotenvIfNeeded(config) {
  if (!config.useDotenv || !config.dotenvPath) {
    return;
  }

  const dotenv = require('dotenv');
  const absolutePath = resolve(process.cwd(), config.dotenvPath);

  const result = dotenv.config({ path: absolutePath });
  if (result.error) {
    throw new Error(
      `Failed to load environment file "${config.dotenvPath}": ${result.error.message}`
    );
  }
}

function resolveVariableValues(variables) {
  const tsValues = {};

  variables.forEach((variable) => {
    const raw = getRawVariableValue(variable);
    const typed = convertToType(variable, raw);
    tsValues[variable.ts] = typed;
  });

  return tsValues;
}

function getRawVariableValue(variable) {
  const raw = process.env[variable.id];

  if (raw !== undefined && raw !== null && raw !== '') {
    return raw;
  }

  if (variable.default !== undefined) {
    return variable.default;
  }

  if (variable.required) {
    throw new Error(`Required environment variable "${variable.id}" is not set.`);
  }

  return undefined;
}

function convertToType(variable, value) {
  if (value === undefined) {
    return null;
  }

  switch (variable.type) {
    case 'boolean':
      return toBoolean(variable, value);
    case 'number':
      return toNumber(variable, value);
    case 'string':
      return toString(variable, value);
    default:
      throw new Error(
        `Unsupported type "${variable.type}" for variable "${variable.id}".`
      );
  }
}

function toBoolean(variable, value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalised = value.trim().toLowerCase();
    if (['true', '1', 'yes'].includes(normalised)) return true;
    if (['false', '0', 'no'].includes(normalised)) return false;
  }

  throw new Error(
    `Invalid boolean value for "${variable.id}": ${JSON.stringify(value)}`
  );
}

function toNumber(variable, value) {
  if (typeof value === 'number') {
    if (Number.isFinite(value)) return value;
    throw new Error(`Number value for "${variable.id}" is not finite.`);
  }

  const asNumber = Number(String(value).trim());

  if (Number.isNaN(asNumber)) {
    throw new Error(
      `Invalid number value for "${variable.id}": ${JSON.stringify(value)}`
    );
  }

  return asNumber;
}

function toString(variable, value) {
  const asString = typeof value === 'string' ? value : String(value);

  if (variable.sanitize !== false) {
    if (/[\r\n]/.test(asString)) {
      throw new Error(
        `String value for "${variable.id}" contains newline characters which are not allowed.`
      );
    }
  }

  return asString;
}

function generateEnvironmentFileContent(variables, tsValues) {
  const lines = variables.map((variable) => {
    const value = tsValues[variable.ts];
    return `  ${variable.ts}: ${formatTsValue(variable.type, value)},`;
  });

  return `export const environment = {\n${lines.join('\n')}\n};\n`;
}

function formatTsValue(type, value) {
  if (value === null || value === undefined) {
    return 'null';
  }

  switch (type) {
    case 'boolean':
      return value ? 'true' : 'false';
    case 'number':
      return Number.isFinite(value) ? String(value) : 'null';
    case 'string':
      return `'${escapeForSingleQuotes(value)}'`;
    default:
      return JSON.stringify(value);
  }
}

function escapeForSingleQuotes(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function writeEnvironmentFile(target, content) {
  const absoluteTarget = resolve(process.cwd(), target);
  mkdirSync(dirname(absoluteTarget), { recursive: true });
  writeFileSync(absoluteTarget, content);
  return absoluteTarget;
}

function syncCloudBuildEnvironment(config, variables) {
  if (!config || !config.path) {
    return [];
  }

  const absolutePath = resolve(process.cwd(), config.path);
  let parsed;

  try {
    const yamlContent = readFileSync(absolutePath, 'utf8');
    parsed = YAML.parse(yamlContent);
  } catch (error) {
    throw new Error(
      `Failed to read Cloud Build file "${config.path}": ${error.message}`
    );
  }

  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.steps)) {
    throw new Error(
      `Cloud Build file "${config.path}" does not contain a "steps" array.`
    );
  }

  const targetStep = parsed.steps.find(
    (step) => step && step.id === config.stepId
  );

  if (!targetStep) {
    throw new Error(
      `Could not find step "${config.stepId}" in Cloud Build file "${config.path}".`
    );
  }

  const managedVariables = variables.filter((variable) =>
    Boolean(variable.cloudbuild)
  );

  const renderedEntries = managedVariables.map((variable) => ({
    key: variable.id,
    value: `${variable.id}=${buildSubstitutionExpression(
      variable.cloudbuild
    )}`,
  }));

  if (config.mode === 'docker-build-args') {
    const existingArgs = Array.isArray(targetStep[config.envProperty])
      ? targetStep[config.envProperty]
      : [];
    targetStep[config.envProperty] = orchestrateDockerBuildArgs(
      existingArgs,
      renderedEntries,
      config.staticEnv
    );
  } else {
    targetStep[config.envProperty] = [
      ...config.staticEnv,
      ...renderedEntries.map((entry) => entry.value),
    ];
  }

  const updated = YAML.stringify(parsed, { lineWidth: 0 });
  writeFileSync(absolutePath, `${updated.trimEnd()}\n`);

  return renderedEntries.map((entry) => entry.value);
}

function syncDockerfileEnvironment(config, variables) {
  if (!config || !config.path) {
    return { args: [], env: [] };
  }

  const absolutePath = resolve(process.cwd(), config.path);
  let fileContents;

  try {
    fileContents = readFileSync(absolutePath, 'utf8');
  } catch (error) {
    throw new Error(
      `Failed to read Dockerfile "${config.path}": ${error.message}`
    );
  }

  const managedVariables = variables.filter((variable) =>
    Boolean(variable.cloudbuild)
  );

  const argsEntries = buildDockerfileArgEntries(config, managedVariables);
  const envEntries = buildDockerfileEnvEntries(config, managedVariables);

  let updatedContents = replaceLinesBetweenMarkers(
    fileContents,
    config.markers.args.start,
    config.markers.args.end,
    argsEntries
  );

  updatedContents = replaceLinesBetweenMarkers(
    updatedContents,
    config.markers.env.start,
    config.markers.env.end,
    envEntries
  );

  if (updatedContents !== fileContents) {
    writeFileSync(absolutePath, updatedContents);
  }

  return { args: argsEntries, env: envEntries };
}

function buildDockerfileArgEntries(config, variables) {
  const entries = [
    ...config.staticArgs,
    ...variables.map((variable) => `ARG ${variable.id}=""`),
  ];

  return dedupePreserveOrder(entries);
}

function buildDockerfileEnvEntries(config, variables) {
  const entries = [
    ...config.staticEnv,
    ...variables.map(
      (variable) => `ENV ${variable.id}=${'${' + variable.id + '}'}`
    ),
  ];

  return dedupePreserveOrder(entries);
}

function orchestrateDockerBuildArgs(existingArgs, entries, staticEntries) {
  const result = Array.isArray(existingArgs) ? [...existingArgs] : [];

  if (Array.isArray(staticEntries) && staticEntries.length > 0) {
    staticEntries.forEach((item) => {
      if (!result.includes(item)) {
        const insertionPoint = findDockerArgsInsertionIndex(result);
        result.splice(insertionPoint, 0, item);
      }
    });
  }

  entries.forEach(({ key, value }) => {
    const valueIndex = findDockerBuildArgIndex(result, key);
    if (valueIndex >= 0) {
      result[valueIndex] = value;
      return;
    }

    const insertionPoint = findDockerArgsInsertionIndex(result);
    result.splice(insertionPoint, 0, '--build-arg', value);
  });

  return result;
}

function findDockerBuildArgIndex(args, key) {
  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];
    const next = args[index + 1];
    if (
      current === '--build-arg' &&
      typeof next === 'string' &&
      next.startsWith(`${key}=`)
    ) {
      return index + 1;
    }
  }

  return -1;
}

function findDockerArgsInsertionIndex(args) {
  const reversedIndex = [...args].reverse().indexOf('.');
  if (reversedIndex === -1) {
    return args.length;
  }

  return args.length - reversedIndex - 1;
}

function replaceLinesBetweenMarkers(content, startMarker, endMarker, newLines) {
  const newline = content.includes('\r\n') ? '\r\n' : '\n';
  const lines = content.split(/\r?\n/);

  const startIndex = lines.indexOf(startMarker);
  if (startIndex === -1) {
    throw new Error(
      `Dockerfile marker "${startMarker}" was not found. Ensure the marker line exists.`
    );
  }

  const endIndex = lines.indexOf(endMarker);
  if (endIndex === -1) {
    throw new Error(
      `Dockerfile marker "${endMarker}" was not found. Ensure the marker line exists.`
    );
  }

  if (endIndex <= startIndex) {
    throw new Error(
      `Dockerfile marker order invalid: "${endMarker}" appears before "${startMarker}".`
    );
  }

  const updatedLines = [
    ...lines.slice(0, startIndex + 1),
    ...newLines,
    ...lines.slice(endIndex),
  ];

  let updatedContent = updatedLines.join(newline);
  if (!updatedContent.endsWith('\n')) {
    updatedContent += '\n';
  }

  return updatedContent;
}

function dedupePreserveOrder(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item)) {
      return false;
    }
    seen.add(item);
    return true;
  });
}

function toStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (item === undefined || item === null ? '' : String(item)))
    .map((item) => item.trim())
    .filter((item) => item !== '');
}

function buildSubstitutionExpression(token) {
  const trimmed = String(token).trim();

  if (trimmed.startsWith('${') && trimmed.endsWith('}')) {
    return trimmed;
  }

  if (trimmed.startsWith('$')) {
    return '${' + trimmed.slice(1) + '}';
  }

  return '${' + trimmed + '}';
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  const environment =
    args['--environment'] || args['-e'] || process.env.APP_ENV || 'development';

  const configPath = args['--config'] || DEFAULT_CONFIG_PATH;
  const skipCloudBuild = getBooleanFlag(args, '--skip-cloudbuild', false);
  const cloudBuildOnly = getBooleanFlag(args, '--cloudbuild-only', false);
  const skipDockerfile = getBooleanFlag(args, '--skip-dockerfile', false);

  const configuration = loadConfiguration(configPath);

  if (cloudBuildOnly) {
    const synced = syncCloudBuildEnvironment(
      configuration.cloudBuild,
      configuration.variables
    );
    console.log(
      `[set-env] Synced Cloud Build environment entries (${synced.length}).`
    );
    if (!skipDockerfile) {
      const dockerSynced = syncDockerfileEnvironment(
        configuration.dockerfile,
        configuration.variables
      );
      console.log(
        `[set-env] Synced Dockerfile ARG/ENV entries (args: ${dockerSynced.args.length}, env: ${dockerSynced.env.length}).`
      );
    }
    return;
  }

  const environmentConfig = selectEnvironmentConfig(configuration, environment);

  const overrideEnvFile = args['--env-file'];
  if (overrideEnvFile === true) {
    throw new Error('The flag "--env-file" requires a file path value.');
  }

  if (overrideEnvFile && typeof overrideEnvFile === 'string') {
    environmentConfig.useDotenv = true;
    environmentConfig.dotenvPath = overrideEnvFile;
  }

  loadDotenvIfNeeded(environmentConfig);

  const tsValues = resolveVariableValues(configuration.variables);
  const fileContent = generateEnvironmentFileContent(
    configuration.variables,
    tsValues
  );
  const targetPath = writeEnvironmentFile(environmentConfig.target, fileContent);

  console.log(
    `[set-env] Wrote ${targetPath} for "${environment}" environment.`
  );

  if (!skipCloudBuild) {
    const syncedEntries = syncCloudBuildEnvironment(
      configuration.cloudBuild,
      configuration.variables
    );
    console.log(
      `[set-env] Synced Cloud Build environment entries (${syncedEntries.length}).`
    );
  }

  if (!skipDockerfile) {
    const dockerSynced = syncDockerfileEnvironment(
      configuration.dockerfile,
      configuration.variables
    );
    console.log(
      `[set-env] Synced Dockerfile ARG/ENV entries (args: ${dockerSynced.args.length}, env: ${dockerSynced.env.length}).`
    );
  }
}

try {
  main();
} catch (error) {
  console.error(`[set-env] ${error.message}`);
  process.exit(1);
}
