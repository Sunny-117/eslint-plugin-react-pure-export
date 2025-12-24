import React from 'react';

// Valid: React.FC component export
export const ValidFC: React.FC<{ title: string }> = ({ title }) => {
  return <div>{title}</div>;
};

// Valid: React.memo wrapped component
export const ValidMemo = React.memo(() => {
  return <div>Memoized Component</div>;
});

// Valid: React.forwardRef component
export const ValidForwardRef = React.forwardRef<HTMLDivElement, { text: string }>((props, ref) => {
  return <div ref={ref}>{props.text}</div>;
});

// Valid: Type exports are allowed
export type ValidProps = {
  name: string;
  age: number;
};

// Valid: Interface exports are allowed
export interface ValidUser {
  id: string;
  email: string;
}

// Valid: Type-only enum (const enum)
export const enum ValidStatus {
  Active = 'active',
  Inactive = 'inactive'
}

// Valid: Default export of React component
const DefaultComponent: React.FC = () => {
  return <div>Default Component</div>;
};

export default DefaultComponent;
