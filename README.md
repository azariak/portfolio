# Personal Portfolio

Here is the source code for [azariak.com](https://www.azariak.com/). 

You are welcome to fork this for your own website, with attribution.

## Installation and configuration instructions 
1. Clone the repository: `git clone https://github.com/azariak/portfolio.git`
2. Install dependencies: `npm install`
3. Run the project: `npm run dev`
4. Input your Gemini API Key in settings by uncommenting the settings button in `App.jsx` or create a `.env` file with a `GEMINI_API_KEY` variable
5. Configure to yourself by updating the `questionsAndAnswers.json` file and updating the header in `index.html`
    - Please do not remove the footer or Github link giving me credit for creating this website.

TODO:
- Refact app.jsx into many subdirectories and files
- Consider footer modal (lean against)
- Improve default answers
- Fix mobile rendering