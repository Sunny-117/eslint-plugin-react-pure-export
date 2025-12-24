/**
 * AST helper functions for analyzing TypeScript/ESLint AST nodes
 */

/**
 * Check if an export declaration is type-only
 * @param {Object} node - ESLint AST node
 * @returns {boolean} True if the export is type-only
 */
function isTypeOnlyExport(node) {
  if (!node) {
    return false;
  }
  
  // Check for ExportNamedDeclaration
  if (node.type === 'ExportNamedDeclaration') {
    // Check exportKind property (set by @typescript-eslint/parser)
    if (node.exportKind === 'type') {
      return true;
    }
    
    // Check if all specifiers are type-only
    if (node.specifiers && node.specifiers.length > 0) {
      return node.specifiers.every(spec => spec.exportKind === 'type');
    }
    
    // Check if declaration is a type declaration
    if (node.declaration) {
      const declType = node.declaration.type;
      return declType === 'TSTypeAliasDeclaration' || 
             declType === 'TSInterfaceDeclaration';
    }
  }
  
  return false;
}

/**
 * Check if an enum is a runtime enum (not const or declare)
 * @param {Object} node - ESLint AST node
 * @returns {boolean} True if the enum is a runtime enum
 */
function isRuntimeEnum(node) {
  if (!node) {
    return false;
  }
  
  // Check if it's an enum declaration
  if (node.type !== 'TSEnumDeclaration') {
    return false;
  }
  
  // Runtime enum is one that is NOT const and NOT declare
  const isConst = node.const === true;
  const isDeclare = node.declare === true;
  
  return !isConst && !isDeclare;
}

/**
 * Get the exported name from an export declaration
 * @param {Object} node - ESLint AST node
 * @returns {string|null} The exported name, or null if not found
 */
function getExportedName(node) {
  if (!node) {
    return null;
  }
  
  // Handle ExportNamedDeclaration
  if (node.type === 'ExportNamedDeclaration') {
    // If there's a declaration, get its name
    if (node.declaration) {
      // Variable declaration: export const NAME = ...
      if (node.declaration.type === 'VariableDeclaration') {
        if (node.declaration.declarations && node.declaration.declarations.length > 0) {
          const declarator = node.declaration.declarations[0];
          if (declarator.id && declarator.id.name) {
            return declarator.id.name;
          }
        }
      }
      
      // Function declaration: export function NAME() {}
      if (node.declaration.type === 'FunctionDeclaration') {
        if (node.declaration.id && node.declaration.id.name) {
          return node.declaration.id.name;
        }
      }
      
      // Type/Interface declaration
      if (node.declaration.type === 'TSTypeAliasDeclaration' || 
          node.declaration.type === 'TSInterfaceDeclaration' ||
          node.declaration.type === 'TSEnumDeclaration') {
        if (node.declaration.id && node.declaration.id.name) {
          return node.declaration.id.name;
        }
      }
      
      // Class declaration: export class NAME {}
      if (node.declaration.type === 'ClassDeclaration') {
        if (node.declaration.id && node.declaration.id.name) {
          return node.declaration.id.name;
        }
      }
    }
    
    // If there are specifiers: export { NAME }
    if (node.specifiers && node.specifiers.length > 0) {
      const firstSpecifier = node.specifiers[0];
      if (firstSpecifier.exported && firstSpecifier.exported.name) {
        return firstSpecifier.exported.name;
      }
    }
  }
  
  // Handle ExportDefaultDeclaration
  if (node.type === 'ExportDefaultDeclaration') {
    // If declaration has a name
    if (node.declaration) {
      if (node.declaration.id && node.declaration.id.name) {
        return node.declaration.id.name;
      }
      // For anonymous default exports
      return 'default';
    }
  }
  
  return null;
}

/**
 * Get the import source string from an import declaration
 * @param {Object} node - ESLint AST node
 * @returns {string|null} The import source, or null if not found
 */
function getImportSource(node) {
  if (!node) {
    return null;
  }
  
  // Check if it's an ImportDeclaration
  if (node.type !== 'ImportDeclaration') {
    return null;
  }
  
  // Get the source property
  if (node.source && node.source.value) {
    return node.source.value;
  }
  
  return null;
}

module.exports = {
  isTypeOnlyExport,
  isRuntimeEnum,
  getExportedName,
  getImportSource
};
