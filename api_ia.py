import json
import logging
import mimetypes
import os
from io import BytesIO
from math import isfinite

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from openpyxl import load_workbook
from starlette.concurrency import run_in_threadpool


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_NAME = "gemini-2.5-flash"
XLSX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
ALLOWED_MIME_TYPES = {"application/pdf", "image/png", "image/jpeg", "image/webp", XLSX_MIME_TYPE}
PROMPT = (
    'Você é um especialista em logística. Leia este documento (Packing List / AWB / Invoice). '
    'Extraia os volumes, dimensões e pesos das peças. Converta tudo estritamente para METROS '
    '(comprimento, largura, altura) e TONELADAS (peso total dividido pela quantidade). Retorne '
    'ÚNICA e EXCLUSIVAMENTE um array JSON válido, sem formatação markdown. O formato de cada '
    'objeto deve ser: {"comp": float, "larg": float, "alt": float, "peso": float, "qtd": int, '
    '"type": "caixa", "camadas": 1, "armador": "generico"}.'
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_workbook_text(file_bytes: bytes) -> str:
    workbook = load_workbook(BytesIO(file_bytes), read_only=True, data_only=True)
    try:
        sheets = []
        for worksheet in workbook.worksheets:
            rows = []
            for row in worksheet.iter_rows(values_only=True):
                values = [str(value).strip() if value is not None else "" for value in row]
                while values and not values[-1]:
                    values.pop()
                if any(values):
                    rows.append("\t".join(values))
            if rows:
                sheets.append(f"Planilha: {worksheet.title}\n" + "\n".join(rows))
        if not sheets:
            raise ValueError("A planilha não contém dados.")
        return "\n\n".join(sheets)
    finally:
        workbook.close()


def extract_document(file_bytes: bytes, mime_type: str, api_key: str, workbook_text: str = "") -> str:
    client = genai.Client(api_key=api_key)
    contents = [PROMPT]
    if workbook_text:
        contents.append(f"Conteúdo extraído da planilha XLSX:\n{workbook_text}")
    else:
        contents.append(types.Part.from_bytes(data=file_bytes, mime_type=mime_type))
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=contents,
        config=types.GenerateContentConfig(response_mime_type="application/json"),
    )
    if not response.text:
        raise ValueError("O Gemini retornou uma resposta vazia.")
    return response.text


def parse_number(value, field_name: str) -> float:
    if isinstance(value, bool):
        raise ValueError(f"O campo {field_name} não é numérico.")
    if isinstance(value, str):
        value = value.strip().replace(",", ".")
    try:
        number = float(value)
    except (TypeError, ValueError) as error:
        raise ValueError(f"O campo {field_name} não é numérico.") from error
    if not isfinite(number):
        raise ValueError(f"O campo {field_name} não é finito.")
    return number


def normalize_load(item: dict, index: int) -> dict:
    aliases = {
        "comp": ("comp", "comprimento", "length"),
        "larg": ("larg", "largura", "width"),
        "alt": ("alt", "altura", "height"),
        "peso": ("peso", "weight", "peso_toneladas"),
        "qtd": ("qtd", "quantidade", "quantity", "volumes"),
    }

    values = {}
    for field, names in aliases.items():
        value = next((item[name] for name in names if item.get(name) is not None), None)
        if value is None:
            raise ValueError(f"Falta o campo {field} no item {index}.")
        values[field] = parse_number(value, field)

    if values["comp"] <= 0 or values["larg"] <= 0 or values["alt"] <= 0:
        raise ValueError(f"As dimensões do item {index} devem ser maiores que zero.")
    if values["peso"] < 0:
        raise ValueError(f"O peso do item {index} não pode ser negativo.")
    if values["qtd"] < 1 or not values["qtd"].is_integer():
        raise ValueError(f"A quantidade do item {index} deve ser um inteiro positivo.")

    return {
        **values,
        "qtd": int(values["qtd"]),
        "type": "caixa",
        "camadas": 1,
        "armador": "generico",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/ler-documento")
async def ler_documento(file: UploadFile = File(...)):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Configure a variável de ambiente GEMINI_API_KEY para usar a extração por IA.",
        )

    filename = file.filename or ""
    mime_type = XLSX_MIME_TYPE if filename.lower().endswith(".xlsx") else file.content_type
    if mime_type not in ALLOWED_MIME_TYPES:
        mime_type = mimetypes.guess_type(filename)[0]
    if mime_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=415,
            detail="Formato não suportado. Envie um PDF, imagem PNG/JPG/WebP ou planilha XLSX.",
        )

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="O arquivo enviado está vazio.")

    workbook_text = ""
    if mime_type == XLSX_MIME_TYPE:
        try:
            workbook_text = await run_in_threadpool(extract_workbook_text, file_bytes)
        except Exception as error:
            logger.exception("Falha ao ler a planilha XLSX enviada.")
            raise HTTPException(
                status_code=400,
                detail="Não foi possível abrir a planilha. Confirme se o arquivo XLSX é válido.",
            ) from error

    try:
        response_text = await run_in_threadpool(
            extract_document, file_bytes, mime_type, api_key, workbook_text
        )
    except Exception as error:
        logger.exception("Falha ao solicitar extração de documento ao Gemini.")
        raise HTTPException(
            status_code=502,
            detail="Não foi possível extrair os dados do documento com o Gemini.",
        ) from error

    try:
        result = json.loads(response_text)
    except json.JSONDecodeError as error:
        logger.exception("O Gemini retornou conteúdo que não é JSON válido.")
        raise HTTPException(
            status_code=502,
            detail="A resposta da IA não estava em formato JSON válido.",
        ) from error

    if not isinstance(result, list) or any(not isinstance(item, dict) for item in result):
        raise HTTPException(
            status_code=502,
            detail="A resposta da IA não contém uma lista válida de cargas.",
        )

    try:
        return [normalize_load(item, index + 1) for index, item in enumerate(result)]
    except ValueError as error:
        logger.warning("A resposta do Gemini contém dados de carga inválidos: %s", error)
        raise HTTPException(
            status_code=502,
            detail=f"A IA não conseguiu identificar todas as medidas e quantidades: {error}",
        ) from error
