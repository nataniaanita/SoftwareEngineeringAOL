import numpy as np
import base64
import io
from PIL import Image
import torch
import torch.nn as nn
import tensorflow as tf
import numpy as np


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
generator.load_state_dict(torch.load("app/vae_final.pt", map_location=torch.device("cpu")))
generator.eval()


discriminator = tf.keras.models.load_model("app/discriminator_model.keras")


def generate_and_evaluate(num_samples=5):
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
