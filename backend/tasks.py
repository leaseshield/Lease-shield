import io
import time
import hashlib
from redis import Redis
from rq import Queue, get_current_job
import fitz  # PyMuPDF
import pdfplumber
try:
    from pdf2image import convert_from_bytes
    import pytesseract
except Exception:  # pragma: no cover
    convert_from_bytes = None
    pytesseract = None

import rules

redis_conn = Redis(host='localhost', port=6379, decode_responses=False)
queue = Queue('analysis', connection=redis_conn)


def parse_pdf(data: bytes) -> str:
    """Parse PDF bytes using PyMuPDF, fall back to pdfplumber then Tesseract."""
    # PyMuPDF
    try:
        doc = fitz.open(stream=data, filetype='pdf')
        text = ''.join(page.get_text() for page in doc)
        if text.strip():
            return text
    except Exception:
        pass
    # pdfplumber
    try:
        with pdfplumber.open(io.BytesIO(data)) as pdf:
            text = ''.join(page.extract_text() or '' for page in pdf.pages)
            if text.strip():
                return text
    except Exception:
        pass
    # Tesseract
    if convert_from_bytes and pytesseract:
        try:
            images = convert_from_bytes(data)
            text = ''.join(pytesseract.image_to_string(img) for img in images)
            if text.strip():
                return text
        except Exception:
            pass
    raise ValueError('Unable to parse PDF')


def analyze(pdf_bytes: bytes):
    job = get_current_job()
    job.meta['progress'] = 10
    job.save_meta()
    text = parse_pdf(pdf_bytes)
    job.meta['progress'] = 70
    job.save_meta()
    clause_results = rules.analyze_text(text)
    text_hash = hashlib.sha256(text.encode('utf-8')).hexdigest()
    job.meta['progress'] = 100
    job.save_meta()
    return {'hash': text_hash, 'clauses': clause_results}
