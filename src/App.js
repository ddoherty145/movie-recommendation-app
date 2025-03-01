import React from "react";
import PreferencesForm from "./components/PreferencesForm";

const App = () => {
    const handlePreferencesSubmit = (preferences) => {
        console.log("User Preferences:", preferences);
    };

    return (
        <div className="app">
            <h1>Movie/TV Show Recommendation</h1>
            <PreferencesForm onSubmitPreferences={handlePreferencesSubmit} />
        </div>
    );
};

export default App;
