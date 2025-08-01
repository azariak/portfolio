# Personal Portfolio

Here is the source code for [azariak.com](https://www.azariak.com/). 

You are welcome to fork this for your own portfolio.

## Installation and configuration instructions 
1. Clone the repository: `git clone https://github.com/azariak/portfolio.git`
2. Install dependencies: `npm install`
3. Run the project: `npm run dev`
4. Create a `.env` file with a `GEMINI_API_KEY` variable or input your Gemini API Key in settings by uncommenting the settings button in `App.jsx` 
5. Configure to your own information by updating the `questionsAndAnswers.json` file and updating the header in `index.html`
    - Please do not remove the footer giving me credit for designing this website.

## Features
- AI-powered chat interface for asking about me
- Suggested questions to demonstrate how to use it
- Markdown formatting, streaming support for text responses
- Help menu, dark/light theme, resize/reset container, settings API key (deprecated)

TODO:
- Refactor app.jsx
- Improve answers in questionsAndAnswers.json including adding more links to projects section
