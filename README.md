#  PCA Image Visualizer

<div align="center">
  <img src="https://github.com/user-attachments/assets/0ca5d4c7-0101-40b4-9a86-2748e9a45373" width="100%" alt="PCA Image Visualizer Screenshot">
</div>


**An interactive web application for visualizing Principal Component Analysis on image datasets**

[![Demo](https://img.shields.io/badge/Demo-Live-success?style=for-the-badge)](https://pca-image-visualizer.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation)

</div>

---

## 📖 Overview

**PCA Image Visualizer** is a powerful, educational tool that helps you understand and visualize Principal Component Analysis (PCA) applied to image datasets. Whether you're a data scientist, researcher, student, or enthusiast, this application makes it easy to explore how PCA captures variance and patterns in visual data.

### What is PCA?

Principal Component Analysis is a dimensionality reduction technique that identifies the directions (principal components) of maximum variance in high-dimensional data. When applied to images, PCA can:

- **Compress** images while preserving essential features
- **Reveal** hidden patterns and similarities in image collections
- **Visualize** high-dimensional image data in 1D, 2D, or 3D space
- **Extract** eigenimages representing the core visual patterns

---

## ✨ Features

### 🎯 Core Functionality

- **Interactive Visualization**: Explore your data in 1D, 2D, or 3D projections with smooth Plotly charts
- **Real-time Image Reconstruction**: See how images are reconstructed from principal components
- **Built-in Datasets**: Three curated datasets (cat faces, handwritten digits, chest X-rays) ready to explore
- **Custom Upload**: Analyze your own image collections
- **Eigenimage Display**: Visualize the principal components as images
- **Click-to-Compare**: Click any point in the visualization to compare original vs reconstructed images

### 🎨 User Experience

- **Modern Dark UI**: Sleek, gradient-rich interface with glassmorphism effects
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Drag & Drop**: Easy image upload with drag-and-drop support
- **Real-time Feedback**: Loading states, error handling, and progress indicators
- **Export Capabilities**: Download PCA coordinates as CSV files

### 🔬 Technical Features

- **Automatic Grayscale Conversion**: Optimizes images for PCA analysis
- **Standardized Preprocessing**: Consistent image resizing and normalization
- **Variance Explained**: Detailed breakdown of explained variance by component
- **Flexible Component Selection**: Choose 1-100 components for reconstruction
- **Educational Notes**: Context-aware explanations for each dataset

---

## 🎬 Demo


https://github.com/user-attachments/assets/4ab754c5-117b-4824-a831-57e3f91a90f5



### 🌐 Live Application

**[Try the Live Demo](https://pca-image-visualizer.vercel.app/)** 

### 📹 Video Walkthrough



### 📸 Screenshots

#### Main Interface - Dataset Selection
<img src="https://github.com/user-attachments/assets/e13d261c-1663-444d-b288-73f5f184df4c" width="100%" alt="Dataset Selection Interface">

<br>

#### 3D Interactive Plot
<img src="https://github.com/user-attachments/assets/1de92d13-942d-441c-844c-4f42dfa7935e" width="100%" alt="3D PCA Visualization">

<br>

#### 2D PCA Visualization
<img src="https://github.com/user-attachments/assets/795f3a79-3a85-4450-8ae0-049cfc4008b5" width="100%" alt="2D PCA Visualization">

<br>

#### 1D PCA Visualization

<img width="1260" height="882" alt="image" src="https://github.com/user-attachments/assets/bdc9fbda-0c76-4bad-aa0e-e2bfbe757f42" />

<br>

#### Image Reconstruction Comparison
<img src="https://github.com/user-attachments/assets/7da2ae89-b166-4698-a90d-141f913a27ce" width="100%" alt="Original vs Reconstructed Comparison">

<br>

#### Eigenimages Gallery
<img src="https://github.com/user-attachments/assets/382b0515-7041-41fc-939f-e874075491f1" width="100%" alt="Principal Components Gallery">

---

## 🚀 Installation

### Prerequisites

- **Python** 3.8 or higher
- **Node.js** 14 or higher
- **npm** or **yarn**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/pca-image-visualizer.git
cd pca-image-visualizer
```

### 2️⃣ Backend Setup (Flask)

```bash
# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

**Create `requirements.txt`:**
```txt
flask==2.3.3
flask-cors==4.0.0
numpy==1.24.3
scikit-learn==1.3.0
Pillow==10.0.0
```

### 3️⃣ Frontend Setup (React)

```bash
# Navigate to frontend directory (if separate)
cd frontend

# Install Node dependencies
npm install

# Or with yarn
yarn install
```

### 4️⃣ Dataset Setup

Create a `datasets` directory in your backend folder and organize your built-in datasets:

```
backend/
├── datasets/
│   ├── dataset1/  (Cat faces)
│   ├── dataset2/  (Handwritten digits)
│   └── dataset3/  (Chest X-rays)
├── app.py
└── requirements.txt
```

---

## 🎮 Usage

### Running the Application

#### Start the Backend Server

```bash
# From backend directory with venv activated
python app.py
```

The Flask server will start at `http://localhost:5000`

#### Start the Frontend Development Server

```bash
# From frontend directory
npm start

# Or with yarn
yarn start
```

The React app will open at `http://localhost:3000`

### Using the Application

1. **Choose Data Source**
   - Select a **Built-in Dataset** (recommended for learning)
   - Or **Upload Your Own Images** (5+ similar images recommended)

2. **Configure Analysis**
   - Set **Reconstruction Components** (1-100): How many principal components to use for image reconstruction
   - Choose **Visualization Mode** (1D/2D/3D): Dimensionality of the PCA projection

3. **Run Analysis**
   - Click **"Run PCA Analysis"**
   - Wait for processing (typically 2-10 seconds)

4. **Explore Results**
   - **Interact** with the PCA plot (zoom, pan, rotate in 3D)
   - **Click** any data point to compare original vs reconstructed images
   - **Review** eigenimages to see the principal components
   - **Export** results as CSV for further analysis

---

## 🏗️ Project Structure

```
pca-image-visualizer/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── datasets/              # Built-in image datasets
│   │   ├── dataset1/
│   │   ├── dataset2/
│   │   └── dataset3/
│   └── requirements.txt       # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── App.css           # Styling
│   │   └── index.js          # Entry point
│   ├── public/
│   └── package.json          # Node dependencies
│
├── README.md
├── LICENSE
└── .gitignore
```

---

## 🔧 Configuration

### Adjusting Image Size

In `app.py`, modify the `target_size` parameter:

```python
target_size = (64, 64)  # Default: 64x64 pixels
```

### Customizing UI Colors

In `App.css`, adjust the CSS variables:

```css
:root {
  --primary-color: #8B5CF6;
  --secondary-color: #3B82F6;
  --background-color: #0a0a0f;
}
```

---

## 📚 Documentation

### API Endpoints

#### `GET /api/health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "message": "PCA Image API is running"
}
```

#### `GET /api/datasets`
List available built-in datasets

**Response:**
```json
{
  "datasets": ["dataset1", "dataset2", "dataset3"]
}
```

#### `POST /api/pca`
Perform PCA analysis on images

**Parameters:**
- `mode`: "upload" or "dataset"
- `dataset_name`: Name of dataset (if mode="dataset")
- `files`: Image files (if mode="upload")
- `n_components`: Number of components (1-100)
- `dimensions`: Visualization dimensions (1, 2, or 3)
- `grayscale`: Convert to grayscale (default: true)

**Response:**
```json
{
  "status": "success",
  "coordinates": [...],
  "variance": {...},
  "original_images": [...],
  "reconstructed_images": [...],
  "eigenimages": [...],
  "metadata": {...}
}
```

### Understanding the Results

**Explained Variance**: Percentage of total variance captured by each principal component. Higher = more important.

**Eigenimages**: Visual representations of the principal components. They show the patterns PCA discovered.

**Reconstruction Quality**: With more components, reconstructed images more closely match originals. Fewer components = more compression but less detail.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint/Prettier for JavaScript/React code
- Write descriptive commit messages
- Add tests for new features
- Update documentation as needed

---

## 🐛 Troubleshooting

### Common Issues

**"No images provided" error**
- Ensure you've selected files or chosen a dataset before clicking "Run PCA Analysis"

**"Need at least X images" error**
- PCA requires at least as many images as the number of components or dimensions you've selected

**Images not displaying**
- Check that image files are valid formats (JPG, PNG, BMP, TIFF)
- Ensure backend server is running and accessible

**CORS errors**
- Verify `flask-cors` is installed
- Check that frontend is making requests to correct backend URL

---

## 📊 Example Use Cases

### 1. Face Recognition Research
Explore eigenfaces using the cat faces dataset to understand how facial recognition systems work.

### 2. Handwriting Analysis
Use the digits dataset to see how PCA separates different handwriting styles and digit shapes.

### 3. Medical Imaging
Analyze chest X-rays to understand variance in normal vs pneumonia cases.

### 4. Custom Collections
Upload your own photos (landscapes, products, artwork) to discover hidden patterns.

---

## 🎓 Educational Resources

### Learn More About PCA

- [StatQuest: PCA Explained](https://www.youtube.com/watch?v=FgakZw6K1QQ)
- [Scikit-learn PCA Documentation](https://scikit-learn.org/stable/modules/decomposition.html#pca)
- [Understanding Eigenfaces](https://en.wikipedia.org/wiki/Eigenface)

### Related Topics

- Dimensionality Reduction
- Singular Value Decomposition (SVD)
- t-SNE and UMAP
- Autoencoders

---

## 👤 Author

**This project was created and is maintained solely by:**

**Adam KASSIS**

- 🌐 Portfolio: [my-portfolio.com](https://portfolio2-silk-ten-50.vercel.app/)
- 💼 LinkedIn: [linkedin.com/in/AdamKASSIS](https://www.linkedin.com/in/adam-kassis-036569326/)
- 📧 Email: adam.kassis@outlook.fr
- 💻 GitHub: [@Adam-KASSIS](https://github.com/Adam-KASSIS)

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Adam KASSIS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**Note**: All rights to the original work, design, and implementation belong exclusively to Adam KASSIS.

---

## 🙏 Acknowledgments

This project utilizes the following open-source libraries and resources:

- **Plotly.js** - Interactive data visualization library
- **Scikit-learn** - Machine learning library for PCA implementation
- **React** - Frontend framework
- **Flask** - Backend web framework
- **Lucide Icons** - Icon library

**Dataset Sources:**
- Cat faces dataset from Kaggle
- MNIST handwritten digits database
- Chest X-ray images from Kaggle Medical Imaging collections

*While this project leverages these excellent tools and datasets, all original code, architecture, design, and implementation are the sole work of Adam KASSIS.*

---

## ⭐ Star History

If you find this project helpful, please consider giving it a star!

[![Star History Chart](https://api.star-history.com/svg?repos=Adam-KASSIS/pca-image-visualizer&type=Date)](https://star-history.com/#Adam-KASSIS/pca-image-visualizer&Date)

---

<div align="center">

**[Back to Top](#-pca-image-visualizer)**

</div>
