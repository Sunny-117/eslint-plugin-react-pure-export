// This file demonstrates exports that contain JSX and should be allowed

// Function returning JSX - should be allowed
export function getEditor() {
    return <div>Editor</div>;
}

// Arrow function returning JSX - should be allowed
export const getViewer = () => {
    return <span>Viewer</span>;
};

// Config object containing JSX - should be allowed
export const tableConfig = {
    columns: [
        {
            title: 'Name',
            render: (text: string) => <span>{text}</span>
        }
    ]
};

// Variable with JSX element - should be allowed
export const element = <div>Hello World</div>;

// Array containing JSX - should be allowed
export const items = [
    <div key="1">Item 1</div>,
    <div key="2">Item 2</div>
];

// Destructured export with inline JSX - should be allowed
export const { editor, viewer } = {
    editor: <div>Editor</div>,
    viewer: <div>Viewer</div>
};

// Pure function without JSX - should NOT be allowed
export function calculate(a: number, b: number) {
    return a + b;
}

// Pure constant without JSX - should NOT be allowed
export const API_URL = 'https://api.example.com';
