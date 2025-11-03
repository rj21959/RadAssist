import cv2
import numpy as np
from PIL import Image
import io

def validate_dicom_image(image_data):
    """Validate if the uploaded file is a proper medical image"""
    try:
        image = Image.open(io.BytesIO(image_data))
        # Basic validation checks
        if image.format not in ['JPEG', 'PNG', 'DICOM']:
            return False, "Unsupported image format"
        
        # Check image dimensions
        if image.size[0] < 100 or image.size[1] < 100:
            return False, "Image dimensions too small"
            
        return True, "Valid image"
    except Exception as e:
        return False, f"Invalid image file: {str(e)}"

def enhance_image_quality(image_data):
    """Enhance medical image quality for better analysis"""
    try:
        # Convert to numpy array
        image = Image.open(io.BytesIO(image_data))
        img_array = np.array(image)
        
        # Apply contrast enhancement
        if len(img_array.shape) == 3:  # Color image
            img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        
        # Apply CLAHE for contrast enhancement
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        enhanced = clahe.apply(img_array)
        
        return enhanced
    except Exception as e:
        print(f"Image enhancement failed: {e}")
        return image_data