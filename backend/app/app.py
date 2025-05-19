from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
import psycopg2
import numpy as np
import base64
import io
from PIL import Image
import torch
import torch.nn as nn
import tensorflow as tf
import os
import bcrypt

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "*"]}})

conn = psycopg2.connect(
    host="localhost",
    database="medisynth",
    user="postgres",
    password="root",
    port="5432"
)
cursor = conn.cursor()

class VAE(nn.Module):
    def __init__(self, image_size=128, latent_dim=128):
        super(VAE, self).__init__()
        self.image_size = image_size
        self.latent_dim = latent_dim

        # Encoder
        self.encoder = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(32),
            nn.LeakyReLU(0.2),
            nn.Conv2d(32, 64, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(64),
            nn.LeakyReLU(0.2),
            nn.Conv2d(64, 128, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(128),
            nn.LeakyReLU(0.2),
            nn.Conv2d(128, 256, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(256),
            nn.LeakyReLU(0.2),
            nn.Conv2d(256, 512, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(512),
            nn.LeakyReLU(0.2),
        )

        self.fc_mu = nn.Linear(512 * 4 * 4, latent_dim)
        self.fc_logvar = nn.Linear(512 * 4 * 4, latent_dim)
        self.decoder_input = nn.Linear(latent_dim, 512 * 4 * 4)

        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(512, 256, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(256),
            nn.LeakyReLU(0.2),
            nn.ConvTranspose2d(256, 128, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(128),
            nn.LeakyReLU(0.2),
            nn.ConvTranspose2d(128, 64, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(64),
            nn.LeakyReLU(0.2),
            nn.ConvTranspose2d(64, 32, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(32),
            nn.LeakyReLU(0.2),
            nn.ConvTranspose2d(32, 1, kernel_size=4, stride=2, padding=1),
            nn.Tanh()
        )

    def encode(self, x):
        x = self.encoder(x)
        x = x.view(x.size(0), -1)
        mu = self.fc_mu(x)
        logvar = self.fc_logvar(x)
        return mu, logvar

    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + eps * std

    def decode(self, z):
        x = self.decoder_input(z)
        x = x.view(x.size(0), 512, 4, 4)
        x = self.decoder(x)
        return x

    def forward(self, x):
        mu, logvar = self.encode(x)
        z = self.reparameterize(mu, logvar)
        return self.decode(z), mu, logvar

generator = VAE(image_size=128, latent_dim=128)
vae_path = os.path.join(os.path.dirname(__file__), "vae_final.pt")
generator.load_state_dict(torch.load(vae_path, map_location=torch.device("cpu")))
generator.eval()

discriminator_path = os.path.join(os.path.dirname(__file__), "discriminator_model.keras")
discriminator = tf.keras.models.load_model(discriminator_path)

def generate_and_evaluate(num_samples=5):
    num_samples = min(int(num_samples), 100)
    latent_dim = 128  
    z = torch.randn(num_samples, latent_dim)

    with torch.no_grad():
        generated_images = generator.decode(z).cpu().numpy()  
    generated_images = (generated_images + 1) / 2.0

    images_base64 = []
    evaluation_results = []

    for img_array in generated_images:
        img_array = img_array.squeeze()  
        
        img = Image.fromarray((img_array * 255).astype(np.uint8), mode='L')
        
        buffered = io.BytesIO()
        img.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        images_base64.append(img_str)

        img_resized = img.resize((64, 64))
        img_rgb = img_resized.convert('RGB')
        img_input = np.array(img_rgb).astype(np.float32) / 255.0
        img_input = np.expand_dims(img_input, axis=0)
        
        discriminator_output = discriminator.predict(img_input, verbose=0)
        evaluation_results.append(float(discriminator_output[0][0]))

    return images_base64, evaluation_results

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password") 

    try:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
                      (name, email, hashed_password.decode('utf-8')))
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        print(e)
        conn.rollback()
        return jsonify({"error": "Something went wrong"}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    try:
        cursor.execute("SELECT name, email, password FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()

        if user and bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):
            return jsonify({
                "message": "Login successful",
                "user": {
                    "name": user[0],
                    "email": user[1]
                }
            }), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401

    except Exception as e:
        print(e)
        return jsonify({"error": "Something went wrong"}), 500

@app.route("/generate", methods=["GET"])
def generate_endpoint():
    num_samples = request.args.get('count', default=10, type=int)
    
    num_samples = max(1, min(num_samples, 100))
    
    images, evaluations = generate_and_evaluate(num_samples=num_samples)  
    return jsonify({"images": images, "evaluations": evaluations})

if __name__ == '__main__':
    app.run(port=5000, debug=True)