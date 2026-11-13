"""Shared edit helper for sessions working on the deck at the same time (see WORKERS.md).

Every edit to index.html, deck.css, deck.js or BRIEF.md goes through this, so two sessions never overwrite each
other: it takes an exclusive lock, reads each file fresh, checks every replacement matches exactly the expected
number of times, backs the originals up, writes them atomically, logs the edit, and lets go of the lock. If any
replacement doesn't match, nothing is written.

    import sys; sys.path.insert(0, "/home/ben/me/code/2611_mine_ai_talk/tools")
    from deck_edit import Patch
    p = Patch("slide-21-arrows")              # who and what, shows in the log and the backup's name
    p.sub("site/index.html", old, new)        # count=1 by default
    p.sub("site/deck.css", old, new)
    p.apply()

Write `old` from what you just read in the file, never from memory: another session may have changed it since.
"""
import fcntl, json, os, pathlib, shutil, sys, time

ROOT = pathlib.Path(__file__).resolve().parent.parent
LOCK = ROOT / ".deck.lock"
LOG = ROOT / ".deck-edits.log"
# Ben's own deck session on the homelab doesn't use this lock, so wait while it's busy.
OWNER_SESSION = pathlib.Path.home() / ".claude/sessions/2661646.json"


def owner_busy():
    try:
        return json.loads(OWNER_SESSION.read_text()).get("status") not in (None, "idle")
    except (OSError, ValueError):
        return False  # gone or unreadable: nothing to wait for


class Patch:
    def __init__(self, label):
        self.label = "".join(c if c.isalnum() or c in "-_" else "-" for c in label)[:60]
        self.subs = []

    def sub(self, rel, old, new, count=1):
        self.subs.append((rel, old, new, count))
        return self

    def apply(self, wait=180):
        deadline = time.time() + wait
        while owner_busy():
            if time.time() > deadline:
                sys.exit(f"[{self.label}] Ben's deck session is still busy after {wait} s; nothing written. Try again.")
            time.sleep(5)
        with open(LOCK, "a+") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            texts, originals = {}, {}
            for rel, old, new, count in self.subs:
                if rel not in texts:
                    texts[rel] = originals[rel] = (ROOT / rel).read_text()
                n = texts[rel].count(old)
                if n != count:
                    sys.exit(f"[{self.label}] {rel}: expected {count} match(es), found {n}; nothing written:\n{old[:240]}")
                texts[rel] = texts[rel].replace(old, new)
            stamp = time.strftime("%m%d-%H%M%S")
            backup = pathlib.Path(f"/tmp/deck-backup-{stamp}-{self.label}")
            backup.mkdir(parents=True, exist_ok=True)
            for rel, text in texts.items():
                path = ROOT / rel
                shutil.copy2(path, backup / path.name)
                tmp = path.with_name(f".{path.name}.{os.getpid()}.tmp")
                tmp.write_text(text)
                shutil.copymode(path, tmp)
                os.replace(tmp, path)
            with open(LOG, "a") as log:
                log.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')}  {self.label}  {', '.join(texts)}  backup {backup}\n")
            print(f"[{self.label}] wrote {', '.join(texts)} (backup {backup})")
