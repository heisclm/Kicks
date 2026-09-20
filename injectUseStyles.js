const { Project, SyntaxKind } = require('ts-morph');
const path = require('path');

const project = new Project();
project.addSourceFilesAtPaths(['app/**/*.tsx', 'app/**/*.ts', 'src/**/*.tsx', 'src/**/*.ts']);

for (const file of project.getSourceFiles()) {
    const filePath = file.getFilePath();
    if (filePath.includes('src/theme')) continue;
    
    // Find if file uses colors. or spacing. or radius. etc not prefixed with t. or theme.
    // We will do string replacement first, but inject useStyles if needed.
    
    const importDecs = file.getImportDeclarations();
    let importsTheme = false;
    for (const imp of importDecs) {
        if (imp.getModuleSpecifierValue().includes('theme')) {
            importsTheme = true;
            break;
        }
    }
    
    if (!importsTheme) continue;

    // Check if the file has any React components (Functions returning JSX)
    const functions = file.getDescendantsOfKind(SyntaxKind.FunctionDeclaration)
        .concat(file.getDescendantsOfKind(SyntaxKind.ArrowFunction));
    
    let needsUseStyles = false;

    // If it contains `colors.` not preceded by `t.` or `theme.`
    let text = file.getFullText();
    // A bit hacky: replace all ` colors.` or `(colors.` etc.
    if (/(?<!\bt\.|theme\.)(?:colors|spacing|radius|typography)\./.test(text)) {
        needsUseStyles = true;
    }

    if (needsUseStyles) {
        // Add import { useStyles } from 'react-native-unistyles' if not present
        const hasUseStyles = file.getImportDeclarations().some(i => i.getModuleSpecifierValue() === 'react-native-unistyles' && i.getNamedImports().some(n => n.getName() === 'useStyles'));
        if (!hasUseStyles) {
            let unistylesImport = file.getImportDeclaration(i => i.getModuleSpecifierValue() === 'react-native-unistyles');
            if (unistylesImport) {
                if (!unistylesImport.getNamedImports().some(n => n.getName() === 'useStyles')) {
                    unistylesImport.addNamedImport('useStyles');
                }
            } else {
                file.addImportDeclaration({
                    namedImports: ['useStyles'],
                    moduleSpecifier: 'react-native-unistyles'
                });
            }
        }

        // Inject const { theme } = useStyles(); into the main component.
        // We guess the main component is the one exported by default, or named with uppercase.
        for (const func of functions) {
            const name = func.getName ? func.getName() : null;
            const parent = func.getParent();
            const isComponent = name && name[0] === name[0].toUpperCase() || (parent && parent.getKind() === SyntaxKind.VariableDeclaration && parent.getName()[0] === parent.getName()[0].toUpperCase());
            
            if (isComponent) {
                const body = func.getBody();
                if (body && body.getKind() === SyntaxKind.Block) {
                    if (!body.getText().includes('useStyles()')) {
                        body.insertStatements(0, 'const { theme } = useStyles();');
                    }
                }
            }
        }
    }

    file.saveSync();
}
