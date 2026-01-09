/**
 * React component detection utilities
 */

/**
 * Check if a node has React.FC type annotation
 * @param {Object} node - ESLint AST node
 * @returns {boolean} True if the node has React.FC type annotation
 */
function isReactFC(node) {
    if (!node) {
        return false;
    }

    // Check for VariableDeclaration: export const Component: React.FC = ...
    if (node.type === 'VariableDeclaration') {
        if (!node.declarations || node.declarations.length === 0) {
            return false;
        }

        const declaration = node.declarations[0];
        if (!declaration || !declaration.id || !declaration.id.typeAnnotation) {
            return false;
        }

        const typeAnnotation = declaration.id.typeAnnotation.typeAnnotation;
        if (!typeAnnotation || typeAnnotation.type !== 'TSTypeReference') {
            return false;
        }

        const typeName = typeAnnotation.typeName;

        // Check for FC or FunctionComponent
        if (typeName.type === 'Identifier') {
            return typeName.name === 'FC' || typeName.name === 'FunctionComponent';
        }

        // Check for React.FC or React.FunctionComponent
        if (typeName.type === 'TSQualifiedName') {
            return (typeName.left.name === 'React'
              && (typeName.right.name === 'FC' || typeName.right.name === 'FunctionComponent'));
        }
    }

    return false;
}

/**
 * Check if a node is wrapped with React.memo
 * @param {Object} node - ESLint AST node
 * @returns {boolean} True if the node is wrapped with React.memo
 */
function isReactMemo(node) {
    if (!node) {
        return false;
    }

    // Check for VariableDeclaration: export const Component = React.memo(...)
    if (node.type === 'VariableDeclaration') {
        if (!node.declarations || node.declarations.length === 0) {
            return false;
        }

        const declaration = node.declarations[0];
        if (!declaration || !declaration.init) {
            return false;
        }

        const init = declaration.init;
        if (init.type !== 'CallExpression') {
            return false;
        }

        const callee = init.callee;

        // Check for memo()
        if (callee.type === 'Identifier' && callee.name === 'memo') {
            return true;
        }

        // Check for React.memo()
        if (callee.type === 'MemberExpression'
        && callee.object.name === 'React'
        && callee.property.name === 'memo') {
            return true;
        }
    }

    return false;
}

/**
 * Check if a node is wrapped with React.forwardRef
 * @param {Object} node - ESLint AST node
 * @returns {boolean} True if the node is wrapped with React.forwardRef
 */
function isReactForwardRef(node) {
    if (!node) {
        return false;
    }

    // Check for VariableDeclaration: export const Component = React.forwardRef(...)
    if (node.type === 'VariableDeclaration') {
        if (!node.declarations || node.declarations.length === 0) {
            return false;
        }

        const declaration = node.declarations[0];
        if (!declaration || !declaration.init) {
            return false;
        }

        const init = declaration.init;
        if (init.type !== 'CallExpression') {
            return false;
        }

        const callee = init.callee;

        // Check for forwardRef()
        if (callee.type === 'Identifier' && callee.name === 'forwardRef') {
            return true;
        }

        // Check for React.forwardRef()
        if (callee.type === 'MemberExpression'
        && callee.object.name === 'React'
        && callee.property.name === 'forwardRef') {
            return true;
        }
    }

    return false;
}

/**
 * Check if a node represents a React component
 * @param {Object} node - ESLint AST node
 * @returns {boolean} True if the node is a React component
 */
function isReactComponent(node) {
    if (!node) {
        return false;
    }

    return isReactFC(node) || isReactMemo(node) || isReactForwardRef(node);
}

module.exports = {
    isReactComponent,
    isReactFC,
    isReactMemo,
    isReactForwardRef,
};
