from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from PIL import Image
import io
import base64
import traceback
import os
from pathlib import Path
import mimetypes
import hashlib
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)
print("Flask app starting...")

# Dataset base directory
DATASETS_DIR = Path(__file__).parent / 'datasets'
# Dataset base directory
DATASETS_DIR = Path(__file__).parent / 'datasets'

# ============= SECURITY CONFIGURATION =============
# Maximum file size: 10 MB per file
MAX_FILE_SIZE = 10 * 1024 * 1024

# Allowed image MIME types (strict whitelist)
ALLOWED_MIMETYPES = {
    'image/jpeg',
    'image/png',
    'image/bmp',
    'image/tiff',
    'image/x-tiff',
    'image/gif'
}

# Allowed file extensions (case-insensitive)
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.gif'}

# Maximum number of files per upload
MAX_FILES_PER_UPLOAD = 1000

# Minimum image size (to prevent pixel-based attacks)
MIN_IMAGE_SIZE = (16, 16)

# Maximum image size (to prevent resource exhaustion)
MAX_IMAGE_SIZE = (2048, 2048)

# Target size for all images
TARGET_SIZE = (64, 64)

# Dataset-specific notes for each dimension
DATASET_NOTES = {
    'Cat Faces': {
        1: 'Shows the most dominant variation in the dataset along a single axis. Highlights major differences between images, such as overall face orientation or size, but finer details are lost.',
        2: 'Maps images onto a plane defined by the two directions of greatest variance. Reveals clusters of similar-looking cat faces and allows detection of patterns and outliers.',
        3: 'Adds a third dimension to capture more subtle variations. Makes clusters and differences clearer, showing trends in pose, shape, and features while retaining the main structure of the dataset.'
    },
    'MNIST': {
        1: 'Captures the single most dominant variation in the dataset. Shows which digits differ the most in overall structure, but fine details and handwriting styles are lost.',
        2: 'Uses the top two principal components to map digits on a plane. Reveals clusters of similar digits and shows relative similarities and differences between shapes.',
        3: 'Adds a third component to highlight subtler variations. Improves separation of digit clusters and shows finer differences in stroke patterns, loops, and individual handwriting style.'
    },
    'Chest X Ray Images (Pneumonia)': {
        1: 'Highlights the most dominant variation in the dataset. Separates images with obvious differences, such as lungs with infection versus healthy lungs, but finer details are lost.',
        2: 'Shows images on a plane defined by the two largest variance directions. Reveals clusters of NORMAL and PNEUMONIA X-rays, making patterns and outliers easier to spot.',
        3: 'Adds a third dimension to capture more subtle variations. Improves separation between NORMAL and PNEUMONIA X-rays, highlighting trends in lung opacity, infection patterns, and structural differences.'
    },
    'Labeled Faces in the Wild (LFW)': {
        1: 'Captures dominant facial variations in the dataset. Shows major differences in face orientation, lighting, and size across unconstrained real-world images.',
        2: 'Maps faces onto a plane to reveal clusters of similar individuals and expressions. Helps visualize how different faces relate to each other in high-dimensional space.',
        3: 'Adds a third dimension to capture subtle variations in facial features, expressions, and lighting conditions. Improves separation of different people and pose variations.'
    }
}

@app.route('/api/test', methods=['GET'])
def test_route():
    return jsonify({"status": "OK"})


def load_dataset_images(dataset_name, target_size=(64, 64), grayscale=True):
    """
    Load images from a built-in dataset folder
    
    Args:
        dataset_name: Name of the dataset folder (e.g., "Dataset 1")
        target_size: Target size for resizing
        grayscale: Whether to convert to grayscale
    
    Returns:
        Tuple of (processed_images, image_names, original_images_base64)
    """
    dataset_path = DATASETS_DIR / dataset_name
    
    if not dataset_path.exists():
        raise ValueError(f"Dataset '{dataset_name}' not found in {DATASETS_DIR}")
    
    # Supported image extensions
    image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif'}
    
    # Get all image files (case-insensitive matching)
    image_files = []
    for file_path in dataset_path.iterdir():
        if file_path.is_file() and file_path.suffix.lower() in image_extensions:
            image_files.append(file_path)
    
    if not image_files:
        raise ValueError(f"No images found in dataset '{dataset_name}'")
    
    # Sort files for consistent ordering
    image_files = sorted(image_files)
    
    processed_images = []
    image_names = []
    original_images = []
    
    for img_path in image_files:
        try:
            # Read image
            img = Image.open(img_path)
            
            # Store original for display
            original_img = img.copy()
            if grayscale:
                original_img = original_img.convert('L')
            else:
                original_img = original_img.convert('RGB')
            original_img = original_img.resize(target_size, Image.Resampling.LANCZOS)
            original_images.append(np.array(original_img))
            
            # Convert to grayscale if requested
            if grayscale:
                img = img.convert('L')
            else:
                img = img.convert('RGB')
            
            # Resize
            img = img.resize(target_size, Image.Resampling.LANCZOS)
            
            # Convert to numpy array and flatten
            img_array = np.array(img)
            flattened = img_array.flatten()
            
            processed_images.append(flattened)
            image_names.append(img_path.name)
            
        except Exception as e:
            print(f"Error processing {img_path}: {str(e)}")
            continue
    
    return np.array(processed_images), image_names, original_images


def validate_image_file(file):
    """
    Comprehensive validation for uploaded image files
    
    Args:
        file: Flask FileStorage object
    
    Returns:
        Tuple (is_valid, error_message)
    """
    # Check filename exists
    if not file or not file.filename:
        return False, "No filename provided"
    
    # Secure the filename (prevent path traversal)
    filename = secure_filename(file.filename)
    if not filename or filename == '':
        return False, "Invalid filename"
    
    # Check file extension
    file_ext = Path(filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        return False, f"File type '{file_ext}' not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
    
    # Check file size before reading
    if file.content_length and file.content_length > MAX_FILE_SIZE:
        return False, f"File '{filename}' exceeds max size of {MAX_FILE_SIZE / (1024*1024):.1f}MB"
    
    # Check MIME type
    mime_type = file.content_type or mimetypes.guess_type(filename)[0]
    if mime_type and mime_type not in ALLOWED_MIMETYPES:
        return False, f"MIME type '{mime_type}' not allowed. Expected image type."
    
    return True, None


def validate_image_content(img):
    """
    Validate image content to prevent attacks
    
    Args:
        img: PIL Image object
    
    Returns:
        Tuple (is_valid, error_message)
    """
    try:
        # Check image dimensions
        width, height = img.size
        
        if (width, height) < MIN_IMAGE_SIZE:
            return False, f"Image too small: {width}x{height}. Min: {MIN_IMAGE_SIZE[0]}x{MIN_IMAGE_SIZE[1]}"
        
        if (width, height) > MAX_IMAGE_SIZE:
            return False, f"Image too large: {width}x{height}. Max: {MAX_IMAGE_SIZE[0]}x{MAX_IMAGE_SIZE[1]}"
        
        # Check aspect ratio (prevent extreme aspect ratios that might indicate corrupted files)
        aspect_ratio = width / height if height > 0 else 1
        if aspect_ratio > 10 or aspect_ratio < 0.1:
            return False, f"Invalid aspect ratio: {aspect_ratio:.2f}. Must be between 0.1 and 10"
        
        return True, None
    
    except Exception as e:
        return False, f"Invalid image format: {str(e)}"


def preprocess_images(files, target_size=(64, 64), grayscale=True):
    """
    Preprocess uploaded images with SECURITY VALIDATION:
    - Strict file type validation
    - File size limits
    - Image content validation
    - Safe image processing
    - Error handling without exposing internals
    
    Returns:
        Tuple of (processed_images, image_names, original_images)
    
    Raises:
        ValueError: If validation fails
    """
    # Check number of files
    if len(files) == 0:
        raise ValueError("No files provided")
    
    if len(files) > MAX_FILES_PER_UPLOAD:
        raise ValueError(f"Too many files. Maximum: {MAX_FILES_PER_UPLOAD}")
    
    processed_images = []
    image_names = []
    original_images = []
    errors = []
    
    for idx, file in enumerate(files):
        try:
            # Step 1: Validate file metadata
            is_valid, error_msg = validate_image_file(file)
            if not is_valid:
                errors.append(f"File {idx + 1} ({file.filename}): {error_msg}")
                continue
            
            # Step 2: Read and verify image safely
            try:
                # Limit stream reading to MAX_FILE_SIZE
                file.stream.seek(0)
                image_data = file.stream.read(MAX_FILE_SIZE + 1)
                
                if len(image_data) > MAX_FILE_SIZE:
                    errors.append(f"File {idx + 1} ({file.filename}): Exceeds size limit")
                    continue
                
                # Open image from bytes
                img = Image.open(io.BytesIO(image_data))
                
                # Force load and verify (catches corrupted files)
                img.load()
                
            except Exception as e:
                errors.append(f"File {idx + 1} ({file.filename}): Failed to read image - {str(e)}")
                continue
            
            # Step 3: Validate image content
            is_valid, error_msg = validate_image_content(img)
            if not is_valid:
                errors.append(f"File {idx + 1} ({file.filename}): {error_msg}")
                continue
            
            # Step 4: Verify image format is safe
            try:
                if img.format and img.format.upper() not in ['JPEG', 'PNG', 'BMP', 'TIFF', 'GIF']:
                    errors.append(f"File {idx + 1} ({file.filename}): Unsupported format '{img.format}'")
                    continue
            except Exception as e:
                errors.append(f"File {idx + 1} ({file.filename}): Cannot verify format")
                continue
            
            # Step 5: Store original for display
            original_img = img.copy()
            if grayscale:
                original_img = original_img.convert('L')
            else:
                original_img = original_img.convert('RGB')
            original_img = original_img.resize(target_size, Image.Resampling.LANCZOS)
            original_images.append(np.array(original_img))
            
            # Step 6: Convert to grayscale if requested
            if grayscale:
                img = img.convert('L')
            else:
                img = img.convert('RGB')
            
            # Step 7: Resize
            img = img.resize(target_size, Image.Resampling.LANCZOS)
            
            # Step 8: Convert to numpy array and flatten
            img_array = np.array(img)
            flattened = img_array.flatten()
            
            # Step 9: Validate array (check for NaN or Inf)
            if not np.all(np.isfinite(flattened)):
                errors.append(f"File {idx + 1} ({file.filename}): Invalid pixel data")
                continue
            
            processed_images.append(flattened)
            image_names.append(secure_filename(file.filename))
            
        except Exception as e:
            errors.append(f"File {idx + 1}: Unexpected error - {type(e).__name__}")
            continue
    
    # Report any errors that occurred
    if errors:
        print("\n".join(errors))
    
    if len(processed_images) == 0:
        raise ValueError(f"Failed to process any images. Errors: {'; '.join(errors[:3])}")
    
    return np.array(processed_images), image_names, original_images


def apply_pca(data, n_components=2):
    """
    Apply PCA to the preprocessed image data
    
    Returns:
        transformed_data: PCA-transformed coordinates
        explained_variance: Explained variance ratio
        pca_model: Fitted PCA model for reconstruction
    """
    # Standardize the data
    scaler = StandardScaler()
    data_scaled = scaler.fit_transform(data)
    
    # Apply PCA
    pca = PCA(n_components=n_components)
    transformed = pca.fit_transform(data_scaled)
    
    return transformed, pca.explained_variance_ratio_, pca, scaler


def reconstruct_images(pca_model, scaler, transformed_data, original_shape):
    """
    Reconstruct images from PCA components
    """
    # Inverse transform
    reconstructed_scaled = pca_model.inverse_transform(transformed_data)
    reconstructed = scaler.inverse_transform(reconstructed_scaled)
    
    # Reshape back to image dimensions
    reconstructed = reconstructed.reshape(-1, *original_shape)
    
    return reconstructed


def image_to_base64(img_array, is_grayscale=True):
    """Convert numpy array to base64 string"""
    # Normalize to 0-255
    img_array = np.clip(img_array, 0, 255).astype(np.uint8)
    
    # Create PIL Image
    if is_grayscale:
        img = Image.fromarray(img_array, mode='L')
    else:
        img = Image.fromarray(img_array, mode='RGB')
    
    # Convert to base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return img_str


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "PCA Image API is running"})


@app.route('/api/datasets', methods=['GET'])
def list_datasets():
    """
    List available built-in datasets
    """
    try:
        if not DATASETS_DIR.exists():
            return jsonify({"datasets": []}), 200
        
        datasets = [d.name for d in DATASETS_DIR.iterdir() if d.is_dir()]
        return jsonify({"datasets": sorted(datasets)}), 200
    except Exception as e:
        print(f"Error listing datasets: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/pca', methods=['POST'])
def perform_pca():
    """
    Main PCA endpoint - FULLY CORRECTED VERSION
    Expects:
        - mode: "upload" or "dataset"
        - images: Multiple image files (if mode="upload")
        - dataset_name: Name of dataset (if mode="dataset")
        - n_components: Number of PCA components for reconstruction
        - dimensions: Number of dimensions for visualization (1, 2, or 3)
        - target_size: Optional, default 64x64
        - grayscale: Optional, default True
    """
    try:
        # Get parameters
        mode = request.form.get('mode', 'upload')
        dataset_name = request.form.get('dataset_name', '')  # ADD THIS LINE
        n_components = int(request.form.get('n_components', 10))
        dimensions = int(request.form.get('dimensions', 2))
        target_size = int(request.form.get('target_size', 64))
        grayscale = request.form.get('grayscale', 'true').lower() == 'true'
        
        print(f"\n{'='*60}")
        print(f"PCA Request - Mode: {mode}, n_components: {n_components}, dimensions: {dimensions}")
        print(f"{'='*60}")
        
        # Load images based on mode
        if mode == 'dataset':
            if not dataset_name:
                return jsonify({"status": "error", "error": "No dataset name provided"}), 400
            
            print(f"Loading dataset: {dataset_name}")
            processed_data, image_names, original_images = load_dataset_images(
                dataset_name,
                target_size=(target_size, target_size),
                grayscale=grayscale
            )
        else:  # mode == 'upload'
            files = request.files.getlist('files')
            print(f"Files received: {len(files)} files")
            
            if len(files) == 0:
                return jsonify({"status": "error", "error": "No images provided"}), 400
            
            processed_data, image_names, original_images = preprocess_images(
                files,
                target_size=(target_size, target_size),
                grayscale=grayscale
            )
        
        n_samples, n_features = processed_data.shape
        print(f"Data shape: {n_samples} samples x {n_features} features")
        
        if n_samples == 0:
            return jsonify({"status": "error", "error": "Failed to process any images"}), 400
        
        # Validate parameters
        if dimensions < 1 or dimensions > 3:
            return jsonify({"status": "error", "error": "Dimensions must be 1, 2, or 3"}), 400
        
        if n_components < 1:
            return jsonify({"status": "error", "error": "n_components must be at least 1"}), 400
        
        # Calculate maximum possible components
        max_possible = min(n_samples, n_features)
        print(f"Maximum possible components: {max_possible}")
        
        # Check if we have enough samples
        if n_samples < dimensions:
            return jsonify({
                "status": "error",
                "error": f"Need at least {dimensions} images for {dimensions}D visualization (have {n_samples})"
            }), 400
        
        if n_samples < n_components:
            return jsonify({
                "status": "error",
                "error": f"Need at least {n_components} images for {n_components} component reconstruction (have {n_samples})"
            }), 400
        
        # Determine total components to compute
        # We need enough for BOTH visualization and reconstruction
        total_components = max(n_components, dimensions)
        total_components = min(total_components, max_possible)
        
        print(f"Computing {total_components} total components")
        
        # Standardize the data
        print("Standardizing data...")
        scaler = StandardScaler()
        data_scaled = scaler.fit_transform(processed_data)
        print(f"Scaled data - mean: {data_scaled.mean():.6f}, std: {data_scaled.std():.6f}")
        
        # Fit PCA ONCE with all needed components
        print(f"Fitting PCA with {total_components} components...")
        pca = PCA(n_components=total_components)
        transformed = pca.fit_transform(data_scaled)
        
        print(f"PCA complete. Transformed shape: {transformed.shape}")
        print(f"Explained variance (first {min(5, total_components)} components): {pca.explained_variance_ratio_[:5]}")
        print(f"Total variance explained: {pca.explained_variance_ratio_.sum():.4f}")
        
        # Extract coordinates for visualization (first 'dimensions' components)
        coordinates = []
        for i, name in enumerate(image_names):
            coord = {
                "index": i,
                "filename": name,
                "x": float(transformed[i, 0])
            }
            if dimensions >= 2:
                coord["y"] = float(transformed[i, 1])
            if dimensions >= 3:
                coord["z"] = float(transformed[i, 2])
            coordinates.append(coord)
        
        print(f"Generated {len(coordinates)} coordinate points for {dimensions}D visualization")
        
        # Reconstruct images using first n_components
        original_shape = (target_size, target_size) if grayscale else (target_size, target_size, 3)
        print(f"Reconstructing with {n_components} components...")
        
        # Use only first n_components for reconstruction
        transformed_subset = transformed[:, :n_components]
        print(f"Reconstruction subset shape: {transformed_subset.shape}")
        
        # For inverse transform, we need to provide data in the full space
        # Pad with zeros for unused components
        transformed_padded = np.zeros((n_samples, total_components))
        transformed_padded[:, :n_components] = transformed_subset
        
        # Inverse transform
        reconstructed_scaled = pca.inverse_transform(transformed_padded)
        reconstructed_data = scaler.inverse_transform(reconstructed_scaled)
        
        # Reshape to image dimensions
        reconstructed_images = reconstructed_data.reshape(n_samples, *original_shape)
        print(f"Reconstructed images shape: {reconstructed_images.shape}")
        
        # Calculate reconstruction error
        mse = np.mean((processed_data - reconstructed_data) ** 2)
        print(f"Reconstruction MSE: {mse:.4f}")
        
        # Prepare image data
        original_images_data = []
        reconstructed_images_data = []
        
        for i, (orig_img, recon_img) in enumerate(zip(original_images, reconstructed_images)):
            original_images_data.append({
                "index": i,
                "filename": image_names[i],
                "image": image_to_base64(orig_img, grayscale)
            })
            reconstructed_images_data.append({
                "index": i,
                "filename": image_names[i],
                "image": image_to_base64(recon_img, grayscale)
            })
        
        print(f"Encoded {len(original_images_data)} image pairs")
        
        # Generate eigenimages (principal components)
        print(f"Generating {n_components} eigenimages...")
        eigenimages = []
        
        for i in range(n_components):
            component = pca.components_[i]
            
            # Reshape to image (always grayscale for eigenimages)
            if grayscale:
                component_img = component.reshape(target_size, target_size)
            else:
                # For RGB, we still show grayscale eigenimages
                component_img = component[:target_size * target_size].reshape(target_size, target_size)
            
            # Normalize for visualization
            c_min, c_max = component_img.min(), component_img.max()
            if c_max > c_min:
                component_normalized = (component_img - c_min) / (c_max - c_min) * 255
            else:
                component_normalized = np.zeros_like(component_img)
            
            eigenimages.append({
                "index": i,
                "component": i + 1,
                "explained_variance": float(pca.explained_variance_ratio_[i]),
                "image": image_to_base64(component_normalized, True)
            })
        
        # Prepare final response
        response = {
            "status": "success",
            "coordinates": coordinates,
            "variance": {
                "explained_variance": [float(v) for v in pca.explained_variance_ratio_],
                "cumulative_variance": [float(v) for v in np.cumsum(pca.explained_variance_ratio_)]
            },
            "original_images": original_images_data,
            "reconstructed_images": reconstructed_images_data,
            "eigenimages": eigenimages,
            "metadata": {
                "n_images": n_samples,
                "n_components_reconstruction": n_components,
                "n_components_total": total_components,
                "visualization_dimensions": dimensions,
                "reconstruction_mse": float(mse),
                "total_variance_explained": float(pca.explained_variance_ratio_.sum()),
                "mode": mode,
                "dataset_note": DATASET_NOTES.get(dataset_name if mode == 'dataset' else None, {}).get(dimensions, '')
            }
        }
        
        # ADD THESE DEBUG LINES:
        print(f"DEBUG - Mode: {mode}")
        print(f"DEBUG - Dataset name: {dataset_name}")
        print(f"DEBUG - Dimensions: {dimensions}")
        print(f"DEBUG - Dataset note: {response['metadata']['dataset_note']}")
        print(f"DEBUG - Available datasets in DATASET_NOTES: {list(DATASET_NOTES.keys())}")
        
        print(f"Response prepared successfully")
        print(f"{'='*60}\n")
        
        return jsonify(response), 200
        
    except Exception as e:
        error_msg = f"Error in PCA processing: {str(e)}"
        print(f"\n{'!'*60}")
        print(error_msg)
        traceback.print_exc()
        print(f"{'!'*60}\n")
        return jsonify({"status": "error", "error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)