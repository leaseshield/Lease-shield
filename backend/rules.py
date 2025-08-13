import re
import yaml
from pathlib import Path

CLAUSE_FILE = Path(__file__).with_name('clause_library.yaml')

with CLAUSE_FILE.open('r', encoding='utf-8') as f:
    CLAUSES = yaml.safe_load(f).get('clauses', [])


def analyze_text(text: str):
    """Return list of clause matches for given text."""
    results = []
    for clause in CLAUSES:
        pattern = re.compile(clause['pattern'], re.IGNORECASE)
        match = bool(pattern.search(text))
        results.append({
            'id': clause['id'],
            'matched': match,
            'severity': clause.get('severity', 'low'),
            'remedies': clause.get('remedies', []),
        })
    return results
