# Resume Prediction App
A web application for predicting the best job category for a given resume. The application allows users to upload a resume file (in .txt or .pdf format), processes it, and returns a predicted job category based on the contents of the resume.

# Features
- File Upload: Allows users to upload .txt or .pdf resume files.
- Loading Animation: Displays a series of messages that simulate the resume processing steps.
- Prediction Result: Displays the predicted job category after processing the resume.
- Error Handling: Provides error messages in case of issues during processing or if no job category can be predicted.

# Tech Stack
## Frontend:
- HTML, CSS for styling
- JavaScript for functionality and interaction with backend
- Node.js serves as frontend serves who interacts with user and calls requests to python flask server 
## Backend:
- Flask (Python) for handling backend requests and running the prediction model
## Libraries/Frameworks:
- Flask: Python web framework for the backend
- Scikitlearn : used in vectorization and training the model based on the given dataset
- Python Pandas - Used for data analaysis
- Fetch API: For making HTTP requests to the server
- FormData: For handling file uploads

