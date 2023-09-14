import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'task-components',
  globalStyle: 'src/global/global.css',
  buildEs5: 'prod',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      copy: [
        {
          src: 'src/assets/*.woff2',
          dest: 'dist/assets',
          warn: true
        }
      ]
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        {
          src: 'global'
        }
      ]
    },
    {
      type: 'docs-vscode',
      file: 'vscode-data.json'
    },
  ]
};
