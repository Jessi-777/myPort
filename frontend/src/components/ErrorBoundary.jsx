// // src/components/ErrorBoundary.jsx
// import React, { Component } from 'react';

// class ErrorBoundary extends Component {
//   state = { hasError: false };

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, info) {
//     console.log('Error caught in ErrorBoundary:', error, info);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <h1>Something went wrong. Please try again later.</h1>;
//     }

//     return this.props.children;
//   }
// }

// export default ErrorBoundary;
