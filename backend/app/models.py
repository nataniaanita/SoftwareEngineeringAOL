import numpy as np
import base64
import io
from PIL import Image
import tensorflow as tf


generator = tf.keras.models.load_model("app/generator_model.keras")
discriminator = tf.keras.models.load_model("app/discriminator_model.keras")

def generate_and_evaluate(num_samples=5):
    noise = np.random.normal(0, 1, (num_samples, 100))  
    generated_images = generator.predict(noise)  
    generated_images = (generated_images + 1) / 2.0 

    images_base64 = []
    evaluation_results = []

    for img_array in generated_images:
        img = Image.fromarray((img_array * 255).astype(np.uint8))  
        buffered = io.BytesIO()
        img.save(buffered, format="JPEG") 
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8") 
        images_base64.append(img_str)

   
        img_array = np.expand_dims(img_array, axis=0)  
        discriminator_output = discriminator.predict(img_array) 

   
        evaluation_results.append(float(discriminator_output[0][0])) 

    return images_base64, evaluation_results
