import React from 'react';

const ResultDisplay = ({ results }) => {
    if (!results) {
        return <div>No results to display.</div>;
    }

    return (
        <div>
            <h2>Analysis Results</h2>
            <p><strong>Reference Number:</strong> {results.referenceNumber}</p>
            <p><strong>Description:</strong> {results.description}</p>
            <p><strong>Condition:</strong> {results.condition}</p>
            <p><strong>Estimated Value:</strong> {results.estimatedValue}</p>
        </div>
    );
};

export default ResultDisplay;