import React from 'react';
import { useNavigate } from 'react-router-dom';

// Questa funzione prende un Class Component e gli passa la prop "navigate"
export function withNavigation(Component) {
  return function WrappedComponent(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}