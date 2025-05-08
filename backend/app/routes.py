from flask import Blueprint, request, jsonify
import zipfile
import os
from werkzeug.utils import secure_filename

upload_bp = Blueprint('upload_bp', __name__)

@upload_bp.route('/upload', methods=['POST'])
def upload_zip():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if not file.filename.endswith('.zip'):
        return jsonify({'message': 'File must be a .zip'}), 400

    filename = secure_filename(file.filename)
    zip_path = os.path.join('uploads/images', filename)

    os.makedirs('uploads/images', exist_ok=True)
    file.save(zip_path)

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall('uploads/images')

    os.remove(zip_path)

    return jsonify({'message': 'Zip extracted and original file removed successfully!'}), 200
