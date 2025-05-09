from flask import Flask, Blueprint, request, jsonify, send_from_directory
import zipfile
import os
from werkzeug.utils import secure_filename

main = Blueprint('upload_bp', __name__)

max_file_size = 50 * 1024 * 1024 # 50 mb
@main.route('/upload', methods=['POST']) # dipanggil di axion.post Upload.tsx
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

upload_folder = os.path.abspath("./uploads/images")

@main.route('/files', methods=['GET'])
def list_uploaded_folders():
    type_param = request.args.get('type', '')
    target_path = os.path.join(upload_folder, type_param)

    if not os.path.exists(target_path):
        return jsonify([])

    try:
        items = []
        for entry in os.scandir(target_path):
            items.append({
                "name": entry.name,
                "isDirectory": entry.is_dir()
            })
        return jsonify(items)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@main.route('/folders', methods=['GET'])
def uploaded_folders():
    items = []
    target_path = os.path.abspath("./uploads/images")
    if not os.path.exists(target_path):
        return jsonify([])
    try:
        items = []
        for folder in os.scandir(target_path):
            if(folder.is_dir()):
                items.append({
                "name": folder.name
            })
        if(len(items) == 0):
            return jsonify({"message": "Database empty"})
        return jsonify(items)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@main.route('uploads/images/<type>/<path:filename>')
def display_image(type ,filename):
    folder = os.path.join('uploads/images', type)
    return send_from_directory(folder, filename)