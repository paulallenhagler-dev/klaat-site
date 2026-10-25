#!/usr/bin/env python3
"""Build 24 original KLAAT micro-performances from the full-length user recording.
Only trims and gentle fades; no synthesized/replacement music.
"""
from pathlib import Path
import subprocess, json, shutil
src = Path("public/assets/klaat-opening-performance.m4a")
out = Path("public/assets/klaat-fragments")
out.mkdir(parents=True, exist_ok=True)
if not src.is_file(): raise SystemExit("Missing full KLAAT source recording.")
if not shutil.which("ffmpeg"): raise SystemExit("ffmpeg not available.")
raw = [
 ("arrival",6.8,4.6),("ember",13.1,5.1),("skin",20.2,6.1),
 ("first-pulse",27.2,5.5),("current",34.8,7.4),("fracture",42.6,4.2),
 ("drift",49.0,6.9),("strike",57.0,4.0),("undertone",63.5,7.3),
 ("return",71.8,5.1),("suspension",78.8,6.8),("texture",86.1,4.9),
 ("widening",92.0,7.2),("tension",100.2,5.6),("breath",107.8,6.4),
 ("split",115.7,5.1),("grain",121.9,7.6),("pressure",130.4,5.8),
 ("orbit",137.2,7.0),("residue",145.2,4.3),("crossing",151.3,7.8),
 ("dusk",160.2,4.6),("echo",166.2,6.7),("last-light",173.5,5.3)
]
manifest = []
for num, (name,start,dur) in enumerate(raw,1):
    f = out / f"{num:02d}-{name}.m4a"
    subprocess.run([
        "ffmpeg","-hide_banner","-loglevel","error","-y",
        "-ss",str(start),"-i",str(src),"-t",str(dur),"-vn",
        "-af",f"afade=t=in:st=0:d=0.20,afade=t=out:st={dur-.40:.2f}:d=0.38",
        "-ac","2","-ar","44100","-c:a","aac","-b:a","128k",
        "-movflags","+faststart",str(f)
    ],check=True)
    manifest.append({"id":num,"name":name,"from_seconds":start,"length_seconds":dur,
                     "file":f.name,"size_bytes":f.stat().st_size})
(out / "manifest.json").write_text(json.dumps({
 "source":"klaat-opening-performance.m4a",
 "origin":"Extracts from Paul Hagler's live recording, not generated or synthesized music",
 "processing":"Stereo AAC excerpts, individually faded 0.20s in and 0.38s out",
 "clips":manifest
}, indent=2)+"\n")
print(f"Generated {len(manifest)} clips, {sum(a['size_bytes'] for a in manifest):,} bytes.")
