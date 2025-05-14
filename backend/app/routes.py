from flask import Blueprint, jsonify
from flask_cors import CORS
from app.models import generate_and_evaluate 

main = Blueprint("main", __name__)
CORS(main)

@main.route("/generate", methods=["GET"])
def generate_endpoint():
    images, evaluations = generate_and_evaluate(num_samples=10)  
    return jsonify({"images": images, "evaluations": evaluations})

