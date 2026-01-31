import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

const filesToMerge = [
  './SettingsScreen.v1.tsx',
  './SettingsScreen.v2.tsx',
];

let mergedImports: Record<string, string> = {};
let mergedStates: Record<string, any> = {};
let mergedJSX: t.JSXElement[] = [];

filesToMerge.forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  const ast = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });

  traverse(ast, {
    ImportDeclaration({ node }) {
      const key = node.source.value;
      if (!mergedImports[key]) mergedImports[key] = generate(node).code;
    },
    VariableDeclaration({ node }) {
      // pick only useState hooks
      node.declarations.forEach(d => {
        if (t.isCallExpression(d.init) && t.isIdentifier(d.init.callee) && d.init.callee.name === 'useState') {
          const stateName = (d.id as t.Identifier).name;
          if (!mergedStates[stateName]) mergedStates[stateName] = generate(d.init).code;
        }
      });
    },
    JSXElement({ node }) {
      mergedJSX.push(node);
    }
  });
});

// Generate merged file
const importCode = Object.values(mergedImports).join('\n');
const statesCode = Object.entries(mergedStates)
  .map(([name, init]) => `const [${name}, ${name}Setter] = ${init};`)
  .join('\n');

const jsxCode = mergedJSX.map(node => generate(node).code).join('\n');

const finalCode = `
${importCode}

const SettingsScreenMerged: React.FC<any> = () => {
  ${statesCode}

  return (
    <div>
      ${jsxCode}
    </div>
  );
};

export default SettingsScreenMerged;
`;

fs.writeFileSync('./merged/SettingsScreen.tsx', finalCode);
console.log('Merged file created at ./merged/SettingsScreen.tsx');