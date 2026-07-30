import zipfile, re
from pathlib import Path
p = Path('docs/SalesDesk_POS_Frontend_PRD.docx')
with zipfile.ZipFile(p) as z:
    data = z.read('word/document.xml').decode('utf-8', errors='replace')
text = re.sub(r'<[^>]+>', ' ', data)
text = re.sub(r'\s+', ' ', text)
for term in ['Admin', 'Cashier', 'dashboard', 'products', 'POS', 'sales', 'inventory', 'login', 'settings', 'receipt']:
    idx = text.lower().find(term.lower())
    if idx != -1:
        print('TERM', term, 'AT', idx)
        print(text[max(0, idx-250):idx+1200])
        print('---')
