from io import StringIO

from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfparser import PDFParser
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer

from Backend_build.Summarization_Models.LexRank_v_1.summarizer import summarization


def basic_extraction(pdf_path):
    output_string = StringIO()
    with open(pdf_path, 'rb') as in_file:
        parser = PDFParser(in_file)
        doc = PDFDocument(parser)
        rsrcmgr = PDFResourceManager()
        device = TextConverter(rsrcmgr, output_string, laparams=LAParams())
        interpreter = PDFPageInterpreter(rsrcmgr, device)
        for page in PDFPage.create_pages(doc):
            interpreter.process_page(page)

    print(output_string.getvalue())

    # open text file
    text_file = open("basic_extract.txt", "w")

    # write string to file
    n = text_file.write(output_string.getvalue())

    # close file
    text_file.close()
    return


def entity_based_extraction(pdf_path):
    final_string = ''
    for page_layout in extract_pages(pdf_path):
        for element in page_layout:
            if isinstance(element, LTTextContainer):
                final_string += element.get_text()

    return final_string

string_out = entity_based_extraction(pdf_path="Are you Solving right problem?.pdf")

summary = summarization(full_text=string_out, reduce_length=2)
print(summary)
