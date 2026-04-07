import { FiFile, FiImage, FiVideo, FiMusic, FiDownload, FiTrash2 } from 'react-icons/fi';
import './MediaPreview.css';

const API = 'http://localhost:8080';

function getIcon(fileType) {
  if (!fileType) return FiFile;
  if (fileType.startsWith('image')) return FiImage;
  if (fileType.startsWith('video')) return FiVideo;
  if (fileType.startsWith('audio')) return FiMusic;
  return FiFile;
}

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function MediaPreview({ media, onDelete, compact = false }) {
  if (!media) return null;

  const { id, fileName, fileType, fileSize, url } = media;
  const fullUrl = url?.startsWith('http') ? url : `${API}${url}`;
  const Icon = getIcon(fileType);
  const isImage = fileType?.startsWith('image');
  const isVideo = fileType?.startsWith('video');
  const isAudio = fileType?.startsWith('audio');

  if (compact) {
    return (
      <div className="media-preview media-preview--compact" id={`media-preview-${id}`}>
        {isImage ? (
          <img src={fullUrl} alt={fileName} className="media-preview__thumb" />
        ) : (
          <div className="media-preview__icon-box">
            <Icon size={20} />
          </div>
        )}
        <span className="media-preview__name-compact">{fileName}</span>
      </div>
    );
  }

  return (
    <div className="media-preview" id={`media-preview-${id}`}>
      <div className="media-preview__content">
        {isImage && (
          <img src={fullUrl} alt={fileName} className="media-preview__image" loading="lazy" />
        )}
        {isVideo && (
          <video src={fullUrl} className="media-preview__video" controls preload="metadata" />
        )}
        {isAudio && (
          <div className="media-preview__audio-wrapper">
            <Icon size={32} className="media-preview__audio-icon" />
            <audio src={fullUrl} controls className="media-preview__audio" preload="metadata" />
          </div>
        )}
        {!isImage && !isVideo && !isAudio && (
          <div className="media-preview__generic">
            <Icon size={48} />
            <span className="media-preview__ext">
              {fileName?.split('.').pop()?.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="media-preview__footer">
        <div className="media-preview__info">
          <span className="media-preview__name">{fileName}</span>
          {fileSize && <span className="media-preview__size">{formatSize(fileSize)}</span>}
        </div>
        <div className="media-preview__actions">
          <a
            href={fullUrl}
            download={fileName}
            className="media-preview__action-btn"
            title="Download"
            id={`media-download-${id}`}
          >
            <FiDownload />
          </a>
          {onDelete && (
            <button
              className="media-preview__action-btn media-preview__action-btn--danger"
              onClick={() => onDelete(id)}
              title="Delete"
              id={`media-delete-${id}`}
            >
              <FiTrash2 />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
