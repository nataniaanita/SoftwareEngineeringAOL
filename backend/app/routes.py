from flask import Flask, Blueprint, request, jsonify, send_from_directory
import zipfile
import tempfile
import uuid
import os
import firebase_admin
from firebase_admin import credentials, storage
from werkzeug.utils import secure_filename
from flask_cors import CORS

main = Blueprint('upload_bp', __name__)
CORS(main) 

cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred, {'storageBucket': 'medisynth-431d0.firebasestorage.app'})

max_file_size = 50 * 1024 * 1024  # 50 MB

@main.route('/upload', methods=['POST'])
def upload_zip():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    
    if 'filetype' not in request.form:
        return jsonify({'message': 'File type is not specified'}), 400

    file = request.files['file']
    filetype = request.form['filetype']

    if not file.filename.endswith('.zip'):
        return jsonify({'message': 'File must be a .zip'}), 400
    
    if file.content_length > max_file_size:
        return jsonify({'message': 'File size exceeds the 50MB limit'}), 400

    temp_dir = tempfile.mkdtemp()
    zip_path = os.path.join(temp_dir, secure_filename(file.filename))
    file.save(zip_path)

    extract_dir = os.path.join(temp_dir, 'extracted')
    os.makedirs(extract_dir, exist_ok=True)

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_dir)

    bucket = storage.bucket()
    uploaded_urls = []

    for root, _, files in os.walk(extract_dir):
        for name in files:
            local_file_path = os.path.join(root, name)
            blob_path = f'datasets/{filetype}/{uuid.uuid4()}_{name}'
            blob = bucket.blob(blob_path)
            blob.upload_from_filename(local_file_path)
            blob.make_public()
            uploaded_urls.append(blob.public_url)


    try:
        for root, dirs, files in os.walk(extract_dir, topdown=False):
            for name in files:
                os.remove(os.path.join(root, name))
            for name in dirs:
                os.rmdir(os.path.join(root, name))
        os.rmdir(extract_dir)
        os.remove(zip_path)
    except Exception as e:
        pass

    return jsonify({
        'message': 'Files uploaded to Firebase!',
        'file_count': len(uploaded_urls),
        'urls': uploaded_urls
    }), 200


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
    
@main.route('/uploads/images/<type>/<path:filename>')
def display_image(type ,filename):
    folder = os.path.join('uploads/images', type)
    return send_from_directory(folder, filename)
