import os
import uuid
from typing import Optional, Tuple
import aiofiles
from fastapi import UploadFile, HTTPException
import logging
from .text_parser import TextParser

logger = logging.getLogger(__name__)

class FileService:
    """Service for handling file uploads and processing"""
    
    def __init__(self, upload_dir: str = "/Users/jayvora/Desktop/Resume-Analyze/uploads"):
        self.upload_dir = upload_dir
        self.text_parser = TextParser()
        self.allowed_extensions = {'.pdf', '.docx', '.doc', '.txt'}
        self.max_file_size = 10 * 1024 * 1024  # 10MB
        
        # Create upload directory if it doesn't exist
        os.makedirs(upload_dir, exist_ok=True)
    
    async def save_uploaded_file(self, file: UploadFile) -> Tuple[str, str]:
        """Save uploaded file and return file path and type"""
        
        # Validate file
        self._validate_file(file)
        
        # Generate unique filename
        file_extension = self._get_file_extension(file.filename)
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(self.upload_dir, unique_filename)
        
        try:
            # Save file
            async with aiofiles.open(file_path, 'wb') as f:
                content = await file.read()
                await f.write(content)
            
            logger.info(f"File saved successfully: {file_path}")
            return file_path, file_extension[1:]  # Remove dot from extension
            
        except Exception as e:
            logger.error(f"Error saving file: {str(e)}")
            # Clean up file if it exists
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    def extract_text_from_file(self, file_path: str, file_type: str) -> str:
        """Extract text from uploaded file based on its type"""
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
        
        try:
            if file_type.lower() == 'pdf':
                text = self.text_parser.extract_text_from_pdf(file_path)
            elif file_type.lower() in ['docx', 'doc']:
                text = self.text_parser.extract_text_from_docx(file_path)
            elif file_type.lower() == 'txt':
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    text = f.read()
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_type}")
            
            # Clean the extracted text
            cleaned_text = self.text_parser.clean_text(text)
            
            if not cleaned_text.strip():
                raise HTTPException(status_code=400, detail="No text could be extracted from the file")
            
            return cleaned_text
            
        except Exception as e:
            logger.error(f"Error extracting text from file: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")
    
    def cleanup_file(self, file_path: str) -> None:
        """Remove uploaded file from disk"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"File cleaned up: {file_path}")
        except Exception as e:
            logger.warning(f"Failed to cleanup file {file_path}: {str(e)}")
    
    def _validate_file(self, file: UploadFile) -> None:
        """Validate uploaded file"""
        
        # Check file size
        if hasattr(file, 'size') and file.size and file.size > self.max_file_size:
            raise HTTPException(
                status_code=413, 
                detail=f"File too large. Maximum size allowed is {self.max_file_size // (1024*1024)}MB"
            )
        
        # Check file extension
        if not file.filename:
            raise HTTPException(status_code=400, detail="Filename is required")
        
        file_extension = self._get_file_extension(file.filename)
        if file_extension.lower() not in self.allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"File type not supported. Allowed types: {', '.join(self.allowed_extensions)}"
            )
    
    def _get_file_extension(self, filename: str) -> str:
        """Extract file extension from filename"""
        if '.' not in filename:
            return ''
        return '.' + filename.rsplit('.', 1)[1].lower()
    
    def get_file_preview(self, text: str, max_length: int = 200) -> str:
        """Generate a preview of the extracted text"""
        if len(text) <= max_length:
            return text
        return text[:max_length] + "..."