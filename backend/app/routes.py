from flask import Blueprint, request, jsonify, current_app
import os, zipfile

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file.filename.endswith('.zip'):
        upload_folder = current_app.config['UPLOAD_FOLDER']
        zip_path = os.path.join(upload_folder, file.filename)
        file.save(zip_path)

        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(upload_folder)

        os.remove(zip_path)
        return jsonify({'message': 'Zip extracted successfully!'}), 200

    return jsonify({'message': 'Invalid file type'}), 400
