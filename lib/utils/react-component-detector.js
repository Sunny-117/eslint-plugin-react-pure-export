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
 * Check if a function name follows HOC naming convention
 * HOCs typically start with 'with' or are common wrapper names
 * @param {string} name - Function name
 * @returns {boolean}
 */
function isHOCNamingPattern(name) {
    if (!name) {
        return false;
    }

    // Common HOC patterns:
    // 1. Starts with 'with' (withRouter, withBoundary, withAuth, etc.)
    // 2. Known wrapper functions (memo, forwardRef, observer, connect, etc.)
    const knownWrappers = ['memo', 'forwardRef', 'observer', 'connect', 'inject', 'compose'];

    return name.startsWith('with') || knownWrappers.includes(name);
}

/**
 * Check if a CallExpression looks like an HOC call
 * An HOC is a function that takes a component and returns a component
 * @param {Object} callNode - CallExpression node
 * @returns {boolean}
 */
function looksLikeHOCCall(callNode) {
    if (!callNode || callNode.type !== 'CallExpression') {
        return false;
    }

    const callee = callNode.callee;

    // Check if the function name follows HOC naming pattern
    if (callee.type === 'Identifier') {
        return isHOCNamingPattern(callee.name);
    }

    // Check for member expression: React.memo, React.forwardRef
    if (callee.type === 'MemberExpression' && callee.property) {
        return isHOCNamingPattern(callee.property.name);
    }

    // Check for nested calls: connect()(Component) or compose(withA, withB)(Component)
    // The outer call's callee is itself a CallExpression
    if (callee.type === 'CallExpression') {
        return looksLikeHOCCall(callee);
    }

    return false;
}

/**
 * Check if a CallExpression has a component-like argument
 * Components are typically:
 * 1. PascalCase identifiers
 * 2. Arrow functions or function expressions
 * 3. Other HOC calls
 * @param {Object} callNode - CallExpression node
 * @returns {boolean}
 */
function hasComponentLikeArgument(callNode) {
    if (!callNode || !callNode.arguments || callNode.arguments.length === 0) {
        return false;
    }

    const firstArg = callNode.arguments[0];

    // Check if argument is a PascalCase identifier (likely a component)
    if (firstArg.type === 'Identifier') {
        const name = firstArg.name;
        // PascalCase check: starts with uppercase letter
        return name && name[0] === name[0].toUpperCase();
    }

    // Check if argument is a function (arrow function or function expression)
    if (firstArg.type === 'ArrowFunctionExpression'
        || firstArg.type === 'FunctionExpression') {
        return true;
    }

    // Check if argument is another HOC call (chained HOCs)
    if (firstArg.type === 'CallExpression') {
        return looksLikeHOCCall(firstArg);
    }

    return false;
}

/**
 * Check if a node is wrapped with a Higher-Order Component (HOC)
 * Uses heuristics to detect HOC patterns without relying on specific names
 * @param {Object} node - ESLint AST node
 * @returns {boolean} True if the node appears to be wrapped with an HOC
 */
function isWrappedWithHOC(node) {
    if (!node) {
        return false;
    }

    /**
     * Analyze a CallExpression to determine if it's an HOC
     * @param {Object} callNode - CallExpression node
     * @returns {boolean}
     */
    function isHOCPattern(callNode) {
        if (!callNode || callNode.type !== 'CallExpression') {
            return false;
        }

        // Check if it looks like an HOC call (naming pattern)
        if (!looksLikeHOCCall(callNode)) {
            return false;
        }

        // Check if it has a component-like argument
        // This helps distinguish HOCs from regular function calls
        return hasComponentLikeArgument(callNode);
    }

    // For default export: export default withBoundary(Component)
    if (node.type === 'CallExpression') {
        return isHOCPattern(node);
    }

    // For named export: export const Component = withBoundary(...)
    if (node.type === 'VariableDeclaration') {
        if (!node.declarations || node.declarations.length === 0) {
            return false;
        }

        const declaration = node.declarations[0];
        if (!declaration || !declaration.init) {
            return false;
        }

        return isHOCPattern(declaration.init);
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

    // Check for common React component patterns
    if (isReactFC(node) || isReactMemo(node) || isReactForwardRef(node)) {
        return true;
    }

    // Check for HOC wrapper pattern (heuristic-based, no hardcoded names)
    if (isWrappedWithHOC(node)) {
        return true;
    }

    return false;
}

module.exports = {
    isReactComponent,
    isReactFC,
    isReactMemo,
    isReactForwardRef,
    isWrappedWithHOC,
};
