from flask import Blueprint, request, jsonify
import zipfile
import os
from werkzeug.utils import secure_filename

upload_bp = Blueprint('upload_bp', __name__)
max_file_size = 50 * 1024 * 1024 # 50 mb
@upload_bp.route('/upload', methods=['POST']) # dipanggil di axion.post Upload.tsx
def upload_zip():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    
    if 'filetype' not in request.form:
        return jsonify({'message': 'File type is not specified'}), 400

    file = request.files['file']
    filetype = request.form['filetype']

    # if file.filename == '': GAPERLU soalnya kalo ga diadd file, tombolnya gabisa diteken
    #     return jsonify({'message': 'No selected file'}), 400

    # if not file.filename.endswith('.zip'): GAPERLU soalnya cm bisa upload zip
    #     return jsonify({'message': 'File must be a .zip'}), 400
    
    file.seek(0, os.SEEK_END)
    file_length = file.tell()
    file.seek(0)

    if file_length > max_file_size:
        return jsonify({'message': 'File must not be more than 50MB'})


    os.makedirs('uploads', exist_ok=True)
    folder = os.path.join('uploads/images', filetype)
    if not os.path.exists(folder):
        os.makedirs(folder)
    
    filename = secure_filename(file.filename)
    zip_path = os.path.join('uploads', filename) # zipnya disimpen di folder uploads

    file.save(zip_path)

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(folder)

    os.remove(zip_path)

    return jsonify({'message': 'Dataset uploaded successfully!'}), 200
