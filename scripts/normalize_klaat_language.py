#!/usr/bin/env python3
"""Normalize KLAAT's published instrument terminology, preserving text structure."""
import argparse
import collections
import pathlib
import re
import sys
import zipfile
from tempfile import NamedTemporaryFile

ROOT = pathlib.Path(__file__).resolve().parents[1]
EDITABLE = {".html", ".htm", ".md", ".txt", ".json", ".xml", ".csv", ".js", ".yml", ".yaml"}
SCAN_DIRS = ["public", "assets", "marketing", "docs"]
RETIRED = re.compile(r"\b(?:Amastacia|Amastasia|Anastasia|Anastacia|Ankora|elk[\s-]?hide|elk[\s-]?skin)\b", re.I)

def rewrite(value: str) -> str:
    old = value
    # Replace the whole historical instrument identifications before individual names.
    value = re.sub(
        r"\b(?:Amastacia|Amastasia|Anastasia|Anastacia)\s*[,—–-]\s*(?:a|the)\s*C\s*[♯#]\s*agave\s+didgeridoo\b",
        "the didgeridoo", value, flags=re.I)
    value = re.sub(
        r"\bAnkora\s*[,—–-]\s*(?:a|the)\s*elk[\s-]?hide\s+(?:frame\s+)?drum\b",
        "the drum", value, flags=re.I)
    # Membrane material descriptions are no longer accurate for the current drum.
    value = re.sub(r"\belk[\s-]?hide\s+(?:frame\s+)?drum\b", "drum", value, flags=re.I)
    value = re.sub(r"\belk[\s-]?hide\s+percussion\b", "drumming", value, flags=re.I)
    value = re.sub(r"\belk[\s-]?hide\s+(?:drumhead|membrane|head)\b", "drumhead", value, flags=re.I)
    value = re.sub(r"\belk[\s-]?(?:hide|skin)\b", "drumhead material", value, flags=re.I)

    def name_replace(match):
        word = match.group(0)
        chosen = "didgeridoo" if word.casefold() in ("amastacia","amastasia","anastasia","anastacia") else "drum"
        if word.isupper():
            return chosen.upper()
        return "the " + chosen

    value = re.sub(r"\b(?:Amastacia|Amastasia|Anastasia|Anastacia|Ankora)\b", name_replace, value, flags=re.I)
    # Avoid double articles and preserve headings, labels and title-case syntax.
    value = re.sub(r"\bthe\s+the\s+(didgeridoo|drum)\b", r"the \1", value, flags=re.I)
    value = re.sub(r"\bThe\s+the\s+(didgeridoo|drum)\b", lambda m: "The " + m.group(1), value, flags=re.I)
    value = re.sub(r"(?<=[>])the (didgeridoo|drum)(?=<)", lambda m:m.group(1).capitalize(),value)
    value = re.sub(r"(?<=\n)the (didgeridoo|drum)(?=\b)", lambda m:"The "+m.group(1),value)
    value = re.sub(r"(?<=[.!?]\s)the (didgeridoo|drum)(?=\b)",lambda m:"The "+m.group(1),value)
    value = re.sub(r"\bthe (didgeridoo|drum)\s*[/+&]\s*the (didgeridoo|drum)\b",r"the \1 and \2",value,flags=re.I)
    value = re.sub(r"\bthe (didgeridoo|drum)\s+and\s+the (didgeridoo|drum)\b",r"the \1 and \2",value,flags=re.I)
    value = re.sub(r"\bthe drum['’]s drum\b", "the drum", value,flags=re.I)
    return value

def rewrite_epub(path, dry=False):
    updates = 0
    with zipfile.ZipFile(path, "r") as source:
        items = [(i,source.read(i.filename)) for i in source.infolist()]
    revised = []
    for item,data in items:
        if item.filename.lower().endswith((".xhtml",".html",".htm",".xml",".ncx",".opf",".txt")):
            try:
                original=data.decode("utf-8")
                updated=rewrite(original)
                if updated!=original:
                    data=updated.encode("utf-8")
                    updates+=1
            except UnicodeDecodeError:
                pass
        revised.append((item,data))
    if updates and not dry:
        with NamedTemporaryFile(dir=path.parent,delete=False,suffix=".epub") as tmp:
            temp=pathlib.Path(tmp.name)
        try:
            with zipfile.ZipFile(temp,"w") as dest:
                # Preserve EPUB's required first, uncompressed mimetype entry.
                mimetype=next(((i,d) for i,d in revised if i.filename=="mimetype"),None)
                if mimetype:
                    dest.writestr("mimetype",mimetype[1],compress_type=zipfile.ZIP_STORED)
                for item,data in revised:
                    if item.filename=="mimetype": continue
                    dest.writestr(item,data)
            temp.replace(path)
        finally:
            temp.unlink(missing_ok=True)
    return updates

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--check",action="store_true")
    args=p.parse_args()
    counts=collections.Counter()
    changed=[]
    remaining=[]
    files=[ROOT/"index.html",ROOT/"about.html",ROOT/"landing-archive-2026-10-21.html"]
    for directory in SCAN_DIRS:
        d=ROOT/directory
        if d.exists():
            files.extend(f for f in d.rglob("*") if f.is_file() and f.suffix.lower() in EDITABLE)
    for file in sorted(set(files)):
        try: source=file.read_text(encoding="utf-8")
        except (UnicodeError,OSError): continue
        updated=rewrite(source)
        occurrences=len(RETIRED.findall(source))
        if updated!=source:
            changed.append(str(file.relative_to(ROOT)))
            counts["retired_references_rewritten"]+=occurrences
            if not args.check:file.write_text(updated,encoding="utf-8")
        if RETIRED.search(updated):
            remaining.append(str(file.relative_to(ROOT)))
    epubs=sorted((ROOT/"public").rglob("*.epub"))
    for file in epubs:
        n=rewrite_epub(file,args.check)
        if n:
            counts["epub_members_rewritten"]+=n
            changed.append(str(file.relative_to(ROOT)))
    print("CHANGED FILES:",len(changed))
    print("RETIRED TEXT REFERENCES REWRITTEN:",counts["retired_references_rewritten"])
    print("EPUB MEMBERS REWRITTEN:",counts["epub_members_rewritten"])
    for path in changed:print("UPDATED",path)
    if remaining:
        print("FAILED: retired wording remains in:",*remaining,sep="\n",file=sys.stderr)
        return 1
    # PDFs are intentionally not auto-overprinted: typography requires a separately proofed rebuild.
    pdfs=sorted((ROOT/"public").rglob("*.pdf"))
    print("PDFS NEEDING SEPARATE TYPOGRAPHIC VERIFICATION:",len(pdfs))
    for path in pdfs:print("PDF TO INSPECT",path.relative_to(ROOT))
    if args.check and changed:return 1
    return 0

if __name__=="__main__":sys.exit(main())
