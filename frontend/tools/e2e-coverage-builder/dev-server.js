const { createBuilder } = require('@angular-devkit/architect');
const path = require('node:path');
const angularBuildRoot = path.dirname(require.resolve('@angular/build/package.json'));
const { normalizeOptions } = require(path.join(angularBuildRoot, 'src/builders/dev-server/options.js'));
const { serveWithVite } = require(path.join(angularBuildRoot, 'src/builders/dev-server/vite-server.js'));
const { checkPort } = require(path.join(angularBuildRoot, 'src/utils/check-port.js'));
const { buildApplicationInternal } = require('@angular/build/private');

const sourceFile = /[/\\]src[/\\].+\.(?:ts|js)$/;
const testFile = /\.(?:spec|cy)\.(?:ts|js)$/;

async function* serveWithCoverage(options, context) {
  const projectName = context.target?.project;
  if (!projectName) {
    context.logger.error('The coverage dev server requires a project target.');
    return;
  }

  const serverOptions = await normalizeOptions(context, projectName, options);
  const builderName = await context.getBuilderNameForTarget(serverOptions.buildTarget);
  serverOptions.port = await checkPort(serverOptions.port, serverOptions.host);

  yield* serveWithVite(
    serverOptions,
    builderName,
    (buildOptions, buildContext, plugins) => buildApplicationInternal(
      {
        ...buildOptions,
        sourceMap: { scripts: true, styles: true, vendor: true },
        instrumentForCoverage: (filename) => sourceFile.test(filename) && !testFile.test(filename)
      },
      buildContext,
      { codePlugins: plugins }
    ),
    context
  );
}

exports.default = createBuilder(serveWithCoverage);
