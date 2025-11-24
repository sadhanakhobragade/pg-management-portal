const fs = require('fs');
const path = require('path');
const recast = require('recast');
const { visit } = recast.types;

function convertFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const ast = recast.parse(code, { parser: require('recast/parsers/typescript') });

  visit(ast, {
    visitTSTypeAnnotation(path) { path.prune(); return false; },
    visitTSInterfaceDeclaration(path) { path.prune(); return false; },
    visitTSTypeAliasDeclaration(path) { path.prune(); return false; },
    visitTSAsExpression(path) { path.replace(path.node.expression); return false; },
    visitTSNonNullExpression(path) { path.replace(path.node.expression); return false; },
  });

  const output = recast.print(ast).code;
  const newFilePath = filePath.replace(/\.tsx?$/, ext => ext === '.ts' ? '.js' : '.jsx');
  fs.writeFileSync(newFilePath, output, 'utf8');
  if (newFilePath !== filePath) fs.unlinkSync(filePath);
  console.log(`Converted: ${filePath} → ${newFilePath}`);
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) walkDir(fullPath);
    else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) convertFile(fullPath);
  });
}

walkDir(path.join(__dirname, 'src'));
console.log('All files converted!');
