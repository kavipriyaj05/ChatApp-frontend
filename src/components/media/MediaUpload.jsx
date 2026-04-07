import { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadMedia, clearUploadedFiles } from '../../features/media/mediaSlice';
import { FiUploadCloud, FiFile, FiImage, FiVideo, FiMusic, FiX, FiCheck } from 'react-icons/fi';
import './MediaUpload.css';

const FILE_TYPE_ICONS = {
  image: FiImage,
  video: FiVideo,
  audio: FiMusic,
};

function getFileIcon(mimeType) {
  const category = mimeType?.split('/')[0];
  return FILE_TYPE_ICONS[category] || FiFile;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function MediaUpload({ onUploadComplete, maxSizeMB = 50, accept }) {
  const dispatch = useDispatch();
  const { uploading, uploadedFiles, error } = useSelector((s) => s.media);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const maxBytes = maxSizeMB * 1048576;

  const handleFile = useCallback(
    (file) => {
      if (!file) return;
      if (file.size > maxBytes) {
        alert(`File exceeds ${maxSizeMB}MB limit`);
        return;
      }
      setSelectedFile(file);

      // Generate preview for images/videos
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview({ type: 'image', url: e.target.result });
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        setPreview({ type: 'video', url: URL.createObjectURL(file) });
      } else {
        setPreview(null);
      }
    },
    [maxBytes, maxSizeMB]
  );

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleInputChange = (e) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const result = await dispatch(uploadMedia(selectedFile));
    if (uploadMedia.fulfilled.match(result)) {
      onUploadComplete?.(result.payload);
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const FileIcon = selectedFile ? getFileIcon(selectedFile.type) : FiFile;

  return (
    <div className="media-upload">
      {/* Drop zone */}
      <div
        className={`media-upload__dropzone ${dragActive ? 'media-upload__dropzone--active' : ''} ${selectedFile ? 'media-upload__dropzone--has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        id="media-upload-dropzone"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="media-upload__input"
          onChange={handleInputChange}
          accept={accept}
          id="media-upload-input"
        />

        {!selectedFile ? (
          <div className="media-upload__placeholder">
            <div className="media-upload__icon-ring">
              <FiUploadCloud className="media-upload__icon" />
            </div>
            <p className="media-upload__title">Drag & drop a file here</p>
            <p className="media-upload__subtitle">
              or <span className="media-upload__browse">browse</span> to choose — max {maxSizeMB}MB
            </p>
          </div>
        ) : (
          <div className="media-upload__preview" onClick={(e) => e.stopPropagation()}>
            {preview?.type === 'image' && (
              <img src={preview.url} alt="Preview" className="media-upload__preview-img" />
            )}
            {preview?.type === 'video' && (
              <video src={preview.url} className="media-upload__preview-video" controls />
            )}
            {!preview && (
              <div className="media-upload__file-info">
                <FileIcon size={40} />
              </div>
            )}
            <div className="media-upload__meta">
              <span className="media-upload__filename">{selectedFile.name}</span>
              <span className="media-upload__filesize">{formatSize(selectedFile.size)}</span>
            </div>
            <button className="media-upload__clear" onClick={handleClear} id="media-upload-clear">
              <FiX />
            </button>
          </div>
        )}
      </div>

      {/* Upload button */}
      {selectedFile && (
        <button
          className="media-upload__btn"
          onClick={handleUpload}
          disabled={uploading}
          id="media-upload-submit"
        >
          {uploading ? (
            <>
              <span className="media-upload__spinner" />
              Uploading…
            </>
          ) : (
            <>
              <FiCheck /> Upload
            </>
          )}
        </button>
      )}

      {/* Error */}
      {error && <p className="media-upload__error">{error}</p>}
    </div>
  );
}
