from PIL import Image
import os
import glob

def optimize_images():
    # Ruta de las imágenes originales
    images_path = "static/images/gruas/"
    
    if not os.path.exists(images_path):
        print(f"No se encontró la carpeta: {images_path}")
        return
    
    # Procesar todas las imágenes JPG
    jpg_files = glob.glob(f"{images_path}*.jpg")
    
    if not jpg_files:
        print("No se encontraron archivos JPG")
        return
    
    print(f"Encontradas {len(jpg_files)} imágenes para optimizar...")
    
    for img_path in jpg_files:
        try:
            # Abrir imagen
            img = Image.open(img_path)
            print(f"Procesando: {os.path.basename(img_path)} - Tamaño original: {img.size}")
            
            # Redimensionar si es muy grande (máximo 800px de ancho)
            if img.width > 800:
                ratio = 800 / img.width
                new_height = int(img.height * ratio)
                img = img.resize((800, new_height), Image.Resampling.LANCZOS)
                print(f"  Redimensionada a: {img.size}")
            
            # Convertir a WebP con calidad 85
            webp_path = img_path.replace('.jpg', '.webp')
            img.save(webp_path, 'WebP', quality=85, optimize=True)
            
            # Mostrar ahorro de espacio
            original_size = os.path.getsize(img_path) / 1024  # KB
            webp_size = os.path.getsize(webp_path) / 1024     # KB
            savings = ((original_size - webp_size) / original_size) * 100
            
            print(f"  ✓ {os.path.basename(webp_path)} - {original_size:.1f}KB → {webp_size:.1f}KB ({savings:.1f}% ahorro)")
            
        except Exception as e:
            print(f"  ✗ Error procesando {img_path}: {e}")
    
    print("¡Optimización completada!")

if __name__ == "__main__":
    optimize_images()