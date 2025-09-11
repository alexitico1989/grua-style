from PIL import Image
import os
import glob

def create_mobile_images():
    images_path = "static/images/gruas/"
    
    # Lista de todas las imágenes WebP que ya tienes
    webp_files = glob.glob(f"{images_path}*.webp")
    
    for webp_path in webp_files:
        # Abrir imagen WebP existente
        img = Image.open(webp_path)
        print(f"Procesando: {os.path.basename(webp_path)} - Tamaño: {img.size}")
        
        # Crear versión móvil (400px de ancho máximo)
        if img.width > 400:
            ratio = 400 / img.width
            new_height = int(img.height * ratio)
            mobile_img = img.resize((400, new_height), Image.Resampling.LANCZOS)
            
            # Guardar con sufijo -mobile
            base_name = os.path.basename(webp_path).replace('.webp', '')
            mobile_path = f"{images_path}{base_name}-mobile.webp"
            
            # Guardar con calidad 70 (más compresión)
            mobile_img.save(mobile_path, 'WebP', quality=70, optimize=True)
            
            print(f"  ✓ Creada versión móvil: {mobile_path} - Tamaño: {mobile_img.size}")

if __name__ == "__main__":
    create_mobile_images()