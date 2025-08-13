from rules import analyze_text

def test_late_fee_detected():
    text = 'Tenant shall pay a late fee if rent is not received.'
    results = analyze_text(text)
    clause = next(c for c in results if c['id'] == 'CLAUSE001')
    assert clause['matched'] is True

def test_missing_clause():
    text = 'This document has no relevant clauses.'
    results = analyze_text(text)
    clause = next(c for c in results if c['id'] == 'CLAUSE001')
    assert clause['matched'] is False
