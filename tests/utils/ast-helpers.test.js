/**
 * Tests for ast-helpers utility
 * Validates: Requirements 1.1, 1.7, 1.8
 */

const { isTypeOnlyExport, isRuntimeEnum, getExportedName, getImportSource } = require('../../lib/utils/ast-helpers');

console.log('🧪 Testing ast-helpers utility...\n');

/**
 * Helper function to parse code and get AST nodes
 */
function parseCode(code) {
  const parser = require('@typescript-eslint/parser');
  const ast = parser.parse(code, {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  });
  
  return ast;
}

/**
 * Find nodes of a specific type in AST
 */
function findNodes(ast, nodeType) {
  const nodes = [];
  
  function traverse(node) {
    if (!node || typeof node !== 'object') {
      return;
    }
    
    if (node.type === nodeType) {
      nodes.push(node);
    }
    
    for (const key in node) {
      if (key === 'parent') continue; // Avoid circular references
      const value = node[key];
      if (Array.isArray(value)) {
        value.forEach(traverse);
      } else if (typeof value === 'object' && value !== null) {
        traverse(value);
      }
    }
  }
  
  traverse(ast);
  return nodes;
}

function runTests() {
  let passed = 0;
  let failed = 0;
  
  console.log('📋 Testing isTypeOnlyExport:\n');
  
  // Test 1: Type alias export
  try {
    const ast1 = parseCode('export type Status = "active" | "inactive";');
    const exports1 = findNodes(ast1, 'ExportNamedDeclaration');
    if (exports1.length > 0 && isTypeOnlyExport(exports1[0])) {
      console.log('✅ PASS: isTypeOnlyExport recognizes type alias export');
      passed++;
    } else {
      console.log('❌ FAIL: isTypeOnlyExport should recognize type alias export');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error parsing type alias export:', e.message);
    failed++;
  }
  
  // Test 2: Interface export
  try {
    const ast2 = parseCode('export interface User { name: string; }');
    const exports2 = findNodes(ast2, 'ExportNamedDeclaration');
    if (exports2.length > 0 && isTypeOnlyExport(exports2[0])) {
      console.log('✅ PASS: isTypeOnlyExport recognizes interface export');
      passed++;
    } else {
      console.log('❌ FAIL: isTypeOnlyExport should recognize interface export');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error parsing interface export:', e.message);
    failed++;
  }
  
  // Test 3: Const export (not type-only)
  try {
    const ast3 = parseCode('export const PAGE_SIZE = 20;');
    const exports3 = findNodes(ast3, 'ExportNamedDeclaration');
    if (exports3.length > 0 && !isTypeOnlyExport(exports3[0])) {
      console.log('✅ PASS: isTypeOnlyExport rejects const export');
      passed++;
    } else {
      console.log('❌ FAIL: isTypeOnlyExport should reject const export');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error parsing const export:', e.message);
    failed++;
  }
  
  // Test 4: Function export (not type-only)
  try {
    const ast4 = parseCode('export function helper() { return 42; }');
    const exports4 = findNodes(ast4, 'ExportNamedDeclaration');
    if (exports4.length > 0 && !isTypeOnlyExport(exports4[0])) {
      console.log('✅ PASS: isTypeOnlyExport rejects function export');
      passed++;
    } else {
      console.log('❌ FAIL: isTypeOnlyExport should reject function export');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error parsing function export:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing isRuntimeEnum:\n');
  
  // Test 5: Runtime enum
  try {
    const ast5 = parseCode('export enum Status { Active, Inactive }');
    const enums5 = findNodes(ast5, 'TSEnumDeclaration');
    if (enums5.length > 0 && isRuntimeEnum(enums5[0])) {
      console.log('✅ PASS: isRuntimeEnum recognizes runtime enum');
      passed++;
    } else {
      console.log('❌ FAIL: isRuntimeEnum should recognize runtime enum');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error parsing runtime enum:', e.message);
    failed++;
  }
  
  // Test 6: Const enum (not runtime)
  try {
    const ast6 = parseCode('export const enum Status { Active, Inactive }');
    const enums6 = findNodes(ast6, 'TSEnumDeclaration');
    if (enums6.length > 0 && !isRuntimeEnum(enums6[0])) {
      console.log('✅ PASS: isRuntimeEnum rejects const enum');
      passed++;
    } else {
      console.log('❌ FAIL: isRuntimeEnum should reject const enum');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error parsing const enum:', e.message);
    failed++;
  }
  
  // Test 7: Declare enum (not runtime)
  try {
    const ast7 = parseCode('export declare enum Status { Active, Inactive }');
    const enums7 = findNodes(ast7, 'TSEnumDeclaration');
    if (enums7.length > 0 && !isRuntimeEnum(enums7[0])) {
      console.log('✅ PASS: isRuntimeEnum rejects declare enum');
      passed++;
    } else {
      console.log('❌ FAIL: isRuntimeEnum should reject declare enum');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error parsing declare enum:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing getExportedName:\n');
  
  // Test 8: Get name from const export
  try {
    const ast8 = parseCode('export const PAGE_SIZE = 20;');
    const exports8 = findNodes(ast8, 'ExportNamedDeclaration');
    const name8 = exports8.length > 0 ? getExportedName(exports8[0]) : null;
    if (name8 === 'PAGE_SIZE') {
      console.log('✅ PASS: getExportedName extracts const export name');
      passed++;
    } else {
      console.log(`❌ FAIL: getExportedName should extract "PAGE_SIZE", got "${name8}"`);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error extracting const export name:', e.message);
    failed++;
  }
  
  // Test 9: Get name from function export
  try {
    const ast9 = parseCode('export function helper() { return 42; }');
    const exports9 = findNodes(ast9, 'ExportNamedDeclaration');
    const name9 = exports9.length > 0 ? getExportedName(exports9[0]) : null;
    if (name9 === 'helper') {
      console.log('✅ PASS: getExportedName extracts function export name');
      passed++;
    } else {
      console.log(`❌ FAIL: getExportedName should extract "helper", got "${name9}"`);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error extracting function export name:', e.message);
    failed++;
  }
  
  // Test 10: Get name from type export
  try {
    const ast10 = parseCode('export type Status = "active" | "inactive";');
    const exports10 = findNodes(ast10, 'ExportNamedDeclaration');
    const name10 = exports10.length > 0 ? getExportedName(exports10[0]) : null;
    if (name10 === 'Status') {
      console.log('✅ PASS: getExportedName extracts type export name');
      passed++;
    } else {
      console.log(`❌ FAIL: getExportedName should extract "Status", got "${name10}"`);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error extracting type export name:', e.message);
    failed++;
  }
  
  // Test 11: Get name from interface export
  try {
    const ast11 = parseCode('export interface User { name: string; }');
    const exports11 = findNodes(ast11, 'ExportNamedDeclaration');
    const name11 = exports11.length > 0 ? getExportedName(exports11[0]) : null;
    if (name11 === 'User') {
      console.log('✅ PASS: getExportedName extracts interface export name');
      passed++;
    } else {
      console.log(`❌ FAIL: getExportedName should extract "User", got "${name11}"`);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error extracting interface export name:', e.message);
    failed++;
  }
  
  // Test 12: Get name from default export
  try {
    const ast12 = parseCode('export default function Component() { return null; }');
    const exports12 = findNodes(ast12, 'ExportDefaultDeclaration');
    const name12 = exports12.length > 0 ? getExportedName(exports12[0]) : null;
    if (name12 === 'Component' || name12 === 'default') {
      console.log('✅ PASS: getExportedName extracts default export name');
      passed++;
    } else {
      console.log(`❌ FAIL: getExportedName should extract default export name, got "${name12}"`);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error extracting default export name:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing getImportSource:\n');
  
  // Test 13: Get import source from regular import
  try {
    const ast13 = parseCode('import { helper } from "./utils";');
    const imports13 = findNodes(ast13, 'ImportDeclaration');
    const source13 = imports13.length > 0 ? getImportSource(imports13[0]) : null;
    if (source13 === './utils') {
      console.log('✅ PASS: getImportSource extracts import source');
      passed++;
    } else {
      console.log(`❌ FAIL: getImportSource should extract "./utils", got "${source13}"`);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error extracting import source:', e.message);
    failed++;
  }
  
  // Test 14: Get import source from .tsx import
  try {
    const ast14 = parseCode('import { Component } from "./Component.tsx";');
    const imports14 = findNodes(ast14, 'ImportDeclaration');
    const source14 = imports14.length > 0 ? getImportSource(imports14[0]) : null;
    if (source14 === './Component.tsx') {
      console.log('✅ PASS: getImportSource extracts .tsx import source');
      passed++;
    } else {
      console.log(`❌ FAIL: getImportSource should extract "./Component.tsx", got "${source14}"`);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error extracting .tsx import source:', e.message);
    failed++;
  }
  
  // Test 15: Get import source from npm package
  try {
    const ast15 = parseCode('import React from "react";');
    const imports15 = findNodes(ast15, 'ImportDeclaration');
    const source15 = imports15.length > 0 ? getImportSource(imports15[0]) : null;
    if (source15 === 'react') {
      console.log('✅ PASS: getImportSource extracts npm package source');
      passed++;
    } else {
      console.log(`❌ FAIL: getImportSource should extract "react", got "${source15}"`);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error extracting npm package source:', e.message);
    failed++;
  }
  
  // Summary
  const total = passed + failed;
  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`📈 SUMMARY: ${passed}/${total} tests passed`);
  console.log('═══════════════════════════════════════════════════════\n');
  
  return { passed, failed };
}

const result = runTests();
const { passed, failed } = result;

if (failed === 0) {
  process.exit(0);
} else {
  process.exit(1);
}
