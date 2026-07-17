import fitz  # PyMuPDF
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image
import io
import requests
from bs4 import BeautifulSoup
import logging

logger = logging.getLogger(__name__)

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    从 PDF 字节流中提取文本。
    优先使用 PyMuPDF 提取数字文本，如果提取内容过少，则使用 OCR。
    """
    text = ""
    try:
        # 尝试使用 PyMuPDF 提取文字
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        for page in doc:
            text += page.get_text()
        doc.close()

        # 如果提取出的文本太短，可能是扫描件，尝试 OCR
        if len(text.strip()) < 50:
            logger.info("PDF text too short, falling back to OCR")
            images = convert_from_bytes(pdf_bytes)
            ocr_text = ""
            for img in images:
                ocr_text += pytesseract.image_to_string(img, lang='chi_sim+eng')
            return ocr_text

    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        # 最后的保底：再次尝试强制 OCR
        try:
            images = convert_from_bytes(pdf_bytes)
            text = ""
            for img in images:
                text += pytesseract.image_to_string(img, lang='chi_sim+eng')
        except Exception as ocr_e:
            logger.error(f"OCR fallback failed: {ocr_e}")

    return text

def extract_text_from_image(image_bytes: bytes) -> str:
    """
    从图片字节流中提取文本 (OCR)。
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image, lang='chi_sim+eng')
        return text
    except Exception as e:
        logger.error(f"Error extracting text from image: {e}")
        return ""

def extract_jd_from_url(url: str) -> str:
    """
    从职位链接抓取 JD 文本。
    使用简单的 requests + BeautifulSoup 实现。
    """
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        # 简单提取 body 里的文本，去掉 script 和 style
        soup = BeautifulSoup(response.text, 'html.parser')
        for script_or_style in soup(["script", "style"]):
            script_or_style.decompose()

        text = soup.get_text(separator='\n')
        # 简单清洗
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = '\n'.join(chunk for chunk in chunks if chunk)

        return text
    except Exception as e:
        logger.error(f"Error fetching JD from URL: {e}")
        return ""
