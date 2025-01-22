from flask import Flask, request, jsonify
import pickle
import re

app = Flask(__name__)

# Load models
tfidf_model = pickle.load(open('tfidf.pkl', 'rb'))
prediction_model = pickle.load(open('clf.pkl', 'rb'))

def clean_text(txt):
    cleanText = re.sub(r"http\S+\s", " ", txt)
    cleanText = re.sub(r"RT|CC", " ", cleanText)
    cleanText = re.sub(r"#\S+\s", " ", cleanText)
    cleanText = re.sub(r"@\S+", " ", cleanText)
    cleanText = re.sub(r"[%s]" % re.escape("""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), " ", cleanText)
    cleanText = re.sub(r"\s+", " ", cleanText)
    return cleanText.strip()

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    resume_text = data.get('resume', '')

    if not resume_text:
        return jsonify({'error': 'No resume provided'}), 400

    # Process resume
    cleanResume = clean_text(resume_text)
    resume_vector = tfidf_model.transform([cleanResume])
    job_category_ID = prediction_model.predict(resume_vector)[0]

    # Map ID to category
    category_mapping = {
        6: "Data Science",
        12: "HR",
        0: "Advocate",
        1: "Arts",
        24: "Web Designing",
        16: "Mechanical Engineer",
        22: "Sales",
        14: "Health and Fitness",
        5: "Civil Engineer",
        15: "Java Developer",
        4: "Business Analyst",
        21: "SAP Developer",
        2: "Automation Testing",
        11: "Electrical Engineering",
        18: "Operations Manager",
        20: "Python Developer",
        8: "DevOps Engineer",
        17: "Network Security Engineer",
        19: "PMO",
        7: "Database",
        13: "Hadoop",
        10: "ETL Developer",
        9: "DotNet Developer",
        3: "Blockchain",
        23: "Testing"
    }
    job_category = category_mapping.get(job_category_ID, "Unknown")
    return jsonify({'job_category': job_category})

if __name__ == '__main__':
    app.run(debug=True)
