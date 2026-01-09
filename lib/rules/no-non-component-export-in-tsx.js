/* eslint-disable */
/**
 * @fileoverview Disallow non-component runtime exports in .tsx files
 * @author eslint-plugin-react-pure-export
 */

'use strict';

const {isTsxFile} = require('../utils/file-pattern-matcher');
const {isReactComponent} = require('../utils/react-component-detector');
const {isTypeOnlyExport, isRuntimeEnum, getExportedName} = require('../utils/ast-helpers');
const {containsJSX} = require('../utils/jsx-detector');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow non-component runtime exports in .tsx files',
            recommended: 'error',
        },
        messages: {
            nonComponentExport: 'Non-component runtime export "{{name}}" is not allowed in .tsx files. Extract to a separate .ts file.',
            runtimeEnumExport: 'Runtime enum export "{{name}}" is not allowed in .tsx files. Use type-only enum or extract to a separate .ts file.',
        },
        fixable: 'code',
        schema: [],
    },

    create(context) {
        const filename = context.getFilename();

        // Only apply this rule to .tsx files
        if (!isTsxFile(filename)) {
            return {};
        }

        /**
     * Check if an export declaration is a runtime export
     * @param {Object} node - The export declaration node
     * @returns {boolean} True if it's a runtime export
     */
        function isRuntimeExport(node) {
            // Type-only exports are not runtime exports
            if (isTypeOnlyExport(node)) {
                return false;
            }

            // Check if the declaration is a runtime declaration
            if (node.declaration) {
                const declType = node.declaration.type;

                // Type declarations are not runtime exports
                if (declType === 'TSTypeAliasDeclaration'
            || declType === 'TSInterfaceDeclaration') {
                    return false;
                }

                // Check for runtime enum
                if (declType === 'TSEnumDeclaration') {
                    return isRuntimeEnum(node.declaration);
                }

                // Variable, function, and class declarations are runtime exports
                if (declType === 'VariableDeclaration'
            || declType === 'FunctionDeclaration'
            || declType === 'ClassDeclaration') {
                    return true;
                }
            }

            return false;
        }

        /**
     * Convert camelCase or PascalCase to kebab-case
     * @param {string} str - The string to convert
     * @returns {string} The kebab-case string
     */
        function toKebabCase(str) {
            if (!str) {
                return 'export';
            }
            return str
                // Handle underscores: convert to hyphens
                .replace(/_/g, '-')
                // Insert hyphen between lowercase and uppercase
                .replace(/([a-z])([A-Z])/g, '$1-$2')
                // Insert hyphen between multiple uppercase and lowercase
                .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
                .toLowerCase();
        }

        /**
     * Generate a fixer for extracting non-component export
     * @param {Object} node - The export declaration node
     * @param {string} exportName - The name of the export
     * @returns {Object|null} Fixer object or null if exportName is invalid
     */
        function generateFixer(node, exportName) {
            // Don't provide a fixer if we don't have a valid export name
            if (!exportName) {
                return null;
            }
            
            return function (fixer) {
                const sourceCode = context.getSourceCode();
                const exportText = sourceCode.getText(node);

                // Generate new filename in kebab-case
                const newFileName = toKebabCase(exportName) + '.ts';

                // Generate import statement
                const importStatement = `import { ${exportName} } from './${toKebabCase(exportName)}';\n`;

                // Create TODO comment with instructions
                const todoComment = `// TODO: Create ${newFileName} with:\n// ${exportText.replace(/\n/g, '\n// ')}\n${importStatement}`;

                // Replace the export with the TODO comment
                return fixer.replaceText(node, todoComment);
            };
        }

        /**
     * Get all exported names from a variable declarator
     * @param {Object} declarator - The variable declarator node
     * @returns {string[]} Array of exported names
     */
        function getExportedNamesFromDeclarator(declarator) {
            const names = [];
            
            if (!declarator || !declarator.id) {
                return names;
            }
            
            const id = declarator.id;
            
            // Simple identifier: export const NAME = ...
            if (id.type === 'Identifier') {
                names.push(id.name);
            }
            // Object destructuring: export const { a, b } = ...
            else if (id.type === 'ObjectPattern' && id.properties) {
                id.properties.forEach(prop => {
                    if (prop.type === 'Property') {
                        // Handle shorthand: { a }
                        if (prop.value && prop.value.type === 'Identifier') {
                            names.push(prop.value.name);
                        }
                        // Handle renamed: { a: b }
                        else if (prop.key && prop.key.type === 'Identifier') {
                            names.push(prop.key.name);
                        }
                    }
                    // Handle rest: { ...rest }
                    else if (prop.type === 'RestElement' && prop.argument && prop.argument.type === 'Identifier') {
                        names.push(prop.argument.name);
                    }
                });
            }
            // Array destructuring: export const [a, b] = ...
            else if (id.type === 'ArrayPattern' && id.elements) {
                id.elements.forEach(element => {
                    if (element && element.type === 'Identifier') {
                        names.push(element.name);
                    }
                    // Handle rest: [...rest]
                    else if (element && element.type === 'RestElement' && element.argument && element.argument.type === 'Identifier') {
                        names.push(element.argument.name);
                    }
                });
            }
            
            return names;
        }

        /**
     * Report an error for non-component runtime export
     * @param {Object} node - The export declaration node
     * @param {string} exportName - The name of the export
     * @param {boolean} isEnum - Whether the export is an enum
     */
        function reportNonComponentExport(node, exportName, isEnum = false) {
            const messageId = isEnum ? 'runtimeEnumExport' : 'nonComponentExport';

            context.report({
                node,
                messageId,
                data: {
                    name: exportName,
                },
                fix: generateFixer(node, exportName),
            });
        }

        return {
            ExportNamedDeclaration(node) {
                // Skip if it's a type-only export
                if (isTypeOnlyExport(node)) {
                    return;
                }

                // Check if it's a runtime export
                if (!isRuntimeExport(node)) {
                    return;
                }

                const declaration = node.declaration;

                // Check if the export contains JSX - if so, it's allowed
                if (declaration && containsJSX(declaration)) {
                    return;
                }

                // Check for runtime enum
                if (declaration && declaration.type === 'TSEnumDeclaration') {
                    if (isRuntimeEnum(declaration)) {
                        const exportName = getExportedName(node);
                        reportNonComponentExport(node, exportName, true);
                    }
                    return;
                }

                // Check if it's a React component
                if (declaration && isReactComponent(declaration)) {
                    return;
                }

                // Handle variable declarations (including destructuring)
                if (declaration && declaration.type === 'VariableDeclaration') {
                    if (declaration.declarations && declaration.declarations.length > 0) {
                        const declarator = declaration.declarations[0];
                        const exportedNames = getExportedNamesFromDeclarator(declarator);
                        
                        // Report error for each exported name
                        exportedNames.forEach(name => {
                            reportNonComponentExport(node, name);
                        });
                        return;
                    }
                }

                // For other types of exports (function, class, etc.)
                const exportName = getExportedName(node);
                if (exportName) {
                    reportNonComponentExport(node, exportName);
                }
            },

            ExportDefaultDeclaration(node) {
                const declaration = node.declaration;

                // Check if the export contains JSX - if so, it's allowed
                if (declaration && containsJSX(declaration)) {
                    return;
                }

                // Check if it's a React component
                if (declaration && isReactComponent(declaration)) {
                    return;
                }

                // For default exports, we need to check if it's a runtime export
                // Type exports cannot be default exports in TypeScript
                // So all default exports are runtime exports

                // Check if it's a function or arrow function that might be a component
                if (declaration) {
                    const declType = declaration.type;

                    // If it's a function declaration or expression, check if it returns JSX
                    if (declType === 'FunctionDeclaration'
              || declType === 'FunctionExpression'
              || declType === 'ArrowFunctionExpression') {
                        // For now, we'll assume functions are components
                        // A more sophisticated check would analyze the return type
                        return;
                    }

                    // If it's a variable declaration, check if it's a component
                    if (declType === 'VariableDeclaration') {
                        if (isReactComponent(declType)) {
                            return;
                        }
                    }
                }

                // It's a non-component runtime export, report error
                const exportName = getExportedName(node) || 'default';
                reportNonComponentExport(node, exportName);
            },
        };
    },
};
