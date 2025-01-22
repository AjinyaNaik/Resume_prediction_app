import pickle
import sys
import re

# Load the trained classifier and vectorizer
tfidf_model = pickle.load(open('tfidf.pkl', 'rb'))
prediction_model = pickle.load(open('clf.pkl', 'rb'))

# Function to clean text
def cleanText(txt):
    cleanText = re.sub("http\S+\s", " ", txt)
    cleanText = re.sub("RT|CC", " ", cleanText)
    cleanText = re.sub("#\S+\s", " ", cleanText)
    cleanText = re.sub("@\S+", " ", cleanText)
    cleanText = re.sub('[%s]' % re.escape("""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), " ", cleanText)
    cleanText = re.sub("r'[^\x00-\x7f]", " ", cleanText)
    cleanText = re.sub(r"\s+", " ", cleanText)
    cleanText = re.sub(r"^[\-\•\*\d+.\)]\s*", " ", cleanText, flags=re.M)
    return cleanText

# Get the resume text passed from Node.js
resume_text = sys.argv[1]

# Clean and transform the resume text
cleanResume = cleanText(resume_text)
resume_vector = tfidf_model.transform([cleanResume])
job_category_ID = prediction_model.predict(resume_vector)[0]

category_mapping = {
    6: "Data Science", 12: "HR", 0: "Advocate", 1: "Arts", 24: "Web Designing",
    16: "Mechanical Engineer", 22: "Sales", 14: "Health and fitness", 5: "Civil Engineer",
    15: "Java Developer", 4: "Business Analyst", 21: "SAP Developer", 2: "Automation Testing",
    11: "Electrical Engineering", 18: "Operations Manager", 20: "Python Developer",
    8: "DevOps Engineer", 17: "Network Security Engineer", 19: "PMO", 7: "Database",
    13: "Hadoop", 10: "ETL Developer", 9: "DotNet Developer", 3: "Blockchain", 23: "Testing"
}

# Map the prediction ID to category
job_category = category_mapping.get(job_category_ID, "Unknown")

# Print the job category result to be captured by Node.js
print(job_category)
